const express = require('express');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

const router = express.Router();

// Get global leaderboard
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const users = await User.find({ role: 'user' })
      .select('username profile stats')
      .sort({ 
        'stats.problemsSolved': -1, 
        'stats.acceptedSubmissions': -1,
        'stats.totalSubmissions': 1
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: (page - 1) * limit + index + 1
    }));

    const total = await User.countDocuments({ role: 'user' });

    res.json({
      leaderboard,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username profile stats');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent submissions
    const recentSubmissions = await Submission.find({ user: req.params.userId })
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get solved problems by difficulty
    const solvedProblems = await Submission.aggregate([
      {
        $match: {
          user: user._id,
          status: 'Accepted'
        }
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problem',
          foreignField: '_id',
          as: 'problemDetails'
        }
      },
      {
        $unwind: '$problemDetails'
      },
      {
        $group: {
          _id: '$problemDetails.difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get submission statistics by status
    const submissionStats = await Submission.aggregate([
      {
        $match: { user: user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate user rank
    const betterUsers = await User.countDocuments({
      role: 'user',
      $or: [
        { 'stats.problemsSolved': { $gt: user.stats.problemsSolved } },
        {
          'stats.problemsSolved': user.stats.problemsSolved,
          'stats.acceptedSubmissions': { $gt: user.stats.acceptedSubmissions }
        },
        {
          'stats.problemsSolved': user.stats.problemsSolved,
          'stats.acceptedSubmissions': user.stats.acceptedSubmissions,
          'stats.totalSubmissions': { $lt: user.stats.totalSubmissions }
        }
      ]
    });

    const rank = betterUsers + 1;

    res.json({
      user: {
        ...user.toObject(),
        rank
      },
      recentSubmissions,
      solvedProblems,
      submissionStats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get problem statistics
router.get('/problems', async (req, res) => {
  try {
    const problemStats = await Problem.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          totalSubmissions: { $sum: '$stats.totalSubmissions' },
          acceptedSubmissions: { $sum: '$stats.acceptedSubmissions' }
        }
      },
      {
        $addFields: {
          acceptanceRate: {
            $cond: {
              if: { $gt: ['$totalSubmissions', 0] },
              then: { $multiply: [{ $divide: ['$acceptedSubmissions', '$totalSubmissions'] }, 100] },
              else: 0
            }
          }
        }
      }
    ]);

    // Get most popular problems
    const popularProblems = await Problem.find({ isActive: true })
      .select('title difficulty stats')
      .sort({ 'stats.totalSubmissions': -1 })
      .limit(10);

    // Get most solved problems
    const mostSolved = await Problem.find({ isActive: true })
      .select('title difficulty stats')
      .sort({ 'stats.acceptedSubmissions': -1 })
      .limit(10);

    res.json({
      problemStats,
      popularProblems,
      mostSolved
    });
  } catch (error) {
    console.error('Get problem stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activity
router.get('/activity/recent', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const recentSubmissions = await Submission.find({ status: 'Accepted' })
      .populate('user', 'username')
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(limit * 1);

    res.json({ recentActivity: recentSubmissions });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;