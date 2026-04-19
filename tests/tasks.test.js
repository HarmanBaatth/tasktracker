const request = require('supertest');
const app = require('../app');  // <-- use app.js

let token;

describe('Task Manager API', () => {
  beforeAll(async () => {
    // Register user
    await request(app)
      .post('/auth/register')
      .send({ email: "student@example.com", password: "mypassword" });

    // Login user
    const res = await request(app)
      .post('/auth/login')
      .send({ email: "student@example.com", password: "mypassword" });

    token = res.body.token;
  });

  it('should add a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing add task",
        dueDate: "2026-04-20",
        priority: "High"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task added");
  });

  it('should view tasks with state', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("state");
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put('/tasks/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task updated");
  });

  it('should get metrics', async () => {
    const res = await request(app)
      .get('/tasks/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("pending");
    expect(res.body).toHaveProperty("completed");
    expect(res.body).toHaveProperty("overdue");
    expect(res.body).toHaveProperty("resubmission");
  });
});
