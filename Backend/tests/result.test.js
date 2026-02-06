const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./utils/test-setup');
const { app } = require('../src/app');

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await teardownDB());

async function createAdminAndGetToken() {
  await request(app).post('/api/admin/register').send({ username: 'admin3', password: 'pwd' });
  const res = await request(app).post('/api/admin/login').send({ username: 'admin3', password: 'pwd' });
  return res.body.token;
}

describe('Results routes', () => {
  test('Add, get and delete result (protected)', async () => {
    const token = await createAdminAndGetToken();

    const payload = {
      studentName: 'Alice',
      examName: 'SBI PO',
      rank: 'Selected',
      category: 'Banking',
      year: 2024
    };

    const addRes = await request(app).post('/api/results').set('Authorization', `Bearer ${token}`).send(payload);
    expect(addRes.status).toBe(201);
    expect(addRes.body.studentName).toBe('Alice');

    const getRes = await request(app).get('/api/results');
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);

    const id = addRes.body._id;
    const delRes = await request(app).delete(`/api/results/${id}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);
  });
});
