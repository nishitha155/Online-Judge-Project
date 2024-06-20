const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./database/db');
const User = require('./models/User');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
dotenv.config({
    path: '.env'
});

connectDB();


// Register endpoint


// ... (other imports and middleware)

// Endpoint to check uniqueness of username or email
app.post('/check-uniqueness', async (req, res) => {
  const { userName, email } = req.body;
  try {
    if (userName) {
      const existingUser = await User.findOne({ userName });
      return res.json({ isUnique: !existingUser });
    } else if (email) {
      const existingUser = await User.findOne({ email });
      return res.json({ isUnique: !existingUser });
    }
    res.status(400).json({ message: 'Invalid request' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { password, email, phoneNumber, fullName, userName } = req.body;

  // Check if all required fields are present
  if (!password || !email || !phoneNumber || !fullName || !userName) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
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
      phoneNumber,
      fullName,
      userName
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

/const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));



// Login endpoint
app.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'Username does not exist' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in response
    res.status(200).json({ token, userName: user.userName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if username exists endpoint
app.post('/check-username', async (req, res) => {
  const { userName } = req.body;

  try {
    const user = await User.findOne({ userName });
    res.json({ exists: !!user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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
