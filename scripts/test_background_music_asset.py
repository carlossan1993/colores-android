"""Asset gate regression tests. They do not substitute for uploading the MP3."""
from pathlib import Path
import tempfile
import unittest

from verify_background_music import verify_music, APPROVED_BYTES


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
