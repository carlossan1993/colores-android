# Ruta y estado de ejecución

Línea base: [guía maestra aprobada](project-guide.md). Las etapas no se cierran únicamente por disponer de código.

| Etapa | Entregable | Estado |
| --- | --- | --- |
| 0. Preparación | Repositorio público, reglas, documentación y PR | Completada; PR 1 integrado |
| 1. Fundación Android | Base nativa horizontal y APK generado desde GitHub | Completada; APK validado en Actions y funcionamiento confirmado por el usuario |
| 2. Motor SVG | Un dibujo, toque por región, paleta, undo/redo y reset | Completada; PR 2 integrado tras APK verificado y confirmación del usuario |
| 3. Pantalla de coloreado | UX horizontal en teléfono y tablet | Completada; APK validado por el usuario y PR 3 integrado |
| 4. Navegación y catálogo | Inicio, categorías y galería | Completada; APK validado por el usuario y PR 4 integrado |
| 5. Persistencia offline | Guardado y restauración local versionados | Implementada; pendiente de verificar APK y prueba real |
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

El usuario confirmó “Funcionó” para el APK de la etapa 3 y autorizó continuar. PR 3 integrado con `aab3614309d9ee7425032c8186e262b9dcc7d22e`; Actions aprobó la pantalla en seis tamaños, incluidos los doce colores completos.

El usuario confirmó “Funciona bien. Avancemos” para el APK de la etapa 4. PR 4 integrado con `6367fea0e9ca1a529190c1e9646d238a31d883ee`; [Actions](https://github.com/carlossan1993/colores-android/actions/runs/37879542885) aprobó navegación offline en seis tamaños y las cuatro categorías.

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
- [x] APK generado, verificado y ejercitado offline en los seis tamaños del emulador: [Actions del PR 3](https://github.com/carlossan1993/colores-android/actions/runs/37826626602).
- [x] Usuario confirma comodidad de dibujo, paleta y controles en su dispositivo.

La etapa 5 añade guardado local de colores y preferencias. El historial undo/redo se mantiene únicamente durante la sesión.

## Próximo cambio

Validar la etapa 5 en el dispositivo: pintar dos dibujos, cerrar el proceso y reabrir en modo avión; colores, miniaturas y selección de color deben restaurarse. Después etapa 6: pipeline de contenido. Antes de probar persistencia entre versiones, configurar una firma estable de pruebas en GitHub Secrets. Antes de publicar: nombre comercial, paquete definitivo, edades, cuenta de Play y requisitos vigentes.

## Criterio de salida de la etapa 4

- [x] Inicio visual y cuatro categorías: animales, frutas, lugares y vehículos.
- [x] Galería con miniaturas SVG locales y estados sin empezar/en progreso/terminado.
- [x] Cinco dibujos de muestra; catálogo completo de 40 reservado a la etapa 7.
- [x] Coloreado genérico, anterior/siguiente limitado a la categoría y retorno a galería.
- [x] Botón Atrás de Android y estados/undo independientes por dibujo durante la sesión.
- [x] Pruebas de navegación, límites e independencia de regiones e historial.
- [x] APK verificado y recorrido ejercitado offline en Actions.
- [x] Usuario confirma el recorrido completo en su teléfono.

Sin nuevas dependencias, permisos, conexión o SDK. El contenido incluido es gratuito; el acceso pasa por la abstracción free/premium existente.

## Criterio de salida de la etapa 5

- [x] Progreso por ID de dibujo/región y preferencias en almacenamiento privado Android.
- [x] Formato versionado, validación, recuperación y protección ante versiones desconocidas.
- [x] Restauración previa a interacción; sin sobrescritura con estados vacíos durante la carga.
- [x] Escrituras ordenadas con confirmación de disco y reintento tras fallo.
- [x] Pruebas de round-trip, aislamiento, reapertura, reset persistido y errores.
- [ ] APK compilado y guardado/restauración ejercitados offline en Android.
- [ ] Usuario confirma progreso conservado al cerrar/reabrir en su teléfono.

El almacenamiento solo contiene colores y preferencias; no guarda imágenes ni historial undo/redo. La prueba de CI reinstala el mismo APK sobre sí mismo; la actualización entre versiones distintas queda pendiente de configurar una firma estable en Secrets.
