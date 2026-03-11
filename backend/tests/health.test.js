/**
 * Tests for the email service (build function only — no real sends).
 */
import request from 'supertest';
import app from '../src/app.js';

describe('GET /health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBe('1.0.0');
  });
});

describe('GET /api/v1/health', () => {
  it('should return provider configuration', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.services).toHaveProperty('llmProvider');
    expect(res.body.services).toHaveProperty('emailProvider');
  });
});
