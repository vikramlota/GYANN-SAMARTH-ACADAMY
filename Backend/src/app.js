const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express()

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  
];

app.use(async (req, res, next) => {
    try {
        await connectDB(); // Wait for DB here, only when a user asks for something
        next();
    } catch (error) {
        res.status(500).json({ error: "Database Connection Failed" });
    }
});

// Add this BEFORE your other app.use() routes
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ message: "Server is connected and healthy!" });
});
// --- 2. CORS MIDDLEWARE (MUST BE FIRST) ---
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));


// --- 3. MANUALLY HANDLE PREFLIGHT REQUESTS ---
// This acts as a safety net if the middleware fails
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'https://samarthacadam.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}))

app.use(express.static("public"))
app.use(cookieParser())

// routes import 

app.use('/api/admin', require('./routes/Admin.routes.js'));
app.use('/api/courses', require('./routes/course.routes.js'));
app.use('/api/results', require('./routes/result.routes.js'));
app.use('/api/notifications', require('./routes/update.routes.js'));
app.use('/api/leads', require('./routes/lead.routes.js'));
app.use('/api/current-affairs', require('./routes/currentaffairs.routes.js'));

module.exports = {app};