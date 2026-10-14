# COLORIMBO — propuesta de identidad visual (etapa 10)

Estado: **nombre candidato principal**, pendiente de aprobar la identidad gráfica final. No cambiar todavía el nombre de la app, icono, identificador Android o firma mientras se elige dirección.

## Decisiones confirmadas por el responsable del proyecto

- Nombre candidato elegido para continuar: **Colorimbo**.
- Correo de contacto oficial aprobado para el proyecto: **colorimbo.app@gmail.com**.
- Se debe **comprobar por el responsable que el buzón está creado y recibe mensajes**, antes de publicarlo en la ficha de Play Console o en una política de privacidad.
- La cuenta de Play Console ya existe y se utilizará la misma cuenta de desarrollador que la de los otros proyectos. No se debe publicar su correo de acceso en el repositorio.
- Producto V1: app Android infantil horizontal de colorear por toque, offline, sin cuentas, anuncios ni compras; catálogo inicial de 40 dibujos.
- Frase descriptiva candidata (pendiente de aprobar): **Toca y colorea**.

## Tres conceptos a comparar

### A — Arco C: moderno, claro y alegre

- **Símbolo:** C gruesa redondeada formada por cuatro tramos de color, con aire suficiente para verse con tamaño de icono pequeño.
- **Wordmark:** Colorimbo en letras redondeadas y legibles, peso semibold o bold. Sin texturas, sombras fuertes ni gradientes complejos.
- **Paleta:** celeste `#62AFE2`, coral `#EF6B6B`, menta `#66BE96`, amarillo `#FFD54F`, crema `#FFF8EE`, texto oscuro `#303048`.
- **Ventaja:** síntesis visual sólida para launcher Android, Play Store, miniaturas y futuros productos.
- **Riesgo a evitar:** que se interprete como una app genérica de diseño, en lugar de coloreado infantil.

### B — Gota amiga: tierno y cercano

- **Símbolo:** una gota de pintura sencilla con sonrisa y ojos, estilo geométrico amable.
- **Wordmark:** Colorimbo redondeado, sencillo y sin exceso de detalles; personaje y letras deben poder separarse.
- **Paleta:** coral `#EF6B6B`, amarillo `#FFD54F`, menta `#66BE96`, azul `#62AFE2`, fondo marfil `#FFF8EE`.
- **Ventaja:** identificación fácil por parte de niños pequeños, potencial de mascota.
- **Riesgo a evitar:** parecer una app solo para bebés o introducir rasgos imposibles de distinguir a 48 px.

### C — Toque mágico: la mecánica en primer plano

- **Símbolo:** contorno de una figura simple que se rellena al tocarla, representado por un punto central y pequeñas formas de color. Sin pincel: la app **rellena regiones con un toque**.
- **Wordmark:** Colorimbo en tipografía redondeada de alto contraste, con un solo acento de color.
- **Paleta:** azul `#62AFE2`, violeta `#9C7BEA`, amarillo `#FFD54F`, coral `#EF6B6B`, blanco `#FFFFFF`.
- **Ventaja:** comunica de forma fiel el diferencial del producto.
- **Riesgo a evitar:** exceso de elementos y confusión con una aplicación de dibujo libre.

## Criterios de selección

1. Se entiende a tamaño de icono de teléfono y en Play Store (sin texto minúsculo).
2. No depende de una mascota compleja ni exige que el niño sepa leer.
3. Genera versiones de una tinta, color, fondo claro y fondo oscuro.
4. Identidad reutilizable en Play Store, splash y materiales sin distraer el área de coloreado.
5. Crear recursos finales originales, exportables en PNG y, cuando corresponda, vectoriales editables. Un mockup renderizado **no reemplaza** los assets de producción.

## No modificar todavía

- `applicationId` actual ni `applicationIdSuffix` preview: podría romper continuidad de datos y actualizaciones locales.
- Claves de firma de prueba o de publicación.
- Nombre visible provisional «COLORES» en Android o pantallas.
- Política de privacidad publicada: esperar dirección de identidad elegida y confirmar funcionamiento del correo.

## Siguientes acciones

1. Elegir una de las propuestas A/B/C (se pueden pedir iteraciones visuales).
2. Confirmar **Colorimbo** como marca final tras nueva comprobación razonable de disponibilidad en Google Play y bases marcarias relevantes; la búsqueda web preliminar no constituye clearance jurídico.
3. Verificar que `colorimbo.app@gmail.com` está creado y recibe correo.
4. Preparar PR específico de assets, textos, cambio de marca, y pruebas Android sin cambiar el paquete de preview sin plan de migración.
5. Publicar política de privacidad con dirección estable, completar Families/Data Safety y AAB de producción firmado.
