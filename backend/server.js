import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriasRoutes from "./src/routes/categorias.routes.js";
import divisionesRoutes from "./src/routes/divisiones.routes.js";
import equiposRoutes from "./src/routes/equipos.routes.js";
import delegadosRoutes from "./src/routes/delegados.routes.js";
import veedoresRoutes from "./src/routes/veedores.routes.js";
import administradoresRoutes from "./src/routes/administradores.routes.js";
import superadminRoutes from "./src/routes/superadmin.routes.js";
import configuracionesRoutes from "./src/routes/configuraciones.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "Frame0 API"
  });
});

// TODO: agregar autenticacion y autorizacion por roles admin/delegado/veedor/superadmin.
app.use("/api/categorias", categoriasRoutes);
app.use("/api/divisiones", divisionesRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/delegados", delegadosRoutes);
app.use("/api/veedores", veedoresRoutes);
app.use("/api/administradores", administradoresRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/configuraciones", configuracionesRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Frame0 API escuchando en http://localhost:${port}`);
});
