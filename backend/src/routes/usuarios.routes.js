import { Router } from "express";
import { usuariosController } from "../controllers/usuarios.controller.js";

const router = Router();

// TODO: validar rol admin/superadmin.
router.get("/", usuariosController.list);

export default router;
