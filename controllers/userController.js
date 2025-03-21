import User from "../models/Users";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

const validateUserRegistration = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
        .isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0].msg);
    }
    
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email})
    if(userExists) {
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

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
})

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if(user) {
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

const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body
    const user = await User.findOne(email)
    if(user && (await bcrypt.compare(password, user.password))){
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


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })
}

export { registerUser, validateUserRegistration }
