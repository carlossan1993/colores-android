# Arquitectura de Colores

## Base aprobada

React Native + TypeScript, Android nativo, assets incluidos y progreso local. No hay web, WebView, backend, cuentas ni servicios remotos. El contrato de contenido diferencia `free` y `premium`, pero V1 solo permite acceso gratuito.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| `src/app/` | Arranque, proveedores y futura navegación |
| `src/screens/` | Pantallas y acciones de UI |
| `src/components/` | Paleta y controles nativos reutilizables |
| `src/layout/` | Distribución en dp según tamaño disponible y zonas seguras |
| `src/theme/` | Colores y estilos comunes |
| `src/content/` | Tipos de catálogo e IDs estables |
| `src/coloring/` | Motor SVG y estado de regiones con historial acotado |
| `src/storage/` | Persistencia local versionada; etapa 5 |
| `src/access/` | Contrato `EntitlementManager` y acceso free/premium |
| `assets/` | Dibujos y miniaturas incluidos en la app |
| `android/` | Proyecto Android nativo |
| `scripts/` | Validación de la base y del APK real |
| `.github/workflows/` | Controles y compilación desde GitHub |

## Herramientas de la primera base

Proyecto creado con Community CLI 20.2.0 y React Native 0.87.1, con su plantilla oficial. React 19.2.3, Hermes, TypeScript, `react-native-safe-area-context` y `react-native-svg` 15.15.5. `package-lock.json` fija las dependencias resueltas y CI instala con `npm ci`.

Node 24.19.0, JDK 17, Gradle 9.4.1 con checksum, compile SDK 36, target SDK 36, build tools 36.0.0 y NDK 27.1.12297006. La base conserva React Native y Gradle de la plantilla; se fija el SDK estable 36 porque CI confirmó que el instalador oficial no ofrece `platforms;android-37`. Los requisitos de Play se revisarán de nuevo antes de publicar.

Paquete provisional: `com.carlossan1993.colores`. Debe quedar definido antes de publicar. Nombre provisional: **Colores**. Paquetes separados `.debug` y `.preview` evitan interferir con la futura versión de producción.

## Compilación y firma

- `debug`: herramientas de desarrollo y conexión a Metro, solo para desarrollo opcional.
- `preview`: comportamiento de release, JavaScript/Hermes incluido, sin depuración ni permisos de red; firma temporal de prueba del runner.
- `release`: permanece sin firma hasta configurar la clave de carga mediante GitHub Secrets. No hay publicación automática.

Se usa `preview` porque un APK debug normal depende de Metro y no satisface la prueba de apertura offline. CI comprueba la firma, el paquete, las bibliotecas ARM64, el bundle y los permisos del APK final, incluidos los que pudieran añadir dependencias. Solo se admite el permiso interno de receptores de AndroidX, protegido por la firma de la propia app y sin acceso a datos o red.

No hay claves de firma en el repositorio. Antes de las pruebas de conservación de progreso entre actualizaciones se habilitará una firma de pruebas estable en Secrets.

## Orientación y pantallas

`sensorLandscape` permite las dos posiciones horizontales. `getColoringLayout` recibe las dimensiones en dp después de descontar las zonas seguras. El panel lateral aloja doce colores en tres columnas y las acciones debajo. Los botones miden 48 dp en teléfono y 64 dp cuando hay al menos 960 × 560 dp disponibles.

Si el ancho disponible es inferior a 560 dp o la altura a 340 dp, la paleta pasa debajo del dibujo y admite desplazamiento horizontal; las acciones pasan a la cabecera. Por debajo de 520 dp de ancho, esa cabecera usa dos filas. La pantalla conserva el mismo reducer durante cambios de tamaño. Las etiquetas de accesibilidad describen colores, acciones y progreso; la selección se distingue con una marca además del borde.

`check-android-ui.py` instala el APK de Actions en Android 15 x86_64, activa modo avión y simula seis tamaños: dos teléfonos, dos tablets y dos ventanas pequeñas. Espera a que dimensiones y zonas seguras se estabilicen. Comprueba blancos de toque, acceso a los doce colores completos (deslizando cuando corresponde) y pintura/undo/redo en todos los tamaños; en teléfono comprueba también borrado y cancelación/confirmación del reinicio. Guarda XML, capturas y resultados. La confirmación del usuario en dispositivo real sigue siendo necesaria para cerrar cada etapa.

Con target 36 se declara la propiedad de compatibilidad de Android 16 para conservar orientación horizontal en pantallas grandes. Antes de elevar target a 37 debe revisarse el comportamiento adaptativo y no asumirse un bloqueo absoluto en todos los fabricantes o modos de ventana.

## Motor SVG de prueba

La UI abre directamente un dibujo original. `house_001.json` contiene la geometría que consume React Native; `check-drawing.cjs` comprueba IDs y cierre de regiones y mantiene sincronizada su exportación SVG. El renderer es genérico por definición de dibujo, sin coordenadas fijas en el motor.

El reducer puro guarda únicamente ID/color por región. Mantiene 50 instantáneas de undo/redo, ignora operaciones sin cambio e impide pintar regiones desconocidas. El reset es una acción reversible y la UI solicita confirmación. El blanco elimina el color asignado. Los contornos se dibujan con constantes y no forman parte del estado mutable.

La selección de color permanece en la UI. El indicador de completado cuenta únicamente las ocho regiones declaradas. Todavía no hay persistencia, catálogo ni celebración animada; esas etapas siguen en el roadmap.

## Referencias técnicas

- [Community CLI oficial](https://reactnative.dev/docs/getting-started-without-a-framework).
- [Empaquetado por variantes de React Native](https://reactnative.dev/docs/react-native-gradle-plugin).
- [Orientación en Android 16](https://developer.android.com/about/versions/16/behavior-changes-16).

- [Eventos táctiles de react-native-svg](https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md#touch-events).

## Navegación y estado de sesión (etapa 4)

`src/navigation/navigation.ts` define rutas tipadas y el retorno inicio/categorías/galería/coloreado. Anterior/siguiente obtiene únicamente dibujos accesibles de la categoría, sin saltar ni envolver límites. El catálogo y sus assets se incluyen estáticamente. La UI no depende de Internet ni de librerías nuevas de navegación.

`src/app/App.tsx` conserva sesiones por ID de dibujo mediante `sessionReducer`; cada motor valida sus propias regiones y conserva un historial independiente de 50 cambios. El color seleccionado vive en el nivel de app. `ColoringScreen` admite estado controlado para que desmontar una pantalla no borre el progreso. Android Back vuelve primero a galería, luego a categorías, luego a inicio; en inicio permite salir normalmente.

`DrawingPreview` reutiliza geometría sin eventos táctiles, con los colores de sesión en galería y ejemplos de color en categorías. Los indicadores se calculan con el mismo motor. Esto no es almacenamiento permanente; cerrar el proceso borra las sesiones hasta la etapa 5. La navegación se valida con cinco ejemplos antes de producir los 40 dibujos.

## Persistencia offline (etapa 5)

TurboModule `NativeProgressStorage` con Codegen y `ProgressStoragePackage` registrado en `MainApplication`. SharedPreferences privadas `colores_progress`; las copias snapshot/backup se escriben juntas con `commit()` en un ejecutor de un hilo. La promesa confirma disco, no solo memoria. No agrega librerías ni permisos.

`useProgress` bloquea navegación hasta restaurar, maneja preferencias y sesiones, y guarda snapshots tras cada cambio. `ProgressStore` ordena escrituras y conserva el estado pendiente tras un fallo. `snapshot.ts` define esquema 1, sanea IDs/colores y restaura colores con historial vacío. Deriva estados de la galería; no almacena imágenes ni flags de completado. Los dibujos no presentes en el catálogo se conservan; una versión de esquema distinta no se sobrescribe.

La copia recupera JSON corrupto; un error de lectura mantiene el almacenamiento original y permite reintentar. Un fallo de guardado mantiene la sesión visible y avisa antes de salir. Preferencia de sonido preparada para etapa 8, sin controles ni sonidos nuevos en esta etapa.

CI aísla los fixtures de tamaños borrando solo los datos del emulador, y prueba aparte cierre del proceso, restauración de dos dibujos, selección de color, reset/borrado persistentes y reinstalación in situ del mismo APK. No valida todavía actualizaciones firmadas entre versiones diferentes: requieren certificado estable en Secrets.

Referencia del módulo nativo: https://reactnative.dev/docs/turbo-native-modules-introduction
