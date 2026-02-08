const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

// 1. Create a Global Cache
// This saves the connection so it survives between "hot" requests
let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    // 2. CHECK IF ALREADY CONNECTED
    if (isConnected) {
        console.log('=> Using existing database connection');
        return;
    }
    
    // Also check Mongoose's internal state
    if (mongoose.connections.length > 0) {
        isConnected = mongoose.connections[0].readyState;
        if (isConnected === 1) {
            console.log('=> Using existing database connection');
            return;
        }
    }

    try {
        // 3. CLEAN & CONNECT
        let uri = process.env.MONGODB_URI || "";
        uri = uri.replace(/^["']|["']$/g, '').trim(); // Remove quotes/spaces

        if (!uri) {
            throw new Error("MONGODB_URI is missing");
        }

        const dbName = DB_NAME || 'test';
        // Ensure URI doesn't end with slash before appending DB name
        const connectionString = uri.endsWith('/') ? `${uri}${dbName}` : `${uri}/${dbName}`;

        const db = await mongoose.connect(connectionString, {
            // These options optimize for serverless
            bufferCommands: false, // Don't queue queries if disconnected
            serverSelectionTimeoutMS: 5000, // Fail fast if DB is down
            socketTimeoutMS: 45000, // Close idle sockets
        });

        isConnected = db.connections[0].readyState;
        console.log(`\n✅ New MongoDB Connection Established !! HOST: ${db.connection.host}`);

    } catch (error) {
        console.error("❌ MONGODB connection FAILED: ", error);
        // Don't exit process in serverless, just throw so Vercel logs it
        throw error;
    }
}

module.exports = connectDB;