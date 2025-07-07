import express from "express";
import { postEarthquake } from "./earthquakeController.js";
import { validateEarthquake } from "./validate.js";


const router = express.Router();
router.post("/", validateEarthquake, postEarthquake);

export default router;

