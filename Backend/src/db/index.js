const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js"); // Ensure this file uses module.exports too, or remove if unused

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB..."); 
        
        // Remove DB_NAME if you added it directly to the Connection String in Vercel
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME || 'test'}`);
        
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        process.exit(1);
    }
}

module.exports = connectDB; // <--- This fixes the "is not a function" error