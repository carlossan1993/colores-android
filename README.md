# Colores · Android

Aplicación Android infantil para colorear regiones SVG con un toque. React Native + TypeScript, actividad principal offline y desarrollo desde GitHub. Nombre provisional.

## Entregable actual: etapa 5 — guardado y restauración offline

Etapas 0–4 confirmadas en el teléfono e integradas. Inicio, cuatro categorías y cinco dibujos de muestra: Gatito, Manzana, Mi casita, Castillo y Auto. El catálogo de 40 dibujos corresponde a la etapa 7.

Los colores y el color seleccionado se guardan automáticamente en el teléfono. Al volver a abrir, las galerías y dibujos restauran el progreso sin Internet. El indicador **Guardado** confirma la escritura en disco; si falla, aparece Reintentar y se conservan los colores en pantalla. La app espera la restauración antes de permitir pintar. Se guardan regiones y preferencias, no imágenes ni historial de deshacer/rehacer: ese historial empieza vacío al reabrir.

Formato versionado con validación y copia de recuperación. No se agregaron permisos, dependencias, servidores o SDKs. Desinstalar o borrar los datos elimina el progreso; las futuras actualizaciones deberán conservar paquete y firma. La firma de prueba entre versiones sigue siendo temporal hasta configurar Secrets.

**[Cómo descargar e instalar el APK](docs/instalar-apk.md)**

En un PR, abre su comprobación **Android · Verificar y generar APK**, espera el resultado verde y descarga el ZIP de **Artifacts**. También puedes entrar desde [Actions](https://github.com/carlossan1993/colores-android/actions). Contiene `colores-android-prueba.apk`, instrucciones y checksum. GitHub exige sesión iniciada para descargar artefactos.

El APK `preview` incluye el código JavaScript y Hermes. No necesita Metro, Android Studio ni Internet para abrirse. Incluye ARM64 para teléfonos y x86_64 para verificar el mismo APK en el emulador, con Android 7 o superior. Lleva firma temporal de prueba; no es un paquete listo para Play Store.

## Flujo de trabajo online

1. Crear una rama y un PR con un cambio verificable.
2. GitHub Actions instala desde `package-lock.json`, verifica TypeScript, lint, pruebas, configuración base e IDs/geometría del SVG de prueba.
3. Compila Android y verifica firma, bundle incluido, bibliotecas nativas y permisos del APK final.
4. Ejecuta ese APK sin red en un emulador Android 15 con seis tamaños; comprueba botones, pintura y controles y conserva capturas en el artefacto `colores-android-ui-N`.
5. Descarga el APK y prueba el comportamiento necesario en el teléfono.
6. Integra el PR revisado y actualiza el estado de la etapa.

Actions también se ejecuta al integrar en `main`. La ejecución manual estará disponible cuando el workflow exista en la rama principal. Los artefactos se conservan 7 días. No hay publicación automática ni servicios de pago de compilación.

## Documentación

- [Guía rectora aprobada](docs/project-guide.md).
- [Ruta y estado](docs/roadmap.md).
- [Arquitectura](docs/architecture.md).
- [Estándar de dibujos SVG](docs/content-standard.md).
- [Checklist Play Store](docs/play-store-checklist.md).
- [Cambios](CHANGELOG.md).
- [Reglas de contribución](AGENTS.md).

## Controles técnicos

Los ejecuta GitHub Actions; el usuario no necesita instalar herramientas en su computadora.

```sh
npm ci
npm run verify
```

La compilación del APK de prueba en el runner es:

```sh
cd android
./gradlew :app:assemblePreview --no-daemon --max-workers=2 -PreactNativeArchitectures=arm64-v8a,x86_64
```

La variante `release` permanece sin firma. Las claves de prueba estables y de publicación se configurarán mediante GitHub Secrets cuando corresponda; nunca se guardan en el repositorio.

## Alcance aprobado

V1 sin cuentas, backend, publicidad, analítica ni compras. Todo el contenido necesario se incluirá en la aplicación. La abstracción de acceso diferencia gratuito/premium para incorporar Google Play Billing en una segunda versión, después de estabilizar y publicar V1.
