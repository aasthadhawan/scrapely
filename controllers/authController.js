const User = require("../models/User");
const bcrypt = require("bcrypt");


// =============================
// SIGN UP
// =============================
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({
            message: "User registered successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error."
        });
    }
};


// =============================
// LOGIN
// =============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter both email and password."
            });
        }
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }
        res.status(200).json({
            message: "Login successful!",
            id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error."
        });
    }
};


module.exports = {
    signup,
    login
};