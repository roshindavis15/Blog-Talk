import User from "../model/User.js";
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from "../utils/helpers/emailHelper.js";
import { generateToken } from "../utils/helpers/jwtHelper.js";


export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }
    if (!users) {
        return res.status(404).json({ message: "No Users Found" });
    }
    return res.status(200).json({ users });
}



export const signUp = async (req, res) => {

    const { username, email, password } = req.body;

    //handling  validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //generating otp
        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        const otpExpires = Date.now() + 2 * 60 * 1000;
        console.log("otp:", otp);

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email: email,
            password: hashedPassword,
            otp,
            otpExpires
        })
        await user.save();

        //sending otp via mail

        try {
            await sendOTPEmail(email, otp);
            res.status(200).json({ message: 'OTP sent to email, please verify your OTP' });
        } catch (emailError) {
            console.error(emailError.message);
            res.status(500).send('Error sending OTP');
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


export const verifyOTP = async (req, res) => {
    console.log("req.body:", req.body);
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log("user:", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //verify OTP
        if (user.otp === otp && user.otpExpires > Date.now()) {

            user.isVerified = true,
                user.otp = null,
                user.otpExpires = null;
            await user.save();

            //generate token
            await generateToken(res, user);

            return res.status(200).json({ message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error')
    }
};



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: "User is not verified" });
        }
        generateToken(res, user);

        res.status(200).json({ message: "Login Successful" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
};

