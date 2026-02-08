const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        // --- DEBUGGING BLOCK ---
        if (!uri) {
            console.error("❌ FATAL: MONGO_URI is missing in Vercel Env Vars");
            process.exit(1);
        }

        // 1. Force convert to string and trim whitespace
        uri = String(uri).trim();

        // 2. Remove wrapping quotes if they exist (Common Vercel mistake)
        if (uri.startsWith('"') || uri.startsWith("'")) {
            uri = uri.slice(1, -1);
        }

        console.log(`🔍 Debug: URI starts with '${uri.substring(0, 5)}...'`);
        console.log(`🔍 Debug: URI ends with '...${uri.substring(uri.length - 5)}'`);

        // 3. Construct Final Connection String
        // Remove trailing slash from URI if present to avoid double slash
        const cleanUri = uri.endsWith('/') ? uri.slice(0, -1) : uri;
        const dbName = DB_NAME || 'test';
        
        const finalConnectionString = `${cleanUri}/${dbName}`;

        console.log(`🚀 Connecting to database: ${dbName}...`);

        const connectionInstance = await mongoose.connect(finalConnectionString);
        
        console.log(`\n✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MONGODB connection FAILED: ", error);
        // Do not exit process in serverless, just throw error so Vercel logs it
        throw error;
    }
}

module.exports = connectDB;