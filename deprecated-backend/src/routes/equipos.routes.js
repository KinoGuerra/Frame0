import { Router } from "express";
import { equiposController } from "../controllers/equipos.controller.js";

const router = Router();

// TODO: validar rol admin para ABM y delegado solo para su equipo.
router.get("/", equiposController.list);
router.get("/:id", equiposController.getById);
router.post("/", equiposController.create);
router.put("/:id", equiposController.update);
router.patch("/:id/desactivar", equiposController.deactivate);
router.patch("/:id/activar", equiposController.activate);

export default router;
