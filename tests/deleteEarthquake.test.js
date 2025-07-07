const request = require('supertest');
const mongoose = require('mongoose');
const Earthquake = require('../Earthquake');
const app = require('../app');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const customId = 'sismo_3007';

beforeAll(async () => {
  await mongoose.connect(uri);
  const sismo = new Earthquake({
    _id: customId,
    magnitude: 6.1,
    depth: 18,
    location: 'TestCity3007',
    date: '2025-07-25'
  });

  await sismo.save();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('DELETE /earthquakes/:id con ID manual mayor a 3000', () => {
  it('🗑️ debería eliminar el sismo con ID personalizado', async () => {
    const res = await request(app).delete(`/earthquakes/${customId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });

  it('🔍 debería confirmar que el sismo ya no existe', async () => {
    const res = await request(app).get('/earthquakes?city=TestCity3007');

    if (res.statusCode === 404) {
      expect(Object.keys(res.body).length).toBeGreaterThanOrEqual(0);
    } else if (res.statusCode === 200) {
      expect(Array.isArray(res.body.data)).toBe(true);
      const eliminado = res.body.data.find(eq => eq._id === customId);
      expect(eliminado).toBeUndefined();
    } else {
      throw new Error(`Respuesta inesperada: status ${res.statusCode}`);
    }
  });
});
