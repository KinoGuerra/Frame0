import { Router } from "express";
import { categoriasController } from "../controllers/categorias.controller.js";

const router = Router();

// TODO: validar rol admin/superadmin.
router.get("/", categoriasController.list);
router.get("/:id", categoriasController.getById);
router.post("/", categoriasController.create);
router.put("/:id", categoriasController.update);
router.patch("/:id/desactivar", categoriasController.deactivate);
router.patch("/:id/activar", categoriasController.activate);

export default router;
