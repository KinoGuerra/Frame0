import { Router } from "express";
import { administradoresController } from "../controllers/administradores.controller.js";

const router = Router();

// TODO: validar rol superadmin.
router.get("/", administradoresController.list);
router.get("/:id", administradoresController.getById);
router.post("/", administradoresController.create);
router.put("/:id", administradoresController.update);
router.patch("/:id/desactivar", administradoresController.deactivate);
router.patch("/:id/activar", administradoresController.activate);

export default router;
