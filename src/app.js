import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import earthquakeRoutes from "./earthquakes.js";
import weatherAPIConnectionRoutes from "./weatherAPIConnection.routes.js";
import eartquakesAPIConnectionRoutes from "./earthquakesAPIConnection.routes.js";
import weatherBDRoutes from "./weatherBD.routes.js";
import dotenv from "dotenv";
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

if (process.env.NODE_ENV !== "test") {
    mongoose
        .connect(uri, {})
        .then(() => {
            console.log("Conectado a MongoDB Atlas");
        })
        .catch((err) => {
            console.error("Error de conexión:", err.message);
        });
}

const app = express();
app.use(express.json());

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
    (async () => {
        try {
            const swaggerDocument = await import("./docs/swagger.json", {
                assert: { type: "json" },
            }).then((m) => m.default);
            app.use(
                "/api-docs",
                swaggerUi.serve,
                swaggerUi.setup(swaggerDocument)
            );
        } catch (e) {
            console.warn("No se pudo cargar Swagger JSON:", e.message);
        }
    })();
}

export default app;
