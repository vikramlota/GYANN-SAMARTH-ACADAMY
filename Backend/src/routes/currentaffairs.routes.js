const express = require('express');
const router = express.Router();
const { 
  getCurrentAffairs, 
  createCurrentAffair, 
  deleteCurrentAffair,
  updateCurrentAffair // <--- Import this
} = require('../controllers/currentaffairs.controllers.js');

const { protect } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/upload.middleware.js');

router.get('/', getCurrentAffairs);
router.post('/', protect, upload.single('image'), createCurrentAffair);
router.delete('/:id', protect, deleteCurrentAffair);

// ADD THIS LINE:
router.put('/:id', protect, upload.single('image'), updateCurrentAffair);

module.exports = router;