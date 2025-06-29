import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import weatherAPIConnectionRoutes from "./weatherAPIConnection.routes.js";
import eartquakesAPIConnectionRoutes from "./earthquakesAPIConnection.routes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/weather", weatherAPIConnectionRoutes);
app.use("/earthquakes", eartquakesAPIConnectionRoutes);

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "API para Datos Meteorológicos y Sismológicos",
        version: "1.0.0",
        description:
            "Documentación de una API que proporciona datos meteorológicos y sismológicos, realizada como proyecto de la materia Tópicos Especiales de Programación.\n\n Elaborada por: Edwin Li, José Oropeza y Andrés Valdivieso",
    },
};

const options = {
    swaggerDefinition,
    apis: ["./src/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
