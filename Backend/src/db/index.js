const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not set - running without database');
}

let isConnected = false;
let connectionPromise = null;

async function connectDB() {
  // Check if we have a connection already to avoid re-connecting
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  if (!MONGODB_URI) {
    console.warn('⚠️ Skipping MongoDB connection - URI not set');
    return;
  }

  try {
    connectionPromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 1,
      family: 4,
      retryWrites: true,
    });

    await connectionPromise;
    isConnected = true;
    console.log("✅ MongoDB Connected Successfully");
    connectionPromise = null;

  } catch (error) {
    console.error("⚠️ MongoDB Connection Error:", error.message);
    connectionPromise = null;
    isConnected = false;
  }
}

module.exports = connectDB;
module.exports.default = connectDB;