const CurrentAffair = require('../models/CurrentAffair.model.js'); 
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { notifyGoogle } = require('../utils/googleIndexing.js');

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
    // Added slug to destructured body
    const { headline, slug, contentBody, category, tags, isSpotlight } = req.body;
    
    // Validate required fields (Now checking for slug too)
    if (!headline || !contentBody || !category || !slug) {
      return res.status(400).json({ 
        message: "Missing required fields: headline, slug, contentBody, category",
        received: { headline: !!headline, slug: !!slug, contentBody: !!contentBody, category: !!category }
      });
    }
    
    // 1. Handle Image Upload
    let imageUrl = '';
    if (req.file) {
      try {
        const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (uploadResult) {
          imageUrl = uploadResult.url;
          console.log("✅ Image uploaded to Cloudinary:", imageUrl);
        } else {
          console.warn("⚠️ Cloudinary upload returned null");
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(400).json({ message: `Image upload failed: ${uploadError.message}` });
      }
    }

    // 2. Parse Tags
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    // 3. Create Database Entry
    const newArticle = new CurrentAffair({
      headline,
      slug, // Saving the manual slug
      contentBody,
      category,
      tags: parsedTags,
      isSpotlight: isSpotlight === 'true',
      imageUrl
    });
    
    const savedArticle = await newArticle.save();

    // --- PING GOOGLE INSTANTLY ---
    const articleUrl = `https://thesamarthacademy.in/current-affairs/${savedArticle.slug}`;
    await notifyGoogle(articleUrl, 'URL_UPDATED');
    
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error("❌ Error creating current affair:", error);
    res.status(400).json({ message: error.message, details: error.toString() });
  }
};

// @desc    Update an article
// @route   PUT /api/current-affairs/:id
// @access  Private (Admin)
const updateCurrentAffair = async (req, res) => {
  try {
    const article = await CurrentAffair.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const { headline, slug, contentBody, category, tags, isSpotlight } = req.body;

    // Update text fields
    article.headline = headline || article.headline;
    article.slug = slug || article.slug; // Update manual slug
    article.contentBody = contentBody || article.contentBody;
    article.category = category || article.category;
    
    // Update Boolean
    if (isSpotlight !== undefined) {
        article.isSpotlight = isSpotlight === 'true';
    }

    // Update Tags
    if (tags) {
       article.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }

    // Update Image
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
      if (uploadResult) {
        article.imageUrl = uploadResult.url;
      }
    }

    const updatedArticle = await article.save();

    // --- PING GOOGLE INSTANTLY (Added this to your update function!) ---
    const articleUrl = `https://thesamarthacademy.in/current-affairs/${updatedArticle.slug}`;
    await notifyGoogle(articleUrl, 'URL_UPDATED');

    res.json(updatedArticle);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an article
// @route   DELETE /api/current-affairs/:id
// @access  Private (Admin)
const deleteCurrentAffair = async (req, res) => {
  try {
    const deletedArticle = await CurrentAffair.findByIdAndDelete(req.params.id);
    
    if (deletedArticle) {
      // --- PING GOOGLE AFTER SUCCESSFUL DELETION ---
      const articleUrl = `https://thesamarthacademy.in/current-affairs/${deletedArticle.slug}`;
      await notifyGoogle(articleUrl, 'URL_DELETED');

      res.json({ message: 'Article removed' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single current affair by Slug
// @route   GET /api/current-affairs/:slug
// @access  Public
const getCurrentAffairBySlug = async (req, res) => {
  try {
    const article = await CurrentAffair.findOne({ slug: req.params.slug });
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCurrentAffairs,
  getCurrentAffairBySlug,
  createCurrentAffair,
  deleteCurrentAffair,
  updateCurrentAffair 
};