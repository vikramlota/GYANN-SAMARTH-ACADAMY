const request = require('supertest');
const { setupDB, teardownDB, clearDB } = require('./utils/test-setup');
const { app } = require('../src/app');

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await teardownDB());

async function createAdminAndGetToken() {
  await request(app).post('/api/admin/register').send({ username: 'admin4', password: 'pwd' });
  const res = await request(app).post('/api/admin/login').send({ username: 'admin4', password: 'pwd' });
  return res.body.token;
}

describe('Updates and Current Affairs routes', () => {
  test('Create, list and delete update (protected) and current affair (protected create, public list)', async () => {
    const token = await createAdminAndGetToken();

    const updatePayload = { title: 'New Job', description: 'Job posted', type: 'Job' };
    const createUpdate = await request(app)
      .post('/api/updates')
      .set('Authorization', `Bearer ${token}`)
      .send(updatePayload);
    expect(createUpdate.status).toBe(201);

    const getUpdates = await request(app).get('/api/updates');
    expect(getUpdates.status).toBe(200);
    expect(Array.isArray(getUpdates.body)).toBe(true);

    const id = createUpdate.body._id;
    const del = await request(app).delete(`/api/updates/${id}`).set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);

    // Current affairs create & get
    const newsPayload = { headline: 'Big Event', contentBody: 'Details', category: 'National' };
    const createNews = await request(app)
      .post('/api/updates/news/create')
      .set('Authorization', `Bearer ${token}`)
      .send(newsPayload);
    expect(createNews.status).toBe(201);

    const getNews = await request(app).get('/api/updates/news/all');
    expect(getNews.status).toBe(200);
    expect(Array.isArray(getNews.body)).toBe(true);
  });
});
