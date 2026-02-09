require('dotenv').config({ path: './.env' });
const { app } = require('./app.js');
const serverless = require('serverless-http');

// Export handler for Vercel serverless
module.exports = serverless(app);

// Local development server
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`⚙️  Server is running at port : ${PORT}`);
    });
}