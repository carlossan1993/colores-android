"""Validación estructural de AAB firmado; la firma criptográfica se verifica con jarsigner."""
from pathlib import Path
import sys
from zipfile import ZipFile, BadZipFile


def check_signed_aab(path: Path) -> None:
    if not path.is_file():
        raise SystemExit(f"No existe el AAB firmado: {path}")
    try:
        with ZipFile(path) as z:
            names = set(z.namelist())
            required = ("BundleConfig.pb", "base/manifest/AndroidManifest.xml",
                        "base/assets/index.android.bundle")
            missing = [n for n in required if n not in names or not z.getinfo(n).file_size]
            if missing:
                raise SystemExit("Componentes AAB ausentes: " + ", ".join(missing))
            if not any(n.startswith("base/dex/classes") and n.endswith(".dex") for n in names):
                raise SystemExit("AAB sin clases DEX")
            for abi in ("arm64-v8a", "x86_64"):
                if not any(n.startswith(f"base/lib/{abi}/") and n.endswith(".so") for n in names):
                    raise SystemExit(f"AAB sin bibliotecas {abi}")
            signatures = [
                n for n in names
                if n.upper().startswith("META-INF/")
                and n.upper().endswith((".RSA", ".DSA", ".EC"))
            ]
            if not signatures or not any(
                n.upper().startswith("META-INF/") and n.upper().endswith(".SF")
                for n in names
            ):
                raise SystemExit("AAB sin metadatos de firma de carga JAR")
            private = [n for n in names if n.lower().endswith((".jks", ".keystore", ".p12", ".pfx"))]
            if private:
                raise SystemExit("AAB contiene archivo potencialmente privado: " + str(private))
        print("OK: AAB con estructura y firma de carga presentes.")
        print("Verificar criptográficamente con jarsigner y confirmar Play App Signing antes del envío.")
    except BadZipFile as exc:
        raise SystemExit(f"AAB ZIP inválido: {exc}") from exc


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python3 scripts/verify-signed-aab.py archivo.aab")
    check_signed_aab(Path(sys.argv[1]))
