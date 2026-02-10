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
const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDatabase();
  const server = serverless(app);
  return server(event, context);
};

module.exports = handler;
module.exports.handler = handler;  
