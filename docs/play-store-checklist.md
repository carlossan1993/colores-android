# Checklist de publicación

Este archivo es un registro de pendientes, no una declaración de cumplimiento. Los requisitos externos se verificarán nuevamente en la etapa 10.

- [ ] Definir nombre, paquete definitivo y edades del público objetivo.
- [ ] Verificar cuenta de Play Console y los requisitos vigentes de pruebas y registro.
- [ ] Completar comportamiento V1 y catálogo validado.
- [ ] Probar teléfonos/tablets, offline, cierre forzado, actualizaciones y accesibilidad.
- [ ] Revisar permisos y SDKs del binario final.
- [ ] Publicar política de privacidad e incluir acceso desde la app.
- [ ] Completar Data Safety, público infantil/Families y clasificación IARC coherentes con la app.
- [x] Fuente: targetSdk 36 (requisito de nueva app desde 31-08-2026). Falta verificar compatibilidad de bibliotecas y paquete final.
- [ ] Revisar target SDK, compatibilidad de librerías nativas (incluido soporte 16 KB) y formato exigidos por Play.
- [ ] Configurar clave de carga en Secrets y Google Play App Signing.
- [ ] Generar y probar AAB firmado desde Actions.
- [ ] Preparar icono definitivo, capturas y ficha de la tienda.
- [ ] Completar pruebas internas/cerradas aplicables y solicitar producción.
- [ ] Enviar a revisión, responder observaciones y confirmar publicación.

V1 no incluye compras ni anuncios. Google Play Billing, restauración y control parental se implementan únicamente en V2.

## Etapa 10 — AAB de preflight sin firma

- [ ] PR 19 debe aprobar workflow de `:app:bundleRelease` sin firma de publicación ni secretos.
- [ ] Verificar BundleConfig, manifiesto, DEX, JavaScript offline y bibliotecas ARM64/x86_64 dentro del AAB.
- [ ] El AAB de preflight **no se publica ni se sube a Google Play**. Play App Signing, clave de carga y AAB firmado son trabajos posteriores.
- [ ] Evaluar 16 KB, declaración de datos, política Familias y privacidad pública antes del envío.

Incidencia pendiente de QA: [#18](https://github.com/carlossan1993/colores-android/issues/18) — el usuario no vio colores anteriores conservados tras actualizar en su teléfono. El emulador aprobó la actualización, pero no sustituye la investigación ni la prueba física; etapa 9 permanece abierta.

Documentación oficial: [Requisitos de API](https://support.google.com/googleplay/android-developer/answer/11926878?hl=es-419) y [Política de Familias](https://support.google.com/googleplay/android-developer/answer/9893335?hl=es-us).
