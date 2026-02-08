const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express()

// trust proxy when running behind Vercel / proxies (for secure cookies)
app.set('trust proxy', 1)

// allow single origin or comma-separated list in CORS_ORIGIN
const rawOrigins = process.env.CORS_ORIGIN || '';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);
app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like curl, server-to-server)
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            } else {
                return callback(new Error('CORS policy does not allow this origin'), false);
            }
        },
        credentials: true,
    })
)

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