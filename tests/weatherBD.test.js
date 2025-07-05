import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from '../src/weatherBD.routes.js';
import { Weather } from '../src/weather.js';

// Configurar la aplicación para pruebas
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/weather', weatherRoutes);

describe('Weather Database Operations', () => {
    beforeAll(async () => {
        // Conectar a MongoDB para pruebas
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-app-test';
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB para pruebas');
    }, 10000);

    afterAll(async () => {
        // Limpiar y desconectar
        await Weather.deleteMany({});
        await mongoose.connection.close();
        console.log('✅ Desconectado de MongoDB');
    }, 10000);

    beforeEach(async () => {
        // Limpiar la base de datos antes de cada prueba
        await Weather.deleteMany({});
    });

    describe('POST /weather/db', () => {
        test('debería guardar un nuevo registro de clima', async () => {
            const climaData = {
                city: 'Madrid',
                temperature: 25,
                humidity: 60,
                condition: 'Soleado'
            };

            const response = await request(app)
                .post('/weather/db')
                .send(climaData)
                .expect(201);

            expect(response.body.message).toBe('Clima guardado exitosamente');
            expect(response.body.data.city).toBe('Madrid');
            expect(response.body.data.temperature).toBe(25);
            expect(response.body.data.humidity).toBe(60);
            expect(response.body.data.condition).toBe('Soleado');
            expect(response.body.data._id).toBeDefined();
            expect(response.body.data.date).toBeDefined();
        }, 10000);

        test('debería rechazar datos faltantes', async () => {
            const climaData = {
                city: 'Madrid',
                temperature: 25
                // Falta humidity y condition
            };

            const response = await request(app)
                .post('/weather/db')
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain('Todos los campos son requeridos');
        }, 10000);

        test('debería rechazar condición inválida', async () => {
            const climaData = {
                city: 'Madrid',
                temperature: 25,
                humidity: 60,
                condition: 'Ventoso' // Condición no válida
            };

            const response = await request(app)
                .post('/weather/db')
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain('La condición debe ser una de');
        }, 10000);

        test('debería rechazar temperatura fuera de rango', async () => {
            const climaData = {
                city: 'Madrid',
                temperature: 100, // Temperatura muy alta
                humidity: 60,
                condition: 'Soleado'
            };

            const response = await request(app)
                .post('/weather/db')
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain('La temperatura debe estar entre -50°C y 60°C');
        }, 10000);

        test('debería rechazar humedad fuera de rango', async () => {
            const climaData = {
                city: 'Madrid',
                temperature: 25,
                humidity: 150, // Humedad muy alta
                condition: 'Soleado'
            };

            const response = await request(app)
                .post('/weather/db')
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain('La humedad debe estar entre 0% y 100%');
        }, 10000);
    });

    describe('GET /weather/db/:city', () => {
        test('debería obtener todos los registros de una ciudad', async () => {
            // Crear múltiples registros para Madrid
            const registros = [
                { city: 'Madrid', temperature: 25, humidity: 60, condition: 'Soleado' },
                { city: 'Madrid', temperature: 20, humidity: 70, condition: 'Nublado' },
                { city: 'Barcelona', temperature: 28, humidity: 55, condition: 'Soleado' }
            ];

            for (const registro of registros) {
                await new Weather(registro).save();
            }

            const response = await request(app)
                .get('/weather/db/Madrid')
                .expect(200);

            expect(response.body.city).toBe('Madrid');
            expect(response.body.total).toBe(2);
            expect(response.body.records).toHaveLength(2);
            expect(response.body.records[0].city).toBe('Madrid');
            expect(response.body.records[1].city).toBe('Madrid');
        }, 10000);

        test('debería devolver 404 para ciudad sin registros', async () => {
            const response = await request(app)
                .get('/weather/db/CiudadInexistente')
                .expect(404);

            expect(response.body.error).toContain('No se encontraron registros climáticos');
        }, 10000);

        test('debería devolver 404 sin especificar ciudad', async () => {
            const response = await request(app)
                .get('/weather/db/')
                .expect(404); // Express devuelve 404 para rutas no encontradas

            // Este test verifica que la ruta no existe sin parámetro
        }, 10000);
    });

    describe('DELETE /weather/db/:city', () => {
        test('debería eliminar todos los registros de una ciudad', async () => {
            // Crear registros para múltiples ciudades
            const registros = [
                { city: 'Madrid', temperature: 25, humidity: 60, condition: 'Soleado' },
                { city: 'Madrid', temperature: 20, humidity: 70, condition: 'Nublado' },
                { city: 'Barcelona', temperature: 28, humidity: 55, condition: 'Soleado' }
            ];

            for (const registro of registros) {
                await new Weather(registro).save();
            }

            const response = await request(app)
                .delete('/weather/db/Madrid')
                .expect(200);

            expect(response.body.message).toContain('Registros climáticos de Madrid eliminados exitosamente');
            expect(response.body.deletedCount).toBe(2);

            // Verificar que solo quedan los registros de Barcelona
            const registrosRestantes = await Weather.find({});
            expect(registrosRestantes).toHaveLength(1);
            expect(registrosRestantes[0].city).toBe('Barcelona');
        }, 10000);

        test('debería devolver 404 para ciudad sin registros', async () => {
            const response = await request(app)
                .delete('/weather/db/CiudadInexistente')
                .expect(404);

            expect(response.body.error).toContain('No se encontraron registros climáticos para eliminar');
        }, 10000);

        test('debería devolver 404 sin especificar ciudad', async () => {
            const response = await request(app)
                .delete('/weather/db/')
                .expect(404); // Express devuelve 404 para rutas no encontradas

            // Este test verifica que la ruta no existe sin parámetro
        }, 10000);
    });
}); 