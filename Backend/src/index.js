
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const connectDB = require('./db/index.js');
const { app } = require('./app.js');

const serverless = require('serverless-http');


// Connect once (reused across lambda invocations where possible)
connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    
    // Only try to seed if we have the function and variables
    try {
        const seedAdmin = require('./utils/AdminSeeder.js');
        if(process.env.ADMIN_EMAIL) {
            seedAdmin();
        }
    } catch (e) {
        console.error("Seeding failed but server is running:", e.message);
    }
  })
  .catch((err) => {
    // LOG THE ERROR SO YOU CAN SEE IT IN VERCEL LOGS
    console.error("!!! MONGO DB CRITICAL ERROR !!!", err);
  });
// If running on Vercel (serverless) export the handler, otherwise start a listener
if (process.env.VERCEL) {
    module.exports = serverless(app);
} else {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
    });
}
