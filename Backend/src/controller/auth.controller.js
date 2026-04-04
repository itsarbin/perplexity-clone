import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../model/user.model.js';
import { sendEmail } from '../services/mail.service.js';

const register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne(
            { $or: [{ email }, { username }] }
        );
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or username already exists"
            })
        }



        const user = await userModel.create({
            username,
            email,
            password
        })

        try {
            await sendEmail({
                to: email,
                subject: "Welcome to Preplexity",
                html: `<h1>Welcome to Preplexity, ${username}!</h1>
                   <p>Thank you for registering. We're excited to have you on board.</p>`,
                text: `Welcome to Preplexity, ${username}! Thank you for registering. We're excited to have you on board.`
            });
        } catch (mailError) {
            console.error("Welcome email failed:", {
                message: mailError.message,
                code: mailError.code,
                command: mailError.command,
                response: mailError.response
            });
        }

        res.status(201).json({
            message: "User registered successfully",
            user,
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error
        })
    }
}


const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or username"
            })
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
                err: "User already exists"
            })
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        res.cookie('token', token)

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(200).json({
            message: "User logged in successfully",
            user: safeUser
        })

    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error
        })
    }
}





export default {
    register,
    login
}
