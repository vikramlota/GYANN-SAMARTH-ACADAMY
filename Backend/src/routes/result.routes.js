const express = require('express');
const router = express.Router();
const { getResults, addResult, deleteResult } = require('../controllers/result.controller.js');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware.js');

router.route('/').get(getResults).post(protect, upload.single('image'), addResult);
router.route('/:id').delete(protect, deleteResult);

module.exports = router;