import { Router } from "express";
import { divisionesController } from "../controllers/divisiones.controller.js";

const router = Router();

// TODO: validar rol admin/superadmin.
router.get("/", divisionesController.list);
router.get("/:id", divisionesController.getById);
router.post("/", divisionesController.create);
router.put("/:id", divisionesController.update);
router.patch("/:id/desactivar", divisionesController.deactivate);
router.patch("/:id/activar", divisionesController.activate);

export default router;
