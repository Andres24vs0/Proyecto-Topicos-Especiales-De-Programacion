import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDB } from "../src/index.js";
import Weather from "../src/weather.js";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Weather Database Operations", () => {
    beforeAll(async () => {
        await connectDB();
        await Weather.deleteMany({});
    }, 10000);

    afterAll(async () => {
        await Weather.deleteMany({});
        await mongoose.connection.close();
    }, 10000);

    beforeEach(async () => {
        // Limpiar la base de datos antes de cada prueba
        await Weather.deleteMany({});
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe("POST /weather", () => {
        test("debería guardar un nuevo registro de clima", async () => {
            const climaData = {
                city: "Madrid",
                temperature: 25,
                humidity: 60,
                condition: "Soleado",
            };

            const response = await request(app)
                .post("/weather")
                .send(climaData)
                .expect(201);

            expect(response.body.message).toBe("Clima guardado exitosamente");
            expect(response.body.data.city).toBe("Madrid");
            expect(response.body.data.temperature).toBe(25);
            expect(response.body.data.humidity).toBe(60);
            expect(response.body.data.condition).toBe("Soleado");
            expect(response.body.data._id).toBeDefined();
            expect(response.body.data.date).toBeDefined();
        }, 10000);

        test("debería rechazar datos faltantes", async () => {
            const climaData = {
                city: "Madrid",
                temperature: 25,
                // Falta humidity y condition
            };

            const response = await request(app)
                .post("/weather")
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain(
                "Todos los campos son requeridos"
            );
        }, 10000);

        test("debería rechazar condición inválida", async () => {
            const climaData = {
                city: "Madrid",
                temperature: 25,
                humidity: 60,
                condition: "Ventoso", // Condición no válida
            };

            const response = await request(app)
                .post("/weather")
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain(
                "La condición debe ser una de"
            );
        }, 10000);

        test("debería rechazar temperatura fuera de rango", async () => {
            const climaData = {
                city: "Madrid",
                temperature: 100, // Temperatura muy alta
                humidity: 60,
                condition: "Soleado",
            };

            const response = await request(app)
                .post("/weather")
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain(
                "La temperatura debe estar entre -50°C y 60°C"
            );
        }, 10000);

        test("debería rechazar humedad fuera de rango", async () => {
            const climaData = {
                city: "Madrid",
                temperature: 25,
                humidity: 150, // Humedad muy alta
                condition: "Soleado",
            };

            const response = await request(app)
                .post("/weather")
                .send(climaData)
                .expect(400);

            expect(response.body.error).toContain(
                "La humedad debe estar entre 0% y 100%"
            );
        }, 10000);
    });

    describe("GET /weather/history/:city", () => {
        test("debería obtener todos los registros de una ciudad", async () => {
            // Seed DB with two Madrid records
            await Weather.create([
                {
                    city: "Madrid",
                    temperature: 20,
                    humidity: 50,
                    condition: "Soleado",
                },
                {
                    city: "Madrid",
                    temperature: 22,
                    humidity: 55,
                    condition: "Nublado",
                },
            ]);
            const response = await request(app)
                .get("/weather/history/Madrid")
                .expect(200);
            expect(response.body.city).toBe("Madrid");
            expect(response.body.total).toBe(2);
        }, 10000);

        test("debería devolver 404 para ciudad sin registros", async () => {
            const response = await request(app)
                .get("/weather/history/CiudadInexistente")
                .expect(404);

            expect(response.body.error).toContain(
                "No se encontraron registros climáticos"
            );
        }, 10000);

        test("debería devolver 404 sin especificar ciudad", async () => {
            const response = await request(app)
                .get("/weather/history/")
                .expect(404); // Express devuelve 404 para rutas no encontradas

            // Este test verifica que la ruta no existe sin parámetro
        }, 10000);
    });

    describe("DELETE /weather/:id", () => {
        test("debería eliminar el registro de clima por id:clima_numero", async () => {
            // Seed DB with a record
            const weather = await Weather.create({
                city: "TestCity",
                temperature: 20,
                humidity: 50,
                condition: "Soleado",
            });
            const response = await request(app)
                .delete(`/weather/${weather._id}`)
                .expect(200);
            expect(response.body.message).toContain(
                "Registro eliminado exitosamente"
            );
        });
    });
});
