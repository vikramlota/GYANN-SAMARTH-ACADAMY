const express = require('express');
const router = express.Router();

// Import your models (adjust the path if necessary depending on where this file lives)
const Course = require('../models/Course.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');

// Route: GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const courses = await Course.find().select('slug updatedAt');
    const news = await CurrentAffair.find().select('slug updatedAt');

    const baseUrl = 'https://thesamarthacademy.in';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${baseUrl}</loc><priority>1.0</priority></url>
      <url><loc>${baseUrl}/courses</loc><priority>0.8</priority></url>
      <url><loc>${baseUrl}/current-affairs</loc><priority>0.8</priority></url>`;

    // Loop through courses
    courses.forEach(course => {
      xml += `
      <url>
        <loc>${baseUrl}/courses/${course.slug}</loc>
        <lastmod>${course.updatedAt.toISOString()}</lastmod>
        <priority>0.8</priority>
      </url>`;
    });

    // Loop through news
    news.forEach(item => {
      xml += `
      <url>
        <loc>${baseUrl}/current-affairs/${item.slug}</loc>
        <lastmod>${item.updatedAt.toISOString()}</lastmod>
        <priority>0.7</priority>
      </url>`;
    });

    xml += `
    </urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;