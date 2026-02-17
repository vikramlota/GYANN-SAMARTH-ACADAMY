const CurrentAffair = require('../models/CurrentAffair.model.js'); // Ensure filename matches your model file
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

// --- UTILITY FUNCTION to generate slug ---
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// @desc    Get all Current Affairs
// @route   GET /api/current-affairs
// @access  Public
const getCurrentAffairs = async (req, res) => {
  try {
    // Sort by most recent date
    const news = await CurrentAffair.find({}).sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new Current Affair Article
// @route   POST /api/current-affairs
// @access  Private (Admin)
const createCurrentAffair = async (req, res) => {
  try {
    const { headline, contentBody, category, tags, isSpotlight } = req.body;
    
    // 1. Handle Image Upload
    let imageUrl = '';
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (uploadResult) {
        imageUrl = uploadResult.url;
      }
    }

    // 2. Parse Tags (FormData sends arrays as strings like "tag1,tag2")
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(tag => tag.trim());
    }

    // 3. Create Database Entry
    const newArticle = await CurrentAffair.create({
      headline,
      contentBody,
      category,
      tags: parsedTags,
      isSpotlight: isSpotlight === 'true', // Convert string "true" to boolean
      imageUrl
    });
    
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating current affair:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an article
// @route   DELETE /api/current-affairs/:id
// @access  Private (Admin)
const deleteCurrentAffair = async (req, res) => {
  try {
    const article = await CurrentAffair.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await CurrentAffair.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCurrentAffair = async (req, res) => {
  try {
    const article = await CurrentAffair.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const { headline, contentBody, category, tags, isSpotlight } = req.body;

    // Update text fields
    article.headline = headline || article.headline;
    article.contentBody = contentBody || article.contentBody;
    article.category = category || article.category;
    
    // Update Boolean (handle string "true"/"false" from FormData)
    if (isSpotlight !== undefined) {
        article.isSpotlight = isSpotlight === 'true';
    }

    // Update Tags
    if (tags) {
       article.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }

    // Update Image ONLY if a new file is uploaded
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (uploadResult) {
        article.imageUrl = uploadResult.url;
      }
    }

    const updatedArticle = await article.save();
    res.json(updatedArticle);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a single current affair by ID or Slug
// @route   GET /api/current-affairs/:id
// @access  Public
const getCurrentAffairById = async (req, res) => {
  try {
    const param = req.params.id;
    let affair;

    // Check if param is a MongoDB ObjectId or a slug
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid MongoDB ObjectId
      affair = await CurrentAffair.findById(param);
    } else {
      // It's a slug, search by slug field
      affair = await CurrentAffair.findOne({ slug: param });
      
      // If slug not found, try case-insensitive
      if (!affair) {
        const regexSlug = new RegExp(`^${param}$`, 'i');
        affair = await CurrentAffair.findOne({ slug: regexSlug });
      }

      // If still not found, try to find by generating slug from headline
      if (!affair) {
        const allAffairs = await CurrentAffair.find({});
        for (const doc of allAffairs) {
          const generatedSlug = generateSlug(doc.headline);
          if (generatedSlug === param) {
            affair = doc;
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

    if (!affair) {
      return res.status(404).json({ message: 'Current Affair not found', searchedParam: param });
    }
    res.json(affair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Don't forget to export it!
module.exports = {
  getCurrentAffairs,
  getCurrentAffairById,
  createCurrentAffair,
  deleteCurrentAffair,
  updateCurrentAffair // <--- Add this
};