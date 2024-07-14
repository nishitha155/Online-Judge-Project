const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const {executePy}=require('./executePy');
const {executeJava}=require('./executeJava');
const cors = require('cors');
const dotenv = require('dotenv')
const connectDB = require('./database/db.js')
const Question = require('./models/Question.js')
const TestCase = require('./models/TestCase.js')
const cookieParser = require('cookie-parser');
const Submission = require('./models/Submission.js')
const jwt = require('jsonwebtoken');
const calculateStreak = require('./utils/streakCalculator.js');
const User = require('./models/User.js');
const Contest = require('./models/Contest.js');
const Registration = require('./models/Registration.js');
const ContestSubmission = require('./models/ContestSubmission.js');

dotenv.config({
    path: './.env'
});

connectDB();

//middlewares
const corsOptions = {
    origin: 'https://www.algobug.online',
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
      console.log('hi')
      console.log(filePath);
      const inputPath = await generateInputFile(input);
      console.log(inputPath);
      
      let output;
      const timeLimit = 10;
      switch(language) {
        case 'cpp':
          console.log('running cpp');
          output = await executeCpp(filePath, inputPath,timeLimit);
          console.log(output);
          break;
        case 'java':
          output = await executeJava(filePath, inputPath,timeLimit);
          break;
        case 'py':
          output = await executePy(filePath, inputPath,timeLimit);
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
        difficulty: problem.difficulty,
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


  app.post('/contests/:contestId/problems/:problemId/submit', authenticateToken, async (req, res) => {
    try {
      const { language, code } = req.body;
      const userId = req.user.userId;
      const contestId = req.params.contestId;
      const problemId = req.params.problemId;
  
      const contest = await Contest.findById(contestId);
      if (!contest) {
        return res.status(404).json({ message: 'Contest not found' });
      }
  
      const problem = contest.problems.id(problemId);
      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }
  
      const testcases = problem.testCases;
  
      // Check if the same code has already been submitted
      const existingSubmission = await ContestSubmission.findOne({ userId, contestId, problemId });
      if (existingSubmission) {
        console.log('Code already submitted');
        return res.status(200).json({ message: 'Code already submitted, no points added' });
      }
  
      const filePath = await generateFile(language, code);
  
      let results = [];
      let allPassed = true;
      let totalRuntime = 0;
      let status = 'Accepted';
      const timeLimit = 10;
  
      try {
        for (let i = 0; i < testcases.length; i++) {
          const testCase = testcases[i];
          const inputPath = await generateInputFile(testCase.input);
  
          const startTime = process.hrtime();
          const output = await executeCpp(filePath, inputPath, timeLimit);
          const endTime = process.hrtime(startTime);
          const testRuntime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
          totalRuntime += testRuntime;
  
          const passed = output.trim() === testCase.output.trim();
          results.push({
            testCase: i + 1,
            passed,
            runtime: testRuntime.toFixed(2)
          });
  
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
  
      const submission = new ContestSubmission({
        userId,
        contestId,
        problemId,
        language,
        code,
        status,
        runtime: totalRuntime.toFixed(2)
      });
  
      await submission.save();
  
      // Update user's points
      const registration = await Registration.findOne({ userId, contestId });
      if (registration) {
        registration.points += problem.points;
        registration.submissions.push(submission._id);
        await registration.save();
      }
  
      res.json({ 
        success: allPassed,
        message: status === 'Accepted' ? "All test cases passed!" : `Submission failed: ${status}`,
        results,
        runtime: totalRuntime.toFixed(2),
        status
      });
    } catch (error) {
      console.error('Error submitting solution:', error);
      res.status(500).json({ message: 'Error submitting solution' });
    }
  });
  

app.get('/api/contests/:contestId/problems/:problemId/mysubmissions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const contestId = req.params.contestId;
    const problemId = req.params.problemId;
    console.log('Received:', userId, contestId, problemId);

    const submissions = await ContestSubmission.find({ userId, contestId, problemId })
      .sort({ createdAt: -1 });
    console.log(submissions);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

  

app.listen(5000,()=>{
    console.log('server running on port 5000');
})