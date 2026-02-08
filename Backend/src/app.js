const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

}))

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