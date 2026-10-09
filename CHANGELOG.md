# Changelog

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
