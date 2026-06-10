# Frame0 - Guía para agentes

## Contexto del proyecto
Frame0 es un frontend estático para una plataforma de torneos amateur de fútbol. El proyecto usa HTML5, CSS3, Bootstrap 5, Bootstrap Icons y JavaScript vanilla.

## Archivos principales
- `index.html`: estructura principal, modales y carga de dependencias CDN.
- `styles.css`: estilos visuales, responsive, dark mode y componentes.
- `script.js`: datos demo, navegación, roles, renderizados dinámicos y lógica de interacción.
- `assets/`: logos, escudos, SVG e imágenes usadas por la interfaz.

## Reglas de trabajo
- Mantener separados HTML, CSS y JavaScript.
- No agregar frameworks ni build system sin necesidad.
- Conservar rutas relativas para que funcione en GitHub Pages.
- Validar cambios de JavaScript con `node --check script.js`.
- Evitar romper el comportamiento existente de roles: público, administrador, delegado y veedor.
- Cuidar contraste en modo claro y dark mode.

## Estilo de código
- Usar nombres descriptivos para clases, funciones y atributos `data-*`.
- Priorizar cambios pequeños y localizados.
- Reutilizar componentes visuales existentes antes de crear nuevos patrones.
- Mantener el diseño responsive.

## Publicación
El sitio se publica como frontend estático en GitHub Pages desde la raíz del repositorio.
