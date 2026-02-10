const Course = require('../models/Course.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const fs = require('fs');
const path = require('path');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = async (req, res) => {
  let tempFilePath = null;
  try {
    const body = { ...req.body };

    // Handle image upload using Cloudinary
    if (req.file) {
      try {
        // Write buffer to temp file for Cloudinary upload
        tempFilePath = path.join('/tmp', `${Date.now()}-${req.file.originalname}`);
        fs.writeFileSync(tempFilePath, req.file.buffer);
        
        const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);
        if (cloudinaryResponse && cloudinaryResponse.secure_url) {
          body.image = cloudinaryResponse.secure_url;
          tempFilePath = null; // Already cleaned up by Cloudinary function
        } else {
          throw new Error('Cloudinary upload returned no URL');
        }
      } catch (uploadError) {
        // Clean up temp file if still exists
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          try {
            fs.unlinkSync(tempFilePath);
          } catch (err) {
            console.error('Failed to delete temp file:', err.message);
          }
        }
        throw uploadError;
      }
    }

    // Normalize features if sent as features[0], features[1], ... from FormData
    if (!body.features) {
      const features = [];
      Object.keys(body).forEach((key) => {
        const m = key.match(/^features\[(\d+)\]$/);
        if (m) {
          features[Number(m[1])] = body[key];
          delete body[key];
        }
      });
      if (features.length) body.features = features.filter(f => f !== undefined && f !== null);
    }

    const course = new Course(body);
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    // Clean up temp file if still exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err.message);
      }
    }
    console.error('Course creation error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, createCourse, deleteCourse };