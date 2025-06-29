import request from "supertest";
import { app, connectDB } from "../src/index.js";
import { Earthquakes } from "../src/earthquakes.js";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.connection.close();
});

describe("Prueba de la ruta GET /earthquakes/:source?country=[pais]", () => {
    it("debería responder 404 cuando la fuente no es valida", async () => {
        const res = await request(app).get(
            "/earthquakes/fuenteInvalida?country=paisInexistente"
        );
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
            "error",
            "La fuente de datos 'fuenteInvalida' no es válida. Las fuentes válidas son: USGS, EMSC o Local."
        );
    });
    it("debería responder 400 cuando no indican pais", async () => {
        const res = await request(app).get("/earthquakes/USGS");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "error",
            "Debe indicar el parámetro 'country' en la consulta."
        );
    });
    it("debería responder 404 cuando pone un pais inexistente y se comunica con USGS", async () => {
        const res = await request(app).get(
            "/earthquakes/USGS?country=paisInexistente"
        );
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "error",
            "Las coordenadas del pais no fueron encontradas"
        );
    });
    it("debería responder 200 y dar resultado cuando colocas un pais y se comunica con USGS", async () => {
        const res = await request(app).get(
            "/earthquakes/USGS?country=Colombia"
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.country.toLowerCase()).toContain("colombia");
        expect(res.body).toHaveProperty("magnitude");
        expect(res.body).toHaveProperty("depth");
        expect(res.body).toHaveProperty("date");
    });
    it("debería responder 200 y dar resultado cuando colocas un pais y se comunica con USGS sin importar mayusculas", async () => {
        const res = await request(app).get(
            "/earthquakes/usgs?country=Colombia"
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.country.toLowerCase()).toContain("colombia");
        expect(res.body).toHaveProperty("magnitude");
        expect(res.body).toHaveProperty("depth");
        expect(res.body).toHaveProperty("date");
    });
    it("debería responder 200 y dar resultado cuando colocas un pais y se comunica con EMSC", async () => {
        const res = await request(app).get("/earthquakes/EMSC?country=Colombia");
        expect(res.statusCode).toBe(200);
        expect(res.body.country.toLowerCase()).toContain("colombia");
        expect(res.body).toHaveProperty("magnitude");
        expect(res.body).toHaveProperty("depth");
        expect(res.body).toHaveProperty("date");
    });
    it("debería responder 404 cuando pone un pais inexistente y se comunica con EMSC", async () => {
        const res = await request(app).get(
            "/earthquakes/EMSC?country=paisInexistente"
        );
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "error",
            "Las coordenadas del pais no fueron encontradas"
        );
    });
    it("debería responder 200 y dar resultado cuando colocas un pais y se comunica con EMSC sin importar mayusculas", async () => {
        const res = await request(app).get("/earthquakes/emsc?country=Colombia");
        expect(res.statusCode).toBe(200);
        expect(res.body.country.toLowerCase()).toContain("colombia");
        expect(res.body).toHaveProperty("magnitude");
        expect(res.body).toHaveProperty("depth");
        expect(res.body).toHaveProperty("date");
    });
    it("debería responder 200 y dar resultado cuando colocas un pais y se comunica con la BD", async () => {
        await earthquakes.deleteMany({}); // Limpia la colección antes
        const earthquakes = new earthquakes({
            location: "Medellin, Colombia",
            magnitude: 5.4,
            depth: 30,
            date: "2023-11-15",
        });
        await earthquakes.save();
        const res = await request(app).get("/earthquakes/local?country=Colombia");
        expect(res.statusCode).toBe(200);
        expect(res.body.country.toLowerCase()).toContain("colombia");
        expect(res.body).toHaveProperty("magnitude",5.4);
        expect(res.body).toHaveProperty("depth",30);
        expect(res.body).toHaveProperty("date","2023-11-15");
    });
    it("debería responder con mensaje cuando no hay registros sísmicos en la BD", async () => {
        // Borra todos los registros de la colección antes de la prueba
        await earthquakes.deleteMany({});

        const res = await request(app).get("/earthquakes/local?country=Colombia");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "No hay registros sísmicos");
    });
});