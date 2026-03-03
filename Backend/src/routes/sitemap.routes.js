const express = require('express');
const router = express.Router();

// Import your models
const Course = require('../models/Course.model.js');
const CurrentAffair = require('../models/CurrentAffair.model.js');
const Notification = require('../models/Notification.model.js');

// Route: GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const courses = await Course.find().select('slug updatedAt');
    const news = await CurrentAffair.find().select('slug updatedAt');
    const notifications = await Notification.find().select('slug updatedAt');

    const baseUrl = 'https://thesamarthacademy.in';

    // 1. Build the header with NO empty spaces before <?xml
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 2. Static URLs
    xml += `  <url><loc>${baseUrl}</loc><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/courses</loc><priority>0.8</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/current-affairs</loc><priority>0.8</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/notifications</loc><priority>0.8</priority></url>\n`;

    // Helper function to safely format dates
    const safeDate = (date) => {
      return date ? date.toISOString() : new Date().toISOString();
    };

    // 3. Loop through courses
    courses.forEach(course => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/courses/${course.slug}</loc>\n`;
      xml += `    <lastmod>${safeDate(course.updatedAt)}</lastmod>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // 4. Loop through current affairs
    news.forEach(item => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/current-affairs/${item.slug}</loc>\n`;
      xml += `    <lastmod>${safeDate(item.updatedAt)}</lastmod>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // 5. Loop through notifications
    notifications.forEach(notification => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/notifications/${notification.slug}</loc>\n`;
      xml += `    <lastmod>${safeDate(notification.updatedAt)}</lastmod>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';

    // Send the correct content type
    res.set('Content-Type', 'text/xml');
    res.send(xml);
    
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;