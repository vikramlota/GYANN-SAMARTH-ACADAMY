const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

const connectDB = async () => {
    try {
        // 1. Get the URI
        let uri = process.env.MONGO_URI;

        // 2. Safety Check: Is it undefined?
        if (!uri) {
            console.error("❌ ERROR: MONGO_URI is undefined in environment variables!");
            process.exit(1);
        }

        // 3. CLEAN THE STRING (The Fix)
        // This removes quotes (" or ') and whitespace from both ends
        uri = uri.replace(/^["']|["']$/g, '').trim();

        console.log(`Attempting to connect... (URI starts with: ${uri.substring(0, 10)}...)`);

        // 4. Construct Connection String
        // We ensure we don't double-slash if the URI already ends with /
        const connectionString = uri.endsWith('/') 
            ? `${uri}${DB_NAME || 'test'}` 
            : `${uri}/${DB_NAME || 'test'}`;

        const connectionInstance = await mongoose.connect(connectionString);
        
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        process.exit(1);
    }
}

module.exports = connectDB;