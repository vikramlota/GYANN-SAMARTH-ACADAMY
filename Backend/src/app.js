const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require('./db/index.js');
const demoRoutes = require('./routes/demo.routes.js');
const app = express()
const sitemapRoutes = require('./routes/sitemap.routes.js');
// Connect to database on startup
connectDB().catch((error) => {
  console.error("Failed to connect to database:", error);
  // For serverless, continue anyway - health checks should work
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", 
  credentials: true,
}));



app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
app.use('/', sitemapRoutes);
app.use('/api/admin', require('./routes/Admin.routes.js'));
app.use('/api/courses', require('./routes/course.routes.js'));
app.use('/api/results', require('./routes/result.routes.js'));
app.use('/api/notifications', require('./routes/update.routes.js'));
app.use('/api/leads', require('./routes/lead.routes.js'));
app.use('/api/current-affairs', require('./routes/currentaffairs.routes.js'));
app.use("/api/demo-requests", demoRoutes);
// Global error handler - catches any unhandled errors
app.use((err, req, res, next) => {
  console.error('🔴 ERROR:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = { app };