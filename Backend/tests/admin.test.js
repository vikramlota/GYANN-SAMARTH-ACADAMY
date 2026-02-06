const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./utils/test-setup');
const { app } = require('../src/app');

beforeAll(async () => {
  await setupDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await teardownDB();
});

describe('Admin routes', () => {
  test('should register and login admin', async () => {
    const registerRes = await request(app)
      .post('/api/admin/register')
      .send({ username: 'testadmin', password: 'password123' });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('token');

    const loginRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'testadmin', password: 'password123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});
