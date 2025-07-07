import { Router } from "express";
import { Weather } from "./weather.js";

const router = Router();

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