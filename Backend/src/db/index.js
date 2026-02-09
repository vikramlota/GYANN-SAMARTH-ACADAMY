const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

// 1. Create a Global Cache
// This saves the connection so it survives between "hot" requests
let isConnected = false;
let connectionPromise = null; // Don't retry multiple times simultaneously

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    // 2. CHECK IF ALREADY CONNECTED
    if (isConnected) {
        console.log('=> Using existing database connection');
        return;
    }
    
    // If connection is in progress, wait for it instead of making another
    if (connectionPromise) {
        return connectionPromise;
    }

    // Also check Mongoose's internal state
    if (mongoose.connections.length > 0) {
        const state = mongoose.connections[0].readyState;
        if (state === 1) {
            isConnected = true;
            console.log('=> Using existing database connection');
            return;
        }
    }

    try {
        connectionPromise = (async () => {
            // 3. CLEAN & CONNECT
            let uri = process.env.MONGODB_URI || "";
            uri = uri.replace(/^["']|["']$/g, '').trim(); // Remove quotes/spaces

            if (!uri) {
                console.warn("⚠️ MONGODB_URI is not set - running without DB");
                return; // Don't throw, just continue without DB
            }

            const dbName = DB_NAME || 'test';
            // Ensure URI doesn't end with slash before appending DB name
            const connectionString = uri.endsWith('/') ? `${uri}${dbName}` : `${uri}/${dbName}`;

            const db = await mongoose.connect(connectionString, {
                // These options optimize for serverless
                bufferCommands: false,
                serverSelectionTimeoutMS: 3000, // Quick timeout
                socketTimeoutMS: 30000,
                maxPoolSize: 5,
                minPoolSize: 1,
                family: 4,
                retryWrites: true,
            });

            isConnected = db.connections[0].readyState;
            console.log(`✅ MongoDB Connected: ${db.connection.host}`);

        })();

        await connectionPromise;
        connectionPromise = null;

    } catch (error) {
        console.error("⚠️ MongoDB Connection Issue:", error.message);
        connectionPromise = null;
        isConnected = false;
        // Don't throw - allow app to run without DB for health checks
    }
}

module.exports = connectDB;