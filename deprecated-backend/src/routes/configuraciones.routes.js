import { Router } from "express";
import {
  configuracionesCrudController,
  getByClave,
  getHabilitacionEdicionJugadores,
  setActiveByClave,
  updateByClave
} from "../controllers/configuraciones.controller.js";

const router = Router();

// TODO: validar rol superadmin/admin para escritura.
router.get("/", configuracionesCrudController.list);
router.get("/habilitacion-edicion-jugadores", getHabilitacionEdicionJugadores);
router.get("/:clave", getByClave);
router.post("/", configuracionesCrudController.create);
router.put("/:clave", updateByClave);
router.patch("/:clave/desactivar", (req, res) => setActiveByClave(req, res, false));
router.patch("/:clave/activar", (req, res) => setActiveByClave(req, res, true));

export default router;
