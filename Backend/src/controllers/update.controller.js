const Update = require('../models/Update.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');
const { notifyGoogle } = require('../utils/googleIndexing.js');

// --- NOTIFICATIONS / UPDATES ---
const getUpdates = async (req, res) => {
  try {
    const updates = await Update.find({}).sort({ datePosted: -1 });
    // Ensure image URLs are HTTPS
    const sanitizedUpdates = updates.map(item => ({
      ...item.toObject(),
      imageUrl: item.imageUrl ? item.imageUrl.replace(/^http:/, 'https:') : item.imageUrl
    }));
    res.json(sanitizedUpdates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUpdateById = async (req, res) => {
  try {
    const param = req.params.id;
    let update;

    // Check if param is a MongoDB ObjectId or a slug
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      update = await Update.findById(param);
    } else {
      update = await Update.findOne({ slug: param });
      
      // If slug not found, try case-insensitive
      if (!update) {
        const regexSlug = new RegExp(`^${param}$`, 'i');
        update = await Update.findOne({ slug: regexSlug });
      }
      
      // Removed the heavy database fallback loop here!
    }

    if (!update) {
      return res.status(404).json({ message: 'Update not found', searchedParam: param });
    }
    // Ensure image URL is HTTPS
    const sanitizedUpdate = {
      ...update.toObject(),
      imageUrl: update.imageUrl ? update.imageUrl.replace(/^http:/, 'https:') : update.imageUrl
    };
    res.json(sanitizedUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUpdate = async (req, res) => {
  try {
    const body = { ...req.body };
    
    // Validate required fields
    if (!body.title || !body.description || !body.type) {
      return res.status(400).json({ 
        message: "Missing required fields: title, description, type",
        received: { title: !!body.title, description: !!body.description, type: !!body.type }
      });
    }
    
    // Handle Image Upload to Cloudinary
    if (req.file) {
      try {
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (uploadResult) {
          body.imageUrl = uploadResult.secure_url;
          console.log("✅ Notification image uploaded to Cloudinary:", body.imageUrl);
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    }
    
    // Normalize type enum values
    if (body.type && typeof body.type === 'string') {
      const map = { job: 'Job', admit: 'AdmitCard', result: 'Result', notice: 'Notice' };
      const low = body.type.toLowerCase();
      if (map[low]) body.type = map[low];
    }
    
    const update = await Update.create(body);

    // --- PING GOOGLE INSTANTLY ---
    const updateUrl = `https://thesamarthacademy.in/updates/${update.slug}`;
    await notifyGoogle(updateUrl, 'URL_UPDATED');

    res.status(201).json(update);
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(400).json({ message: error.message, details: error.toString() });
  }
};

const deleteUpdate = async (req, res) => {
  try {
    const deletedUpdate = await Update.findByIdAndDelete(req.params.id);
    
    if (deletedUpdate) {
        // --- PING GOOGLE INSTANTLY ---
        const updateUrl = `https://thesamarthacademy.in/updates/${deletedUpdate.slug}`;
        await notifyGoogle(updateUrl, 'URL_DELETED');
        
        res.json({ message: 'Update removed' });
    } else {
        res.status(404).json({ message: 'Update not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    let update = await Update.findById(id);
    if (!update) return res.status(404).json({ message: 'Update not found' });

    const body = { ...req.body };

    // Normalize type enum values
    if (body.type && typeof body.type === 'string') {
      const map = { job: 'Job', admit: 'AdmitCard', result: 'Result', notice: 'Notice' };
      const low = body.type.toLowerCase();
      if (map[low]) body.type = map[low];
    }

    // Handle Image Upload
    if (req.file) {
      try {
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (uploadResult) {
          body.imageUrl = uploadResult.secure_url;
          console.log("✅ Notification image uploaded to Cloudinary (update):", body.imageUrl);
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error during update:", uploadError);
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    }

    // Apply updates and save
    Object.keys(body).forEach(key => {
      if (typeof body[key] !== 'undefined') update[key] = body[key];
    });

    await update.save();

    // --- PING GOOGLE INSTANTLY ---
    const updateUrl = `https://thesamarthacademy.in/updates/${update.slug}`;
    await notifyGoogle(updateUrl, 'URL_UPDATED');

    res.json(update);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(400).json({ message: error.message });
  }
};

// --- CURRENT AFFAIRS ---
const getCurrentAffairs = async (req, res) => {
  try {
    const news = await CurrentAffair.find({}).sort({ date: -1 });
    // Ensure image URLs are HTTPS
    const sanitizedNews = news.map(item => ({
      ...item.toObject(),
      imageUrl: item.imageUrl ? item.imageUrl.replace(/^http:/, 'https:') : item.imageUrl
    }));
    res.json(sanitizedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCurrentAffair = async (req, res) => {
  try {
    const body = { ...req.body };
    
    // Handle Image Upload to Cloudinary
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (uploadResult) {
        body.imageUrl = uploadResult.secure_url;
      }
    }
    
    const news = await CurrentAffair.create(body);

    // --- PING GOOGLE INSTANTLY ---
    const newsUrl = `https://thesamarthacademy.in/current-affairs/${news.slug}`;
    await notifyGoogle(newsUrl, 'URL_UPDATED');

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
  updateUpdate,
  deleteUpdate, 
  getCurrentAffairs, 
  createCurrentAffair 
};