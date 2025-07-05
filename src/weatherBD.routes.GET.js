import { Router } from "express";
import { Weather } from "./weather.js";

const router = Router();

// GET - Obtener historial de climas de una ciudad desde base de datos
router.get("/history/:city", async (req, res) => {
    try {
        const city = req.params.city;

        if (!city) {
            return res.status(400).json({
                error: "Debe especificar el nombre de la ciudad"
            });
        }

        const registros = await Weather.find({ city: city }).sort({ date: -1 });

        if (registros.length === 0) {
            return res.status(404).json({
                error: `No se encontraron registros climáticos para la ciudad: ${city}`
            });
        }

        // Detectar si la petición viene del navegador
        const userAgent = req.headers['user-agent'] || '';
        const isBrowser = userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari') || userAgent.includes('Firefox') || userAgent.includes('Edge');
        
        // Si es navegador, filtrar solo los campos específicos
        let recordsToSend = registros;
        if (isBrowser) {
            recordsToSend = registros.map(registro => ({
                city: registro.city,
                condition: registro.condition,
                temperature: registro.temperature,
                humidity: registro.humidity
            }));
        }

        return res.status(200).json({
            city: city,
            records: recordsToSend,
            total: registros.length
        });

    } catch (error) {
        console.error("Error al obtener registros de clima:", error);
        return res.status(500).json({
            error: "Error interno del servidor al consultar la base de datos"
        });
    }
});

export default router; 