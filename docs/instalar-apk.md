# Instalar el APK de prueba

1. Abre el PR o la pestaña **Actions** del repositorio y entra en una ejecución con resultado verde.
2. En **Artifacts**, descarga `colores-android-apk-N`. Debes estar conectado a GitHub para descargarlo.
3. Extrae el ZIP y lleva `colores-android-prueba.apk` a tu teléfono Android.
4. Abre el APK y, si Android lo pide, habilita temporalmente la instalación desde esa aplicación (navegador o gestor de archivos).
5. Abre **Colores · Prueba** en horizontal y pulsa Empezar.
6. Entra a las cuatro categorías y abre un dibujo desde su galería.
7. Prueba pintar, deshacer/rehacer, borrar con blanco y reiniciar con confirmación.
8. En Lugares, usa siguiente para pasar de Mi casita a Castillo y anterior para volver. Los colores e historial de cada dibujo deben mantenerse separados.
9. Vuelve a la galería: la miniatura debe reflejar los colores y mostrar En progreso o Terminado según corresponda. Prueba también Atrás de Android.
10. En una ventana pequeña, desliza la paleta inferior para alcanzar los doce colores.
11. Repite el recorrido en modo avión. Todavía no se guarda al cerrar el proceso; el guardado corresponde a la etapa 5.

La etapa 4 incluye cinco dibujos de muestra para validar navegación. El catálogo de 40 corresponde a la etapa 7.

## Compatibilidad de este artefacto

Android 7 o superior y procesador ARM64 o x86_64. Se incluye x86_64 para comprobar el mismo archivo en el emulador de Actions. La matriz de dispositivos y las arquitecturas de distribución se revisarán antes de publicar.

## Firma de prueba

El APK lleva una firma de desarrollo generada en el runner, sin claves en el repositorio. En esta etapa la firma puede cambiar entre ejecuciones. Si aparece “App no instalada” al reemplazar una prueba anterior, desinstala esa versión y vuelve a instalarla; en esta etapa el progreso solo vive durante la sesión y todavía no se guarda.

Antes de probar persistencia y actualizaciones se configurará una firma de pruebas estable mediante GitHub Secrets. La firma de producción y el AAB para Play se prepararán en la etapa de publicación. El paquete de prueba termina en `.preview` y no reemplaza la futura app publicada.

Los artefactos se conservan 7 días para limitar almacenamiento. Un nuevo PR o la ejecución manual en Actions vuelve a generarlos.
