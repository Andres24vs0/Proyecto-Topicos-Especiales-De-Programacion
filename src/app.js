import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Ejemplo",
    version: "1.0.0",
    description: "Documentación de la API usando Swagger",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/*.js"], // Archivos donde tienes tus rutas y comentarios JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
