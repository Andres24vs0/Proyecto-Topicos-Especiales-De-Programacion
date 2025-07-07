const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

beforeAll(async () => {
});

afterAll(async () => {
  await mongoose.disconnect();
}, 30000);

describe('POST /earthquakes', () => {
  jest.setTimeout(30000); 

  it('✅ debería guardar un terremoto válido', async () => {
    const res = await request(app)
      .post('/earthquakes')
      .send({
        magnitude: 5.8,
        depth: 12,
        location: 'Los Andes',
        date: '2025-07-15'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    console.log('🌍 Sismo creado con ID:', res.body.id);
  });
});
