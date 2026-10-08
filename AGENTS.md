# Reglas del proyecto

La guía rectora está en `docs/project-guide.md`. El estado de ejecución está en `docs/roadmap.md`.

- Producto Android nativo React Native + TypeScript. No web, PWA ni WebView.
- GitHub es la fuente de verdad: ramas, PR, controles automáticos y APK generado por Actions. No exigir Android Studio al usuario.
- V1 offline, sin cuentas, backend, publicidad, analítica ni compras.
- Regiones SVG cerradas e IDs estables; no flood fill raster ni pincel libre.
- Validar un dibujo antes de producir los 40 del catálogo.
- Mantener la separación de UI, contenido, motor, persistencia y acceso free/premium.
- No incorporar permisos, SDKs externos o servicios de pago sin una razón aprobada.
- No versionar claves de firma ni secretos. Release permanece sin firma hasta configurar Secrets.
- Ejecutar `npm run verify` y comprobar el build de Actions al modificar código o configuración Android.
- No marcar una etapa como terminada hasta satisfacer su criterio de salida; instalación en un dispositivo real requiere confirmación del usuario.
