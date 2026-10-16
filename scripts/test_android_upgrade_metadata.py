"""Regression tests: 0.14 and 0.18 preview have different launcher classes."""
import os
import importlib.util
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

# Metadata parsing must be testable without downloading the Android SDK.
os.environ.setdefault("ANDROID_HOME", "/tmp/colorimbo-test-android-home")
# The actual CI script has a hyphen in its filename, so import by path.
spec = importlib.util.spec_from_file_location(
    "check_android_upgrade", Path(__file__).with_name("check-android-upgrade.py")
)
assert spec is not None and spec.loader is not None
upgrade = importlib.util.module_from_spec(spec)
spec.loader.exec_module(upgrade)
parse_badging, PACKAGE = upgrade.parse_badging, upgrade.PACKAGE


class ApkIdentityTests(unittest.TestCase):
    def test_legacy_preview_launches_original_native_activity(self):
        text = (
            "package: name='com.carlossan1993.colores.preview' versionCode='14' "
            "versionName='0.14.0-preview'\n"
            "launchable-activity: name='com.carlossan1993.colores.MainActivity' "
            "label='Colorimbo' icon=''\n"
        )
        self.assertEqual(
            parse_badging(text),
            (PACKAGE, 14, "com.carlossan1993.colores.MainActivity"),
        )

    def test_new_preview_launches_renamed_native_activity(self):
        text = (
            "package: name='com.carlossan1993.colores.preview' versionCode='18' "
            "versionName='0.18.0-preview'\n"
            "launchable-activity: name='com.colorimbo.app.MainActivity' "
            "label='Colorimbo' icon=''\n"
        )
        self.assertEqual(
            parse_badging(text),
            (PACKAGE, 18, "com.colorimbo.app.MainActivity"),
        )

    def test_reject_absent_launcher_instead_of_guessing(self):
        with self.assertRaisesRegex(AssertionError, "launcher activity"):
            parse_badging(
                "package: name='com.carlossan1993.colores.preview' versionCode='18'\n"
            )

    def test_reject_missing_package_version(self):
        with self.assertRaisesRegex(AssertionError, "package/version"):
            parse_badging(
                "launchable-activity: name='com.colorimbo.app.MainActivity'\n"
            )


class PaletteUpgradeCompatibilityTests(unittest.TestCase):
    @staticmethod
    def palette(*swatches):
        nodes = "".join(
            f'<node resource-id="com.carlossan1993.colores.preview:id/color-{color}"/>'
            for color in swatches
        )
        return ET.fromstring(f"<hierarchy>{nodes}</hierarchy>")

    def test_old_preview_uses_original_blue_and_red(self):
        root = self.palette("62AFE2", "EF6B6B")
        self.assertEqual(upgrade.available_color(root, "0A35F5", "62AFE2"), "color-62AFE2")
        self.assertEqual(upgrade.available_color(root, "F54536", "EF6B6B"), "color-EF6B6B")

    def test_current_preview_uses_approved_blue_and_red(self):
        root = self.palette("0A35F5", "F54536")
        self.assertEqual(upgrade.available_color(root, "0A35F5", "62AFE2"), "color-0A35F5")
        self.assertEqual(upgrade.available_color(root, "F54536", "EF6B6B"), "color-F54536")

    def test_missing_color_fails_instead_of_painting_another(self):
        with self.assertRaisesRegex(AssertionError, "No matching palette color"):
            upgrade.available_color(self.palette("66BE96"), "0A35F5", "62AFE2")


if __name__ == "__main__":
    unittest.main()
