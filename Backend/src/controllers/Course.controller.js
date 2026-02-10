const Course = require('../models/Course.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const fs = require('fs');

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
  try {
    const body = { ...req.body };

    // Handle image upload
    if (req.file) {
      if (process.env.NODE_ENV === 'production') {
        // Use Cloudinary for production
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse && cloudinaryResponse.secure_url) {
          body.image = cloudinaryResponse.secure_url;
        } else {
          throw new Error('Failed to upload image to Cloudinary');
        }
      } else {
        // Use local uploads for development
        body.image = `/uploads/${req.file.filename}`;
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
    // Clean up uploaded file if error occurs
    if (req.file && process.env.NODE_ENV !== 'production') {
      fs.unlinkSync(req.file.path).catch(err => console.error('Failed to delete temp file:', err));
    }
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