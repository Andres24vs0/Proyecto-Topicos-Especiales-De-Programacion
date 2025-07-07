import { Router } from "express";
import { Weather } from "./weather.js";

const router = Router();

// POST - Guardar nuevo registro de clima
router.post("/", async (req, res) => {
    try {
        const { city, temperature, humidity, condition } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!city || temperature === undefined || humidity === undefined || !condition) {
            return res.status(400).json({
                error: "Todos los campos son requeridos: city, temperature, humidity, condition"
            });
        }

        // Validar que la condición sea válida
        const condicionesValidas = ["Soleado", "Lluvioso", "Nublado", "Tormenta"];
        if (!condicionesValidas.includes(condition)) {
            return res.status(400).json({
                error: `La condición debe ser una de: ${condicionesValidas.join(", ")}`
            });
        }

        // Validar rangos de temperatura y humedad
        if (temperature < -50 || temperature > 60) {
            return res.status(400).json({
                error: "La temperatura debe estar entre -50°C y 60°C"
            });
        }

        if (humidity < 0 || humidity > 100) {
            return res.status(400).json({
                error: "La humedad debe estar entre 0% y 100%"
            });
        }

        // Crear el nuevo registro de clima
        const nuevoClima = new Weather({
            city,
            temperature,
            humidity,
            condition
        });

        const climaGuardado = await nuevoClima.save();

        return res.status(201).json({
            message: "Clima guardado exitosamente",
            data: climaGuardado
        });

    } catch (error) {
        console.error("Error al guardar el clima:", error);
        return res.status(500).json({
            error: "Error interno del servidor al guardar el clima"
        });
    }
});

export default router; 