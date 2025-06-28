import request from "supertest";
import { app, connectDB } from "../src/index.js";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.connection.close();
});

describe("API básica", () => {
    it("debería responder 404 en una ruta inexistente", async () => {
        const res = await request(app).get("/ruta-inexistente");
        expect(res.statusCode).toBe(404);
    });
});
