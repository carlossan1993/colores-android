# Colorimbo · Android

Aplicación Android infantil para colorear regiones SVG con un toque. React Native + TypeScript, actividad principal offline y desarrollo desde GitHub. Marca Colorimbo · «Toca y colorea». Correo de soporte: colorimbo.app@gmail.com.

## Estado actual: etapa 10 — identidad Colorimbo y preparación de Google Play (0.15.0)

La app Android offline permite recorrer inicio, cuatro categorías y galerías, colorear los dibujos del catálogo, deshacer/rehacer y reiniciar con confirmación. Los colores se guardan y restauran en el dispositivo junto con la selección de paleta, sin cuentas, permisos nuevos ni Internet.

La etapa 6 incorporó un manifiesto de dibujos en assets/drawings/catalog.json y un generador de catálogo TypeScript/SVG. Así, añadir nuevos dibujos no requiere modificar el motor o la navegación; los datos y geometrías se validan automáticamente antes de compilar. La etapa 7 prepara el lote final de once dibujos: elefantito, pececito, buhito, uvas, cerezas, limón, estación de bomberos, tiendita, bicicleta, camioncito y helicóptero. El catálogo incluye 40 dibujos en cuatro categorías (diez por categoría), con 361 regiones coloreables.

Para agregar contenido: crear JSON de geometría, registrar metadata y ejecutar npm run content:generate. npm run verify y GitHub Actions comprueban que todo esté sincronizado. Consulta docs/content-standard.md.

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

### Etapa 8 (en revisión)

Se introduce una felicitación visual breve al terminar un dibujo por primera vez durante el coloreado. No bloquea toques y no se repite al abrir un dibujo ya completado. El sonido y su control de silencio se abordarán por separado.

### Sonido de celebración (PR 12, en revisión)

Al terminar un dibujo, COLORES puede reproducir un tono breve mediante el sistema Android. El botón de silencio permite desactivar el sonido en todo momento; su estado se guarda localmente junto con el color elegido, incluso tras reiniciar. No requiere Internet, permisos adicionales ni dependencias de audio externas.

### Ajustes y privacidad (PR 13, en revisión)

Desde Inicio se accede a una pantalla independiente con el control de sonido, una explicación breve sobre el tratamiento local de datos y la versión de la app. Disponible sin Internet. El aviso interno no sustituye la política de privacidad pública requerida para Google Play, que se completará en la etapa de cumplimiento.

### Etapa 9 — pruebas finales (en desarrollo)

Matriz de validación y bloqueo de firma estable: [docs/qa-stage9.md](docs/qa-stage9.md). Se incluyen pruebas de integridad al guardar y restaurar los 40 dibujos. La etapa no se cerrará hasta confirmar la experiencia en teléfono y tablet reales.

### Firma estable de APK de prueba (PR 15 integrado)

[Guía de firma estable](docs/firma-estable-preview.md). La compilación manual de Actions firma APK de preview con una clave privada custodiada en GitHub Secrets. La firma estable 0.13.0 fue verificada en GitHub y el usuario comprobó el primer APK en el dispositivo. Los PR seguirán utilizando APK con certificado temporal. **No desinstalar la versión actual sin confirmar el destino del progreso guardado.**

### Etapa 9 — verificar actualización a 0.14.0

Se incrementa `versionCode` de 13 a 14 (versión mostrada 0.14.0), conservando el paquete preview y el esquema de guardado. Después de integrar el PR 16, volver a lanzar el workflow **Android · APK de prueba con firma estable** con `baseline_run_id=38292552744`; la prueba adicional instalará 0.13.0, pintará sin Internet y actualizará a 0.14.0 verificando progreso y sonido. [Instrucciones](docs/qa-stage9.md). El APK generado en los PR ordinarios tiene otra firma y no debe usarse para actualizar el teléfono.
