const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

const setupDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri; // for compatibility if code uses this
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  await mongoose.connect(uri);
};

const teardownDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = { setupDB, teardownDB, clearDB };
