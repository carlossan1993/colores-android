"""Regression checks for system dialog recovery. No Android SDK required."""
import unittest
import xml.etree.ElementTree as ET

from android_ui_helpers import pixel_launcher_close_button


class LauncherAnrTests(unittest.TestCase):
    @staticmethod
    def root(text, title_package="android"):
        return ET.fromstring(
            '<hierarchy><node package="%s" text="%s" resource-id="android:id/alertTitle"/>'
            '<node package="android" text="Close app" resource-id="android:id/aerr_close"/>'
            '</hierarchy>' % (title_package, text.replace("&", "&amp;"))
        )

    def test_pixel_launcher_anr_is_recognized(self):
        self.assertEqual(
            pixel_launcher_close_button(
                self.root("Pixel Launcher isn't responding")
            ).attrib["resource-id"],
            "android:id/aerr_close",
        )

    def test_app_anr_is_not_hidden(self):
        self.assertIsNone(
            pixel_launcher_close_button(
                self.root("COLORES isn't responding")
            )
        )

    def test_app_control_cannot_trigger_system_recovery(self):
        self.assertIsNone(
            pixel_launcher_close_button(
                self.root("Pixel Launcher isn't responding", title_package="com.carlossan1993.colores.preview")
            )
        )

    def test_normal_screen_does_not_trigger_recovery(self):
        root = ET.fromstring('<hierarchy><node resource-id="settings-open" package="com.carlossan1993.colores.preview" /></hierarchy>')
        self.assertIsNone(pixel_launcher_close_button(root))


if __name__ == "__main__":
    unittest.main()
