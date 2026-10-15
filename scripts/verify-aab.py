"""Validación estructural del Android App Bundle de preflight sin firma.

No certifica cumplimiento de Play Console. No usa ni publica claves privadas.
"""
from pathlib import Path
import sys
from struct import unpack_from
from zipfile import BadZipFile, ZipFile



# Android 15+ / Google Play: shared libraries on 64-bit devices need 16 KiB
# PT_LOAD alignment. This checks ELF alignment, NOT bundle zip alignment
# or runtime behavior on an actual 16 KiB-page device.
PAGE_16K = 16 * 1024
REQUIRED_64BIT_ABIS = ("arm64-v8a", "x86_64")


def check_elf_16kb(name: str, content: bytes) -> int:
    if len(content) < 64 or content[:4] != b"\x7fELF":
        raise SystemExit(f"ELF nativo inválido: {name}")
    if content[4] != 2 or content[5] not in (1, 2):
        raise SystemExit(f"ELF 64-bit inválido/no compatible: {name}")
    order = "<" if content[5] == 1 else ">"
    phoff = unpack_from(order + "Q", content, 32)[0]
    phentsize = unpack_from(order + "H", content, 54)[0]
    phnum = unpack_from(order + "H", content, 56)[0]
    if phentsize < 56 or phnum == 0 or phoff + phentsize * phnum > len(content):
        raise SystemExit(f"Cabeceras ELF inválidas: {name}")
    count = 0
    for i in range(phnum):
        pos = phoff + i * phentsize
        p_type = unpack_from(order + "I", content, pos)[0]
        if p_type != 1:  # PT_LOAD
            continue
        count += 1
        p_offset = unpack_from(order + "Q", content, pos + 8)[0]
        p_vaddr = unpack_from(order + "Q", content, pos + 16)[0]
        p_align = unpack_from(order + "Q", content, pos + 48)[0]
        if (p_align < PAGE_16K or (p_align & (p_align - 1))
                or p_offset % PAGE_16K != p_vaddr % PAGE_16K):
            raise SystemExit(
                f"Biblioteca nativa no compatible 16 KB: {name}, "
                f"segmento LOAD {i}, alineación {p_align} bytes. "
                "Actualizar dependencia/toolchain y compilar de nuevo."
            )
    if not count:
        raise SystemExit(f"ELF sin segmentos LOAD: {name}")
    return count


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
            elf_segments = 0
            elf_libraries = 0
            for name in sorted(members):
                if (name.endswith(".so") and any(
                    name.startswith(f"base/lib/{abi}/")
                    for abi in REQUIRED_64BIT_ABIS
                )):
                    elf_libraries += 1
                    elf_segments += check_elf_16kb(name, archive.read(name))
            if not elf_libraries:
                raise SystemExit("AAB sin bibliotecas 64-bit para revisar 16 KB")
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
                "Incluye BundleConfig, manifiesto, JavaScript y bibliotecas nativas.\n"
                f"ELF 16 KB: {elf_libraries} bibliotecas 64-bit; {elf_segments} segmentos LOAD OK.\n"
                "PENDIENTE: confirmar alineación ZIP del AAB con bundletool y probar 16 KB real."
            )
    except BadZipFile as error:
        raise SystemExit(f"AAB ilegible: {error}") from error


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python3 scripts/verify-aab.py ruta/app-release.aab")
    check_aab(Path(sys.argv[1]))
