"""Pruebas sintéticas: detectar segmentos ELF no alineados a 16 KB."""
import importlib.util
from pathlib import Path
from struct import pack_into
import unittest

module_path = Path(__file__).with_name("verify-aab.py")
spec = importlib.util.spec_from_file_location("verify_aab", module_path)
assert spec and spec.loader
verify_aab = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verify_aab)


def elf(align=16384, offset=0, vaddr=0):
    data = bytearray(256)
    data[:4] = b"\x7fELF"
    data[4:6] = bytes([2, 1])  # ELF64, little-endian
    pack_into("<Q", data, 32, 64)  # e_phoff
    pack_into("<H", data, 54, 56)  # e_phentsize
    pack_into("<H", data, 56, 1)   # e_phnum
    pack_into("<I", data, 64, 1)   # PT_LOAD
    pack_into("<Q", data, 72, offset)
    pack_into("<Q", data, 80, vaddr)
    pack_into("<Q", data, 112, align)
    return bytes(data)


class ElfPageAlignmentTests(unittest.TestCase):
    def test_aligned_16kb(self):
        self.assertEqual(
            verify_aab.check_elf_16kb("base/lib/arm64-v8a/test.so", elf()),
            1,
        )

    def test_rejects_4kb_alignment(self):
        with self.assertRaisesRegex(SystemExit, "no compatible 16 KB"):
            verify_aab.check_elf_16kb("old.so", elf(align=4096))

    def test_rejects_incongruent_offset(self):
        with self.assertRaisesRegex(SystemExit, "no compatible 16 KB"):
            verify_aab.check_elf_16kb("offset.so", elf(offset=4096))

    def test_rejects_invalid_binary(self):
        with self.assertRaisesRegex(SystemExit, "inválido"):
            verify_aab.check_elf_16kb("bad.so", b"not ELF")


if __name__ == "__main__":
    unittest.main()
