# Lector 3D de publicaciones

Visor de PDFs como libro en 3D (páginas que se pasan a mano, zoom a pasajes y fotos, texto accesible, sonido) con descarga del PDF original. Basado en el reader de Vital Oceans.

- Visor: `src/components/reader3d/` (`Reader3D.tsx`, `engine.ts`, `types.ts`)
- Página: `/[locale]/lector/[slug]` (por ahora sin indexar)
- Conversor: `scripts/reader-build.mjs` y `scripts/reader/convert.mjs`
- Archivos: R2 en `readers/<slug>/<idioma>/` (`manifest.json` y `pages/*.webp`)

## Convertir un PDF

```bash
# Desde un archivo o una URL
npm run reader:build -- ruta/al/reporte.pdf --slug mi-reporte --lang es \
  --title "Título" --kicker "Reporte público · 2026" --subtitle "Subtítulo" \
  --pdf-url "https://…/reporte.pdf"

# Desde el Archive (descarga el PDF y el botón usa /api/download)
npm run reader:build -- --report <id> --slug mi-reporte --lang es
```

1. Revisa en local: `http://localhost:3000/es/lector/mi-reporte` (en desarrollo, si aún no está en R2, se lee la copia de `public/readers/`).
2. Sube con `--upload`: sube el lector y el registro `readers/index.json`.

Un reporte con varios idiomas se convierte una vez por idioma con el mismo `--slug` (`--lang es`, `--lang en`, `--lang pt`).

## En The Archive

El registro `readers/index.json` dice qué reportes del Archive tienen lector y en qué idiomas (solo los convertidos con `--report <id>`). `/api/readers` lo expone; The Archive y `/reportes/[id]` muestran el botón «Leer en 3D» solo para esos reportes y abren el lector en el idioma de la pestaña elegida. En el lector, «Descargar PDF» usa `/api/download` del Archive.

Opciones útiles: `--pages 1-12` (prueba rápida), `--cover-fx water` (ondas en la foto de portada), `--force` (reconvertir aunque el PDF no haya cambiado). Un PDF de 41 páginas tarda unos 20 s.

## Qué detecta solo

| Del PDF | Cómo |
|---|---|
| Imagen de cada página | 1600 px y 420 px en WebP |
| Texto accesible | Bloques en orden de lectura (columnas), sin cabeceras, pies, números de página ni llamadas de nota |
| Puntos de zoom | Párrafos largos (hasta 4 por página); el título es la primera oración o el título de la sección |
| Índice | Enlaces internos del PDF o, si no tiene, líneas «Título ……… 12» o rejillas «03  Título» (página titulada «Índice», «Contents»…) |
| Secciones | Del índice, de los marcadores del PDF o de los títulos |
| Enlaces externos | Anotaciones del PDF (se abren en otra pestaña) |
| Fotos | Imágenes grandes (respetando el recorte): barniz y, si tienen pie de foto, un punto de zoom |

No detecta: descripciones de fotos sin pie (pendiente: generarlas con IA y revisarlas), gráficas vectoriales, páginas horizontales.

## Caché

Las imágenes se guardan con un hash en el nombre (`p001-3fa9c2d1.webp`) y caché inmutable; `manifest.json` tiene caché de 5 minutos. Al reconvertir, el manifest apunta a las imágenes nuevas. El script de subida nunca borra objetos de R2.
