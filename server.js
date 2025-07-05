import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import weatherRoutes from './src/weatherBD.routes.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
const connectDB = async () => {
    const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB } = process.env;
    
    // Si tenemos credenciales de MongoDB Atlas, usarlas
    if (MONGO_USER && MONGO_PASS && MONGO_HOST && MONGO_DB) {
        const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}`;
        await mongoose
            .connect(url)
            .then(() => console.log("✅ Conectado a MongoDB Atlas"))
            .catch((err) => console.error("❌ Error de conexión a MongoDB Atlas:", err));
    } else {
        // Fallback a MongoDB local
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-app';
        await mongoose
            .connect(mongoURI)
            .then(() => console.log("✅ Conectado a MongoDB local"))
            .catch((err) => console.error("❌ Error de conexión a MongoDB local:", err));
    }
};

// Rutas
app.use('/weather', weatherRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API de Clima - Base de Datos',
        version: '1.0.0',
        endpoints: {
            'POST /weather': 'Guardar nuevo registro de clima',
            'GET /weather/history/:city': 'Obtener historial de climas de una ciudad',
            'GET /weather/:id': 'Obtener un registro específico por ID',
            'DELETE /weather/:id': 'Eliminar un registro específico por ID'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// Iniciar servidor
if (process.env.NODE_ENV !== "test") {
    // Intentar conectar a MongoDB, pero continuar si falla
    connectDB().then(() => {
        app.listen(PORT, function () {
            console.log(`🚀 API corriendo en http://localhost:${PORT}`);
            console.log(`📊 Endpoints disponibles:`);
            console.log(`   POST /weather`);
            console.log(`   GET /weather/history/:city`);
            console.log(`   GET /weather/:id`);
            console.log(`   DELETE /weather/:id`);
        });
    }).catch((err) => {
        console.log("⚠️  MongoDB no disponible, pero el servidor continuará funcionando");
        console.log("   Las APIs externas seguirán funcionando");
        app.listen(PORT, function () {
            console.log(`🚀 API corriendo en http://localhost:${PORT}`);
            console.log(`📊 Endpoints disponibles:`);
            console.log(`   POST /weather`);
            console.log(`   GET /weather/history/:city`);
            console.log(`   GET /weather/:id`);
            console.log(`   DELETE /weather/:id`);
        });
    });
}

export { app, connectDB }; 