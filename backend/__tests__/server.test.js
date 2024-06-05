const request = require('supertest');
const app = require('../server'); 

// Test für GET /api
describe('GET /api', () => {
  it('should respond with a message', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Hello from the backend');
  });
});