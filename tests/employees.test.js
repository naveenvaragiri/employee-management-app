'use strict';

const request = require('supertest');
const { createApp } = require('../src/app');
const employeeModel = require('../src/models/employee');

const app = createApp();

const validEmployee = {
  name: 'Alice Johnson',
  phoneNumber: '+1-555-123-4567',
  emailId: 'alice.johnson@example.com',
  role: 'Software Engineer',
  hireDate: '2023-06-15',
  department: 'Engineering',
};

beforeEach(() => {
  employeeModel.clear();
});

describe('Health check', () => {
  it('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /api/employees', () => {
  it('creates an employee and returns 201 with the new record', async () => {
    const res = await request(app).post('/api/employees').send(validEmployee);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(validEmployee);
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/employees').send({ name: 'Bob' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('returns 400 when emailId is invalid', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...validEmployee, emailId: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('emailId must be a valid email address');
  });

  it('returns 400 when phoneNumber is invalid', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...validEmployee, phoneNumber: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('phoneNumber must be a valid phone number');
  });

  it('returns 400 when hireDate is not in YYYY-MM-DD format', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...validEmployee, hireDate: '15-06-2023' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('hireDate must be in YYYY-MM-DD format');
  });
});

describe('GET /api/employees', () => {
  it('returns an empty array when no employees exist', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all employees', async () => {
    await request(app).post('/api/employees').send(validEmployee);
    await request(app)
      .post('/api/employees')
      .send({ ...validEmployee, name: 'Bob Smith', emailId: 'bob@example.com' });

    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});

describe('GET /api/employees/:id', () => {
  it('returns a single employee by id', async () => {
    const created = await request(app).post('/api/employees').send(validEmployee);
    const { id } = created.body;

    const res = await request(app).get(`/api/employees/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.name).toBe(validEmployee.name);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/employees/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });
});

describe('PUT /api/employees/:id', () => {
  it('updates an employee and returns the updated record', async () => {
    const created = await request(app).post('/api/employees').send(validEmployee);
    const { id } = created.body;

    const updated = { ...validEmployee, role: 'Senior Software Engineer', department: 'Platform' };
    const res = await request(app).put(`/api/employees/${id}`).send(updated);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.role).toBe('Senior Software Engineer');
    expect(res.body.department).toBe('Platform');
  });

  it('returns 404 when updating a non-existent employee', async () => {
    const res = await request(app).put('/api/employees/non-existent-id').send(validEmployee);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });

  it('returns 400 when update payload is invalid', async () => {
    const created = await request(app).post('/api/employees').send(validEmployee);
    const { id } = created.body;

    const res = await request(app)
      .put(`/api/employees/${id}`)
      .send({ ...validEmployee, emailId: 'bad-email' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/employees/:id', () => {
  it('deletes an employee and returns 204', async () => {
    const created = await request(app).post('/api/employees').send(validEmployee);
    const { id } = created.body;

    const res = await request(app).delete(`/api/employees/${id}`);
    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/api/employees/${id}`);
    expect(getRes.status).toBe(404);
  });

  it('returns 404 when deleting a non-existent employee', async () => {
    const res = await request(app).delete('/api/employees/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });
});

describe('Unknown routes', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });
});
