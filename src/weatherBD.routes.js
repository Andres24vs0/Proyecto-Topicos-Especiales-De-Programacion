import { Router } from "express";
import postRouter from "./weatherBD.routes.POST.js";
import getRouter from "./weatherBD.routes.GET.js";
import deleteRouter from "./weatherBD.routes.DELETE.js";

const router = Router();

// POST /weather
router.use("/", postRouter);
// GET /weather/history/:city
router.use("/history", getRouter);
// DELETE /weather/:id
router.use("/:id", deleteRouter);

export default router;
