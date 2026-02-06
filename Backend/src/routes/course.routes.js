const express = require('express');
const router = express.Router();
const { getCourses, createCourse, deleteCourse } = require('../controllers/Course.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/upload.middleware.js');

router.route('/').get(getCourses).post(protect, upload.single('image'), createCourse);
router.route('/:id').delete(protect, deleteCourse);

module.exports = router;