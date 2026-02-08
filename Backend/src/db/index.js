import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // Ensure you have this or remove DB_NAME usage

const connectDB = async () => {
    try {
        // 1. LOG THE URI TO DEBUG (Hide password for safety if viewing logs publicly)
        // This helps you see if Vercel is actually reading the variable
        console.log("Attempting to connect to MongoDB..."); 

        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME || 'test'}`);
        
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        process.exit(1);
    }
}

export default connectDB;