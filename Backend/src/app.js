const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// 1. Basic Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*", // Fallback to * for testing
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// 2. TEST ROUTE (This proves app.js loads)
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ 
        message: "App.js is healthy! The issue is likely in your User Routes.",
        success: true 
    });
});

// 3. COMMENT OUT YOUR ROUTES FOR NOW
// (We will turn these back on in the next step)
// const userRouter = require('./routes/user.routes.js');
// app.use("/api/v1/users", userRouter);


// 4. CRITICAL: Export correctly
module.exports = { app };