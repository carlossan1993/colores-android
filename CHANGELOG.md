# Changelog

## 0.14.0 — Validación de actualización firmada (PR 16)

- `versionCode` Android 14, versión visible 0.14.0; se mantiene el identificador preview y el esquema del progreso guardado.
- Prueba de actualización offline de un APK previamente firmado con la misma clave, con comparación de certificados y versiones antes de instalar.
- No se modifica el motor de coloreado ni se añaden permisos o conexión de red.
- La actualización real en teléfono, sin desinstalar, queda pendiente de confirmación del usuario.


## QA · Preparación de firma estable (PR 15)

- Flujo manual de APK preview con certificado persistente y secretos protegidos de GitHub.
- Comprobación del certificado SHA-256 de cada APK frente al almacén PKCS12 configurado.
- El pipeline normal de CI permanece igual con firma temporal; no se incorporan claves ni contraseñas al repositorio.
- Guía de custodia del almacén y advertencias sobre incompatibilidad de firmas con APK ya instalados.
- No cambia la versión ni el funcionamiento de la app; se requiere configuración manual segura para probar el flujo firmado.


## 0.13.0 — Ajustes y aviso interno de privacidad (en revisión)

- Pantalla nativa offline de Ajustes y privacidad desde Inicio, con regreso a través del botón y Android Back.
- Control del sonido compartido con el coloreado y su preferencia guardada sin cambiar el esquema.
- Aviso breve para familias sobre contenido offline, guardado local y ausencia de anuncios y compras en V1.
- Versión de la app visible; todavía falta política completa en URL pública y la revisión legal de Google Play.
- PR 12 integrado tras corregir espacio de paleta en horizontal y aprobar CI completa.


## 0.12.0 — Sonido opcional y control de silencio (en revisión)

- Tono nativo breve al completar por primera vez un dibujo, sujeto al volumen multimedia del teléfono.
- Botón de 48 dp para silenciar/reactivar el sonido, persistente entre sesiones.
- Se reutiliza la preferencia soundEnabled existente sin cambiar el esquema de datos; no se agregan permisos, descargas o bibliotecas.
- Pruebas nuevas de audio y preferencias, además de la matriz Android offline.
- PR 11 integrado con celebración visual tras corregir un bloqueo propio del emulador Pixel Launcher.


## 0.11.0 — Celebración visual (en revisión)

- Felicitación breve y no bloqueante al completar un dibujo con todas las regiones coloreadas.
- No se activa al abrir contenido completado anteriormente; se conserva el estado offline.
- Prueba de transición y de integración de UI; sin dependencias, anuncios o permisos nuevos.
- El catálogo inicial de 40 dibujos fue integrado con el PR 10 tras pasar CI y revisar capturas.


## 0.10.0 — Catálogo inicial de 40 dibujos (en revisión)

- 11 nuevas ilustraciones originales completan 10 dibujos por categoría: animales, frutas, lugares y vehículos.
- Total 40 dibujos y 361 regiones independientes de relleno offline, sin permisos nuevos ni cambios de persistencia.
- Pruebas automáticas reforzadas para exactamente 10 dibujos por categoría y toques reales en cuatro dibujos nuevos.
- La etapa 7 se cerrará solo tras validar CI, capturas y experiencia en dispositivo.


## 0.9.0 — Tercer lote de dibujos (en revisión)

- Ocho nuevos dibujos originales: Zorrito, Leoncito, Pera, Sandía, Biblioteca, Hospital, Autobús y Cohete.
- Catálogo ampliado a 29 dibujos y 249 regiones cerradas, todos gratuitos y offline.
- Pruebas de contenido, navegación y coloreado real ampliadas a un nuevo dibujo por categoría.
- PR 8 integrado tras validación de código, compilación, emulador y capturas.


## 0.8.0 — Segundo lote de dibujos (en revisión)

- Ocho dibujos nuevos: Tortuguita, Mariposa, Naranja, Piña, Faro, Parque, Trencito y Tractor.
- Catálogo de 21 dibujos y 169 regiones independientes, incluidos offline, sin cambiar el motor ni la persistencia.
- Pruebas ampliadas de navegación, geometría, colores y recorridos Android.
- Etapa 7 permanece en desarrollo hasta completar los 40 dibujos.

## 0.7.0 — Primer lote de dibujos (en revisión)

- Ocho dibujos nuevos originales: Perrito, Conejito, Banana, Fresa, Escuela, Granero, Barquito y Avión.
- Catálogo ampliado a 13 dibujos y 98 regiones coloreables, dividido entre cuatro categorías.
- Navegación y emulador ajustados para galerías más largas, sin cambios en el motor o la persistencia.
- PR 6 de pipeline aprobado por TypeScript, tests, APK y prueba de UI Android e integrado.

## 0.6.0 — Pipeline de contenido (en revisión)

- Registro único de metadata para cinco dibujos y generador de catálogo TypeScript y exports SVG.
- Validación de IDs, regiones cerradas, categorías, acceso free/premium y archivos desincronizados.
- Pruebas de errores de contenido y procedimiento de alta sin modificar el motor de pintura.
- PR 5 de persistencia offline integrado tras aprobación del APK por el usuario.

## 0.5.0 — Progreso offline (integrado)

- Guardado de colores por región y preferencias mediante almacenamiento privado Android.
- Restauración al reabrir sin Internet, recuperación y protección de versiones de esquema.
- Validación en Android y prueba del usuario completadas antes de integrar PR 5.

## 0.5.0 — Persistencia offline (sin publicar)

- Guardado automático de colores y selección de color en almacenamiento privado Android.
- Restauración al reabrir, miniaturas actualizadas y progreso separado por dibujo.
- Esquema 1, validación, copia de recuperación y protección ante datos de versiones desconocidas.
- Escrituras ordenadas fuera del hilo de UI, confirmación de disco y reintento de fallos.
- Cambio rápido de color seguido de toque usa la última selección, incluido blanco para borrar.
- Bloqueo de interacción durante la carga para no sobrescribir dibujos anteriores.
- Pruebas de reapertura, reset, errores y conservación al reinstalar el mismo APK.
- Historial undo/redo de sesión; sin imágenes ni datos remotos.
- Etapa 4 aprobada por el usuario y PR 4 integrado.

## 0.4.0 — Navegación y catálogo de muestra (sin publicar)

- Inicio visual, cuatro categorías y galerías con miniaturas SVG y estado de sesión.
- Cinco dibujos originales de muestra incluidos offline.
- Anterior/siguiente dentro de la categoría y retorno mediante UI o Atrás de Android.
- Colores e historial independientes por dibujo al navegar; color seleccionado compartido.
- Comprobación automática del recorrido y estado en seis tamaños Android.
- Cierre de etapa 3 tras confirmación del usuario e integración del PR 3.
- Sin persistencia entre sesiones (etapa 5), nuevas dependencias ni permisos.

## 0.3.0 — Pantalla adaptable (sin publicar)

- Más espacio para el dibujo con colores y controles en un panel lateral.
- Botones de 48 dp en teléfono y 64 dp en tablet, selección visible e iconos SVG.
- Paleta inferior desplazable y cabecera adaptable para ventanas pequeñas.
- Zonas seguras y cambios de tamaño conservando colores e historial.
- Pruebas de distribución e interacción al cambiar entre seis tamaños.
- Comprobación del APK offline en emulador Android, con capturas y pruebas de pintura, borrado, undo/redo y confirmación de reinicio.
- APK de prueba con ARM64 y x86_64 para probar el mismo archivo en dispositivo y emulador.
- Registro de aprobación e integración del motor SVG.

## 0.2.0 — Motor SVG (sin publicar)

- Dibujo original Mi casita con ocho regiones cerradas y contornos fijos.
- Paleta de doce colores, incluido blanco para borrar.
- Undo/redo con historial de 50 cambios y reinicio confirmado y reversible.
- Indicador de progreso y estado completo al pintar todas las zonas.
- Pruebas del motor y de la conexión entre SVG, paleta y controles.
- Geometría JSON incluida en la app y exportación SVG sincronizada y validada.
- Registro de aprobación e integración de la fundación Android.

## 0.1.0 — Fundación Android (sin publicar)

- Base React Native + TypeScript para Android, con orientación horizontal.
- Bienvenida y selección de color para validar instalación e interacción.
- Contrato de contenido y acceso gratuito preparado para separar premium en V2.
- Controles de TypeScript, lint, pruebas y configuración base.
- Workflow de GitHub Actions para generar y verificar un APK de prueba autónomo.
- Documentación rectora, ruta, arquitectura, estándar SVG y pendientes de Play.
