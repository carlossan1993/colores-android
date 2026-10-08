# Guía maestra del proyecto

Transcripción de la guía adjunta aprobada (V1.0, 7 de octubre de 2026). Conserva el alcance y las decisiones originales. Los avances se registran en `roadmap.md`, sin alterar esta línea base.

GUÍA MAESTRA DEL PROYECTO

App infantil de coloreado

Android · Offline · Relleno por zonas · Preparada para Google Play

> DOCUMENTO RECTOR — V1.0<br>Este documento define el alcance, arquitectura, etapas, criterios técnicos, cumplimiento de Google Play y reglas de desarrollo aprobadas para el proyecto. Debe utilizarse como fuente principal de referencia durante todo el desarrollo.

| Estado | Aprobado como línea base del proyecto |
| --- | --- |
| Fecha | 7 de octubre de 2026 |
| Plataforma objetivo | Android / Google Play Store |
| Modo de desarrollo | 100 % online en GitHub; sin entorno local obligatorio |
| Coste de desarrollo | Objetivo: USD 0 |
| Nombre de la app | Pendiente de definir |

## 1. Propósito y objetivo final

El proyecto consiste en desarrollar una aplicación Android infantil de coloreado cuya interacción central sea seleccionar un color y tocar una región cerrada del dibujo para rellenarla completamente. No será una página web, una PWA ni una aplicación de dibujo manual con pinceles.

El objetivo final no es únicamente producir un APK funcional: el producto deberá quedar preparado para ser publicado oficialmente en Google Play Store, cumplir las políticas aplicables a aplicaciones dirigidas a niños y admitir en una segunda etapa contenido premium mediante Google Play Billing.

> OBJETIVO DE ÉXITO<br>El proyecto se considera completado cuando exista una versión estable, instalable, funcional sin Internet, con contenido inicial suficiente, compilada como AAB para Google Play y preparada para superar el proceso de pruebas y revisión de Play Console.

## 2. Decisiones no negociables

| Tema | Decisión aprobada |
| --- | --- |
| Producto | Aplicación Android real. No web, no PWA. |
| Desarrollo | 100 % online; el usuario no dependerá de Android Studio ni de un entorno local. |
| Repositorio | GitHub será la fuente única de verdad. Se priorizará repositorio público para mantener GitHub Actions sin coste. |
| Infraestructura V1 | Sin backend, sin servidor, sin base de datos remota y sin cuentas de usuario. |
| Conectividad | La actividad principal debe funcionar 100 % offline. |
| Coste | Desarrollo e infraestructura V1 con objetivo USD 0. |
| Monetización V1 | No habrá anuncios, compras ni suscripciones. |
| Preparación V2 | La arquitectura incluirá desde el inicio conceptos de contenido free/premium y permisos de acceso. |
| Destino | Publicación en Google Play Store. |
| Público | Aplicación dirigida a niños; la edad exacta objetivo se definirá antes de configurar Play Console. |

> ÚNICA EXCEPCIÓN AL OBJETIVO “USD 0”<br>Google Play exige actualmente una cuota única de registro de USD 25 para crear una nueva cuenta de desarrollador. El desarrollo puede mantenerse sin coste, pero esta cuota es un coste externo de publicación si todavía no existe una cuenta válida de Play Console.

## 3. Definición del producto

### 3.1 Experiencia principal

1.  El niño entra a una categoría y elige un dibujo.

2.  Selecciona un color mediante una paleta grande y visual.

3.  Toca una parte del dibujo.

4.  La región completa cambia al color seleccionado de forma inmediata.

5.  Puede deshacer, rehacer, reiniciar o continuar con otro dibujo.

6.  El progreso queda guardado localmente y se restaura al volver a abrir la app.

Modelo mental de la interacción: elegir dibujo → elegir color → tocar zona → zona coloreada

### 3.2 Principios de diseño infantil

Uso principal en orientación horizontal (landscape).

El dibujo debe ocupar aproximadamente 70–80 % del área útil de la pantalla.

Botones grandes, separados y visualmente inequívocos.

Muy poco texto; ninguna acción esencial debe depender de saber leer.

Evitar gestos complejos, menús profundos y configuraciones innecesarias.

Acciones destructivas, como reiniciar, deben requerir confirmación.

Animaciones y sonidos serán breves, suaves y opcionales.

## 4. Alcance de la Versión 1 (MVP publicable)

### 4.1 Funciones incluidas

Pantalla de inicio.

Selección de categoría.

Galería de dibujos con miniaturas.

Pantalla de coloreado en horizontal.

Paleta de colores.

Relleno por regiones SVG.

Deshacer y rehacer.

Reiniciar dibujo con confirmación.

Guardado automático del progreso.

Restauración del progreso al abrir la app.

Navegación anterior/siguiente.

Estado del dibujo: sin empezar, en progreso, terminado.

Pequeña celebración visual al completar un dibujo.

Sonidos opcionales y control de silencio.

Pantalla de ajustes/legal con acceso a la política de privacidad.

Funcionamiento de la actividad principal sin conexión a Internet.

### 4.2 Contenido inicial

| Categoría | Cantidad inicial | Ejemplos |
| --- | --- | --- |
| Animales | 10 | León, perro, gato, elefante, jirafa… |
| Frutas | 10 | Manzana, banana, fresa, sandía… |
| Edificios / lugares | 10 | Casa, escuela, castillo, granja… |
| Vehículos | 10 | Auto, avión, barco, tren… |
| TOTAL | 40 | Catálogo inicial del MVP |

El número 40 es una meta de contenido para la primera versión, no un requisito para validar el motor. Durante las primeras etapas se utilizará un único dibujo de prueba para demostrar que el sistema de coloreado funciona correctamente antes de producir el catálogo completo.

### 4.3 Fuera de alcance de la V1

Cuentas de usuario o inicio de sesión.

Sincronización en la nube.

Chat o funciones sociales.

Publicidad.

Analítica de terceros no imprescindible.

Compras dentro de la aplicación.

Suscripciones.

IA generativa dentro de la app.

Pincel de dibujo libre.

Servidor propio o panel administrativo remoto.

## 5. Arquitectura tecnológica

### 5.1 Stack aprobado

| Capa | Tecnología / enfoque | Razón |
| --- | --- | --- |
| Aplicación | React Native | Entrega una app Android real y permite trabajar con una base TypeScript mantenible. |
| Lenguaje | TypeScript | Tipado, mantenimiento y validación temprana de errores. |
| Dibujos | SVG / react-native-svg | Cada región puede ser táctil y tener su propio color sin flood-fill de píxeles. |
| Persistencia | Almacenamiento local | Progreso y ajustes sin servidor ni conexión. |
| Automatización | GitHub Actions | Compilación, pruebas y artefactos Android desde la nube. |
| Distribución final | Android App Bundle (AAB) | Formato requerido para nuevas apps publicadas en Google Play. |

> ACLARACIÓN<br>React Native no convierte este proyecto en una web. El resultado será una aplicación Android compilada, con APK para pruebas y AAB para publicación en Google Play.

### 5.2 Diagrama lógico

> APP ANDROID<br>├── UI / navegación<br>│   ├── Inicio<br>│   ├── Categorías<br>│   ├── Galería<br>│   └── Coloreado<br>├── Motor de coloreado<br>│   ├── SVG interactivo<br>│   ├── selección de color<br>│   ├── undo / redo<br>│   └── detección de completado<br>├── Catálogo de contenido<br>│   ├── metadata<br>│   └── assets SVG<br>├── Persistencia local<br>│   ├── progreso<br>│   └── ajustes<br>└── Acceso / entitlements<br>    ├── free (V1)<br>    └── premium (preparado para V2)

## 6. Motor de coloreado

### 6.1 Decisión fundamental: regiones SVG, no relleno raster

El proyecto no implementará un “cubo de pintura” que analice píxeles como Paint. Cada dibujo será un SVG compuesto por regiones independientes y cerradas. Al tocar una región, la app cambia la propiedad de relleno de esa región.

> <Path<br>  id="mane"<br>  d="…"<br>  fill={colors.mane}<br>  stroke="#000000"<br>  onPress={() => paint("mane")}<br>/>

Ventajas:

No existe fuga de pintura por pequeñas aberturas del dibujo.

El rendimiento es predecible y adecuado para dispositivos modestos.

Guardar progreso requiere almacenar solamente IDs de región y colores.

Deshacer y rehacer es sencillo y determinista.

La misma lógica sirve para decenas o cientos de dibujos.

### 6.2 Estado de un dibujo

> {<br>  "drawingId": "lion_001",<br>  "regions": {<br>    "mane": "#F59E0B",<br>    "face": "#FACC15",<br>    "body": "#FACC15",<br>    "nose": "#E8798A"<br>  },<br>  "completed": false<br>}

### 6.3 Requisitos funcionales del motor

Cambio de color de una región por toque.

Regiones con área táctil suficiente.

Selección de color persistente mientras el niño pinta.

Undo y redo con historial acotado.

Reset completo del dibujo.

Restauración exacta del estado guardado.

Detección de “terminado” basada en las regiones definidas como coloreables.

Ningún cambio de color debe modificar el contorno negro del dibujo.

## 7. Estándar de dibujos y pipeline de contenido

### 7.1 Reglas visuales

Contorno negro claro y relativamente grueso.

Fondo blanco o transparente.

Formas grandes y comprensibles.

Pocas regiones pequeñas o difíciles de tocar.

Regiones cerradas y sin geometrías ambiguas.

Estilo coherente entre categorías.

Sin detalles innecesarios que conviertan la actividad en una prueba de precisión.

### 7.2 Metadata de catálogo

> {<br>  "id": "lion_001",<br>  "name": "León",<br>  "category": "animals",<br>  "access": "free",<br>  "productId": null,<br>  "asset": "animals/lion_001"<br>}

Los IDs deben ser estables. No se reutilizarán ni cambiarán una vez que una versión pública pueda haber guardado progreso con ellos.

### 7.3 Alta de un nuevo dibujo

1.  Crear o recibir el SVG conforme al estándar.

2.  Asignar un ID único al dibujo.

3.  Asignar IDs únicos a las regiones coloreables.

4.  Agregar metadata al catálogo.

5.  Generar o añadir miniatura.

6.  Ejecutar validación automática del asset.

7.  Probar toques, colores, undo/redo y restauración.

8.  Integrar mediante Pull Request.

## 8. Estructura de pantallas y navegación

| Pantalla | Función | Reglas clave |
| --- | --- | --- |
| Inicio | Entrada visual a la app | Acceso rápido a categorías; sin carga innecesaria. |
| Categorías | Animales, frutas, edificios/lugares, vehículos | Iconos grandes; navegación directa. |
| Galería | Mostrar dibujos de una categoría | Miniaturas grandes; indicador de progreso. |
| Coloreado | Actividad principal | Landscape; dibujo dominante; paleta visible; controles mínimos. |
| Ajustes / legal | Sonido, privacidad y versión | Accesible pero separado del flujo infantil principal. |

> +-----------------------------------------------------------+<br>\| < Animales              [UNDO] [REDO] [SOUND] [SETTINGS] \|<br>+--------------------------------------------+--------------+<br>\|                                            \|  o o o o     \|<br>\|                                            \|              \|<br>\|                  DIBUJO                    \|  o o o o     \|<br>\|                                            \|              \|<br>\|                                            \|  o o o o     \|<br>\|                                            \|              \|<br>+--------------------------------------------+--------------+<br>\|                 [<]      3 / 10      [>]                  \|<br>+-----------------------------------------------------------+

## 9. Funcionamiento offline y persistencia

La V1 no dependerá de Internet para iniciar, navegar por el catálogo, colorear, guardar ni restaurar progreso. Todos los assets necesarios estarán incluidos en la aplicación.

Guardar solo el estado de colores por región, no imágenes completas.

Guardar preferencias como sonido activado/desactivado.

Versionar el esquema de almacenamiento para permitir migraciones futuras.

Si un dibujo cambia estructuralmente, definir una estrategia explícita de compatibilidad de IDs.

La app debe arrancar correctamente en modo avión después de una instalación válida.

## 10. Preparación para monetización en la Versión 2

La V1 no tendrá compras, pero el código no debe asumir que todo el contenido es siempre gratuito. Se implementará una abstracción de acceso para evitar una reescritura posterior.

> Catálogo → EntitlementManager → ¿usuario tiene acceso?<br>                         ├── Sí → abrir dibujo<br>                         └── No → flujo premium (V2)

| Elemento | V1 | V2 |
| --- | --- | --- |
| access: free/premium | Existe en metadata | Controla disponibilidad real |
| productId | Campo opcional / nulo | ID de producto de Google Play Billing |
| EntitlementManager | Permite todo el contenido incluido | Consulta compras y restauración |
| Pantalla de compra | No existe | Se agrega detrás de control parental |
| Servidor de compras | No requerido en V1 | Evaluar según modelo y seguridad |

> REGLA PARA V2<br>Cualquier flujo de compra deberá quedar separado del área infantil mediante un control parental apropiado y deberá reevaluarse contra las políticas vigentes de Google Play Families en el momento de implementarlo.

## 11. Desarrollo 100 % online en GitHub

### 11.1 Repositorio como fuente única de verdad

Todo el código fuente, assets, configuración y documentación vivirán en GitHub.

Los cambios se realizarán mediante ramas y Pull Requests.

No habrá pasos críticos que solo existan en una computadora local.

Los APK/AAB se generarán mediante automatización en GitHub Actions.

Los secretos de firma nunca se almacenarán como archivos visibles en el repositorio.

Para sostener el objetivo de coste cero, se recomienda un repositorio público mientras sea aceptable exponer el código y los assets. GitHub documenta que el uso de runners estándar hospedados por GitHub es gratuito para repositorios públicos. Si más adelante se decide hacer el repositorio privado, deberá vigilarse el cupo de minutos y almacenamiento incluido en la cuenta.

### 11.2 Flujo de cambios

> Issue / tarea<br>   ↓<br>Rama de trabajo<br>   ↓<br>Pull Request<br>   ↓<br>CI automática<br>   ├── typecheck<br>   ├── lint<br>   ├── tests<br>   └── build Android<br>   ↓<br>Revisión visual / funcional<br>   ↓<br>Merge<br>   ↓<br>Main estable

## 12. Estructura de repositorio propuesta

> coloring-app/<br>├── android/<br>├── src/<br>│   ├── components/<br>│   ├── screens/<br>│   ├── navigation/<br>│   ├── coloring/<br>│   ├── catalog/<br>│   ├── storage/<br>│   ├── entitlements/<br>│   ├── types/<br>│   └── utils/<br>├── assets/<br>│   ├── drawings/<br>│   │   ├── animals/<br>│   │   ├── fruits/<br>│   │   ├── buildings/<br>│   │   └── vehicles/<br>│   ├── thumbnails/<br>│   └── sounds/<br>├── tests/<br>├── scripts/<br>│   └── validate-assets/<br>├── .github/<br>│   └── workflows/<br>├── docs/<br>├── package.json<br>└── README.md

## 13. Integración continua y generación de APK/AAB

### 13.1 Pipeline de Pull Request

1.  Instalar dependencias con versión bloqueada.

2.  Ejecutar TypeScript typecheck.

3.  Ejecutar lint.

4.  Ejecutar pruebas unitarias.

5.  Validar metadata y SVG del catálogo.

6.  Compilar Android debug o release de prueba.

7.  Publicar artefacto APK cuando corresponda.

### 13.2 Pipeline de release

1.  Se dispara manualmente o por tag de versión.

2.  Carga secretos de firma desde GitHub Secrets.

3.  Genera AAB firmado con clave de carga.

4.  Conserva AAB como artefacto de release.

5.  Genera APK de prueba si se desea para verificación final.

6.  No publica automáticamente a producción hasta que el proceso sea deliberadamente habilitado.

> FIRMA<br>La clave de carga es un activo crítico. Debe crearse y respaldarse de forma segura. Para Google Play se utilizará Play App Signing; las apps nuevas que usan AAB requieren esta configuración.

## 14. Estrategia de pruebas

### 14.1 Pruebas automáticas

Cambio de color de una región.

Undo / redo.

Reset.

Serialización y restauración de progreso.

Cálculo de dibujo terminado.

Acceso free/premium mediante EntitlementManager.

Validación de IDs duplicados.

Validación de metadata incompleta.

Build Android en CI.

### 14.2 Pruebas manuales

Teléfono Android en horizontal.

Tablet pequeña.

Tablet de 10 pulgadas o equivalente.

Modo avión.

Cierre forzado y reapertura.

Rotación/orientación bloqueada o controlada.

Toques repetidos rápidos.

Regiones pequeñas y cercanas.

Audio desactivado.

Reinicio de dibujo.

Actualización entre versiones sin perder progreso.

## 15. Privacidad y seguridad por diseño

La V1 se diseñará deliberadamente para minimizar la superficie de cumplimiento y proteger al público infantil: no requerirá cuenta, nombre, correo, ubicación, cámara, micrófono, contactos ni identificadores publicitarios.

No solicitar permisos que no sean estrictamente necesarios.

No declarar AD_ID en una app dirigida exclusivamente a niños.

No incorporar SDKs de publicidad en la V1.

Evitar SDKs de analítica de terceros salvo decisión posterior revisada específicamente para Families.

Mantener el progreso únicamente en el dispositivo.

Documentar cualquier futura incorporación de SDK antes de integrarla.

## 16. Ruta de cumplimiento para Google Play Store

> IMPORTANTE — REQUISITOS VIGENTES<br>Esta sección está verificada contra documentación oficial disponible al 7 de octubre de 2026. Google modifica políticas y requisitos de Play Console; antes del envío final se debe ejecutar una revisión de cumplimiento actualizada.

### 16.1 Requisitos técnicos de publicación

| Requisito | Decisión del proyecto |
| --- | --- |
| Target API | La app nueva deberá apuntar como mínimo a Android 16 / API 36 según el requisito vigente desde el 31 de agosto de 2026. |
| Formato | Publicación mediante Android App Bundle (.aab). |
| Firma | Configurar Play App Signing y conservar de forma segura la clave de carga. |
| Versionado | Mantener versionCode creciente y versionName legible. |
| Calidad | Compilación release sin errores, bloqueos ni permisos innecesarios. |

### 16.2 Políticas por tratarse de una app infantil

Declarar con precisión el público objetivo y las edades correspondientes en Play Console.

Cumplir la Política de Familias de Google Play.

Mantener todo el contenido accesible a niños apropiado para ese público.

No transmitir identificadores restringidos de niños ni usuarios de edad desconocida.

No solicitar ubicación precisa en una app dirigida exclusivamente a niños.

Revisar cualquier SDK externo contra los requisitos de Families antes de incorporarlo.

Completar correctamente el cuestionario de clasificación de contenido IARC.

### 16.3 Privacidad y Data Safety

Todas las apps deben completar la sección Data safety de Play Console, incluso si no recopilan datos.

Todas las apps deben proporcionar una política de privacidad pública y accesible desde Play Console y desde la propia app.

La política debe identificar a la app/desarrollador, explicar qué datos se recogen o no se recogen y definir retención/eliminación.

La política debe alojarse en una URL pública activa; puede usarse una página estática gratuita, por ejemplo GitHub Pages. Esta página será únicamente legal/compliance y no convierte el producto en una web app.

### 16.4 Cuenta de desarrollador y prueba cerrada

Si se crea una cuenta personal nueva de Play Console, la política vigente exige una prueba cerrada con al menos 12 testers que permanezcan inscritos de forma continua durante 14 días antes de solicitar acceso a producción. Esta etapa debe estar prevista en el cronograma final.

| Paso Play Console | Resultado esperado |
| --- | --- |
| Crear/verificar cuenta | Cuenta de desarrollador habilitada; pago de registro si aplica. |
| Crear ficha de aplicación | Nombre, idioma, categoría, contacto y declaraciones. |
| Completar contenido de la app | Público objetivo, Families, anuncios, acceso, etc. |
| Data Safety + privacidad | Declaraciones coherentes con el comportamiento real de la app. |
| Clasificación de contenido | Cuestionario IARC completado. |
| Prueba interna | APK/AAB distribuido a testers iniciales. |
| Prueba cerrada | Cumplir requisito aplicable a cuentas personales nuevas. |
| Solicitud de producción | Responder preguntas de preparación y pruebas. |
| Revisión Google Play | Corregir observaciones si existen. |
| Producción | Publicación pública. |

## 17. Hoja de ruta de ejecución

| Etapa | Objetivo | Criterio de salida |
| --- | --- | --- |
| 0. Preparación | Crear repositorio, reglas, documentación y CI mínima. | Repositorio operativo y flujo PR definido. |
| 1. Fundación Android | React Native + TypeScript + estructura base + landscape. | APK generado automáticamente desde GitHub y abre en Android. |
| 2. Motor SVG | Un dibujo de prueba interactivo, paleta, paint, undo/redo. | Tocar una región cambia únicamente esa región y el estado es estable. |
| 3. Pantalla de coloreado | Construir la UX horizontal definitiva. | Interfaz usable en teléfono y tablet. |
| 4. Navegación y catálogo | Inicio, categorías, galería y navegación. | Flujo completo desde inicio hasta dibujo. |
| 5. Persistencia offline | Guardar/restaurar progreso y ajustes. | Cerrar/reabrir mantiene el estado sin Internet. |
| 6. Pipeline de contenido | Metadata, validadores y alta simple de SVG. | Agregar dibujo no exige modificar lógica central. |
| 7. Catálogo inicial | Completar 40 dibujos aprobados. | 10 por categoría validados y probados. |
| 8. UX final | Sonidos, celebración, estados, detalles visuales. | Experiencia infantil coherente y sin fricción. |
| 9. Hardening / QA | Optimización, errores, dispositivos, offline, actualización. | Cero bloqueadores conocidos y checklist QA aprobado. |
| 10. Compliance Play | Privacidad, Data Safety, Families, API target, store assets. | Checklist Play completo y AAB release listo. |
| 11. Testing Play | Pruebas internas/cerradas según la cuenta. | Requisitos de producción satisfechos. |
| 12. Publicación | Enviar a producción y responder revisión. | App disponible públicamente en Google Play. |

## 18. Detalle de las primeras etapas críticas

### 18.1 Etapa 1 — Fundación Android

Crear el repositorio GitHub.

Inicializar el proyecto React Native + TypeScript.

Configurar el identificador de paquete provisional/definitivo.

Forzar o priorizar orientación horizontal.

Crear estructura de carpetas.

Configurar lint/typecheck/tests.

Crear workflow de GitHub Actions para compilar Android.

Generar un APK como artefacto descargable.

Instalar y abrir ese APK en un dispositivo real.

> NO SE AVANZA<br>No se inicia la construcción del catálogo ni de múltiples pantallas hasta que GitHub sea capaz de producir de forma repetible un APK instalable.

### 18.2 Etapa 2 — Prueba del corazón técnico

Usar un solo dibujo de prueba.

Dividirlo en regiones SVG identificables.

Mostrar paleta de colores.

Pintar por toque.

Implementar undo/redo.

Implementar reset.

Verificar rendimiento y precisión de toque.

> HITO TÉCNICO<br>Cuando un APK generado en GitHub permita seleccionar un color y tocar, por ejemplo, la melena del león para colorear únicamente esa región, el núcleo tecnológico del producto quedará validado.

## 19. Estrategia de Pull Requests

La secuencia exacta podrá variar, pero se trabajará con cambios pequeños, verificables y reversibles. Una propuesta inicial:

| PR | Contenido |
| --- | --- |
| PR 01 | Bootstrap del proyecto y estructura. |
| PR 02 | CI Android y artefacto APK. |
| PR 03 | Motor SVG mínimo. |
| PR 04 | Paleta + estado de color. |
| PR 05 | Undo / redo / reset. |
| PR 06 | Pantalla de coloreado responsive landscape. |
| PR 07 | Navegación y categorías. |
| PR 08 | Galería y catálogo. |
| PR 09 | Persistencia offline. |
| PR 10 | Validación de assets y metadata. |
| PR 11+ | Incorporación progresiva de contenido. |
| PR final QA | Hardening, compliance y release. |

## 20. Definición de “terminado” para la V1

☐ La aplicación es un binario Android real y no depende de una webview.

☐ La compilación se puede realizar desde GitHub sin una computadora de desarrollo local.

☐ El flujo principal funciona sin Internet.

☐ El catálogo inicial está integrado y validado.

☐ Colorear, deshacer, rehacer, reiniciar y guardar funcionan de forma estable.

☐ El progreso persiste entre sesiones.

☐ La interfaz funciona en distintos tamaños de teléfono/tablet en horizontal.

☐ No existen permisos o SDKs innecesarios.

☐ La política de privacidad está publicada y accesible desde la app.

☐ Data Safety y declaraciones de público infantil coinciden con el comportamiento real.

☐ La app apunta al nivel de API exigido por Google Play al momento del envío.

☐ Existe un AAB release firmado y probado.

☐ Se completó la fase de testing exigida por Play Console para la cuenta utilizada.

☐ No existen errores bloqueadores conocidos.

☐ La app está aprobada y publicada en Google Play Store.

## 21. Riesgos principales y mitigación

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Dibujos SVG mal construidos | Regiones difíciles de tocar o coloreado incorrecto | Estándar de assets + validador + revisión manual antes de integrar. |
| Catálogo crece y aumenta APK/AAB | Descarga más pesada | SVG liviano, optimización de assets y evaluar Play Asset Delivery si alguna vez fuese necesario. |
| Cambio de IDs de región | Pérdida de progreso guardado | IDs inmutables y migraciones explícitas. |
| Dependencia externa no apta para niños | Rechazo en Play Store / riesgo de privacidad | Lista mínima de dependencias y revisión de SDKs antes de cada incorporación. |
| Cambios de políticas de Google Play | Bloqueo de publicación | Revisión de compliance en etapa 10 y nuevamente justo antes del envío. |
| Repositorio público expone assets | Copia del contenido/código | Aceptar el riesgo durante V1 o migrar a privado si deja de ser conveniente y existe presupuesto/cupo suficiente. |
| Firma/clave perdida | Problemas de releases | Play App Signing + respaldo seguro de clave de carga. |
| Prueba cerrada no planificada | Retraso mínimo de varias semanas | Preparar testers antes de llegar a la etapa de publicación. |

## 22. Política de costes

| Concepto | V1 desarrollo | Observación |
| --- | --- | --- |
| GitHub repositorio público | USD 0 | Runners estándar de Actions gratuitos en repos públicos. |
| React Native / TypeScript | USD 0 | Open source. |
| SVG / motor | USD 0 | Tecnología local en la app. |
| Backend / hosting funcional | USD 0 | No se requiere. |
| Base de datos | USD 0 | No se requiere. |
| Compilación Android | USD 0 | GitHub Actions en repositorio público. |
| Política de privacidad | USD 0 | Puede alojarse como página estática gratuita. |
| Play Console | USD 25 una vez | Solo si no existe ya una cuenta de desarrollador válida. |
| Google Play Billing | No aplica en V1 | En V2 habrá comisiones/transacciones según las reglas vigentes. |

Por tanto, la regla operativa será: no gastar dinero durante el desarrollo; aceptar únicamente el coste obligatorio de distribución cuando llegue el momento de publicar, si la cuenta aún no existe.

## 23. Versionado, documentación y trazabilidad

README.md: cómo está organizado el proyecto y cómo se ejecuta CI.

docs/architecture.md: decisiones técnicas consolidadas.

docs/content-standard.md: reglas de SVG y alta de dibujos.

docs/play-store-checklist.md: checklist vivo de publicación.

CHANGELOG.md: cambios relevantes por versión.

SemVer o esquema equivalente para versionName; versionCode Android siempre creciente.

Issues y PRs deberán enlazar la etapa del roadmap a la que pertenecen.

## 24. Versión 2 y evolución posterior

Solo se inicia la monetización cuando la V1 sea estable y el flujo de publicación esté resuelto. La expansión prevista incluye:

Google Play Billing.

Paquetes de dibujos premium.

Opción “desbloquear todo”.

Restauración de compras.

Control parental antes de cualquier compra.

Más categorías: dinosaurios, océano, espacio, granja, estaciones, etc.

Posibles actividades educativas basadas en el mismo motor (“colorea de rojo”, reconocimiento de objetos, colores, animales).

La V2 deberá conservar el principio de privacidad por diseño y reevaluar las políticas de Families y pagos vigentes en ese momento.

## 25. Próximo paso autorizado

> SIGUIENTE ACCIÓN DEL PROYECTO<br>Comenzar la Etapa 0/1: crear el repositorio GitHub, establecer la estructura base, configurar React Native + TypeScript y conseguir que GitHub Actions genere un APK Android instalable. Ese será el primer entregable técnico verificable.

Una vez instalado y abierto ese APK, se avanzará al prototipo mínimo del motor SVG con un solo dibujo. No se producirán 40 dibujos antes de validar el núcleo técnico.

## Apéndice A. Fuentes oficiales de referencia

Fuentes consultadas para los requisitos externos incluidos en este documento. Deben revisarse nuevamente antes de la publicación porque Google y GitHub pueden modificar políticas, tarifas y requisitos técnicos.

Google Play Console — Primeros pasos y cuota de registro: https://support.google.com/googleplay/android-developer/answer/6112435

Google Play — Requisitos de nivel de API objetivo: https://support.google.com/googleplay/android-developer/answer/11926878

Google Play — Requisitos de pruebas para nuevas cuentas personales: https://support.google.com/googleplay/android-developer/answer/14151465

Google Play — Política de Familias: https://support.google.com/googleplay/android-developer/answer/9893335

Google Play — Política de datos de usuario / privacidad: https://support.google.com/googleplay/android-developer/answer/10144311

Google Play — Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469

Android Developers — Android App Bundle: https://developer.android.com/guide/app-bundle

Android Developers — App signing: https://developer.android.com/studio/publish/app-signing

GitHub Docs — Billing and usage for Actions: https://docs.github.com/en/actions/concepts/billing-and-usage

GitHub Docs — GitHub-hosted runners: https://docs.github.com/en/actions/reference/runners/github-hosted-runners

## Apéndice B. Registro de decisiones aprobadas

| ID | Decisión | Estado |
| --- | --- | --- |
| D-001 | El producto será una app Android, no una web. | Aprobado |
| D-002 | Desarrollo 100 % online usando GitHub. | Aprobado |
| D-003 | Objetivo de coste de desarrollo USD 0. | Aprobado |
| D-004 | Funcionamiento principal offline. | Aprobado |
| D-005 | Relleno por regiones SVG, no coloreado manual. | Aprobado |
| D-006 | Interfaz principal horizontal y simple. | Aprobado |
| D-007 | V1 sin pagos, pero arquitectura preparada para premium. | Aprobado |
| D-008 | Objetivo final: publicación en Google Play Store. | Aprobado |
| D-009 | Catálogo inicial objetivo de 40 dibujos / 4 categorías. | Aprobado |
| D-010 | Sin publicidad en V1. | Aprobado |

