import { createCrudController } from "../utils/crudController.js";

export const delegadosController = createCrudController({
  table: "delegados",
  select: "id,usuario_id,equipo_id,activo,created_at,usuario:usuarios_app(id,nombre,email,rol,activo),equipo:equipos(id,nombre)",
  activeColumn: "activo",
  orderBy: "created_at",
  postRequired: ["usuario_id", "equipo_id"],
  createPayload: (body) => ({
    usuario_id: body.usuario_id,
    equipo_id: body.equipo_id,
    activo: body.activo ?? true
  }),
  updatePayload: (body) => ({
    usuario_id: body.usuario_id,
    equipo_id: body.equipo_id,
    activo: body.activo
  })
});
