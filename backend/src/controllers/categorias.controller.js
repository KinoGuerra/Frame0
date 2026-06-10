import { createCrudController } from "../utils/crudController.js";

export const categoriasController = createCrudController({
  table: "categorias",
  select: "id,nombre,descripcion,activa,created_at",
  activeColumn: "activa",
  orderBy: "nombre",
  postRequired: ["nombre"],
  createPayload: (body) => ({
    nombre: body.nombre,
    descripcion: body.descripcion || null,
    activa: body.activa ?? true
  }),
  updatePayload: (body) => ({
    nombre: body.nombre,
    descripcion: body.descripcion,
    activa: body.activa
  })
});
