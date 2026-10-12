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
| Teléfono Android | Pantalla horizontal, controles completos, dibujo sin bloqueos | Pendiente en APK completo |
| Tablet Android (ideal 10 pulgadas) | Misma funcionalidad con controles cómodos | Pendiente |
| Sin Internet | Abrir, navegar, pintar y guardar en modo avión | Automatizado; confirmar manualmente |
| Progreso entre sesiones | Colorear varios dibujos, cerrar por completo y reabrir sin pérdidas | Automatizado; confirmar manualmente |
| Toques repetidos | Colorear rápidamente, deshacer, rehacer, borrar y continuar sin bloqueos | Prueba lógica automatizada; pendiente táctil |
| Regiones pequeñas y cercanas | Se colorea solo la región elegida, sin desbordamientos ni zonas inaccesibles | Pendiente inspección real de los 40 dibujos |
| Sonido opcional | El sonido breve suena al completar; silencio impide el sonido; preferencia persiste | Estado automatizado; audio físico pendiente |
| Interfaz y tamaño | Colores, botones, textos y privacidad accesibles en horizontal | Automatizado en seis perfiles; validar dispositivo |
| Reinstalación del mismo APK | Reinstalar sobre sí mismo sin pérdida de datos | Automatizado |
| Actualización entre dos versiones diferentes | Misma firma de instalación, versionCode creciente y progreso intacto | **Bloqueado: falta firma estable** |
| Rendimiento y cierre inesperado | Sin pantallas congeladas, bloqueos ni cierres durante uso continuado | Pendiente pruebas físicas |
| Accesibilidad infantil | 48 dp mínimo en controles, texto legible e interfaz coherente | Controles verificados en emulador; validar uso real |

## Bloqueador: actualización entre versiones

Los APK preview de GitHub Actions usan actualmente la firma de depuración del entorno de compilación. No se puede asumir que dos ejecuciones distintas utilicen el mismo certificado. **No desinstalar un APK con progreso guardado únicamente para probar otra versión.**

Para comprobar la actualización real sin pérdida de progreso hay que configurar una clave estable y respaldada, cargada mediante GitHub Secrets. Eso requiere una decisión explícita sobre la clave de prueba/release y un procedimiento seguro de custodia; no se debe subir ningún keystore ni contraseña al repositorio público.

La firma de prueba no sustituye la clave de carga del AAB que se utilizará para Google Play con Play App Signing.

## Criterio de cierre

No dar por aprobada la etapa 9 hasta obtener evidencia manual de al menos un teléfono real y una tablet, verificar audio, revisar las zonas pequeñas, ejecutar actualización entre versiones distintas con firma estable y confirmar que no existen fallos bloqueadores. Registrar cualquier fallo con versión, dispositivo, reproducción y corrección en un PR aislado.
