"""Fail closed unless the exact approved original soundtrack is bundled."""
import hashlib
from pathlib import Path

AUDIO = Path("android/app/src/main/assets/colorimbo_music.mp3")
APPROVED_BYTES = 597056
APPROVED_SHA256 = "201f30745de622057c7f2834362882a4be8ba663a2164a8ecaece787c37ff796"


def verify_music(path: Path = AUDIO) -> None:
    if not path.is_file():
        raise SystemExit(
            "Falta la musica aprobada: " + str(path)
            + "\nSubir el archivo MP3 original al PR antes de integrar. "
            + "Consultar docs/musica-colorimbo.md"
        )
    content = path.read_bytes()
    if len(content) != APPROVED_BYTES:
        raise SystemExit(f"MP3 incorrecto: {len(content)} bytes (esperados {APPROVED_BYTES})")
    digest = hashlib.sha256(content).hexdigest()
    if digest != APPROVED_SHA256:
        raise SystemExit("El MP3 no coincide con la muestra musical aprobada (SHA-256)")
    if not (content.startswith(b"ID3") or content.startswith(b"\xff\xfb")):
        raise SystemExit("MP3 sin cabecera reconocida")
    print("OK: MP3 aprobado y exacto incluido offline (32.0 s, 597056 bytes).")


if __name__ == "__main__":
    verify_music()
