const express = require('express');
const router = express.Router();
const { getUpdates, getUpdateById, createUpdate, deleteUpdate, getCurrentAffairs, createCurrentAffair } = require('../controllers/update.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/upload.middleware.js');

// Notification Routes
router.route('/').get(getUpdates).post(protect, upload.single('image'), createUpdate);
router.route('/:id').get(getUpdateById).delete(protect, deleteUpdate);

// Current Affairs Routes
router.route('/current-affairs/all').get(getCurrentAffairs);
router.route('/current-affairs/create').post(protect, upload.single('image'), createCurrentAffair);

module.exports = router;