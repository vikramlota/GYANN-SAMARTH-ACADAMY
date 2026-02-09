require('dotenv').config({ path: './.env' });
const { app } = require('./app.js'); // Matches "module.exports = { app }"
const connectDB = require('./db/index.js');
const serverless = require('serverless-http');

// 1. Connect to DB (Background)
connectDB();

// 2. Export Handler
if (process.env.VERCEL) {
    module.exports = serverless(app);
} else {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT}`);
    });
}