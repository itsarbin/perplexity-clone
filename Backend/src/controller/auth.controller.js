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

        const emailVerificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET)

        try {
            await sendEmail({
                to: email,
                subject: "Welcome to Preplexity",
                html: `<h1>Welcome to Preplexity, ${username}!</h1>
                   <p>Thank you for registering. We're excited to have you on board.</p>
                   <p>Please click the link below to verify your email</p>
                   <a href="http://localhost:3000/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>`,
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
            success: true
            
        })

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error
        })
    }
}


export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid token"
            })
        }
        user.verified = true;
        await user.save();
        res.send(`<h1>Email verified successfully. You can now login.</h1>
        <p>please click the link below to go to the login page.</p>
        <a href="http://localhost:3000/auth/login">Go to Login</a>`
        )
    } catch (error) {
        res.status(500).json({
            message: "Error verifying email",
            error
        })

    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or username"
            })
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
                err: "User already exists"
            })
        }

        if (!user.verified) {
            return res.status(400).json({
                message: "Email not verified. Please verify your email before logging in.",
                success: false,
                err: "Email is not verified"
            })
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
        }, process.env.JWT_SECRET)

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

const getMe = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }
        res.status(200).json({
            message: "User fetched successfully",
            user,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user",
            success: false,
            err: error
        })
    }
}





export default {
    register,
    login,
    verifyEmail,
    getMe
}
