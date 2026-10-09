# Instalar el APK de prueba

1. Abre el PR o la pestaña **Actions** del repositorio y entra en una ejecución con resultado verde.
2. En **Artifacts**, descarga `colores-android-apk-N`. Debes estar conectado a GitHub para descargarlo.
3. Extrae el ZIP y lleva `colores-android-prueba.apk` a tu teléfono Android.
4. Abre el APK y, si Android lo pide, habilita temporalmente la instalación desde esa aplicación (navegador o gestor de archivos).
5. Abre **Colores · Prueba**, pulsa Empezar y entra a Lugares.
6. Pinta varias zonas de Mi casita y Castillo con colores diferentes. Espera el indicador **Guardado**.
7. Cierra la app desde las aplicaciones recientes y vuelve a abrirla en modo avión. Entra a los mismos dibujos: los colores, miniaturas, progreso y color seleccionado deben conservarse.
8. Reinicia uno de los dibujos con confirmación, espera Guardado, cierra y reabre: debe seguir vacío y el otro dibujo debe conservarse.
9. Prueba pintar, deshacer/rehacer y borrar con blanco. El historial se conserva al navegar durante la sesión, y empieza vacío al reabrir el proceso.
10. Si aparece un error al guardar, pulsa Reintentar antes de salir.

La etapa 5 guarda colores y preferencias localmente. Desinstalar o borrar datos de Android elimina los dibujos guardados. Si esta primera instalación no permite reemplazar la versión anterior por la firma temporal, desinstala la anterior; esa versión todavía no tenía persistencia. La firma estable para futuras actualizaciones se configurará en GitHub Secrets.

## Compatibilidad de este artefacto

Android 7 o superior y procesador ARM64 o x86_64. Se incluye x86_64 para comprobar el mismo archivo en el emulador de Actions. La matriz de dispositivos y las arquitecturas de distribución se revisarán antes de publicar.

## Firma de prueba

El APK lleva una firma de desarrollo generada en el runner, sin claves en el repositorio. En esta etapa la firma puede cambiar entre ejecuciones. Si aparece “App no instalada” al reemplazar una prueba anterior, desinstala esa versión y vuelve a instalarla; en esta etapa el progreso solo vive durante la sesión y todavía no se guarda.

Antes de probar persistencia y actualizaciones se configurará una firma de pruebas estable mediante GitHub Secrets. La firma de producción y el AAB para Play se prepararán en la etapa de publicación. El paquete de prueba termina en `.preview` y no reemplaza la futura app publicada.

Los artefactos se conservan 7 días para limitar almacenamiento. Un nuevo PR o la ejecución manual en Actions vuelve a generarlos.
