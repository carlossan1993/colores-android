/**
 * Copia offline para lectura dentro de Ajustes.
 * Mantener sincronizada con docs/privacy-policy.md y docs/privacy/index.html.
 */
export const privacyPolicyUpdated = '14 de octubre de 2026';

export const privacyPolicySections = [
  {
    title: '1. Datos que trata Colorimbo',
    paragraphs: [
      'Colorimbo no solicita cuentas, nombres, contraseñas, fechas de nacimiento, direcciones, ubicación, fotografías ni números telefónicos. La aplicación no solicita permiso de Internet.',
      'Los colores aplicados a cada dibujo, la selección de paleta y la preferencia de sonido se guardan únicamente en el almacenamiento privado del dispositivo Android. El desarrollador no recibe estos datos ni los almacena en servidores propios.',
      'Esta versión no incorpora anuncios, compras, suscripciones, redes sociales, chats ni herramientas propias de análisis de comportamiento.',
    ],
  },
  {
    title: '2. Uso y conservación',
    paragraphs: [
      'El progreso local permite continuar dibujos y restaurar ajustes. Los datos se mantienen en el dispositivo hasta que se borren los datos de la aplicación o se desinstale, sujeto al funcionamiento de Android. El progreso puede perderse.',
      'No ofrecemos sincronización ni respaldo en la nube en esta versión.',
    ],
  },
  {
    title: '3. Niños y familias',
    paragraphs: [
      'Colorimbo está diseñada para uso infantil. No pide a los niños que revelen información personal, se registren o contacten a terceros. Un padre, madre o tutor puede dirigirse al correo de contacto.',
    ],
  },
  {
    title: '4. Mensajes de soporte voluntarios',
    paragraphs: [
      'Si un adulto escribe a colorimbo.app@gmail.com desde su correo, el desarrollador puede recibir su dirección, el mensaje y los archivos adjuntos que decida enviar. Se utilizan únicamente para atender la consulta y no forman parte del funcionamiento de la app infantil.',
      'El servicio de correo se presta mediante Gmail y está sujeto a sus políticas. Los mensajes se conservan mientras sean necesarios para resolver consultas y cumplir obligaciones aplicables. Puede solicitarse su eliminación por correo cuando corresponda.',
    ],
  },
  {
    title: '5. Terceros y distribución',
    paragraphs: [
      'Colorimbo no comparte dibujos ni preferencias a través de sus funciones. Google Play y Android pueden tratar datos para distribución, descarga, seguridad y sus propios servicios conforme a sus respectivas políticas.',
    ],
  },
  {
    title: '6. Permisos y conexión',
    paragraphs: [
      'Colorimbo no necesita ubicación, cámara, micrófono, contactos ni almacenamiento compartido para colorear. No utiliza identificadores publicitarios.',
    ],
  },
  {
    title: '7. Cambios de esta política',
    paragraphs: [
      'Si futuras versiones incorporan funciones que cambian el tratamiento de datos, como compras o sincronización, la política se actualizará antes de activarlas y se informará según corresponda.',
    ],
  },
  {
    title: '8. Consultas y solicitudes',
    paragraphs: [
      'Para privacidad, ejercicio de derechos aplicables y consultas sobre mensajes de soporte, un padre, madre o tutor puede escribir a colorimbo.app@gmail.com.',
      'Esta política describe la versión infantil gratuita y offline. Antes de publicar, se verificarán nuevamente las declaraciones de Seguridad de los datos y el AAB definitivo.',
    ],
  },
] as const;
