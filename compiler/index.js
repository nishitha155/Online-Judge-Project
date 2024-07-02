const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const cors = require('cors');
const dotenv = require('dotenv')
const connectDB = require('../backend/database/db.js')
const Question = require('../backend/models/Question.js')
const TestCase = require('../backend/models/TestCase.js')
const cookieParser = require('cookie-parser');
const Submission = require('../backend/models/Submission.js')
const jwt = require('jsonwebtoken');

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
 
  

    const { language = 'cpp', code,input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
  
        
        const filePath = await generateFile(language, code);
          const inputPath = await generateInputFile(input);
          
          
        let output;
        if(language === 'cpp'){
          console.log('running cpp')
          output = await executeCpp(filePath, inputPath);
        }
          
          else if(language === 'java'){
            output = await executeJava(filePath);
          }else{
            output = await executePy(filePath);
          }
        
          res.json({ filePath, inputPath, output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
  });

  function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
   console.log(token)
  
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

  app.post('/submit/:id',authenticateToken, async (req, res) => {
    console.log('hi')
    const { id } = req.params;
    const { language = "cpp", code } = req.body;
    const userId=req.user.userId;
    console.log(userId)

    try {
        const problem = await Question.findById(id);
        if (!problem) {
            return res.status(404).json({ success: false, error: "Problem not found" });
        }

        const filePath = await generateFile(language, code);

        const testcases = await TestCase.find({ problemId: id });
        let results = [];
        let allPassed = true;
        let runtime = 0;
        console.log(testcases.length)

        for (let i = 0; i < testcases.length; i++) {
            const testCase = testcases[i];
            const inputPath = await generateInputFile(testCase.input);
            const startTime = process.hrtime();
            const output = await executeCpp(filePath, inputPath);
            console.log(output)
            const endTime = process.hrtime(startTime);
            const testRuntime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
            runtime += testRuntime;

            const passed = output.trim() === testCase.output.trim();
            results.push({
                testCase: i + 1,
                passed,
                runtime: testRuntime
            });

            if (!passed) {
                allPassed = false;
            }
        }


        const submission = new Submission({
            userId,
            problemId: id,
            language,
            code,
            status: allPassed ? 'Accepted' : 'Failed',
            runtime: runtime.toFixed(2)
          });
          await submission.save();
          console.log(submission)
        // Update the problem statistics after all test cases have been checked
        if (allPassed) {
            problem.submissions += 1;
            problem.succesful += 1;
        } else {
            problem.submissions += 1;
        }
        await problem.save();

        res.json({
            success: allPassed,
            message: allPassed ? "All test cases passed!" : "Some test cases failed.",
            results,
            runtime: runtime.toFixed(2)
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