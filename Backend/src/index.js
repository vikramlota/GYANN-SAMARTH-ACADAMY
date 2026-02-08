const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { app } = require('./app.js');
 // Ensure this path is correct
const serverless = require('serverless-http');
/*
// 1. Start DB Connection in the Background (Fire and Forget)
// Do NOT wait for it with 'await' or '.then()' before exporting
const connectDB = require('./db/index.js');
console.log("--> Initializing Server...");
connectDB().catch(err => console.error("Background DB Connect Error:", err));

// 2. Add a simple root route to verify the server is running
app.get('/', (req, res) => {
    res.send("Server is Running! (Database might still be connecting)");
}); 

app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working! The issue is definitely the DB." });
});
*/
// 3. Export for Vercel IMMEDIATELY
// This ensures Vercel sees the app is ready instantly
app.get('/test-express', (req, res) => {
    res.json({ message: "Express is working! The issue is definitely the DB." });
});
if (process.env.VERCEL) {
    module.exports = serverless(app);
} else {
    // Local Development
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`⚙️  Server is running at port : ${PORT}`);
    });
} 
