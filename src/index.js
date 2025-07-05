import mongoose from "mongoose";
import app from "./app.js";

const port = 3005;

const connectDB = async () => {
    const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB } = process.env;
    const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}`;
    await mongoose
        .connect(url)
        .then(() => console.log("Conectado a MongoDB"))
        .catch((err) => console.error("Error de conexión:", err));
};

if (process.env.NODE_ENV !== "test") {
    connectDB().then(() => {
        app.listen(port, function () {
            console.log(`Api corriendo en http://localhost:${port}`);
        });
    });
}

export { app, connectDB };
