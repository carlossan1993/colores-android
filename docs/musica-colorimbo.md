# COLORIMBO — Música de fondo aprobada para V1

**Aprobación:** melodía original *Pequeñas aventuras*, instrumental alegre y juguetona,
32 segundos. Xilófono, campanitas y acompañamiento ligero. El responsable confirmó
expresamente que aprobaba la muestra MP3 antes de integrarla.

## Archivo maestro exacto (pendiente de cargar al PR)

- Ruta dentro del repositorio: `android/app/src/main/assets/colorimbo_music.mp3`
- Formato: MPEG Layer III, 44,1 kHz, estéreo.
- Longitud de archivo: **597056 bytes**.
- Duración reproducida: aproximadamente **32 segundos**.
- SHA-256: `201f30745de622057c7f2834362882a4be8ba663a2164a8ecaece787c37ff796`

**Obligatorio:** subir el MP3 recibido y aprobado, sin editarlo ni transcodificarlo.
`scripts/verify-background-music.py` exige exactamente el SHA-256 arriba.
Hasta incluirlo no se integra el PR ni se considera terminada la música.

## Cómo subir el MP3 sin desarrollo local

Desde el navegador, descargar la muestra aprobada del chat, renombrarla
`colorimbo_music.mp3` y entrar a la rama
`feat-colorimbo-background-music-030`, carpeta `android/app/src/main/assets/`.
Elegir **Add file → Upload files**, arrastrar el MP3 y hacer commit **a esa rama**,
no a `main`. No cargar enlaces de Spotify, música con derechos ajenos,
contraseñas ni archivos de firma.

## Reglas funcionales

- Un solo botón de sonido controla la música de fondo y el sonido corto de logro.
- La música empieza **solo tras restaurar preferencias**. Si se silencia,
  se detiene; no se modifica la selección de color, dibujos ni esquema de datos.
- El loop es continuo en `MediaPlayer.isLooping` mientras la actividad está
  en primer plano. El volumen nativo es 20% de amplitud (no modifica el volumen
  general del teléfono).
- Al cambiar entre Inicio, categorías, galerías, dibujos y Ajustes,
  **no se reinicia la música**. Al pasar la app a segundo plano se pausa;
  al volver se reanuda desde su posición; al cerrar se liberan recursos.
- Música local, sin Internet, anuncios, permisos adicionales, SDKs nuevos
  ni transferencia de información.
- Si Android no permite audio en el dispositivo, dibujar y guardar siguen
  disponibles.
- El APK preview permanece con el identificador y certificado estables.
  Versión **0.19.0** / `versionCode` 19.

## QA antes de Play

1. Instalar el APK firmado 0.19.0 **encima** del 0.18.0 sin desinstalar.
2. Verificar sonido suave al iniciar con preferencia activada, y la reproducción
   al navegar por categorías/dibujos, sin que suene otra instancia a la vez.
3. Silenciar en Ajustes y en la pantalla de dibujo. Reabrir Colorimbo:
   sigue silenciado. Los sonidos de logro también están silenciados.
4. Activar audio, enviar a Inicio/Recientes del teléfono: debe pausarse;
   volver a Colorimbo: reanudar. Cerrar Colorimbo: no debe seguir sonando.
5. Probar offline, en un Samsung horizontal, con auriculares y sin ellos.
6. Revisar al oído las transiciones del loop: los archivos MP3 pueden tener
   padding de codificación. No declarar imperceptible el reinicio sin
   escucharlo en un teléfono real.
7. Confirmar que los 40 dibujos, sus colores guardados y el progreso
   anterior se conservan.

La prueba automatizada comprueba presencia/hash exacto de la muestra y
controles de silencio. La escucha humana en un teléfono debe verificar el
loop, el volumen y la continuidad, porque la compilación no los garantiza.
