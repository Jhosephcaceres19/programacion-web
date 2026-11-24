# SlideStudio

Aplicación web para crear, editar y presentar diapositivas. Los proyectos se guardan localmente en IndexedDB.

## Requisitos e instalación

- Node.js 20.19+ o 22.12+
- Bun 1.4+ para instalar desde `bun.lock` y ejecutar las pruebas

```sh
bun install
bun run dev
```

Vite muestra la dirección local para abrir SlideStudio. Para compilar la versión de producción:

```sh
bun run build
```

## Exportar una presentación

Abre un proyecto en el editor y elige una opción de exportación:

- **Exportar HTML** descarga una presentación autocontenida en un archivo `.html`, con navegación por botones o flechas del teclado. El exportador incrusta las imágenes accesibles; las URL que bloquean la descarga de imágenes por CORS permanecen como URL y necesitan conexión.
- **Exportar PDF** abre la vista de impresión del navegador. Elige **Guardar como PDF** en el diálogo de impresión; usa orientación horizontal para conservar el formato de diapositiva.
- **Exportar PowerPoint** descarga `.pptx`, que puede abrirse y editarse en Microsoft PowerPoint o LibreOffice Impress. Las imágenes disponibles desde el navegador se incorporan al archivo.

El diseño de exportación conserva el orden de las diapositivas y sus contenidos, portadas, diseños de texto e imagen, autor y numeración.

## Estructura

- `src/models`: modelos de proyecto y diapositiva y el contrato `IExporter`.
- `src/controllers`: lógica de acceso a proyectos y persistencia.
- `src/infrastructure`: repositorio IndexedDB y adaptador de exportación HTML, impresión PDF y `.pptx`.
- `src/views`: editor, presentación y componentes de diseño.
- `src/App.tsx`: composición de dependencias y navegación entre vistas.

El editor recibe `IExporter` por inyección; la implementación de formatos vive en infraestructura, separada de los modelos y las vistas.

## Comprobaciones

```sh
bun test --preload ./src/test/setup.ts
bun run lint
bun run build
```

La compilación de TypeScript y Vite valida el empaquetado de la aplicación. Las pruebas cubren el controlador de proyectos y el repositorio IndexedDB.
