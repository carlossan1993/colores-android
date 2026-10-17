"""Pruebas de integridad de un AAB firmado sintético; no hacen signing real."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from zipfile import ZipFile

module_path = Path(__file__).with_name("verify-signed-aab.py")
spec = importlib.util.spec_from_file_location("verify_signed_aab", module_path)
assert spec and spec.loader
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


def create_aab(path: Path, signed=True, leak=False) -> None:
    with ZipFile(path, "w") as z:
        for filename in (
            "BundleConfig.pb",
            "base/manifest/AndroidManifest.xml",
            "base/assets/index.android.bundle",
            "base/dex/classes.dex",
            "base/lib/arm64-v8a/libtest.so",
            "base/lib/x86_64/libtest.so",
        ):
            z.writestr(filename, b"test")
        if signed:
            z.writestr("META-INF/UPLOAD.RSA", b"signature")
            z.writestr("META-INF/UPLOAD.SF", b"manifest")
        if leak:
            z.writestr("temp/private.p12", b"private")


class SignedAabTests(unittest.TestCase):
    def test_structural_signature(self):
        with tempfile.TemporaryDirectory() as d:
            aab = Path(d) / "valid.aab"
            create_aab(aab)
            checker.check_signed_aab(aab)

    def test_missing_signature_fails_closed(self):
        with tempfile.TemporaryDirectory() as d:
            aab = Path(d) / "unsigned.aab"
            create_aab(aab, signed=False)
            with self.assertRaisesRegex(SystemExit, "sin metadatos de firma"):
                checker.check_signed_aab(aab)

    def test_keystore_leak_fails_closed(self):
        with tempfile.TemporaryDirectory() as d:
            aab = Path(d) / "leak.aab"
            create_aab(aab, leak=True)
            with self.assertRaisesRegex(SystemExit, "potencialmente privado"):
                checker.check_signed_aab(aab)


if __name__ == "__main__":
    unittest.main()
