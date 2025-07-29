const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Install uuid if not already installed
// npm install uuid

const TEMP_DIR = path.join(__dirname, '../temp');
const TIMEOUT = 5000; // 5 seconds

// Ensure temp directory exists
const ensureTempDir = async () => {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
};

// Language configurations
const languageConfigs = {
  javascript: {
    extension: '.js',
    command: 'node',
    args: (filename) => [filename]
  },
  python: {
    extension: '.py',
    command: 'python3',
    args: (filename) => [filename]
  },
  java: {
    extension: '.java',
    command: 'javac',
    compileArgs: (filename) => [filename],
    runCommand: 'java',
    runArgs: (className) => [className]
  },
  cpp: {
    extension: '.cpp',
    command: 'g++',
    compileArgs: (filename, outputFile) => [filename, '-o', outputFile],
    runCommand: './',
    runArgs: (outputFile) => [outputFile]
  },
  c: {
    extension: '.c',
    command: 'gcc',
    compileArgs: (filename, outputFile) => [filename, '-o', outputFile],
    runCommand: './',
    runArgs: (outputFile) => [outputFile]
  }
};

// Execute code with input and return output
const runCode = (command, args, input, timeLimit) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd: TEMP_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      process.kill('SIGKILL');
      reject(new Error('Time Limit Exceeded'));
    }, timeLimit);

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      clearTimeout(timer);
      
      if (timedOut) return;

      if (code !== 0) {
        reject(new Error(error || `Process exited with code ${code}`));
      } else {
        resolve(output.trim());
      }
    });

    process.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    // Send input to the process
    if (input) {
      process.stdin.write(input);
    }
    process.stdin.end();
  });
};

// Compile code (for compiled languages)
const compileCode = (language, filename) => {
  return new Promise((resolve, reject) => {
    const config = languageConfigs[language];
    const outputFile = filename.replace(config.extension, '');
    
    const process = spawn(config.command, config.compileArgs(filename, outputFile), {
      cwd: TEMP_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let error = '';

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Compilation Error: ${error}`));
      } else {
        resolve(outputFile);
      }
    });

    process.on('error', (err) => {
      reject(new Error(`Compilation Error: ${err.message}`));
    });
  });
};

// Clean up temporary files
const cleanup = async (files) => {
  for (const file of files) {
    try {
      await fs.unlink(path.join(TEMP_DIR, file));
    } catch (error) {
      // Ignore cleanup errors
    }
  }
};

// Main code execution function
const executeCode = async (submissionId, code, language, testCases, constraints) => {
  await ensureTempDir();
  
  const config = languageConfigs[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const uniqueId = uuidv4();
  const filename = `${uniqueId}${config.extension}`;
  const filePath = path.join(TEMP_DIR, filename);
  
  let filesToCleanup = [filename];
  let compiledFile = null;

  try {
    // Write code to file
    await fs.writeFile(filePath, code);

    // Compile if necessary
    if (config.compileArgs) {
      try {
        compiledFile = await compileCode(language, filename);
        filesToCleanup.push(compiledFile);
      } catch (error) {
        await cleanup(filesToCleanup);
        return {
          status: 'Compilation Error',
          verdict: 'Compilation Error',
          errorMessage: error.message,
          testCasesPassed: 0,
          executionTime: 0,
          memoryUsed: 0
        };
      }
    }

    let passedTests = 0;
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;

    // Run test cases
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const startTime = Date.now();

      try {
        let command, args;
        
        if (config.runCommand) {
          // Compiled languages
          command = config.runCommand;
          args = config.runArgs(compiledFile);
        } else {
          // Interpreted languages
          command = config.command;
          args = config.args(filename);
        }

        const output = await runCode(command, args, testCase.input, constraints.timeLimit || TIMEOUT);
        const executionTime = Date.now() - startTime;
        totalExecutionTime += executionTime;

        // Compare output (trim whitespace)
        const expectedOutput = testCase.output.trim();
        const actualOutput = output.trim();

        if (actualOutput === expectedOutput) {
          passedTests++;
        } else {
          // Wrong answer
          await cleanup(filesToCleanup);
          return {
            status: 'Wrong Answer',
            verdict: `Wrong Answer on test case ${i + 1}`,
            testCasesPassed: passedTests,
            totalTestCases: testCases.length,
            executionTime: totalExecutionTime,
            memoryUsed: maxMemoryUsed,
            output: actualOutput,
            score: Math.round((passedTests / testCases.length) * 100)
          };
        }

      } catch (error) {
        await cleanup(filesToCleanup);
        
        if (error.message.includes('Time Limit Exceeded')) {
          return {
            status: 'Time Limit Exceeded',
            verdict: `Time Limit Exceeded on test case ${i + 1}`,
            testCasesPassed: passedTests,
            totalTestCases: testCases.length,
            executionTime: constraints.timeLimit || TIMEOUT,
            memoryUsed: maxMemoryUsed
          };
        } else {
          return {
            status: 'Runtime Error',
            verdict: `Runtime Error on test case ${i + 1}`,
            errorMessage: error.message,
            testCasesPassed: passedTests,
            totalTestCases: testCases.length,
            executionTime: totalExecutionTime,
            memoryUsed: maxMemoryUsed
          };
        }
      }
    }

    // All test cases passed
    await cleanup(filesToCleanup);
    return {
      status: 'Accepted',
      verdict: 'Accepted',
      testCasesPassed: passedTests,
      totalTestCases: testCases.length,
      executionTime: totalExecutionTime,
      memoryUsed: maxMemoryUsed,
      score: 100
    };

  } catch (error) {
    await cleanup(filesToCleanup);
    return {
      status: 'Runtime Error',
      verdict: 'Runtime Error',
      errorMessage: error.message,
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      executionTime: 0,
      memoryUsed: 0
    };
  }
};

module.exports = { executeCode };