# Etapa 9 — Plan de hardening y control de calidad

La V1 de COLORES es una app **nativa Android horizontal y offline**, con 40 dibujos, 12 colores, sonidos opcionales, celebración, galería y guardado local. El cumplimiento de esta etapa no se declara por haber compilado un APK: requiere pruebas automáticas y pruebas reales.

## Evidencia automatizada ya existente

- GitHub Actions ejecuta TypeScript, ESLint, Jest, pipeline de 40 dibujos/361 regiones y comprobaciones de recursos SVG.
- El artefacto APK se verifica en cuanto a firma temporal de prueba, JavaScript integrado, arquitectura ARM64 y ausencia de permisos externos, incluidos los de red.
- El emulador comprueba seis tamaños de pantalla horizontal, galería, acceso a 12 colores con áreas completas de 48 dp, undo/redo/reset, audio silenciado, ajustes, celebraciones y Android Back.
- Las pruebas offline incluyen cierre forzado y reapertura, dos dibujos guardados separadamente, preferencia de sonido, color seleccionado, borrado y reinstalación del **mismo APK**.
- El PR 14 agrega pruebas de estrés lógico y serialización/restauración simultánea de los 40 dibujos. Se mantiene el límite de 256 KiB del módulo nativo de almacenamiento.

## Matriz obligatoria de validación manual

| Caso | Criterio de aprobación | Estado |
| --- | --- | --- |
| Teléfono Android | Pantalla horizontal, controles completos, dibujo sin bloqueos | Primer APK firmado 0.13.0 probado por el usuario; revisión extensa pendiente |
| Tablet Android (ideal 10 pulgadas) | Misma funcionalidad con controles cómodos | Pendiente |
| Sin Internet | Abrir, navegar, pintar y guardar en modo avión | Automatizado; confirmar manualmente |
| Progreso entre sesiones | Colorear varios dibujos, cerrar por completo y reabrir sin pérdidas | Automatizado; confirmar manualmente |
| Toques repetidos | Colorear rápidamente, deshacer, rehacer, borrar y continuar sin bloqueos | Prueba lógica automatizada; pendiente táctil |
| Regiones pequeñas y cercanas | Se colorea solo la región elegida, sin desbordamientos ni zonas inaccesibles | Pendiente inspección real de los 40 dibujos |
| Sonido opcional | El sonido breve suena al completar; silencio impide el sonido; preferencia persiste | Estado automatizado; audio físico pendiente |
| Interfaz y tamaño | Colores, botones, textos y privacidad accesibles en horizontal | Automatizado en seis perfiles; validar dispositivo |
| Reinstalación del mismo APK | Reinstalar sobre sí mismo sin pérdida de datos | Automatizado |
| Actualización entre dos versiones diferentes | Misma firma de instalación, versionCode creciente y progreso intacto | Primera versión estable 0.13.0 preparada; PR 16 prueba upgrade 0.14.0 en CI y teléfono |
| Rendimiento y cierre inesperado | Sin pantallas congeladas, bloqueos ni cierres durante uso continuado | Pendiente pruebas físicas |
| Accesibilidad infantil | 48 dp mínimo en controles, texto legible e interfaz coherente | Controles verificados en emulador; validar uso real |

## Bloqueador: actualización entre versiones

Los APK preview de GitHub Actions usan actualmente la firma de depuración del entorno de compilación. No se puede asumir que dos ejecuciones distintas utilicen el mismo certificado. **No desinstalar un APK con progreso guardado únicamente para probar otra versión.**

El PR 15 prepara un flujo manual de GitHub Actions con firma estable y verificación del certificado. **La clave ya está configurada y respaldada**, el usuario agregó ambos secretos en GitHub, y la compilación 0.13.0 verificó su certificado (run 38292552744). Seguir [firma-estable-preview.md](firma-estable-preview.md). Nunca subir ningún keystore ni contraseña al repositorio público. Con la clave nueva, un APK antiguo de firma temporal podría no ser actualizable sin desinstalar y perder progreso.

La firma de prueba no sustituye la clave de carga del AAB que se utilizará para Google Play con Play App Signing.

## Criterio de cierre

No dar por aprobada la etapa 9 hasta obtener evidencia manual de al menos un teléfono real y una tablet, verificar audio, revisar las zonas pequeñas, ejecutar actualización entre versiones distintas con firma estable y confirmar que no existen fallos bloqueadores. Registrar cualquier fallo con versión, dispositivo, reproducción y corrección en un PR aislado.

## Incidencia del emulador durante el PR 15

La ejecución #42 aprobó código y APK, pero el emulador mostró la ventana nativa `Pixel Launcher isn't responding` antes del botón Ajustes, interrumpió la navegación y terminó agotando el límite de tiempo del job durante el cierre. La app COLORES estaba visible detrás del aviso; no se confirmó un cierre de la app.

La prueba de interfaz ahora identifica y descarta únicamente esa ventana de Android **antes de cualquier control**, con un máximo de dos recuperaciones por acción, sin ocultar mensajes de error propios de COLORES. Las nuevas pruebas unitarias del helper distinguen ANR del launcher, ANR de la aplicación y pantallas normales.

## Actualización offline de 0.13.0 a 0.14.0

La versión candidata 0.14.0 incrementa `versionCode` de 13 a 14 sin cambiar ni el `applicationId` preview ni el esquema de datos. Tras integrar el PR 16, ejecutar el workflow de firma estable con entrada `baseline_run_id=38292552744` para recuperar el APK firmado 0.13.0 de la primera ejecución. La prueba opcional descarga ambos APK, comprueba igual firma, versión creciente y actualización mediante `adb install -r` en el emulador en modo avión; pinta dibujos y silencia antes de la actualización y verifica que persisten después. El baseline es un artefacto de Actions que caduca a los 7 días, por lo que la verificación debe completarse antes de su vencimiento.

**No desinstalar la versión 0.13.0 del teléfono.** Instalar el APK 0.14.0 firmado con la misma clave y comprobar que Android actualiza sin borrar los dibujos. Si Android indica conflicto de firma, detenerse y recopilar el error; no borrar los datos. Los APK normales de PR mantienen una firma temporal y **no sirven** para esta prueba de actualización.
