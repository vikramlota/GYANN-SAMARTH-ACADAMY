require('dotenv').config({ path: './.env' });
const { app } = require('./app.js');

// For Hostinger traditional hosting - just listen on port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`⚙️  Server is running at port : ${PORT}`);
});