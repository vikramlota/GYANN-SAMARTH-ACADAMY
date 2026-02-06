const SuccessStory = require('../models/SuccessStory.model.js');

// @desc    Get all results
// @route   GET /api/results
const getResults = async (req, res) => {
  const results = await SuccessStory.find({}).sort({ year: -1 });
  res.json(results);
};

// @desc    Add a result
// @route   POST /api/results
// @access  Private
const addResult = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.imageUrl = `/uploads/${req.file.filename}`;
    }
    const result = await SuccessStory.create(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete result
// @route   DELETE /api/results/:id
// @access  Private
const deleteResult = async (req, res) => {
  const result = await SuccessStory.findById(req.params.id);
  if (result) {
    await result.deleteOne();
    res.json({ message: 'Result removed' });
  } else {
    res.status(404).json({ message: 'Result not found' });
  }
};

module.exports = { getResults, addResult, deleteResult };