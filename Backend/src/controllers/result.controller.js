const SuccessStory = require('../models/SuccessStory.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// @desc    Get all results
// @route   GET /api/results
const getResults = async (req, res) => {
  const results = await SuccessStory.find({}).sort({ year: -1 });
  // Ensure image URLs are HTTPS
  const sanitizedResults = results.map(item => ({
    ...item.toObject(),
    imageUrl: item.imageUrl ? item.imageUrl.replace(/^http:/, 'https:') : item.imageUrl
  }));
  res.json(sanitizedResults);
};

// @desc    Add a result
// @route   POST /api/results
// @access  Private
const addResult = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      try {
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (uploadResult && (uploadResult.secure_url || uploadResult.url)) {
          body.imageUrl = uploadResult.secure_url || uploadResult.url;
        }
      } catch (uploadErr) {
        console.error('❌ Cloudinary upload failed for result image:', uploadErr);
        return res.status(400).json({ message: 'Image upload failed', details: uploadErr.message });
      }
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