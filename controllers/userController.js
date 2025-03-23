import User from "../models/Users.js";
import PasswordResetCode from "../models/PasswordResetCode.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
};



const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0].msg);
    }

    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email,
        password: hashedpassword
    })

    if (user) {
        // Create root folder for the user
        const rootFolder = await Folder.create({
          name: "Root",
          owner: user._id,
        });
        await User.findByIdAndUpdate(user._id, { rootFolder: rootFolder._id });
    
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      }
})

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const code = generateCode();

    await PasswordResetCode.create(
        {
            email,
            code,
            expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
        }
    );
    try {
        await transporter.sendMail({
            from: '"Your App Name" <no-reply@example.com>', // Static name/email
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${code}`
        });
        res.status(200).json({ message: 'Password reset code sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send password reset code' });

    }

})


const resetPassword = asyncHandler(async (req, res) => {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const passwordResetCode = await PasswordResetCode.findOne({ email });

    if (!passwordResetCode || passwordResetCode.code !== code) {
        return res.status(400).json({ message: 'Invalid password reset code' });
    }

    if (passwordResetCode.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Password reset code has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(newPassword, salt);

    try {
        await User.findOneAndUpdate(
            { email },
            { password: hashedpassword },
        );
        await PasswordResetCode.findOneAndDelete({ email });

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })
}








export { registerUser, getUser, loginUser, forgotPassword, resetPassword }
