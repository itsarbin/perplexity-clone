import { body, validationResult } from 'express-validator';

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation errors",
            errors: errors.array()
        })

    }
    next();
}


export const registerValidator = [
    body('username').trim().notEmpty().withMessage('username is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validator
]

export const loginValidator = [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').trim().notEmpty().withMessage('password is required'),
    validator
]


