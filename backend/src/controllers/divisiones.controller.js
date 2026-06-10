import { createCrudController } from "../utils/crudController.js";

export const divisionesController = createCrudController({
  table: "divisiones",
  select: "id,categoria_id,nombre,descripcion,activa,created_at,categoria:categorias(id,nombre)",
  activeColumn: "activa",
  orderBy: "nombre",
  postRequired: ["categoria_id", "nombre"],
  createPayload: (body) => ({
    categoria_id: body.categoria_id,
    nombre: body.nombre,
    descripcion: body.descripcion || null,
    activa: body.activa ?? true
  }),
  updatePayload: (body) => ({
    categoria_id: body.categoria_id,
    nombre: body.nombre,
    descripcion: body.descripcion,
    activa: body.activa
  })
});
