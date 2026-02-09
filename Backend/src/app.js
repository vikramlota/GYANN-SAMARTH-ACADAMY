const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require('./db/index.js');

const app = express()


app.use(async (req, res, next) => {
    try {
        await connectDB(); // Wait for DB here, only when a user asks for something
        next();
    } catch (error) {
        res.status(500).json({ error: "Database Connection Failed" });
    }
});

// --- 2. CORS MIDDLEWARE (MUST BE FIRST) ---
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", 
  credentials: true,
  //methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  //allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Server is running perfectly! (DB is OFF for testing)" 
    });
});

// --- 3. MANUALLY HANDLE PREFLIGHT REQUESTS ---
// This acts as a safety net if the middleware fails
/* app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'https://samarthacadam.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});
 */

app.use(express.json())
//app.use(express.urlencoded({extended: true,limit: "16kb"}))

//app.use(express.static("public"))
app.use(cookieParser())
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ message: "Server is connected and healthy!" });
});
// routes import 
/* 
app.use('/api/admin', require('./routes/Admin.routes.js'));
app.use('/api/courses', require('./routes/course.routes.js'));
app.use('/api/results', require('./routes/result.routes.js'));
app.use('/api/notifications', require('./routes/update.routes.js'));
app.use('/api/leads', require('./routes/lead.routes.js'));
app.use('/api/current-affairs', require('./routes/currentaffairs.routes.js'));
 */
module.exports = {app};