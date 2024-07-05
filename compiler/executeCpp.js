const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath, timeLimit) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  
  return new Promise((resolve, reject) => {
    // Compile the C++ file
    exec(`g++ -Wall -Wextra -Werror "${filepath}" -o "${outPath}"`, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        // Check if the error message indicates a syntax error
        if (compileStderr.includes('error:')) {
          reject({ type: 'SyntaxError', error: compileStderr });
        } else {
          reject({ type: 'CompilationError', error: compileStderr });
        }
        return;
      }

      // Determine the appropriate timeout command based on the operating system
      const isWindows = process.platform === 'win32';
      const timeoutCommand = isWindows ? `timeout /T ${timeLimit}` : `timeout ${timeLimit}s`;

      // Run the compiled program
      const runCommand = isWindows
        ? `cd "${outputPath}" && "${jobId}.out" < "${inputPath}"`
        : `cd "${outputPath}" && ${timeoutCommand} "./${jobId}.out" < "${inputPath}"`;

      exec(runCommand, (runError, runStdout, runStderr) => {
        if (runError) {
          if (runError.code === 124 || runError.signal === 'SIGTERM') {
            reject({ type: 'TimeLimitExceeded', error: 'Time limit exceeded' });
          } else {
            reject({ type: 'RuntimeError', error: runStderr });
          }
          return;
        }
        resolve(runStdout);
      });
    });
  });
};

module.exports = {
  executeCpp,
};
