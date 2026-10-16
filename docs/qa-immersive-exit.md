# QA · Pantalla inmersiva y salida confirmada (Colorimbo 0.17.0)

## Objetivo

Mantener la zona de dibujo a pantalla completa en teléfonos Android, ocultando tanto la barra superior como los controles de navegación del sistema, sin anular los gestos de salida y accesibilidad de Android.

**Implementación:** AndroidX `WindowInsetsControllerCompat` con `BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE` en la actividad principal. Se vuelve a aplicar cuando la ventana recupera el foco, también después de un diálogo. Android controla el comportamiento exacto según versión, fabricante y modo de navegación.

## Comprobaciones obligatorias en teléfono real

1. Abrir la app en horizontal, usando **navegación con tres botones**. Comprobar que la barra (Atrás/Inicio/Recientes) no ocupa permanentemente espacio a la derecha ni tapa la paleta.
2. Deslizar el dedo **desde el borde del sistema hacia adentro**. Verificar que los controles de Android aparecen temporalmente y luego vuelven a ocultarse sin interferir con un color.
3. Repetir con **navegación por gestos** si el teléfono lo permite. Comprobar que se puede regresar a Inicio del dispositivo y abrir Recientes. No es un quiosco infantil ni bloquea la salida por gestos del sistema.
4. Desde un dibujo, pulsar Atrás: debe volver a la galería. Repetir desde galería, categorías y Ajustes sin cuadros de confirmación adicionales.
5. **Solo desde Inicio de Colorimbo**, pulsar el botón/gesto Atrás: debe aparecer `¿Quieres salir de Colorimbo?` con `Seguir coloreando` y `Salir`.
6. Elegir `Seguir coloreando`: debe seguir abierta la app. Repetir y elegir `Salir`: debe cerrar/abandonar la actividad.
7. Reabrir la aplicación: las zonas ya guardadas, selección de color y sonido siguen guardadas.
8. Abrir/cerrar el cuadro de reinicio de dibujo y comprobar que la barra del sistema permanece inmersiva al recuperar foco.
9. Validar en al menos teléfono Samsung horizontal (como el de la captura) y tablet o emulador. Probar con teclado/servicios de accesibilidad si están disponibles.

## Límites explícitos

- **Inicio y Aplicaciones recientes son controles reservados a Android**, y sus gestos o botones pueden sacar al niño de la app **sin pasar por el diálogo**. Bloquear esas acciones requeriría un modo quiosco/administración del dispositivo, que no forma parte de esta app.
- El diálogo solo intercepta **Atrás desde Inicio de Colorimbo**, no las salidas por botones Inicio/Recientes ni el cierre forzado de Android.
- Se mantiene el paquete actual y la firma preview para conservar compatibilidad de actualización. El cambio posterior a `com.colorimbo.app` se ejecutará en otro PR.
- No se agregan permisos, bibliotecas de terceros, conexiones a Internet, rastreadores ni lógica que modifique los dibujos.

## Aviso del sistema en el primer uso

En una instalación o dispositivo nuevo, Android puede mostrar una vez el aviso
**“Viewing full screen” / “Got it”** para explicar cómo volver a mostrar las barras.
Es comportamiento normal del sistema, no una pantalla creada por Colorimbo.

En el emulador de GitHub Actions, el ensayo identifica específicamente
`android:id/immersive_cling_title` y `android:id/ok` pertenecientes al paquete
`android`, cierra el aviso y continúa las pruebas. Nunca cierra cuadros arbitrarios
de la app. No se han suprimido ni cambiado los avisos de seguridad para usuarios reales.

## Evidencia automatizada

La prueba Jest verifica diálogo, navegación previa y llamada a `BackHandler.exitApp` solo tras confirmar. GitHub Actions compila APK/AAB y realiza prueba de interfaz en emulador, incluida la **cancelación** del diálogo. La comprobación real del gesto de revelación de barras requiere revisión en dispositivo físico.

## Ajuste de distribución tras la prueba compacta (PR 27)

Al probar un emulador horizontal de 640 × 360 dp con modo inmersivo,
la cuarta fila del selector de colores resultó parcialmente recortada.
Se reubicó el control de sonido en la cabecera del dibujo cuando
la paleta usa barra lateral; en pantallas pequeñas con paleta inferior
el sonido conserva su lugar en los controles compactos. Esto libera
espacio vertical **sin reducir los botones de 48 dp** ni ocultar colores.

- [ ] Verificar 12 colores completamente visibles y accesibles en 640 × 360 dp.
- [ ] Verificar sonido en cabecera y controles deshacer/rehacer/reiniciar en lateral.
- [ ] Comprobar que no se alteran pintura, guardado y barra lateral en tablet.

