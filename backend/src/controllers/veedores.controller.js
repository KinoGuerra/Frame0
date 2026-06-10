import { createCrudController } from "../utils/crudController.js";

export const veedoresController = createCrudController({
  table: "veedores",
  select: "id,usuario_id,activo,created_at,usuario:usuarios_app(id,nombre,email,rol,activo)",
  activeColumn: "activo",
  orderBy: "created_at",
  postRequired: ["usuario_id"],
  createPayload: (body) => ({
    usuario_id: body.usuario_id,
    activo: body.activo ?? true
  }),
  updatePayload: (body) => ({
    usuario_id: body.usuario_id,
    activo: body.activo
  })
});
