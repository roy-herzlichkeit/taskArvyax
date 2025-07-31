import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const MAX_AGE = process.env.MAX_AGE;

const _createToken = (_id) => {
    return jwt.sign(
        { _id },
        process.env.JWT_SECRET,
        { expiresIn: MAX_AGE }
    )
};

const _register = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        username = username?.toString().trim();
        email = email?.toString().trim().toLowerCase();
        password = password?.toString();

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }

        if (username.length < 5 || username.length > 17) {
            return res.status(400).json({ message: 'Username must be between 5 and 17 characters' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or username already exists'
            });
        }

        const user = await User.create({
            username: username,
            email: email,
            password: password
        });

        const token = _createToken(user._id);
        console.log(MAX_AGE);
        res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });

        return res.status(201).json({ message: 'User Registered' });
    } catch (e) {
        console.error('Register error:', e);
        res.status(500).json({ message: 'Server error during Register' });
    }
};

const _login = async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username?.toString().trim();
        password = password?.toString();

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (username.length < 5 || password.length < 8 || username.length > 17) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(400).send({ message: 'Invalid Password' });
        }

        const token = _createToken(user._id);
        console.log(MAX_AGE);
        res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });

        return res.status(200).json({ message: 'User Authenticated' });
    } catch (e) {
        console.error('Login error:', e);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

const _delete = async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username?.toString().trim();
        password = password?.toString();

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (username.length < 5 || password.length < 8 || username.length > 17) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        const match = await user.comparePassword(password);
        console.log(match);
        if (!match) {
            return res.status(400).send({ message: 'Invalid Password' });
        }

        await User.findByIdAndDelete(user._id);
        res.cookie('jwt', '', { maxAge: 1 });
        return res.status(200).json({ message: 'User Deleted' });
    } catch (e) {
        console.error('Deletion error:', e);
        return res.status(500).json({ message: 'Server error during Deletion' });
    }
};

const _logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.json({ message: 'Logged out' });
};

export default { _login, _register, _delete, _logout };