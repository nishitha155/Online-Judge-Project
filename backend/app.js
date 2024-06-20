const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./database/db');
const User = require('./models/User');
const session=require('express-session');
const passport=require('passport');
const OAuth2Strategy=require('passport-google-oauth2').Strategy;


app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
dotenv.config({
    path: '.env'
});

connectDB();

const clientid="10427455581-2ptisuamqtvgmkdacjnf1pgd9tl7dpsd.apps.googleusercontent.com"
const clientsecret="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"

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:clientid,
        clientSecret:clientsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]},
        async(accessToken,refreshToken,profile,done)=>{
            console.log(profile);
            try{
              const existingUser=await User.findOne({googleid:profile.id});
              if(existingUser){
                  return done(null,existingUser);
              }
              const user=new User({
                  userName:profile.displayName,
                  email:profile.emails[0].value,
                  googleid:profile.id
              });
              await user.save();
              return done(null,user);
            }catch(error){
                return done(error,null);
            }
        }
    ))
passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser((user,done)=>{
    done(null,user.id);
});

app.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}));

app.get('/auth/google/callback',passport.authenticate('google',{
    successRedirect:'http://localhost:5173/dashboard',
    failureRedirect:'http://localhost:5173/login'
}));


app.get("/login/success",(req,res)=>{
    res.send("Login Success");
});
// Middleware to authenticate user using JWT
function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
}
}

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
app.post('/register',authenticateToken, async (req, res) => {
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




// Middleware

// Login endpoint
app.post('/login',authenticateToken, async (req, res) => {
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
    res.cookie('token', token, { httpOnly: true });

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



app.listen(2000, () => {
    console.log('Server is running on port 2000');
});
