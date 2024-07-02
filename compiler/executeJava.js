const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const javaFilePath = path.join(outputPath, `${jobId}.java`);
  const className = jobId;

  // Read the original Java file
  const originalJavaCode = fs.readFileSync(filepath, "utf-8");

  // Modify the class name to match the jobId
  const modifiedJavaCode = originalJavaCode.replace(/public class \w+/, `public class ${className}`);

  // Save the modified Java file
  fs.writeFileSync(javaFilePath, modifiedJavaCode);

  return new Promise((resolve, reject) => {
    exec(
      `javac "${javaFilePath}" -d "${outputPath}" && cd "${outputPath}" && java ${className}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeJava,
};
