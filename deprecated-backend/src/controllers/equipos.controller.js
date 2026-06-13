import { createCrudController } from "../utils/crudController.js";

export const equiposController = createCrudController({
  table: "equipos",
  select: "id,division_id,nombre,escudo_url,color_principal,color_secundario,activo,created_at,division:divisiones(id,nombre,categoria:categorias(id,nombre))",
  activeColumn: "activo",
  orderBy: "nombre",
  postRequired: ["division_id", "nombre"],
  createPayload: (body) => ({
    division_id: body.division_id,
    nombre: body.nombre,
    escudo_url: body.escudo_url || null,
    color_principal: body.color_principal || null,
    color_secundario: body.color_secundario || null,
    activo: body.activo ?? true
  }),
  updatePayload: (body) => ({
    division_id: body.division_id,
    nombre: body.nombre,
    escudo_url: body.escudo_url,
    color_principal: body.color_principal,
    color_secundario: body.color_secundario,
    activo: body.activo
  })
});
