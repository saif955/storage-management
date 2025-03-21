
import { body } from "express-validator";
const validateUserRegistration = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
        .isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];



export { validateUserRegistration} 