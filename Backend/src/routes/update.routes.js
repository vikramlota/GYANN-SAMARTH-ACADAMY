const express = require('express');
const router = express.Router();
const { getUpdates, getUpdateById, createUpdate, updateUpdate, deleteUpdate, getCurrentAffairs, createCurrentAffair } = require('../controllers/update.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/upload.middleware.js');

// Notification Routes
router.route('/').get(getUpdates).post(protect, upload.single('image'), createUpdate);
router.route('/:id').get(getUpdateById).put(protect, upload.single('image'), updateUpdate).delete(protect, deleteUpdate);

module.exports = router;