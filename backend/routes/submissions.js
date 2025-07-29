const express = require('express');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { executeCode } = require('../utils/codeExecutor');

const router = express.Router();

// Submit code for a problem
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // Validate problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Create submission
    const submission = new Submission({
      user: req.user._id,
      problem: problemId,
      code,
      language,
      totalTestCases: problem.testCases.length
    });

    await submission.save();

    // Execute code asynchronously
    executeCode(submission._id, code, language, problem.testCases, problem.constraints)
      .then(async (result) => {
        // Update submission with results
        await Submission.findByIdAndUpdate(submission._id, result);
        
        // Update problem stats
        await Problem.findByIdAndUpdate(problemId, {
          $inc: { 
            'stats.totalSubmissions': 1,
            'stats.acceptedSubmissions': result.status === 'Accepted' ? 1 : 0
          }
        });

        // Update user stats
        if (result.status === 'Accepted') {
          const userSubmissions = await Submission.find({
            user: req.user._id,
            problem: problemId,
            status: 'Accepted'
          });

          // If this is the first accepted submission for this problem
          if (userSubmissions.length === 1) {
            await User.findByIdAndUpdate(req.user._id, {
              $inc: { 
                'stats.problemsSolved': 1,
                'stats.acceptedSubmissions': 1,
                'stats.totalSubmissions': 1
              }
            });
          } else {
            await User.findByIdAndUpdate(req.user._id, {
              $inc: { 
                'stats.acceptedSubmissions': 1,
                'stats.totalSubmissions': 1
              }
            });
          }
        } else {
          await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'stats.totalSubmissions': 1 }
          });
        }
      })
      .catch(async (error) => {
        console.error('Code execution error:', error);
        await Submission.findByIdAndUpdate(submission._id, {
          status: 'Runtime Error',
          verdict: 'Runtime Error',
          errorMessage: error.message
        });
      });

    res.status(201).json({
      message: 'Code submitted successfully',
      submissionId: submission._id,
      status: 'Pending'
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Server error during submission' });
  }
});

// Get submission status
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problem', 'title')
      .populate('user', 'username');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user owns this submission or is admin
    if (submission.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's submissions
router.get('/user/me', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, problemId } = req.query;
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (problemId) {
      query.problem = problemId;
    }

    const submissions = await Submission.find(query)
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submissions for a problem
router.get('/problem/:problemId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const submissions = await Submission.find({
      problem: req.params.problemId,
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments({
      problem: req.params.problemId,
      user: req.user._id
    });

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get problem submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all submissions (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('user', 'username')
      .populate('problem', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;