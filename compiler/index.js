const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const {executePy}=require('./executePy');
const {executeJava}=require('./executeJava');
const cors = require('cors');
const dotenv = require('dotenv')
const connectDB = require('../backend/database/db.js')
const Question = require('../backend/models/Question.js')
const TestCase = require('../backend/models/TestCase.js')
const cookieParser = require('cookie-parser');
const Submission = require('../backend/models/Submission.js')
const jwt = require('jsonwebtoken');
const calculateStreak = require('../backend/utils/streakCalculator.js');
const User = require('../backend/models/User.js');

dotenv.config({
    path: '../backend/.env'
});

connectDB();

//middlewares
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };
  app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Empty code!" });
    }
    
    try {
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);
      
      let output;
      switch(language) {
        case 'cpp':
          console.log('running cpp');
          output = await executeCpp(filePath, inputPath);
          break;
        case 'java':
          output = await executeJava(filePath, inputPath);
          break;
        case 'py':
          output = await executePy(filePath, inputPath);
          break;
        default:
          return res.status(400).json({ success: false, error: "Unsupported language!" });
      }
      
      res.json({ success: true, filePath, inputPath, output });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message, details: error.stderr || error });
    }
  });
  
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

 
  app.post('/submit/:id', authenticateToken, async (req, res) => {
    console.log('hi');
    const { id } = req.params;
    const { language = "cpp", code } = req.body;
    const userId = req.user.userId;
  
    try {
      const problem = await Question.findById(id);
      if (!problem) {
        return res.status(404).json({ success: false, error: "Problem not found" });
      }
  
      const filePath = await generateFile(language, code);
      console.log(filePath);
  
      const testcases = await TestCase.find({ problemId: id });
      console.log(testcases);
      let results = [];
      let allPassed = true;
      let totalRuntime = 0;
      let status = 'Accepted';
      const timeLimit = 10; // Set time limit to 2 seconds (adjust as needed)
  
      try {
        for (let i = 0; i < testcases.length; i++) {
          const testCase = testcases[i];
          const inputPath = await generateInputFile(testCase.input);
          console.log(inputPath);
  
          const startTime = process.hrtime();
          const output = await executeCpp(filePath, inputPath, timeLimit);
          console.log(output);
          const endTime = process.hrtime(startTime);
          const testRuntime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
          totalRuntime += testRuntime;
  
          const passed = output.trim() === testCase.output.trim();
          results.push({
            testCase: i + 1,
            passed,
            runtime: testRuntime.toFixed(2)
          });
          console.log(results);
  
          if (!passed) {
            allPassed = false;
            status = 'Wrong Answer';
          }
        }
      } catch (error) {
        allPassed = false;
        if (error.type === 'SyntaxError') {
          status = 'Syntax Error';
          results = [{ error: error.error }];
        } else if (error.type === 'CompilationError') {
          status = 'Compilation Error';
          results = [{ error: error.error }];
        } else if (error.type === 'TimeLimitExceeded') {
          status = 'Time Limit Exceeded';
          results.push({
            testCase: results.length + 1,
            passed: false,
            error: 'Time Limit Exceeded'
          });
        } else {
          status = 'Runtime Error';
          results.push({
            testCase: results.length + 1,
            passed: false,
            error: error.error
          });
        }
      }
  
      const submission = new Submission({
        userId,
        problemId: id,
        language,
        code,
        status,
        runtime: totalRuntime.toFixed(2)
      });
      await submission.save();
  
      // Update the problem statistics
      problem.submissions += 1;
      if (allPassed) {
        problem.succesful += 1;
      }
      await problem.save();
  
      const { currentStreak, maxStreak } = await calculateStreak(userId);
      console.log(results);
  
      res.json({
        success: allPassed,
        message: status === 'Accepted' ? "All test cases passed!" : `Submission failed: ${status}`,
        results,
        runtime: totalRuntime.toFixed(2),
        currentStreak,
        maxStreak,
        status
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  

app.get('/api/problems/:id/submissions', async (req, res) => {
    try {
      const submissions = await Submission.find({ problemId: req.params.id })
        .sort({ createdAt: -1 })
        .limit(100);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching submissions' });
    }
  });


  app.get('/api/problems/:id/mysubmissions',authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId; // Assuming you have user authentication in place
      
      const submissions = await Submission.find({ problemId: req.params.id, userId })
        .sort({ createdAt: -1 });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user submissions' });
    }
  });
  

app.listen(5000,()=>{
    console.log('server running on port 5000');
})