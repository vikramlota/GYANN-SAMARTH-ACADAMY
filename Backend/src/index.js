require('dotenv').config({ path: './.env' });
const { app } = require('./app.js');
const serverless = require('serverless-http');

// 1. EXPORT HANDLER (For Vercel)
// Vercel looks for this export to handle the request.
module.exports = serverless(app);


// 2. LOCAL DEV SERVER (For your computer only)
// This checks: "Is this file being run directly by Node?"
// If yes -> Start listening.
// If no (Vercel imports it) -> Do NOT listen.
if (require.main === module) {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`⚙️  Server is running at port : ${PORT}`);
    });
}