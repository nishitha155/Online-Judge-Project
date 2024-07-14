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
const crypto = require('crypto');


const cookieParser = require('cookie-parser');
const Question = require('./models/Question');
const TestCase = require('./models/TestCase');
const Submission = require('./models/Submission');
const Contest=require('./models/Contest');
const calculateStreak=require('./utils/streakCalculator'); 
const mongoose=require('mongoose');
const Registration=require('./models/Registration');






app.use(bodyParser.json());
const cors = require('cors');
const { mailTransport, generateEmailTemplate, plainEmailTemplate } = require('./utils/mail');
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.options('*', cors(corsOptions));
dotenv.config({
    path: '.env'
});

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      clientID: clientid,
        clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
      passReqToCallback: true // This is required to pass `req` to the callback
  },
  async (req, accessToken, refreshToken, profile, done) => {
      try {
          const existingUser = await User.findOne({ googleid: profile.id });
          if (existingUser) {
              return done(null, existingUser);
          }

          // Function to generate a random unique username
          const generateUsername = () => {
              const randomString = crypto.randomBytes(4).toString('hex'); // Generate 8 random characters
              const randomNumber = Math.floor(Math.random() * 10); // Generate a random digit
              const randomCapitalLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Generate a random capital letter
              return randomCapitalLetter + randomString + randomNumber;
          }

          const user = new User({
              fullName: profile.displayName,
              email: profile.emails[0].value,
              googleid: profile.id,
              userName: generateUsername(),
              verified: true,
          });

          await user.save();
          req.user = user; // Attach the user to the request object
          return done(null, user);
      } catch (error) {
          return done(error, null);
      }
  })
);

passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser((user,done)=>{
    done(null,user.id);
});

app.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:5173/login',
  session: false // Disable session for JWT
}), (req, res) => {
  // Check if user exists and authentication was successful
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  try {
    // Generate JWT token
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token and success message
    res.json({ token: token, message: 'Email Verified' });
  } catch (error) {
    // Log error and respond with appropriate message
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get("/login/success",(req,res)=>{
    res.send("Login Success");
});
// Middleware to authenticate user using JWT
// Middleware to authenticate user using JWT
function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

 

  if (!token) {
      console.log("Access denied. No token provided.");
      return res.status(401).send("Access denied. No token provided.");
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
  } catch (error) {
      console.log("Invalid token", error);
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
app.post('/register', async (req, res) => {
  const { password, email, fullName, userName } = req.body;

  // Check if all required fields are present
  if (!password || !email || !fullName || !userName) {
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
      fullName,
      userName,
      verified: true,
      joined: new Date(),
            lastUpdate: new Date()
    });

    // const OTP=generateOTP();
    // const verificationToken=new VerificationToken({
    //     owner:user._id,
    //     token:OTP
    // });
    
    // await verificationToken.save();
     await user.save();

    // mailTransport().sendMail({
    //   from:'charugundlalakshminishitha@gmail.com',
    //   to:user.email,
    //   subject:'OTP Verification',
    //   html:generateEmailTemplate(OTP)
    // })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    
    res.status(201).json({token:token, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// app.post("/verify-email", async (req, res) => {
//   const { username, otp } = req.body;
//   if (!username || !otp.trim()) {
//     return res.status(400).json({ message: "Invalid Request" });
//   }
 

//   const user = await User.findOne({ userName: username });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   if (user.verified) {
//     return res.status(400).json({ message: "Already verified" });
//   }

//   const token1 = await VerificationToken.findOne({ owner: user._id });
//   if (!token1) {
//     return res.status(404).json({ message: "Token not found" });
//   }

//   const isMatched = await token1.compareToken(otp);
//   if (!isMatched) {
//     return res.status(400).json({ message: "Provide Valid Token" });
//   }

//   user.verified = true;
//   await VerificationToken.findByIdAndDelete(token1._id);
//   await user.save();
//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.cookie('token', token, { httpOnly: true });

//   mailTransport().sendMail({
//     from: 'charugundlalakshminishitha@gmail.com',
//     to: user.email,
//     subject: 'OTP Verification',
//     html: plainEmailTemplate("Email Verified", "Thank you for verifying your email")
//   });

//   res.json({ token:token,message: "Email Verified" });
// });


app.get("/userdetails", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
          return res.status(404).send("User not found");
      }

      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
});


app.get('/streak',authenticateToken, async (req, res) => {
  const userId=req.user.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentStreak, maxStreak } = await calculateStreak(user._id);
    await User.findByIdAndUpdate(user._id, { currentStreak, maxStreak });

    res.json({ currentStreak, maxStreak });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/update', authenticateToken, async (req, res) => {
  
  const { fullName, userName } = req.body;
  
  try {
    const user = await User.findById(req.user.userId);
  
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.fullName = fullName;
    user.userName = userName;
    user.lastUpdate = new Date();
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.clearCookie('token');
    res.cookie('token', token, { httpOnly: true });
   
    res.json({ token: token,msg: 'User updated successfully' });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/deleteaccount', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find the user and delete
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/check-password', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ hasPassword: !!user.password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
app.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (user.password) {
      // If user has an existing password
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.lastUpdate = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.clearCookie('token');
    res.cookie('token', token, { httpOnly: true });
   
   

    

    res.json({ message: 'Password changed successfully', token:token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


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
    res.cookie('token', token, { httpOnly: true });
    
    
    res.status(200).json({ token:token, userName: user.userName });
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

app.post('/addquestions', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    console.log('Question saved successfully:', savedQuestion);
    res.status(201).json({ message: 'Question added successfully', question: savedQuestion });
  } catch (error) {
    console.error('Error in /addquestions:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate title', error: 'A question with this title already exists' });
    }
    res.status(500).json({ message: 'Error adding question', error: error.message });
  }
});


app.get('/checktitle/:title', async (req, res) => {
  try {
    const question = await Question.findOne({ title: req.params.title });
    res.json({ isUnique: !question });
  } catch (error) {
    res.status(500).json({ message: 'Error checking title', error: error.message });
  }
});

app.get('/problems', async (req, res) => {
  try {
    const problems = await Question.find({}).sort({ createdAt: -1 });
    const problemsWithTestCases = await Promise.all(problems.map(async (problem) => {
      const testCases = await TestCase.find({ problemId: problem._id });
      return {
        ...problem.toObject(),
        testCases
      };
    }));
    res.json(problemsWithTestCases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problems', error: error.message });
  }
});

// Update the existing route or add a new one for fetching a single problem
app.get('/problems/:id', async (req, res) => {
  try {
    const problem = await Question.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem', error: error.message });
  }
});

// Add a new route for updating a problem
app.put('/problems/:id', async (req, res) => {
  try {
    const updatedProblem = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem updated successfully', problem: updatedProblem });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error updating problem', error: error.message });
  }
});


app.post('/problems/:id/testcases', async (req, res) => {
  try {
    const { testCases } = req.body;
    const problemId = req.params.id;

    const savedTestCases = await Promise.all(
      testCases.map(async (testCase) => {
        const newTestCase = new TestCase({
          ...testCase,
          problemId
        });
        return await newTestCase.save();
      })
    );

    res.status(201).json({ message: 'Test cases added successfully', testCases: savedTestCases });
  } catch (error) {
    res.status(500).json({ message: 'Error adding test cases', error: error.message });
  }
});

// In your existing backend file


app.get('/api/problems', async (req, res) => {
  try {
    const problems = await Question.find();
    const problemsWithTestCases = await Promise.all(problems.map(async (problem) => {
      const testCases = await TestCase.find({ problemId: problem._id });
      return { ...problem.toObject(), testCases };
    }));
    res.json(problemsWithTestCases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problems', error: error.message });
  }
});



// Delete a test case
app.delete('/api/testcases/:id', async (req, res) => {
  try {
    await TestCase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting test case', error: error.message });
  }
});


app.get('/api/problems/:id', async (req, res) => {
  try {
    const problem = await Question.findById(req.params.id);
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem', error: error.message });
  }
});

app.get('/api/problems/:id/testcases', async (req, res) => {
  try {
    const testCases = await TestCase.find({ problemId: req.params.id });
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test cases', error: error.message });
  }
});

app.post('/api/problems/:id/testcases', async (req, res) => {
  try {
    const newTestCase = new TestCase({
      ...req.body,
      problemId: req.params.id
    });
    await newTestCase.save();
    res.status(201).json(newTestCase);
  } catch (error) {
    res.status(500).json({ message: 'Error adding test case', error: error.message });
  }
});


app.get('/user-submissions', authenticateToken, async (req, res) => {
  try {
    console.log('User:', req.user.userId);
    const userId = req.user.userId;
    const submissions = await Submission.find({ userId }).select('createdAt');
    
    // Group submissions by date
    const submissionDates = submissions.reduce((acc, submission) => {
      const date = submission.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    console.log(submissionDates);

    res.json(submissionDates);
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/api/contests', async (req, res) => {
  try {
    console.log(req.body);
    const newContest = new Contest(req.body);
    const savedContest = await newContest.save();
    res.status(201).json({ message: 'Contest created successfully', contestId: savedContest._id });
  } catch (error) {
    res.status(400).json({ message: 'Error creating contest', error: error.message });
  }
});

app.get('/api/contests/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.json(contest);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching contest', error: error.message });
  }
});

app.get('/contests/:contestId/problems/:problemId', authenticateToken, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    const problem = contest.problems.id(req.params.problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ message: 'Error fetching problem' });
  }
});
// GET /contests endpoint
app.get('/contests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const contests = await Contest.find();
    const registrations = await Registration.find({ userId: userId });

    const contestsWithRegistrationStatus = contests.map(contest => {
      const isRegistered = registrations.some(reg => reg.contestId.toString() === contest._id.toString());
      console.log(`Contest ${contest._id}: User ${userId} is ${isRegistered ? 'registered' : 'not registered'}`);
      return {
        ...contest.toObject(),
        isRegistered: isRegistered
      };
    });

    res.json(contestsWithRegistrationStatus);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ message: 'Error fetching contests' });
  }
});

// POST /registercontest endpoint
app.post('/registercontest', authenticateToken, async (req, res) => {
  try {
    console.log('Registration request received');
    const { contestId } = req.body;
    const userId = req.user.userId;
    console.log('Contest ID:', contestId);
    console.log('User ID:', userId);

    if (!contestId) {
      return res.status(400).json({ message: 'Contest ID is required' });
    }

    const existingRegistration = await Registration.findOne({ userId, contestId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this contest' });
    }

    const newRegistration = new Registration({
      userId,
      contestId,
    });

    await newRegistration.save();
    res.status(201).json({ message: 'Successfully registered for the contest' });
  } catch (error) {
    console.error('Error registering for contest:', error);
    res.status(500).json({ message: 'Error registering for contest' });
  }
});

app.get('/contests/:contestId', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.json(contest);
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).json({ message: 'Error fetching contest' });
  }
});
// Start the server


app.get('/problem-stats', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching problem stats');
    const userId = req.user.userId;
    console.log(`User ID: ${userId}`);

    // Count total problems
    const totalProblems = await Question.countDocuments();

    // Fetch accepted problems by the user
    const acceptedProblems = await Submission.distinct('problemId', {
      userId: userId,
      status: 'Accepted'
    });
    const acceptedProblemsCount = acceptedProblems.length;
    console.log(acceptedProblemsCount);

    // Get difficulty stats for all problems
    const difficultyStats = await Question.aggregate([
      {
        $group: {
          _id: '$difficulty',
          total: { $sum: 1 }
        }
      }
    ]);

    console.log(difficultyStats);

    // Get accepted problem stats by difficulty for the user
    const acceptedDifficultyStats = await Submission.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId), status: 'Accepted' }
      },
      {
        $lookup: {
          from: 'questions',
          localField: 'problemId',
          foreignField: '_id',
          as: 'questionDetails'
        }
      },
      {
        $unwind: '$questionDetails'
      },
      {
        $group: {
          _id: '$questionDetails.difficulty',
          accepted: { $addToSet: '$problemId' }
        }
      },
      {
        $project: {
          difficulty: '$_id',
          accepted: { $size: '$accepted' }
        }
      }
    ]);

    console.log(acceptedDifficultyStats);

    // Merge the two stats arrays
    const stats = {
      totalProblems,
      acceptedProblems: acceptedProblemsCount,
      difficultyStats: difficultyStats.map(stat => ({
        difficulty: stat._id,
        total: stat.total,
        accepted: acceptedDifficultyStats.find(a => a.difficulty === stat._id)?.accepted || 0
      }))
    };
   
    res.json(stats);
  } catch (error) {
    console.error('Error fetching problem stats:', error);
    res.status(500).json({ message: 'Error fetching problem stats' });
  }
});




app.listen(2000, () => {
    console.log('Server is running on port 2000');
});
