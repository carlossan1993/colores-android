"""Regression checks for system dialog recovery. No Android SDK required."""
import unittest
import xml.etree.ElementTree as ET

from android_ui_helpers import immersive_intro_ok_button, pixel_launcher_close_button


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


class ImmersiveIntroTests(unittest.TestCase):
    @staticmethod
    def root(title_package="android", button_package="android", title_id="android:id/immersive_cling_title"):
        return ET.fromstring(
            f'<hierarchy><node package="{title_package}" '
            f'resource-id="{title_id}" text="Viewing full screen" />'
            f'<node package="{button_package}" '
            'resource-id="android:id/ok" text="Got it" /></hierarchy>'
        )

    def test_android_first_use_fullscreen_tutorial_can_be_acknowledged(self):
        button = immersive_intro_ok_button(self.root())
        self.assertIsNotNone(button)
        self.assertEqual(button.attrib["resource-id"], "android:id/ok")

    def test_app_cannot_forge_system_tutorial(self):
        self.assertIsNone(immersive_intro_ok_button(self.root(title_package="com.colorimbo.app")))
        self.assertIsNone(immersive_intro_ok_button(self.root(button_package="com.colorimbo.app")))

    def test_generic_android_dialog_is_not_dismissed(self):
        self.assertIsNone(immersive_intro_ok_button(self.root(title_id="android:id/alertTitle")))



if __name__ == "__main__":
    unittest.main()
