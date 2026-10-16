# Checklist de publicación

Este archivo es un registro de pendientes, no una declaración de cumplimiento. Los requisitos externos se verificarán nuevamente en la etapa 10.

- [x] Colorimbo confirmado como nombre de marca; lema «Toca y colorea» y dirección A aprobados. Falta comprobar marca a nivel jurídico y confirmar grupo superior del público infantil.
- [x] Correo de contacto **colorimbo.app@gmail.com** aprobado, creado y operativo según confirmación del responsable.
- [ ] Verificar cuenta de Play Console y los requisitos vigentes de pruebas y registro.
- [ ] Completar comportamiento V1 y catálogo validado.
- [ ] Probar teléfonos/tablets, offline, cierre forzado, actualizaciones y accesibilidad.
- [ ] Revisar permisos y SDKs del binario final.
- [x] Incorporar lectura offline de la política de privacidad completa desde Ajustes (sin enlaces externos ni permisos nuevos).
- [ ] Habilitar GitHub Pages (`main` / `/docs`) y verificar URL HTTPS pública de la política; luego incluirla en Play Console.
- [ ] Completar Data Safety, público infantil/Families y clasificación IARC coherentes con la app.
- [x] Fuente: targetSdk 36 (requisito de nueva app desde 31-08-2026). Falta verificar compatibilidad de bibliotecas y paquete final.
- [ ] Revisar target SDK, compatibilidad de librerías nativas (incluido soporte 16 KB) y formato exigidos por Play.
- [x] Definido identificador de producción `com.colorimbo.app` y renombradas clases Android (PR #28). Preview existente conservado para actualizaciones.
- [ ] Verificar que `com.colorimbo.app` esté disponible al crear la app en Google Play Console; comprobar AAB/manifiesto final antes de subir.
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

Actualización entre versiones verificada en CI y confirmada en teléfono por el usuario: los dibujos se conservaron. El reporte [#18](https://github.com/carlossan1993/colores-android/issues/18) fue descartado y cerrado. Etapa 9 sigue abierta solo por las demás verificaciones físicas de la matriz (tablet, audio, accesibilidad y pruebas extensas).

Documentación oficial: [Requisitos de API](https://support.google.com/googleplay/android-developer/answer/11926878?hl=es-419) y [Política de Familias](https://support.google.com/googleplay/android-developer/answer/9893335?hl=es-us).

## Etapa 10 — privacidad dentro de la aplicación (PR 23)

- [x] Preparar texto completo de la política para consulta offline en Ajustes y prueba automatizada del control.
- [ ] Confirmar URL pública y contenido sincronizado con `docs/privacy-policy.md` y `docs/privacy/index.html` antes de publicar.
- [ ] Auditar manifiesto combinado del AAB final y completar declaraciones Data Safety/Families para la edad elegida.
