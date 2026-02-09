require('dotenv').config({ path: './.env' });
const { app } = require('./app.js'); // <--- Re-enable App
const serverless = require('serverless-http');

/* KEEP DATABASE OFF FOR NOW 
   We want to see if the Express App itself works.
*/
// const connectDB = require('./db/index.js');
// connectDB()
//  .then(() => console.log("DB Connected"))
//  .catch(err => console.log("DB Error", err));

// Add a test route to bypass your other routes
app.get('/test-express', (req, res) => {
    res.json({ message: "Express is working! The issue is definitely the DB." });
});

if (process.env.VERCEL) {
    module.exports = serverless(app);
} else {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT}`);
    });
}