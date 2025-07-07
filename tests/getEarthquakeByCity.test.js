import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Earthquake from "../src/Earthquake.js";
import { connectDB } from "../src/index.js";

beforeAll(async () => {
    await connectDB();
    // Seed the DB with a Caracas earthquake
    await Earthquake.deleteMany({ location: "Caracas" });
    await new Earthquake({
        _id: "sismo_caracas_test",
        magnitude: 5.0,
        depth: 10,
        location: "Caracas",
        date: new Date(),
    }).save();
}, 20000);

afterAll(async () => {
    await mongoose.disconnect();
}, 30000);

describe("GET /earthquakes?city=Caracas", () => {
    it("🔍 debe devolver al menos un sismo con location = Caracas", async () => {
        const res = await request(app).get("/earthquakes?city=Caracas");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);

        const contieneCaracas = res.body.data.some(
            (eq) => eq.location.toLowerCase() === "caracas"
        );

        expect(contieneCaracas).toBe(true);
    }, 20000);
});
