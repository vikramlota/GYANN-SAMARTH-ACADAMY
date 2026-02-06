// Simple E2E server starter: start an in-memory MongoDB and then start the app
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

async function start() {
  // Set MongoDB URI for in-memory before dotenv loads
  const mongod = await MongoMemoryServer.create();
  let uri = mongod.getUri();
  
  // mongodb-memory-server returns something like: mongodb://localhost:12345/
  // we need to ensure database name is properly appended
  if (!uri.endsWith('/')) {
    uri += '/';
  }
  uri += 'samarthacademy';
  
  console.log('[E2E] Using in-memory MongoDB URI:', uri);
  
  // Must set BEFORE loading app, since app tries to connect immediately
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-secret';

  // Now require the app which connects to MongoDB
  require(path.join(__dirname, '..', 'src', 'index.js'));

  // Keep process alive
  process.on('SIGINT', async () => {
    await mongod.stop();
    process.exit(0);
  });
}

start().catch((err) => {
  console.error('Failed to start E2E server', err);
  process.exit(1);
});
