"""Regression tests: 0.14 and 0.18 preview have different launcher classes."""
import os
import importlib.util
from pathlib import Path
import unittest

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


if __name__ == "__main__":
    unittest.main()
