const Course = require('../models/Course.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const fs = require('fs');
const path = require('path');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    // Sort by latest created
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
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
    // 1. Create a shallow copy of req.body
    const body = { ...req.body };

    // 2. Handle Image Upload
    if (req.file) {
      try {
        // VERCEL FIX: If multer didn't save to disk (memory storage), write to /tmp
        if (req.file.buffer) {
            tempFilePath = path.join('/tmp', `${Date.now()}-${req.file.originalname}`);
            fs.writeFileSync(tempFilePath, req.file.buffer);
        } else {
            // Disk storage was used
            tempFilePath = req.file.path;
        }
        
        const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);
        
        // CRITICAL: Extract ONLY the URL string
        if (cloudinaryResponse && cloudinaryResponse.secure_url) {
          body.image = cloudinaryResponse.secure_url;
        } else {
          throw new Error('Cloudinary upload failed to return a URL');
        }
      } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      } finally {
        // Clean up temp file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Cleanup error", e); }
        }
      }
    }

    // 3. Handle Features (if sent as array items features[0], features[1]...)
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
    console.error('Course creation error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const updateCourse = async (req, res) => {
    let tempFilePath = null;
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const body = { ...req.body };

        // 1. Handle New Image Upload (If provided)
        if (req.file) {
            try {
                 if (req.file.buffer) {
                    tempFilePath = path.join('/tmp', `${Date.now()}-${req.file.originalname}`);
                    fs.writeFileSync(tempFilePath, req.file.buffer);
                } else {
                    tempFilePath = req.file.path;
                }

                const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);

                if (cloudinaryResponse && cloudinaryResponse.secure_url) {
                    body.image = cloudinaryResponse.secure_url;
                }
            } catch (uploadError) {
                 throw new Error(`Image upload failed: ${uploadError.message}`);
            } finally {
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Cleanup error", e); }
                }
            }
        }

        // 2. Handle Features Array Update
        // If features are coming as separate fields (features[0], etc.)
        const features = [];
        Object.keys(body).forEach((key) => {
            const m = key.match(/^features\[(\d+)\]$/);
            if (m) {
                features[Number(m[1])] = body[key];
                delete body[key]; // Remove the raw key
            }
        });
        
        // If we extracted features, update the body
        if (features.length > 0) {
            body.features = features.filter(f => f !== undefined && f !== null);
        }

        // 3. Update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true } // Return the new document
        );

        res.json(updatedCourse);

    } catch (error) {
        console.error('Course update error:', error.message);
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

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };