import { Router } from "express";
import postRouter from "./weatherBD.routes.POST.js";
import getRouter from "./weatherBD.routes.GET.js";
import deleteRouter from "./weatherBD.routes.DELETE.js";

const router = Router();

// POST /weather
router.post("/", postRouter);
// GET /weather/history/:city
router.get("/history/:city", getRouter);
// DELETE /weather/:id
router.delete("/:id", deleteRouter);

export default router;
