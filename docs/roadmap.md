# Ruta y estado de ejecución

Línea base: [guía maestra aprobada](project-guide.md). Las etapas no se cierran únicamente por disponer de código.

| Etapa | Entregable | Estado |
| --- | --- | --- |
| 0. Preparación | Repositorio público, reglas, documentación y PR | Completada; PR 1 integrado |
| 1. Fundación Android | Base nativa horizontal y APK generado desde GitHub | Completada; APK validado en Actions y funcionamiento confirmado por el usuario |
| 2. Motor SVG | Un dibujo, toque por región, paleta, undo/redo y reset | Completada; PR 2 integrado tras APK verificado y confirmación del usuario |
| 3. Pantalla de coloreado | UX horizontal en teléfono y tablet | Implementada; pendiente de completar Actions y confirmar prueba real |
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

El usuario confirmó “Si, funcionó bien. Avancemos” después de recibir el APK de la etapa 2. El PR 2 se integró con el commit `73e14659373eb1f6445fa14df0c4613e5a210c1e`. Su [ejecución de Actions](https://github.com/carlossan1993/colores-android/actions/runs/37724906609) aprobó los controles y el APK; se cierra el motor SVG.

## Criterio de salida de la etapa 2

- [x] Dibujo original de prueba con ocho IDs estables y regiones cerradas.
- [x] Motor puro con pintura, borrado con blanco, undo/redo, reset e historial acotado.
- [x] Confirmación antes de reiniciar y selección de color conservada entre acciones.
- [x] Pruebas automáticas de región aislada, historial, completado y conexión UI/SVG.
- [x] APK generado y validado en GitHub Actions para el PR 2.
- [x] Usuario confirma funcionamiento de la versión del motor en su teléfono.

## Criterio de salida de la etapa 3

- [x] Más espacio para el dibujo y panel lateral con colores y controles.
- [x] Botones de al menos 48 dp y ampliados a 64 dp en tablet.
- [x] Paleta desplazable y cabecera adaptable en ventanas cortas o estrechas.
- [x] Etiquetas de accesibilidad y selección identificable sin depender solo del color.
- [x] Pruebas de dimensiones y conservación de colores/historial al cambiar de tamaño.
- [ ] APK generado, verificado y ejercitado offline en los seis tamaños del emulador.
- [ ] Usuario confirma comodidad de dibujo, paleta y controles en su dispositivo.

Esta versión de prueba todavía no conserva progreso al cerrar la app. La persistencia corresponde a la etapa 5.

## Próximo cambio

Tras validar la pantalla en el dispositivo, etapa 4: inicio, categorías y galería. Antes de probar persistencia entre versiones, configurar una firma estable de pruebas en GitHub Secrets. Antes de publicar: nombre comercial, paquete definitivo, edades, cuenta de Play y requisitos vigentes.
