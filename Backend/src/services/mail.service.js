import nodemailer from 'nodemailer';

let transporterPromise;

const createTransporter = async () => {
    const user = process.env.GOOGLE_USER;
    const pass = process.env.GOOGLE_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error('Missing GOOGLE_USER or GOOGLE_APP_PASSWORD in environment');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass
        }
    });

    await transporter.verify();
    console.log('Email transporter is ready');

    return transporter;
};

const getTransporter = async () => {
    if (!transporterPromise) {
        transporterPromise = createTransporter().catch((error) => {
            transporterPromise = undefined;
            throw error;
        });
    }

    return transporterPromise;
};

export const sendEmail = async ({ to, subject, html, text }) => {
    console.log('Sending email to:', to);

    try {
        const transporter = await getTransporter();
        const details = await transporter.sendMail({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        });

        console.log('Email sent:', details.response);
        return details;
    } catch (error) {
        console.error('Email error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        throw error;
    }
};
