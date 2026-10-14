"""Validación estructural del Android App Bundle de preflight sin firma.

No certifica cumplimiento de Play Console. No usa ni publica claves privadas.
"""
from pathlib import Path
import sys
from zipfile import BadZipFile, ZipFile


def check_aab(path: Path) -> None:
    if not path.is_file():
        raise SystemExit(f"El AAB no existe: {path}")
    try:
        with ZipFile(path) as archive:
            members = {entry.filename: entry for entry in archive.infolist()}
            required = (
                "BundleConfig.pb",
                "base/manifest/AndroidManifest.xml",
                "base/assets/index.android.bundle",
            )
            missing = [
                name for name in required
                if name not in members or members[name].file_size == 0
            ]
            if missing:
                raise SystemExit("AAB incompleto: " + ", ".join(missing))
            dex = [
                name for name, item in members.items()
                if name.startswith("base/dex/classes")
                and name.endswith(".dex") and item.file_size > 0
            ]
            arch = {
                abi: any(
                    name.startswith(f"base/lib/{abi}/")
                    and name.endswith(".so") and item.file_size > 0
                    for name, item in members.items()
                )
                for abi in ("arm64-v8a", "x86_64")
            }
            if not dex or not all(arch.values()):
                raise SystemExit(
                    f"AAB sin DEX o bibliotecas nativas: dex={len(dex)}, ABIs={arch}"
                )
            signatures = [
                name for name in members
                if name.upper().startswith("META-INF/")
                and name.upper().endswith((".RSA", ".DSA", ".EC"))
            ]
            if signatures:
                raise SystemExit("El AAB de preflight no debe estar firmado")
            secrets = [
                name for name in members
                if name.lower().endswith((".jks", ".keystore", ".p12", ".pfx"))
            ]
            if secrets:
                raise SystemExit("Archivos privados dentro del AAB: " + str(secrets))
            print(
                "OK: App Bundle estructural sin firma, NO apto todavía para Play Console.\n"
                f"Archivo: {path.name}; bytes: {path.stat().st_size}; "
                f"DEX: {len(dex)}; ABIs: {', '.join(arch)}.\n"
                "Incluye BundleConfig, manifiesto, JavaScript y bibliotecas nativas."
            )
    except BadZipFile as error:
        raise SystemExit(f"AAB ilegible: {error}") from error


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python3 scripts/verify-aab.py ruta/app-release.aab")
    check_aab(Path(sys.argv[1]))
