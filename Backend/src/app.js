const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require('./db/index.js');

const app = express()

// Initialize DB connection on first request to any route (don't block startup)
let dbInitialized = false;

app.use(async (req, res, next) => {
  try {
    // Only try to connect once per serverless function lifecycle
    if (!dbInitialized) {
      dbInitialized = true;
      await connectDB();
    }
    next();
  } catch (error) {
    // Connection failed but continue anyway - health checks should still work
    console.error("DB connection middleware error:", error);
    next();
  }
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || "https://samarthacadam.vercel.app", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Server is running!" 
    });
});

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Timeout protection - prevent Vercel timeout (max 30s)
app.use((req, res, next) => {
  res.setTimeout(25000, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

// Routes
app.use('/api/admin', require('./routes/Admin.routes.js'));
app.use('/api/courses', require('./routes/course.routes.js'));
app.use('/api/results', require('./routes/result.routes.js'));
app.use('/api/notifications', require('./routes/update.routes.js'));
app.use('/api/leads', require('./routes/lead.routes.js'));
app.use('/api/current-affairs', require('./routes/currentaffairs.routes.js'));

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

module.exports = {app};