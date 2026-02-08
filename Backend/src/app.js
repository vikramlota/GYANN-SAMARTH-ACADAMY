const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express()

// trust proxy when running behind Vercel / proxies (for secure cookies)
app.set('trust proxy', 1)

// CORS handling: log origin and echo it back (permits any origin while allowing credentials)
// NOTE: For production tighten this to specific origins in Vercel env vars.
const rawOrigins = process.env.CORS_ORIGIN || '';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('Incoming Origin:', origin);
    // If allowedOrigins configured, allow only those
    if (allowedOrigins.length > 0) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            res.header('Access-Control-Allow-Origin', origin || '*');
        } else {
            // not allowed - still proceed so caller can see 403/404 as appropriate
            res.header('Access-Control-Allow-Origin', '');
        }
    } else {
        // echo origin (permissive) when no config provided
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
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