# Colores · Android

Aplicación Android infantil para colorear regiones SVG con un toque. React Native + TypeScript, actividad principal offline y desarrollo desde GitHub. Nombre provisional.

## Entregable actual: etapa 2 — motor SVG

La fundación Android fue validada en el teléfono e integrada mediante el PR 1. La versión actual abre directamente **Mi casita**, un dibujo original de ocho regiones SVG, con doce colores, deshacer/rehacer, borrado con blanco y reinicio con confirmación. El contorno permanece fijo.

El historial admite 50 cambios. El progreso se mantiene durante la sesión; todavía no se guarda al cerrar. La pantalla definitiva se trabaja en la etapa 3 y la persistencia en la etapa 5.

**[Cómo descargar e instalar el APK](docs/instalar-apk.md)**

En un PR, abre su comprobación **Android · Verificar y generar APK**, espera el resultado verde y descarga el ZIP de **Artifacts**. También puedes entrar desde [Actions](https://github.com/carlossan1993/colores-android/actions). Contiene `colores-android-prueba.apk`, instrucciones y checksum. GitHub exige sesión iniciada para descargar artefactos.

El APK `preview` incluye el código JavaScript y Hermes. No necesita Metro, Android Studio ni Internet para abrirse. Esta primera compilación es ARM64 para Android 7 o superior. Lleva firma temporal de prueba; no es un paquete listo para Play Store.

## Flujo de trabajo online

1. Crear una rama y un PR con un cambio verificable.
2. GitHub Actions instala desde `package-lock.json`, verifica TypeScript, lint, pruebas, configuración base e IDs/geometría del SVG de prueba.
3. Compila Android y verifica firma, bundle incluido, bibliotecas nativas y permisos del APK final.
4. Descarga el APK y prueba el comportamiento necesario en el teléfono.
5. Integra el PR revisado y actualiza el estado de la etapa.

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
./gradlew :app:assemblePreview --no-daemon --max-workers=2 -PreactNativeArchitectures=arm64-v8a
```

La variante `release` permanece sin firma. Las claves de prueba estables y de publicación se configurarán mediante GitHub Secrets cuando corresponda; nunca se guardan en el repositorio.

## Alcance aprobado

V1 sin cuentas, backend, publicidad, analítica ni compras. Todo el contenido necesario se incluirá en la aplicación. La abstracción de acceso diferencia gratuito/premium para incorporar Google Play Billing en una segunda versión, después de estabilizar y publicar V1.
