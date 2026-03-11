/**
 * Tests for the upload endpoint.
 */
import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';

const API_KEY = 'dev-api-key-change-me';

describe('POST /api/v1/upload', () => {
  it('should accept a valid CSV upload', async () => {
    const csv = 'product,region,revenue\nWidget A,North,1500\nWidget B,South,2300\n';

    const res = await request(app)
      .post('/api/v1/upload')
      .set('X-API-Key', API_KEY)
      .field('email', 'test@example.com')
      .attach('file', Buffer.from(csv), 'sales.csv');

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('jobId');
    expect(res.body.status).toBe('pending');
  });

  it('should reject unsupported file types', async () => {
    const res = await request(app)
      .post('/api/v1/upload')
      .set('X-API-Key', API_KEY)
      .field('email', 'test@example.com')
      .attach('file', Buffer.from('{}'), 'data.json');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Unsupported file type/);
  });

  it('should reject requests without API key', async () => {
    const csv = 'a,b\n1,2\n';

    const res = await request(app)
      .post('/api/v1/upload')
      .field('email', 'test@example.com')
      .attach('file', Buffer.from(csv), 'sales.csv');

    expect(res.status).toBe(401);
  });

  it('should reject invalid email', async () => {
    const csv = 'a,b\n1,2\n';

    const res = await request(app)
      .post('/api/v1/upload')
      .set('X-API-Key', API_KEY)
      .field('email', 'not-an-email')
      .attach('file', Buffer.from(csv), 'sales.csv');

    expect(res.status).toBe(422);
  });
});
