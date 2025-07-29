const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c']
  },
  status: {
    type: String,
    enum: ['Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'],
    default: 'Pending'
  },
  verdict: {
    type: String,
    default: 'Pending'
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  memoryUsed: {
    type: Number, // in KB
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  errorMessage: String,
  output: String,
  score: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, createdAt: -1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);