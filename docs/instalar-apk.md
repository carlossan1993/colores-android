# Instalar el primer APK

1. Abre el PR o la pestaña **Actions** del repositorio y entra en una ejecución con resultado verde.
2. En **Artifacts**, descarga `colores-android-apk-N`. Debes estar conectado a GitHub para descargarlo.
3. Extrae el ZIP y lleva `colores-android-prueba.apk` a tu teléfono Android.
4. Abre el APK y, si Android lo pide, habilita temporalmente la instalación desde esa aplicación (navegador o gestor de archivos).
5. Abre **Colores · Prueba**. Debe aparecer en horizontal con una pantalla de bienvenida.
6. Toca los colores y comprueba que cambia la muestra.
7. Activa modo avión, cierra la app y vuelve a abrirla. La pantalla y la paleta deben seguir funcionando.

Este APK de la etapa 0/1 es una prueba de instalación, apertura, orientación y empaquetado offline. Todavía no tiene dibujos, motor SVG ni guardado del progreso.

## Compatibilidad de este artefacto

Android 7 o superior y procesador ARM64. La automatización construye inicialmente una sola arquitectura para reducir tiempo y tamaño. La matriz de dispositivos y las arquitecturas de distribución se ampliarán antes de publicar.

## Firma de prueba

El APK lleva una firma de desarrollo generada en el runner, sin claves en el repositorio. En esta etapa la firma puede cambiar entre ejecuciones. Si aparece “App no instalada” al reemplazar una prueba anterior, desinstala esa versión y vuelve a instalarla; aún no existe progreso que conservar.

Antes de probar persistencia y actualizaciones se configurará una firma de pruebas estable mediante GitHub Secrets. La firma de producción y el AAB para Play se prepararán en la etapa de publicación. El paquete de prueba termina en `.preview` y no reemplaza la futura app publicada.

Los artefactos se conservan 7 días para limitar almacenamiento. Un nuevo PR o la ejecución manual en Actions vuelve a generarlos.
