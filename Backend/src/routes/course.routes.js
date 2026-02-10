const express = require('express');
const router = express.Router();

// 1. Import updateCourse along with the others
const { 
    getCourses, 
    createCourse, 
    deleteCourse, 
    updateCourse 
} = require('../controllers/Course.controller.js');

const { protect } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/upload.middleware.js');

// Public: Get all courses
// Private (Admin): Create a new course (with image)
router.route('/')
    .get(getCourses)
    .post(protect, upload.single('image'), createCourse);

// Private (Admin): Delete or Update a specific course
router.route('/:id')
    .delete(protect, deleteCourse)
    .put(protect, upload.single('image'), updateCourse); // <--- Added Edit Route

module.exports = router;
module.exports = router;