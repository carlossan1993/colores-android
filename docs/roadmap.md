# Ruta y estado de ejecución

Línea base: [guía maestra aprobada](project-guide.md). Las etapas no se cierran únicamente por disponer de código.

| Etapa | Entregable | Estado |
| --- | --- | --- |
| 0. Preparación | Repositorio público, reglas, documentación y PR | Preparada en este cambio |
| 1. Fundación Android | Base nativa horizontal y APK generado desde GitHub | Implementada; pendiente de validar CI e instalación real |
| 2. Motor SVG | Un dibujo, toque por región, paleta, undo/redo y reset | Pendiente |
| 3. Pantalla de coloreado | UX horizontal en teléfono y tablet | Pendiente |
| 4. Navegación y catálogo | Inicio, categorías y galería | Pendiente |
| 5. Persistencia offline | Guardado y restauración local versionados | Pendiente |
| 6. Pipeline de contenido | Validación de metadata y SVG | Pendiente |
| 7. Catálogo inicial | 40 dibujos, 10 por categoría | Pendiente |
| 8. UX final | Sonidos, celebración y estados | Pendiente |
| 9. QA | Dispositivos, rendimiento, offline y actualizaciones | Pendiente |
| 10. Compliance Play | Privacidad, declaraciones y AAB firmado | Pendiente |
| 11. Testing Play | Prueba exigida por la cuenta de publicación | Pendiente |
| 12. Publicación | App aprobada en Google Play | Pendiente |

## Criterio de salida inmediato

- [ ] Controles de TypeScript, lint, pruebas y base en verde en GitHub.
- [ ] APK generado y validado por GitHub Actions.
- [ ] APK instalado en el teléfono real del usuario.
- [ ] Apertura horizontal, paleta táctil y reapertura en modo avión confirmadas.

La instalación y apertura se registrarán después de la confirmación del usuario. Hasta entonces no se inicia la producción del catálogo ni se declara terminada la etapa 1.

## Próximo cambio

Tras aprobar la instalación, etapa 2 con un SVG original simple. Antes de probar persistencia entre versiones, configurar una firma estable de pruebas en GitHub Secrets. Antes de publicar: nombre comercial, paquete definitivo, edades, cuenta de Play y requisitos vigentes.
