import { Router } from "express";
import { superadminController } from "../controllers/superadmin.controller.js";

const router = Router();

// TODO: validar rol superadmin.
router.get("/", superadminController.list);
router.get("/:id", superadminController.getById);
router.post("/", superadminController.create);
router.put("/:id", superadminController.update);
router.patch("/:id/desactivar", superadminController.deactivate);
router.patch("/:id/activar", superadminController.activate);

export default router;
