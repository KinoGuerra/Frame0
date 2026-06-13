import { Router } from "express";
import { veedoresController } from "../controllers/veedores.controller.js";

const router = Router();

// TODO: validar rol admin/superadmin.
router.get("/", veedoresController.list);
router.post("/login", veedoresController.login);
router.get("/:id", veedoresController.getById);
router.post("/", veedoresController.create);
router.put("/:id", veedoresController.update);
router.patch("/:id/desactivar", veedoresController.deactivate);
router.patch("/:id/activar", veedoresController.activate);

export default router;
