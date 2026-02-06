const Update = require('../models/Update.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');

// --- NOTIFICATIONS ---
const getUpdates = async (req, res) => {
  try {
    const updates = await Update.find({}).sort({ datePosted: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUpdateById = async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }
    res.json(update);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUpdate = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) body.imageUrl = `/uploads/${req.file.filename}`;
    // Normalize type enum values (accept lowercase from frontend)
    if (body.type && typeof body.type === 'string') {
      const map = { job: 'Job', admit: 'AdmitCard', result: 'Result', notice: 'Notice' };
      const low = body.type.toLowerCase();
      if (map[low]) body.type = map[low];
    }
    const update = await Update.create(body);
    res.status(201).json(update);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUpdate = async (req, res) => {
  try {
    await Update.findByIdAndDelete(req.params.id);
    res.json({ message: 'Update removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- CURRENT AFFAIRS ---
const getCurrentAffairs = async (req, res) => {
  try {
    const news = await CurrentAffair.find({}).sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCurrentAffair = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) body.imageUrl = `/uploads/${req.file.filename}`;
    const news = await CurrentAffair.create(body);
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// *** CRITICAL STEP: EXPORT AS AN OBJECT ***
module.exports = { 
  getUpdates, 
  getUpdateById,
  createUpdate, 
  deleteUpdate, 
  getCurrentAffairs, 
  createCurrentAffair 
};