const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  statement: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  constraints: {
    timeLimit: {
      type: Number,
      default: 1000 // milliseconds
    },
    memoryLimit: {
      type: Number,
      default: 128 // MB
    }
  },
  testCases: [testCaseSchema],
  sampleInput: String,
  sampleOutput: String,
  explanation: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate acceptance rate before saving
problemSchema.pre('save', function(next) {
  if (this.stats.totalSubmissions > 0) {
    this.stats.acceptanceRate = (this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100;
  }
  next();
});

module.exports = mongoose.model('Problem', problemSchema);