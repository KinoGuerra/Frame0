# Frame0 Backend

API administrativa para Frame0 construida con Node.js, Express y Supabase PostgreSQL.

Este backend centraliza operaciones ABM para categorias, divisiones, equipos, delegados,
veedores, administradores, superadministradores y configuraciones generales del torneo.
Las bajas son logicas: los registros quedan marcados como `activo = false` o
`activa = false` segun corresponda.

## Instalacion

Desde la raiz del proyecto:

```bash
cd backend
npm install
```

## Variables de entorno

Crear el archivo `.env` copiando el ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Variables disponibles:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=3001
```

Importante: `SUPABASE_SERVICE_ROLE_KEY` es una clave privada de backend. No debe subirse
a GitHub ni usarse desde el frontend.

## Ejecucion

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Por defecto la API queda disponible en:

```text
http://localhost:3001/api
```

## Endpoints

### Salud

- `GET /api/health`

### Categorias

- `GET /api/categorias`
- `GET /api/categorias/:id`
- `POST /api/categorias`
- `PUT /api/categorias/:id`
- `PATCH /api/categorias/:id/desactivar`
- `PATCH /api/categorias/:id/activar`

### Divisiones

- `GET /api/divisiones`
- `GET /api/divisiones/:id`
- `POST /api/divisiones`
- `PUT /api/divisiones/:id`
- `PATCH /api/divisiones/:id/desactivar`
- `PATCH /api/divisiones/:id/activar`

### Equipos

- `GET /api/equipos`
- `GET /api/equipos/:id`
- `POST /api/equipos`
- `PUT /api/equipos/:id`
- `PATCH /api/equipos/:id/desactivar`
- `PATCH /api/equipos/:id/activar`

### Delegados

- `GET /api/delegados`
- `GET /api/delegados/:id`
- `POST /api/delegados`
- `PUT /api/delegados/:id`
- `PATCH /api/delegados/:id/desactivar`
- `PATCH /api/delegados/:id/activar`

### Veedores

- `GET /api/veedores`
- `GET /api/veedores/:id`
- `POST /api/veedores`
- `PUT /api/veedores/:id`
- `PATCH /api/veedores/:id/desactivar`
- `PATCH /api/veedores/:id/activar`

### Administradores

- `GET /api/administradores`
- `GET /api/administradores/:id`
- `POST /api/administradores`
- `PUT /api/administradores/:id`
- `PATCH /api/administradores/:id/desactivar`
- `PATCH /api/administradores/:id/activar`

### Superadmin

- `GET /api/superadmin`
- `GET /api/superadmin/:id`
- `POST /api/superadmin`
- `PUT /api/superadmin/:id`
- `PATCH /api/superadmin/:id/desactivar`
- `PATCH /api/superadmin/:id/activar`

### Configuraciones

- `GET /api/configuraciones`
- `GET /api/configuraciones/habilitacion-edicion-jugadores`
- `GET /api/configuraciones/:clave`
- `POST /api/configuraciones`
- `PUT /api/configuraciones/:clave`
- `PATCH /api/configuraciones/:clave/desactivar`
- `PATCH /api/configuraciones/:clave/activar`

## Migraciones agregadas

- `supabase/migrations/003_create_veedores.sql`
- `supabase/migrations/004_update_roles_and_configuraciones.sql`

Estas migraciones preparan la tabla de veedores, el rol `superadmin` y la tabla de
configuraciones usada por el backend.

## Seguridad pendiente

La estructura ya deja comentarios `TODO` para agregar middleware de autenticacion y roles.
Antes de exponer esta API publicamente, se debe implementar validacion de sesiones,
permisos por rol y reglas de acceso por recurso.
