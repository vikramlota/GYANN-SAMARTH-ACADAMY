const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./utils/test-setup');
const { app } = require('../src/app');

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await teardownDB());

async function createAdminAndGetToken() {
  await request(app).post('/api/admin/register').send({ username: 'admin1', password: 'pwd' });
  const res = await request(app).post('/api/admin/login').send({ username: 'admin1', password: 'pwd' });
  return res.body.token;
}

describe('Course routes', () => {
  test('GET /api/courses should return array', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Create and delete course (protected)', async () => {
    const token = await createAdminAndGetToken();

    const coursePayload = {
      title: 'Test Course',
      slug: 'test-course',
      description: 'A test course',
      category: 'Other'
    };

    const createRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send(coursePayload);

    expect(createRes.status).toBe(201);
    expect(createRes.body.title).toBe('Test Course');

    const id = createRes.body._id;

    const delRes = await request(app)
      .delete(`/api/courses/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.status).toBe(200);
  });
});
