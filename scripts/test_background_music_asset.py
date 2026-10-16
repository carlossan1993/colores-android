"""Asset gate regression tests. They do not substitute for uploading the MP3."""
from pathlib import Path
import tempfile
import unittest
import importlib.util

# Import the actual hyphenated script by file path, not a guessed module name.
spec = importlib.util.spec_from_file_location(
    "verify_background_music", Path(__file__).with_name("verify-background-music.py")
)
assert spec is not None and spec.loader is not None
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)
verify_music, APPROVED_BYTES = validator.verify_music, validator.APPROVED_BYTES


class BackgroundMusicAssetTests(unittest.TestCase):
    def test_missing_asset_fails_closed(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaisesRegex(SystemExit, "Falta la musica aprobada"):
                verify_music(Path(d) / "missing.mp3")

    def test_wrong_size_fails(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "colorimbo_music.mp3"
            p.write_bytes(b"ID3bad")
            with self.assertRaisesRegex(SystemExit, "MP3 incorrecto"):
                verify_music(p)

    def test_matching_size_wrong_audio_fails(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "colorimbo_music.mp3"
            p.write_bytes(b"ID3" + bytes(APPROVED_BYTES - 3))
            with self.assertRaisesRegex(SystemExit, "no coincide"):
                verify_music(p)


if __name__ == "__main__":
    unittest.main()
