# Estándar de contenido

Las reglas completas están en la sección 7 de la guía rectora. Resumen operativo:

- SVG con regiones independientes y cerradas; sin relleno raster.
- Contorno negro grueso, zonas grandes y pocos detalles pequeños.
- IDs únicos de dibujo y región. No reutilizarlos después de una publicación.
- Metadata con categoría, nombre, referencia al asset y acceso `free` o `premium`.
- V1: todo el contenido visible será `free`, con `productId: null`.
- No cambiar geometrías o IDs de una versión pública sin una migración explícita del progreso.
- Validar metadata, IDs y assets automáticamente al implementar el pipeline de la etapa 6.

Primero se incorporará un único dibujo de prueba en la etapa 2. El catálogo de 40 dibujos corresponde a la etapa 7.
