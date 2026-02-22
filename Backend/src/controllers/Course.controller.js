const Course = require('../models/Course.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const fs = require('fs');
const path = require('path');

// --- UTILITY FUNCTION to generate slug ---
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

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
    // 1. DEBUGGING: Check what we actually received
    console.log("➡️ Request Body:", req.body);
    console.log("➡️ Request File:", req.file);

    // 2. VALIDATION: Check if file exists immediately
    // If Multer didn't pick up a file, req.file will be undefined.
    if (!req.file) {
        return res.status(400).json({ message: "❌ Image file is missing in the request." });
    }

    // 3. UPLOAD LOGIC
    let imageUrl = "";
    try {
        // Handle Buffer (Memory Storage) vs Path (Disk Storage)
        if (req.file.buffer) {
            tempFilePath = path.join('/tmp', `${Date.now()}-${req.file.originalname}`);
            fs.writeFileSync(tempFilePath, req.file.buffer);
        } else {
            tempFilePath = req.file.path;
        }
        
        console.log("➡️ Uploading to Cloudinary...");
        const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);
        
        if (!cloudinaryResponse?.secure_url) {
             throw new Error("Cloudinary returned no URL");
        }
        
        imageUrl = cloudinaryResponse.secure_url;
        console.log("✅ Image Uploaded:", imageUrl);

    } catch (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
    } finally {
        // Clean up temp file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Cleanup error:", e); }
        }
    }

    // 4. PARSE FEATURES (Handle array or indexed fields)
    let features = [];
    if (req.body.features) {
        // If it came as a JSON string or array
        features = Array.isArray(req.body.features) ? req.body.features : [req.body.features];
    } else {
        // If it came as features[0], features[1] (FormData standard)
        Object.keys(req.body).forEach((key) => {
            const m = key.match(/^features\[(\d+)\]$/);
            if (m) features[Number(m[1])] = req.body[key];
        });
    }
    // Remove empty/null values
    features = features.filter(f => f);

    // 5. MANUAL CONSTRUCTION ( The Fix for "Cast to String" )
    // We do NOT use { ...req.body }. We pick fields manually.
    const courseData = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        category: req.body.category,
        badgeText: req.body.badgeText,
        colorTheme: req.body.colorTheme, // Mongoose handles the object structure if schema matches
        features: features,
        image: imageUrl, // <--- We force the string URL here
        // Add createdBy if you have auth middleware
        // createdBy: req.user?._id 
    };

    console.log("➡️ Saving Course to DB:", courseData);

    const course = new Course(courseData);
    const createdCourse = await course.save();
    
    res.status(201).json(createdCourse);

  } catch (error) {
    console.error("❌ Create Course Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};
// @desc    Update a course
// @route   PUT /api/courses/:slug
// @access  Private (Admin)
const updateCourse = async (req, res) => {
    let tempFilePath = null;
    try {
        const { slug } = req.params;
        let course;
        
        // Check if param is a MongoDB ObjectId or a slug
        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
          // It's a valid MongoDB ObjectId
          course = await Course.findById(slug);
        } else {
          // It's a slug, search by slug field
          course = await Course.findOne({ slug });
        }

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
            course._id,
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
// @route   DELETE /api/courses/:slug
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    let course;
    
    // Check if param is a MongoDB ObjectId or a slug
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid MongoDB ObjectId
      course = await Course.findById(slug);
    } else {
      // It's a slug, search by slug field
      course = await Course.findOne({ slug });
    }
    
    if (course) {
      await Course.deleteOne({ _id: course._id });
      res.json({ message: 'Course removed successfully', deletedCourse: course });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single course by ID or Slug
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const param = req.params.id;
    let course;

    // Check if param is a MongoDB ObjectId or a slug
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid MongoDB ObjectId
      course = await Course.findById(param);
    } else {
      // It's a slug, search by slug field
      course = await Course.findOne({ slug: param });
      
      // If slug not found, try case-insensitive
      if (!course) {
        const regexSlug = new RegExp(`^${param}$`, 'i');
        course = await Course.findOne({ slug: regexSlug });
      }

      // If still not found, try to find by generating slug from title
      if (!course) {
        const allCourses = await Course.find({});
        for (const doc of allCourses) {
          const generatedSlug = generateSlug(doc.title);
          if (generatedSlug === param) {
            course = doc;
            // Auto-save the generated slug to the document
            if (!doc.slug) {
              doc.slug = generatedSlug;
              await doc.save();
            }
            break;
          }
        }
      }
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found', searchedParam: param });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse };

