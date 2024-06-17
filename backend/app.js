const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./database/db');
const User = require('./models/User');
app.use(bodyParser.json());
dotenv.config({
    path: '.env'
});

connectDB();

// Register endpoint
app.post('/register', async (req, res) => {
    const { password, email, dateOfBirth, fullName, socialLogin } = req.body;

    // Check if all required fields are present
    if (!password || !email || !dateOfBirth || !fullName) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Encrypt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save the user
        const user = new User({
            password: hashedPassword,
            email,
            dateOfBirth,
            fullName,
            socialLogin
        });

        await user.save();

        // Generate a token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token in response
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if all required fields are present
    if (!email || !password) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token in response
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change password endpoint
app.post('/change-password', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    // Check if all required fields are present
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Encrypt the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user's password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
