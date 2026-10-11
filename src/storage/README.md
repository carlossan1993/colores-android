# Progreso local

La app Android guarda un snapshot JSON pequeño en SharedPreferences privadas mediante un TurboModule tipado. No añade dependencias, permisos, imágenes, servidor ni conexión.

Esquema 1: `schemaVersion`, colores por ID de dibujo/región y preferencias (`selectedColor`, `soundEnabled`). El estado terminado se deriva de los colores. El historial undo/redo es de sesión y comienza vacío al reabrir.

La restauración termina antes de habilitar la navegación y la pintura. Las escrituras corren en orden, fuera del hilo de UI; cada promesa se resuelve después de `commit()` en disco. Se actualizan copia principal y recuperación en la misma operación. El indicador Guardado confirma esa escritura. Un fallo de guardado conserva la sesión y permite reintentar. Un fallo de lectura bloquea escrituras para no borrar el progreso anterior.

Un snapshot principal corrupto puede recuperarse desde la segunda copia. Las versiones de esquema desconocidas no se sobrescriben. Se filtran colores y regiones inválidos, y se conservan dibujos desconocidos para evitar borrarlos al abrir una versión con un catálogo más pequeño. Actualmente solo existe el esquema 1; una futura versión debe implementar su migración explícita antes de cambiarlo.

Desinstalar o borrar datos de Android elimina este almacenamiento. La conservación entre APK de versiones distintas exige usar el mismo paquete y certificado; la firma estable de pruebas queda pendiente de GitHub Secrets. CI comprueba force-stop/reapertura y reinstalación del mismo APK firmado, sin confundirla con una actualización entre releases.

Referencia técnica: https://reactnative.dev/docs/turbo-native-modules-introduction
