const dotenv = require("dotenv");
const serverless = require("serverless-http");
const connectDB = require("./db/index.js");
const { app } = require("./app.js");

dotenv.config({ path: "./.env" });

// Ensure DB connects once
let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("MongoDB Connected");
  }
};

// Serverless handler
module.exports.handler = async (event, context) => {
  await connectDatabase();
  const server = serverless(app);
  return server(event, context);
};  
