import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import earthquakeRoutes from "./earthquakes.js";
import weatherAPIConnectionRoutes from "./weatherAPIConnection.routes.js";
import weatherBDRoutes from "./weatherBD.routes.js";
import eartquakesAPIConnectionRoutes from "./earthquakesAPIConnection.routes.js";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json"));

// WEATHER: Todas las rutas en un solo archivo
// WEATHER: Primero las rutas específicas de BD (POST /db, GET /history/:city, DELETE /:id)
app.use("/weather", weatherBDRoutes);
// WEATHER: Luego el catch-all /weather/:source (GET)
app.use("/weather", weatherAPIConnectionRoutes);
// EARTHQUAKES: Primero el POST (DB)
app.use("/earthquakes", earthquakeRoutes);
// EARTHQUAKES: Luego el catch-all /earthquakes/:source (GET)
app.use("/earthquakes", eartquakesAPIConnectionRoutes);

// Swagger solo si existe el archivo y no estamos en test
if (process.env.NODE_ENV !== "test") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default app;
