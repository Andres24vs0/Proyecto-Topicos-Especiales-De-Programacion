import request from "supertest";
import { app, connectDB } from "../src/index.js";
import { Weather } from "../src/weather.js";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.connection.close();
});

describe("Prueba de la ruta GET /weather/:source?city=[nombre_ciudad]", () => {
    it("debería responder 404 cuando la fuente no es valida", async () => {
        const res = await request(app).get(
            "/weather/fuenteInvalida?city=CiudadInexistente"
        );
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
            "error",
            "La fuente de datos 'fuenteInvalida' no es válida. Las fuentes válidas son: OpenWeatherMap, WeatherApi o no colocar fuente y acceder a la Base de Datos propia."
        );
    });
    it("debería responder 400 cuando no indican ciudad", async () => {
        const res = await request(app).get("/weather/openweathermap");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "error",
            "Debe indicar el parámetro 'city' en la consulta."
        );
    });
    it("debería responder 404 cuando pone una ciudad inexistente y se comunica con openweathermap", async () => {
        const res = await request(app).get(
            "/weather/openweathermap?city=CiudadInexistente"
        );
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "error",
            "La ciudad no fue encontrada en OpenWeatherMap"
        );
    });
    it("debería responder 200 y dar resultado cuando colocas una ciudad y se comunica con openweathermap", async () => {
        const res = await request(app).get(
            "/weather/openweathermap?city=Caracas"
        );
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("city", "Caracas");
        expect(res.body).toHaveProperty("temperature");
        expect(res.body).toHaveProperty("humidity");
        expect(res.body).toHaveProperty("condition");
    });
    it("debería responder 200 y dar resultado cuando colocas una ciudad y se comunica con openweathermap sin importar mayusculas", async () => {
        const res = await request(app).get(
            "/weather/OpenWeatherMap?city=Caracas"
        );
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("city", "Caracas");
        expect(res.body).toHaveProperty("temperature");
        expect(res.body).toHaveProperty("humidity");
        expect(res.body).toHaveProperty("condition");
    });
    it("debería responder 200 y dar resultado cuando colocas una ciudad y se comunica con weatherapi", async () => {
        const res = await request(app).get("/weather/weatherapi?city=Caracas");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("city", "Caracas");
        expect(res.body).toHaveProperty("temperature");
        expect(res.body).toHaveProperty("humidity");
        expect(res.body).toHaveProperty("condition");
    });
    it("debería responder 404 cuando pone una ciudad inexistente y se comunica con weatherapi", async () => {
        const res = await request(app).get(
            "/weather/weatherapi?city=CiudadInexistente"
        );
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "error",
            "La ciudad no fue encontrada en WeatherAPI"
        );
    });
    it("debería responder 200 y dar resultado cuando colocas una ciudad y se comunica con weatherapi sin importar mayusculas", async () => {
        const res = await request(app).get("/weather/WeatherAPI?city=Caracas");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("city", "Caracas");
        expect(res.body).toHaveProperty("temperature");
        expect(res.body).toHaveProperty("humidity");
        expect(res.body).toHaveProperty("condition");
    });
    it("debería responder 200 y dar resultado cuando colocas una ciudad y se comunica con la BD", async () => {
        await Weather.create({
            city: "Caracas",
            temperature: 25,
            humidity: 60,
            condition: "Soleado",
        });
        const res = await request(app).get("/weather/WeatherAPI?city=Caracas");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("city", "Caracas");
        expect(res.body).toHaveProperty("temperature");
        expect(res.body).toHaveProperty("humidity");
        expect(res.body).toHaveProperty("condition");
    });
    it("debería responder con mensaje cuando no hay registros climáticos en la BD", async () => {
        // Borra todos los registros de la colección antes de la prueba
        await Weather.deleteMany({});

        const res = await request(app).get("/weather?city=Caracas");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "No hay registros climáticos");
    });
});
