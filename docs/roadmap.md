# Ruta y estado de ejecución

Línea base: [guía maestra aprobada](project-guide.md). Las etapas no se cierran únicamente por disponer de código.

| Etapa | Entregable | Estado |
| --- | --- | --- |
| 0. Preparación | Repositorio público, reglas, documentación y PR | Completada; PR 1 integrado |
| 1. Fundación Android | Base nativa horizontal y APK generado desde GitHub | Completada; APK validado en Actions y funcionamiento confirmado por el usuario |
| 2. Motor SVG | Un dibujo, toque por región, paleta, undo/redo y reset | Implementada en PR 2; pendiente de validar APK y prueba real |
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

## Validación registrada

El usuario confirmó “funcionó. Avancemos” tras recibir el APK y las instrucciones de instalación, apertura horizontal, paleta y reapertura en modo avión. Se integra el PR 1 y se cierra la fundación Android. GitHub Actions del PR 1 completó los controles y la verificación del APK.

## Criterio de salida de la etapa 2

- [x] Dibujo original de prueba con ocho IDs estables y regiones cerradas.
- [x] Motor puro con pintura, borrado con blanco, undo/redo, reset e historial acotado.
- [x] Confirmación antes de reiniciar y selección de color conservada entre acciones.
- [x] Pruebas automáticas de región aislada, historial, completado y conexión UI/SVG.
- [ ] APK generado y validado en GitHub Actions para el PR 2.
- [ ] Usuario confirma precisión de toque, controles y funcionamiento offline en su teléfono.

Esta versión de prueba todavía no conserva progreso al cerrar la app. La persistencia corresponde a la etapa 5; la UX horizontal definitiva, a la etapa 3.

## Próximo cambio

Tras validar el motor en el teléfono, etapa 3: pulir la pantalla de coloreado para teléfono y tablet. Antes de probar persistencia entre versiones, configurar una firma estable de pruebas en GitHub Secrets. Antes de publicar: nombre comercial, paquete definitivo, edades, cuenta de Play y requisitos vigentes.
