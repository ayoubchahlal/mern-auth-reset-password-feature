// POST /api/auth/forgot-password
import crypto from "crypto";
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not found" });

        // 1. Generate token
        const token = crypto.randomBytes(32).toString("hex");

        // 2. Save token hashed in DB
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
        await user.save();

        // 3. Create reset URL
        const resetURL = `http://localhost:5173/reset-password/${token}`;

        // 4. Send email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: user.email,
            from: "support@yourapp.com",
            subject: "Password Reset",
            html: `<p>You requested a password reset</p>
                   <p>Click the link below:</p>
                   <a href="${resetURL}">${resetURL}</a>`,
        });

        res.json({ message: "Reset link sent to email" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};
