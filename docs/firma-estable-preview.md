# Firma estable del APK de pruebas — Etapa 9

COLORES ya genera APK desde GitHub Actions, pero el flujo ordinario usa certificados **temporales**, distintos de una ejecución a otra. El flujo manual **Android · APK de prueba con firma estable** utiliza siempre una clave privada almacenada de forma segura en GitHub Secrets. Su configuración **no se ha completado todavía**: requiere una operación personal del propietario del repositorio.

> No escribas contraseñas ni contenido de claves en chats, issues, pull requests, capturas, README o commits. No publiques un archivo `.p12`, `.jks` o `.keystore`. No subas la clave como artefacto de Actions.

## 1. Crear la clave exclusivamente en el entorno online

Se puede utilizar **GitHub Codespaces desde el navegador**, sujeto a la disponibilidad/cuota de la cuenta. No hace falta instalar Android Studio ni ejecutar el proyecto localmente.

Abre el repositorio GitHub, selecciona **Code → Codespaces → Create codespace on main**. En el terminal del Codespace crea un directorio ignorado para la clave:

```bash
umask 077
mkdir -p .local-secrets
keytool -genkeypair -v \
  -keystore .local-secrets/colores-preview.p12 \
  -storetype PKCS12 \
  -alias colorespreview \
  -keyalg RSA -keysize 3072 -validity 10000 \
  -dname "CN=COLORES Preview, OU=Pruebas, O=COLORES, C=EC"
```

El comando solicita una contraseña. Utiliza **una contraseña fuerte, única y privada**. El formato PKCS12 usa la misma contraseña para el almacén y su clave; el alias debe quedar exactamente como `colorespreview`.

**Antes de continuar, descarga `colores-preview.p12` desde el explorador de archivos de Codespaces y haz una copia privada respaldada.** Asegúrate de conservar tanto el archivo como su contraseña. Perder el archivo o contraseña impide firmar actualizaciones compatibles para las instalaciones ya distribuidas.

## 2. Registrar DOS secretos en GitHub

Ve al repositorio → **Settings → Secrets and variables → Actions → New repository secret**.

- `COLORES_PREVIEW_KEYSTORE_BASE64`: representación base64 completa del archivo `colores-preview.p12`, obtenida dentro del Codespace con `base64 -w 0 .local-secrets/colores-preview.p12`.
- `COLORES_PREVIEW_KEYSTORE_PASSWORD`: contraseña elegida en el paso 1.

Copia el base64 únicamente al campo **Secret** de GitHub. No pegues estos valores en el chat. No crees archivos de contraseñas dentro de Git. Cuando compruebes el respaldo y los dos secretos, elimina la clave del Codespace con `rm -f .local-secrets/colores-preview.p12`. La extensión `.p12` y `.local-secrets/` están ignoradas en Git.

## 3. Generar un APK estable desde GitHub

Una vez integrado el PR que incluye esta configuración en `main`, ve a **Actions → Android · APK de prueba con firma estable → Run workflow → main → Run workflow**.

GitHub validará ambos secretos, construirá la aplicación offline y comprobará que el certificado del APK coincide exactamente con la clave del almacén. El artefacto **colores-apk-firma-estable-N** contendrá solamente:
- `colores-android-prueba-firmada.apk`
- `SHA256SUMS.txt`
- `CERTIFICADO-SHA256.txt` (huella pública)
- `LEEME.md`

No se publicará el keystore, la contraseña ni archivos de firma. El flujo ordinario de PR conserva su firma de depuración sin cambios. La versión de la app y el `versionCode` corresponden al código de `main` al compilar.

## 4. Advertencia imprescindible sobre el progreso existente

La primera compilación firmada con la clave nueva **no necesariamente podrá reemplazar** la app de prueba ya instalada, porque el certificado anterior pudo ser diferente. Android no permite una actualización corriente entre certificados distintos.

**No desinstales el APK actualmente instalado si quieres conservar sus dibujos.** Antes de cambiar a la firma estable deberás decidir si preservamos la instalación actual o aceptas empezar desde cero. Una simple desinstalación borra los datos locales y la V1 aún no tiene exportación/importación.

Una vez instalada una **primera versión con esta firma estable**, las próximas versiones firmadas **con la misma clave, el mismo applicationId `com.carlossan1993.colores.preview` y un `versionCode` no inferior** podrán actualizarse en el mismo dispositivo conservando el almacenamiento privado de la aplicación (salvo errores de migración que se deben probar).

La firma de este APK es para pruebas, no sustituye la firma/upload key del AAB de Google Play. El paquete público futuro tiene otro `applicationId` y se instalará como app independiente.

## 5. Validaciones pendientes

- Probar una primera versión estable en teléfono físico y, si está disponible, tablet, verificando audio, modo avión y guardado.
- Generar posteriormente otra versión con `versionCode` superior usando **el mismo almacén**, instalar sin desinstalar y comprobar los mismos dibujos y el silencio persistente.
- Validar manualmente zonas pequeñas y accesibilidad en las cuatro categorías.

No considerar cerrada la etapa 9 hasta superar dichas pruebas.
