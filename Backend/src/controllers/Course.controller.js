const Course = require('../models/Course.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const fs = require('fs');
const path = require('path');

// @desc    Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
const createCourse = async (req, res) => {
  let tempFilePath = null;
  try {
    // 1. SANITIZE: Remove 'image' from body immediately to prevent "{}" errors
    const body = { ...req.body };
    delete body.image; 

    // 2. Handle Image Upload
    if (req.file) {
      try {
        // Write to /tmp for Vercel
        if (req.file.buffer) {
            tempFilePath = path.join('/tmp', `${Date.now()}-${req.file.originalname}`);
            fs.writeFileSync(tempFilePath, req.file.buffer);
        } else {
            tempFilePath = req.file.path;
        }
        
        const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);
        
        if (cloudinaryResponse && cloudinaryResponse.secure_url) {
          body.image = cloudinaryResponse.secure_url; // Set VALID string
        }
      } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try { fs.unlinkSync(tempFilePath); } catch (e) { console.error(e); }
        }
      }
    }

    // 3. Validation: Image is REQUIRED for creation
    if (!body.image) {
        return res.status(400).json({ message: "Image is required for new courses" });
    }

    // 4. Handle Features
    if (!body.features) {
      const features = [];
      Object.keys(body).forEach((key) => {
        const m = key.match(/^features\[(\d+)\]$/);
        if (m) {
          features[Number(m[1])] = body[key];
          delete body[key];
        }
      });
      if (features.length) body.features = features.filter(f => f);
    }

    const course = new Course(body);
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);

  } catch (error) {
    console.error('Create Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a course
const updateCourse = async (req, res) => {
    let tempFilePath = null;
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 1. SANITIZE: Start with body, but DELETE image so we don't overwrite with garbage
        const body = { ...req.body };
        delete body.image;

        // 2. Handle New Image (Only if uploaded)
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
                    body.image = cloudinaryResponse.secure_url; // Update to NEW image
                }
            } catch (uploadError) {
                 throw new Error(`Image upload failed: ${uploadError.message}`);
            } finally {
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    try { fs.unlinkSync(tempFilePath); } catch (e) { console.error(e); }
                }
            }
        }
        // NOTE: If no file is uploaded, 'body.image' remains undefined, 
        // so Mongoose will NOT update the field (preserving the old image).

        // 3. Handle Features
        const features = [];
        Object.keys(body).forEach((key) => {
            const m = key.match(/^features\[(\d+)\]$/);
            if (m) {
                features[Number(m[1])] = body[key];
                delete body[key];
            }
        });
        if (features.length > 0) {
            body.features = features.filter(f => f);
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        res.json(updatedCourse);

    } catch (error) {
        console.error('Update Error:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a course
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