const Update = require('../models/Update.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// --- UTILITY FUNCTION to generate slug ---
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

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
    const param = req.params.id;
    let update;

    // Check if param is a MongoDB ObjectId or a slug
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid MongoDB ObjectId
      update = await Update.findById(param);
    } else {
      // It's a slug, search by slug field
      update = await Update.findOne({ slug: param });
      
      // If slug not found and param looks like it might be a title slug attempt,
      // try searching case-insensitively
      if (!update) {
        const regexSlug = new RegExp(`^${param}$`, 'i');
        update = await Update.findOne({ slug: regexSlug });
      }

      // If still not found, try to find by generating slug from title
      // This handles cases where the slug wasn't generated yet
      if (!update) {
        // Search through all documents and find one whose generated slug matches
        const allUpdates = await Update.find({});
        for (const doc of allUpdates) {
          const generatedSlug = generateSlug(doc.title);
          if (generatedSlug === param) {
            update = doc;
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

    if (!update) {
      return res.status(404).json({ message: 'Update not found', searchedParam: param });
    }
    res.json(update);
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
          body.imageUrl = uploadResult.url;
          console.log("✅ Notification image uploaded to Cloudinary:", body.imageUrl);
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    }
    
    // Normalize type enum values (accept lowercase from frontend)
    if (body.type && typeof body.type === 'string') {
      const map = { job: 'Job', admit: 'AdmitCard', result: 'Result', notice: 'Notice' };
      const low = body.type.toLowerCase();
      if (map[low]) body.type = map[low];
    }
    
    // The pre-save hook will automatically generate slug from title
    const update = await Update.create(body);
    res.status(201).json(update);
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(400).json({ message: error.message, details: error.toString() });
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
    
    // Handle Image Upload to Cloudinary
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (uploadResult) {
        body.imageUrl = uploadResult.url;
      }
    }
    
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