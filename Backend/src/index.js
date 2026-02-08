
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const connectDB = require('./db/index.js');
const { app } = require('./app.js');
const serverless = require('serverless-http');

// Connect once (reused across lambda invocations where possible)
connectDB().catch((err) => {
    console.log('MONGO DB connection failed !!!', err);
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
