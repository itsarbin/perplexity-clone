import express from 'express';
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import authController from '../controller/auth.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register',
    [
        body('username').trim().notEmpty().withMessage('username is required'),
        body('email').trim().isEmail().withMessage('Valid email is required'),
        body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Validation errors",
                    errors: errors.array()
                })
            }
            next();
        }
    ],
    authController.register);
authRouter.post('/login',
    [
        body('username').optional().trim(),
        body('email').optional().trim().isEmail().withMessage('Valid email is required'),
        body('password').trim().notEmpty().withMessage('Password is required'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Validation errors",
                    errors: errors.array()
                })
            }
            next();
        }

    ], authController.login);


export default authRouter;