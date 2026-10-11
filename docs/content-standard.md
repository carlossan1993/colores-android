# Estándar de dibujos y alta de contenido

Fuente normativa: sección 7 de la guía maestra. Los dibujos SVG/JSON y la metadata pertenecen al catálogo, separado del motor de coloreado.

## Formato de los dibujos

- Geometría en assets/drawings/<categoría>/<id>.json: viewBox y array de regiones con id, name y path.
- Cada región tiene ID único y estable, nombre legible y path SVG que empieza por M y termina en Z.
- Contornos negros gruesos, formas grandes y regiones cómodas de tocar. La validación sintáctica no sustituye la inspección visual ni las pruebas Android.
- Categorías: animals, fruits, places y vehicles.
- IDs ya publicados: no se reutilizan ni cambian sin migración de progreso.
- El viewBox debe tener cuatro números con ancho y alto positivos; priorizar dimensiones cómodas en landscape.

## Metadata y alta de contenido

El archivo assets/drawings/catalog.json es el registro único y ordenado de dibujos, con id, name, category, access, productId y asset. Por ejemplo, el gato utiliza id cat_001, name Gatito, category animals, access free, productId null y asset animals/cat_001. El campo opcional svgTitle añade un título a su SVG.

El orden del manifiesto determina el orden de la galería. V1 contiene solo dibujos free, pero el contrato acepta premium con productId para una futura V2 sin activar pagos ahora.

1. Crear el archivo de geometría JSON bajo la categoría, con ID nuevo y regiones cerradas.
2. Añadir una entrada en assets/drawings/catalog.json.
3. Ejecutar npm run content:generate en la rama de edición. Genera el archivo SVG y src/content/catalog.ts, que no se modifica manualmente.
4. Ejecutar npm run verify. GitHub Actions valida y compila el APK sin exigir herramientas locales al usuario.
5. Probar visualmente en Android toques, colores, undo/redo, guardado y restauración, e integrar mediante PR.

El pipeline comprueba metadata, acceso, IDs, categorías, viewBox, paths cerrados, geometrías huérfanas y coincidencia exacta entre JSON, SVG y catálogo generado. Rechaza archivos desincronizados y duplicados. No comprueba automáticamente superposición visual o regiones demasiado pequeñas: siguen requiriendo revisión.

El catálogo de 40 dibujos (10 por categoría) se produce en la etapa 7.
