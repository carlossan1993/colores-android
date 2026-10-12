# Ruta y estado de ejecución

Línea base: [guía maestra aprobada](project-guide.md). Las etapas no se cierran únicamente por disponer de código.

| Etapa | Entregable | Estado |
| --- | --- | --- |
| 0. Preparación | Repositorio público, reglas, documentación y PR | Completada; PR 1 integrado |
| 1. Fundación Android | Base nativa horizontal y APK generado desde GitHub | Completada; APK validado en Actions y funcionamiento confirmado por el usuario |
| 2. Motor SVG | Un dibujo, toque por región, paleta, undo/redo y reset | Completada; PR 2 integrado tras APK verificado y confirmación del usuario |
| 3. Pantalla de coloreado | UX horizontal en teléfono y tablet | Completada; APK validado por el usuario y PR 3 integrado |
| 4. Navegación y catálogo | Inicio, categorías y galería | Completada; APK validado por el usuario y PR 4 integrado |
| 5. Persistencia offline | Guardado y restauración local versionados | Completada; PR 5 integrado después de confirmar funcionamiento |
| 6. Pipeline de contenido | Validación de metadata y SVG | Completada; PR 6 integrado y las tres pruebas de CI aprobadas |
| 7. Catálogo inicial | 40 dibujos, 10 por categoría | Contenido completado; PR 10 integrado con CI y capturas aprobadas; queda validación integral en dispositivo físico |
| 8. UX final | Sonidos, celebración y estados | En desarrollo: celebración y silencio integrados; ajustes y aviso de privacidad en revisión |
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

El PR 6 quedó integrado con CI aprobada. Etapa 7: el PR 9 ya está integrado. El cuarto lote añade 11 dibujos, llegando a 40/40 (10 por cada categoría). Revisar los SVG, las capturas Android y la accesibilidad táctil antes de cerrar la etapa. La firma estable para conservar progreso entre versiones distintas sigue pendiente en GitHub Secrets.

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
- [x] APK compilado y guardado/restauración ejercitados offline en Android.
- [x] Usuario confirma funcionamiento de la última versión y autoriza avanzar.

El almacenamiento solo contiene colores y preferencias; no guarda imágenes ni historial undo/redo. La prueba de CI reinstala el mismo APK sobre sí mismo; la actualización entre versiones distintas queda pendiente de configurar una firma estable en Secrets.

## Criterio de salida de la etapa 6

- [x] Metadata central con cinco dibujos de muestra, cuatro categorías y acceso free/premium preparado.
- [x] Generador estático de catálogo TypeScript y exports SVG desde JSON, sin cambios al motor.
- [x] Validaciones de IDs duplicados, regiones, geometría, archivos huérfanos y discrepancias.
- [x] Pruebas de errores de contenido y documentación de alta mediante PR.
- [x] GitHub Actions aprueba pruebas y compila un APK con el pipeline.
- [x] Integración del PR 6 tras revisión; etapa 7 es creación de contenido.

## Etapa 7 — primer lote de contenido

- [x] Se han creado geometrías y SVG originales de Perrito, Conejito, Banana, Fresa, Escuela, Granero, Barquito y Avión.
- [x] Catálogo ampliado a 13 dibujos: 3 animales, 3 frutas, 4 lugares y 3 vehículos.
- [x] Pruebas actualizadas para la navegación con nuevos límites y para pintar todas las regiones.
- [x] CI del PR 7 aprobó catálogo, APK, interacción offline y ejemplos nuevos.
- [x] PR 7 integrado tras verificación CI y capturas del emulador; la prueba en dispositivo real con firma estable sigue pendiente.

## Etapa 7 — segundo lote de contenido (PR 8)

- [x] Ocho nuevos dibujos originales: Tortuguita, Mariposa, Naranja, Piña, Faro, Parque, Trencito y Tractor.
- [x] Catálogo expandido a 21 dibujos con 169 regiones, todos gratuitos y offline (5/5/6/5 por categoría).
- [x] Pruebas de límites, regiones coloreables y recorridos nuevos actualizadas.
- [x] Validación CI del PR 8: calidad, APK, interacción y conservación offline.
- [x] Verificadas capturas de Tortuguita, Naranja, Faro y Trencito e integrado el PR 8; las pruebas manuales de actualización firmada siguen pendientes.

## Etapa 7 — tercer lote de contenido (PR 9)

- [x] Ocho dibujos nuevos originales: Zorrito, Leoncito, Pera, Sandía, Biblioteca, Hospital, Autobús y Cohete.
- [x] Catálogo ampliado a 29 dibujos y 249 regiones; todos offline y gratuitos (7 animales, 7 frutas, 8 lugares, 7 vehículos).
- [x] Actualizadas pruebas del catálogo y recorridos Android en 4 nuevos dibujos.
- [x] CI del PR 9 aprobada, capturas revisadas y merge efectuado.
- [ ] Continuar el catálogo hasta 40 dibujos y verificar tamaños de regiones táctiles.

## Etapa 7 — cuarto lote y catálogo objetivo (PR 10)

- [x] Se agregaron 11 dibujos infantiles originales: Elefantito, Pececito, Buhito, Uvas, Cerezas, Limón, Estación de bomberos, Tiendita, Bicicleta, Camioncito y Helicóptero.
- [x] Catálogo total: 40 ilustraciones, diez por categoría, con 361 regiones coloreables offline.
- [x] Integración de metadata y pruebas de catálogo, pintura, navegación y emulador, sin permisos ni dependencias adicionales.
- [x] CI del PR 10 aprobó APK Android, 30 pruebas Jest, validación de 40 dibujos y pruebas offline en seis tamaños.
- [x] Capturas de Elefantito, Cerezas, Tiendita y Helicóptero revisadas e integración del PR 10.
- [ ] Confirmación de la experiencia completa en dispositivo físico; la firma estable de actualizaciones sigue pendiente.

La firma estable para actualizar entre versiones sin pérdida de datos continúa pendiente para etapa 9/10.

## Etapa 8 — primer cambio: celebración al completar (PR 11)

- [x] Detectar transición real desde dibujo incompleto a terminado.
- [x] Mostrar felicitación visual breve, sin bloquear la pintura ni navegar a otra pantalla.
- [x] No volver a celebrarlo al abrir un dibujo ya terminado y restaurado.
- [x] Añadir pruebas para transiciones y UI de celebración.
- [x] CI del PR 11 aprobó código, APK y seis tamaños Android; se recuperó un fallo de Pixel Launcher del emulador.
- [x] Captura de felicitación revisada y PR 11 integrado.
- [ ] Continuar con sonido opcional, control de silencio y ajustes/legal.

## Etapa 8 — segundo cambio: sonido opcional y silencio (PR 12)

- [x] Reutilizar la preferencia persistente `soundEnabled` del esquema v1, sin migración de datos.
- [x] Incorporar un botón grande para encender/apagar el sonido desde el coloreado.
- [x] Añadir un tono suave y breve del sistema Android al completar un dibujo, sin Internet, permisos ni dependencias externas.
- [x] Pruebas de audio silenciado y restauración de preferencias en Android.
- [x] CI del PR 12 aprobó código, APK y emulador tras corregir el recorte de paleta de 44 dp.
- [x] Capturas y restauración de silencio revisadas; PR 12 integrado.
- [ ] Comprobar sonido físicamente en dispositivo antes de cerrar etapa.
- [ ] Pantalla de ajustes/legal y revisión de UX final.

## Etapa 8 — tercer cambio: ajustes y privacidad (PR 13)

- [x] Añadir acceso a Ajustes y privacidad desde Inicio, sin cambiar la ruta de coloreado.
- [x] Permitir activar/desactivar sonido con la misma preferencia persistente.
- [x] Mostrar aviso de privacidad dentro de la aplicación, accesible sin Internet, y versión visible.
- [x] Cubrir navegación, cambios de sonido y retorno al coloreado en pruebas.
- [ ] CI con APK y emulador, capturas en móvil y tablet, sin regresiones offline.
- [ ] Publicar política de privacidad completa en URL pública antes de Google Play; confirmar datos del desarrollador y contacto.
