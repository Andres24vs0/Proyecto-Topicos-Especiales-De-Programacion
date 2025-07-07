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

describe('GET /earthquakes?city=Caracas', () => {
  it('🔍 debe devolver al menos un sismo con location = Caracas', async () => {
    const res = await request(app).get('/earthquakes?city=Caracas');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);

    const contieneCaracas = res.body.data.some(
      eq => eq.location.toLowerCase() === 'caracas'
    );

    expect(contieneCaracas).toBe(true);
  });
});
