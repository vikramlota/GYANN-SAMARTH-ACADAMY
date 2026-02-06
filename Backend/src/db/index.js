const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js"); 

const connectDB = async () => {
    try {
        // MONGODB_URI already includes the database name (e.g., mongodb://localhost:27017/samarthacademy)
        // So we don't append DB_NAME again
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\nMongoDB connecter!! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1)
    }
}

module.exports = connectDB;