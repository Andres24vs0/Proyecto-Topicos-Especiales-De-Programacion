import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDB } from "../src/index.js";
import Earthquake from "../src/Earthquake.js";
import dotenv from "dotenv";
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
}, 30000);

describe("POST /earthquakes", () => {
    it("✅ debería guardar un terremoto válido", async () => {
        const res = await request(app).post("/earthquakes").send({
            magnitude: 5.8,
            depth: 12,
            location: "Los Andes",
            date: "2025-07-15",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        console.log("🌍 Sismo creado con ID:", res.body.id);
    });
}, 30000);
