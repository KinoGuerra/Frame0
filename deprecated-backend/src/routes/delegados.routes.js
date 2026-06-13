import { Router } from "express";
import { delegadosController } from "../controllers/delegados.controller.js";

const router = Router();

// TODO: validar rol admin/superadmin.
router.get("/", delegadosController.list);
router.get("/:id", delegadosController.getById);
router.post("/", delegadosController.create);
router.put("/:id", delegadosController.update);
router.patch("/:id/desactivar", delegadosController.deactivate);
router.patch("/:id/activar", delegadosController.activate);

export default router;
