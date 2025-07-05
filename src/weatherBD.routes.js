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
            message: "Registro de clima guardado exitosamente",
            data: climaGuardado
        });

    } catch (error) {
        console.error("Error al guardar el clima:", error);
        return res.status(500).json({
            error: "Error interno del servidor al guardar el clima"
        });
    }
});

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

// GET - Obtener un registro específico por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Debe especificar el ID del registro"
            });
        }

        // Verificar que el ID tenga un formato válido (ObjectId o id:clima_X)
        const isValidObjectId = id.match(/^[0-9a-fA-F]{24}$/);
        const isValidCustomId = id.match(/^id:clima_\d+$/);
        
        if (!isValidObjectId && !isValidCustomId) {
            return res.status(400).json({
                error: "ID de registro inválido. El formato debe ser un ObjectId de MongoDB (24 caracteres hexadecimales) o 'id:clima_X' donde X es un número"
            });
        }

        // Buscar el registro
        const registro = await Weather.findById(id);

        if (!registro) {
            return res.status(404).json({
                error: "No se encontró el registro con el ID especificado"
            });
        }

        return res.status(200).json({
            message: "Registro encontrado",
            data: registro
        });

    } catch (error) {
        console.error("Error al obtener el registro:", error);
        return res.status(500).json({
            error: "Error interno del servidor al consultar el registro"
        });
    }
});

// DELETE - Eliminar un registro específico por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Debe especificar el ID del registro a eliminar"
            });
        }

        // Verificar que el ID tenga un formato válido (ObjectId o id:clima_X)
        const isValidObjectId = id.match(/^[0-9a-fA-F]{24}$/);
        const isValidCustomId = id.match(/^id:clima_\d+$/);
        
        if (!isValidObjectId && !isValidCustomId) {
            return res.status(400).json({
                error: "ID de registro inválido. El formato debe ser un ObjectId de MongoDB (24 caracteres hexadecimales) o 'id:clima_X' donde X es un número"
            });
        }

        // Buscar y eliminar el registro
        const registroEliminado = await Weather.findByIdAndDelete(id);

        if (!registroEliminado) {
            return res.status(404).json({
                error: "No se encontró el registro con el ID especificado"
            });
        }

        return res.status(200).json({
            message: "Registro eliminado exitosamente",
            deletedRecord: registroEliminado
        });

    } catch (error) {
        console.error("Error al eliminar el registro:", error);
        return res.status(500).json({
            error: "Error interno del servidor al eliminar el registro"
        });
    }
});

export default router; 