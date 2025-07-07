import express from "express";
import { getCities, getEarthquakesByCity } from "./earthquakeController.js";
import Earthquake from "./Earthquake.js";

const router = express.Router();

router.get("/cities", getCities);
router.get("/", getEarthquakesByCity);

// POST /earthquakes - Crear un nuevo sismo
router.post("/", async (req, res) => {
    try {
        const { magnitude, depth, location, date, _id } = req.body;
        if (!magnitude || !depth || !location || !date) {
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" });
        }
        // Si no se provee _id, generamos uno automáticamente
        const id = _id || `sismo_${Date.now()}`;
        const earthquake = new Earthquake({
            _id: id,
            magnitude,
            depth,
            location,
            date,
        });
        await earthquake.save();
        res.status(201).json({ id: earthquake._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /earthquakes/:id - Eliminar un sismo por _id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Earthquake.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: "Sismo no encontrado" });
        }
        res.status(200).json({ message: `Sismo ${id} eliminado` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
