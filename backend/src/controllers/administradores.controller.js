import { createCrudController } from "../utils/crudController.js";

// Si usuarios_app.id referencia auth.users(id), la creacion real requiere integrar Supabase Auth.
export const administradoresController = createCrudController({
  table: "usuarios_app",
  select: "id,nombre,email,rol,activo,created_at",
  activeColumn: "activo",
  orderBy: "nombre",
  postRequired: ["nombre", "email"],
  listFilter: (query) => query.eq("rol", "admin"),
  createPayload: (body) => ({
    id: body.id,
    nombre: body.nombre,
    email: body.email,
    rol: "admin",
    activo: body.activo ?? true
  }),
  updatePayload: (body) => ({
    nombre: body.nombre,
    email: body.email,
    activo: body.activo
  })
});
