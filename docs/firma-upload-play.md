# Colorimbo — clave de carga y AAB firmado para Google Play

**Estado:** procedimiento listo para revisión. La app **NO** está publicada ni el AAB de producción firmado. No ejecutar este flujo hasta confirmar el identificador de paquete y crear/respaldar la clave de carga.

## 1. Decisión irreversible antes del primer envío

El `applicationId` release actual y el paquete registrado en Play Console son `com.colorimbo.app`. Verificar esta coincidencia en el AAB final antes del primer envío; el identificador publicado no puede cambiarse en la misma ficha.

El APK de prueba tiene otro ID (`com.carlossan1993.colores.preview`) y una firma distinta, de modo que el AAB publicado no actualizará aquella instalación de pruebas. No desinstalar la app preview si tiene dibujos que interese conservar.

## 2. Crear la clave de carga (operación del propietario, exclusivamente online)

Usar GitHub Codespaces desde el navegador: `Code → Codespaces → Create codespace on main`, sujeto a los límites gratuitos de la cuenta. Nunca subir la clave a GitHub, al chat ni a un issue.

En la terminal de Codespaces:

```bash
umask 077
mkdir -p .local-secrets
keytool -genkeypair \
  -keystore .local-secrets/colorimbo-play-upload.p12 \
  -storetype PKCS12 \
  -alias colorimboupload \
  -keyalg RSA -keysize 3072 -validity 10000 \
  -dname "CN=Colorimbo Upload, O=Colorimbo, C=EC"
```

Elegir contraseña fuerte, única y privada. La clave PKCS12 utiliza la contraseña del almacén para la clave privada. Guardar **copia de seguridad del archivo .p12 y contraseña fuera del repositorio** (idealmente dos copias privadas). El certificado público puede compartirse, pero no el archivo .p12.

## 3. Crear exactamente dos secretos de repositorio

En `Settings → Secrets and variables → Actions → New repository secret`:

- `COLORIMBO_PLAY_UPLOAD_KEYSTORE_BASE64`: contenido completo del comando `base64 -w 0 .local-secrets/colorimbo-play-upload.p12` (solo pegarlo en GitHub Secrets).
- `COLORIMBO_PLAY_UPLOAD_KEYSTORE_PASSWORD`: contraseña privada del archivo.

Nunca introducirlos en commits, chats, capturas, notas públicas ni mensajes de Pull Request. Después de verificar que existen las copias de seguridad y ambos secretos, borrar el archivo del Codespace: `rm -f .local-secrets/colorimbo-play-upload.p12`. No borrar las copias privadas.

La firma `preview` utiliza secretos distintos. **No reutilizar su clave para Play.**

## 4. Generación de AAB desde GitHub

Después de integrar el PR y confirmar `applicationId`:

1. Ir a `Actions → Play · Generar AAB firmado (manual) → Run workflow → main`.
2. El flujo reconstruye la clave **solo en el directorio temporal del runner**, exige contraseña y alias `colorimboupload` y genera `app-release.aab` firmado.
3. Valida estructura, presencia de firma y `jarsigner -verify`.
4. Publica el artefacto privado de CI `colorimbo-play-aab-N`, que contiene:
   - `colorimbo-play-firmado.aab`: paquete firmado para cargar manualmente a Play.
   - `SHA256SUMS.txt`: integridad del paquete.
   - `CERTIFICADO-PUBLICO-PLAY.pem`: **certificado público**, no clave privada.
5. Los artefactos expiran a los siete días. El flujo **no inicia ninguna publicación** ni sube el archivo a Play Console.

Un AAB compilado correctamente **no basta** para declararlo publicable: verificar 16 KB (ELF, ZIP y ejecución), permisos/SDK del AAB final, Data Safety/Families, público objetivo, IARC, ficha, icono, capturas y QA.

## 5. Google Play App Signing

Al preparar la primera versión, elegir Play App Signing y, si es una aplicación nueva, permitir que Google gestione la clave de firma de distribución. El archivo .p12 anterior es la **clave de carga**, usada por GitHub para firmar lo que se sube a Play, y no tiene que compartirse con Google.

Si Play Console pide asociar un certificado de carga, utilizar `CERTIFICADO-PUBLICO-PLAY.pem`, no el .p12. Confirmar que coincida con el certificado registrado en Play Console. En caso de discrepancia, **detener el envío**.

Documentación oficial: https://developer.android.com/studio/publish/app-signing

## 6. Antes de subir

- [ ] Identificador release confirmado y no registrado previamente para otra app.
- [ ] Clave de carga creada y respaldada fuera de GitHub.
- [ ] Dos secretos de carga configurados sin compartir los valores.
- [ ] Flujo manual de AAB firmado ejecutado sin errores.
- [ ] Certificado público y AAB respaldados por el responsable.
- [ ] Compatibilidad de 16 KB terminada, no solo alineación ELF.
- [ ] Política de privacidad HTTPS publicada: https://carlossan1993.github.io/colores-android/privacy/
- [ ] Audiencia objetivo y adecuación del contenido infantil confirmadas.
- [ ] Data Safety, Familias e IARC verificados en Play Console.
- [ ] Icono, capturas reales y ficha de la tienda completos.
- [ ] QA funcional real y prueba de distribución cerrada/interna según requiera la cuenta.

**Regla:** la integración del código de firma no autoriza ejecutar el flujo con secretos reales ni enviar a Play Console sin revisión final.
