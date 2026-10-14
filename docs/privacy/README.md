# Publicar gratis la política de privacidad de Colorimbo

Esta carpeta contiene `docs/privacy/index.html`, una página estática **sin cookies propias, scripts, rastreadores, anuncios ni formularios**. El nombre, lema y correo han sido aprobados.

## Habilitar GitHub Pages (una sola vez)

1. Abrir [Settings → Pages](https://github.com/carlossan1993/colores-android/settings/pages) del repositorio.
2. En **Build and deployment / Source**, seleccionar **Deploy from a branch**.
3. Elegir **main**, carpeta **/docs**, guardar.
4. Esperar al despliegue y abrir **https://carlossan1993.github.io/colores-android/privacy/** en una ventana privada.
5. Verificar que no aparece 404 y que figura **colorimbo.app@gmail.com**.
6. Solo entonces colocar la URL HTTPS definitiva en Google Play Console.

La cuenta de desarrollador puede exigir habilitar permisos o Pages manualmente. **No declarar la política publicada hasta comprobar que la URL responde.** Este procedimiento no requiere comprar un dominio ni hosting. Mantener la rama main como fuente única.

## Notas de compliance

- Verificar que las declaraciones Data Safety/Families de Play coinciden con el APK/AAB final.
- La política debe revisarse si se agregan anuncios, estadísticas, cuenta, compras, sincronización o SDKs con recopilación.
- No asociar el correo de acceso privado a Play Console con el correo público de soporte.
