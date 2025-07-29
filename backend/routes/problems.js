const express = require('express');
const Problem = require('../models/Problem');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all problems (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, tags } = req.query;
    const query = { isActive: true };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const problems = await Problem.find(query)
      .select('title difficulty tags stats createdAt')
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Problem.countDocuments(query);

    res.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('author', 'username')
      .select('-testCases');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ problem });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new problem (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      statement,
      difficulty,
      tags,
      constraints,
      testCases,
      sampleInput,
      sampleOutput,
      explanation
    } = req.body;

    const problem = new Problem({
      title,
      statement,
      difficulty,
      tags,
      constraints,
      testCases,
      sampleInput,
      sampleOutput,
      explanation,
      author: req.user._id
    });

    await problem.save();

    res.status(201).json({
      message: 'Problem created successfully',
      problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ message: 'Server error during problem creation' });
  }
});

// Update problem (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({
      message: 'Problem updated successfully',
      problem
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({ message: 'Server error during problem update' });
  }
});

// Delete problem (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ message: 'Problem deactivated successfully' });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({ message: 'Server error during problem deletion' });
  }
});

// Get problem test cases (for submission evaluation)
router.get('/:id/testcases', auth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select('testCases');
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ testCases: problem.testCases });
  } catch (error) {
    console.error('Get test cases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;