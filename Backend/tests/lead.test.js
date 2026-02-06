const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./utils/test-setup');
const { app } = require('../src/app');

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await teardownDB());

async function createAdminAndGetToken() {
  await request(app).post('/api/admin/register').send({ username: 'admin2', password: 'pwd' });
  const res = await request(app).post('/api/admin/login').send({ username: 'admin2', password: 'pwd' });
  return res.body.token;
}

describe('Lead routes', () => {
  test('Submit lead (public) and get leads (protected)', async () => {
    const leadPayload = { fullName: 'John Doe', phone: '1234567890', email: 'john@example.com' };
    const submitRes = await request(app).post('/api/leads').send(leadPayload);
    expect(submitRes.status).toBe(201);

    const token = await createAdminAndGetToken();
    const getRes = await request(app).get('/api/leads').set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBe(1);
  });
});
