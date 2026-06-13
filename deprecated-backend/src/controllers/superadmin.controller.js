import { createCrudController } from "../utils/crudController.js";

// TODO: proteger estas rutas para rol superadmin cuando se implemente autenticacion.
export const superadminController = createCrudController({
  table: "usuarios_app",
  select: "id,nombre,email,rol,activo,created_at",
  activeColumn: "activo",
  orderBy: "nombre",
  postRequired: ["nombre", "email"],
  listFilter: (query) => query.eq("rol", "superadmin"),
  createPayload: (body) => ({
    id: body.id,
    nombre: body.nombre,
    email: body.email,
    rol: "superadmin",
    activo: body.activo ?? true
  }),
  updatePayload: (body) => ({
    nombre: body.nombre,
    email: body.email,
    activo: body.activo
  })
});
