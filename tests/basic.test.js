import request from "supertest";
import { connectDB } from "../src/index.js";
import app from "../src/app.js";
import mongoose from "mongoose";

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("API básica", () => {
    it("debería responder 404 en una ruta inexistente", async () => {
        const res = await request(app).get("/ruta-inexistente");
        expect(res.statusCode).toBe(404);
    });
});
