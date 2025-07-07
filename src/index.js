import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const connectDB = async () => {
    const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB } = process.env;
    const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}`;
    await mongoose
        .connect(url)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error de conexión:", err));
};

if (process.env.NODE_ENV !== "test") {
    connectDB().catch((err) => {
        console.error("Error al conectar a la base de datos:", err);
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { app, connectDB };
