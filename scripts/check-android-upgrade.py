"""CI: actualiza un APK estable sin desinstalar ni perder dibujos offline."""
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET

from android_ui_helpers import pixel_launcher_close_button

PACKAGE = "com.carlossan1993.colores.preview"
ACTIVITY = None  # Set from the installed APK manifest for each test phase.
OUTPUT = Path("upgrade-artifacts")
OUTPUT.mkdir(exist_ok=True)
TOOLS = Path(os.environ["ANDROID_HOME"]) / "build-tools" / "36.0.0"


def command(*args):
    return subprocess.check_output([str(a) for a in args], text=True, timeout=65).strip()


def adb(*args):
    return command("adb", *args)


def shell(*args):
    return adb("shell", *args)


def parse_badging(badging):
    """Read the package, version and actual launcher activity from each APK."""
    package = re.search(r"^package:\s+name='([^']+)'\s+versionCode='(\d+)'", badging, re.M)
    launcher = re.search(r"^launchable-activity:\s+name='([^']+)'", badging, re.M)
    assert package is not None, "APK metadata missing package/version"
    assert launcher is not None, "APK metadata missing launcher activity"
    activity = launcher.group(1)
    assert activity and " " not in activity, "Invalid launcher activity"
    return package.group(1), int(package.group(2)), activity


def apk_info(path):
    badging = command(TOOLS / "aapt2", "dump", "badging", path)
    package, version, activity = parse_badging(badging)
    command(TOOLS / "apksigner", "verify", "--verbose", path)
    cert = command(TOOLS / "apksigner", "verify", "--print-certs", path)
    s = re.search(r"Signer #1 certificate SHA-256 digest: ([0-9a-fA-F]+)", cert)
    assert s is not None, f"Missing signer: {path}"
    return package, version, s.group(1).lower(), activity


def snapshot(label):
    for attempt in range(3):
        try:
            shell("uiautomator", "dump", "/sdcard/colores-upgrade.xml")
            raw = subprocess.check_output(["adb", "exec-out", "cat", "/sdcard/colores-upgrade.xml"], timeout=60)
            (OUTPUT / f"{label}.xml").write_bytes(raw)
            return ET.fromstring(raw)
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired, ET.ParseError):
            if attempt == 2:
                raise
            time.sleep(0.5)
    raise AssertionError("UI snapshot unavailable")


def find(root, test_id):
    for node in root.iter("node"):
        if node.attrib.get("resource-id", "").split("/")[-1] == test_id:
            return node
    raise AssertionError(f"Missing control {test_id}")


def bounds(node):
    return tuple(map(int, re.findall(r"\d+", node.attrib["bounds"])))


def tap(node):
    a, b, c, d = bounds(node)
    shell("input", "tap", (a + c) // 2, (b + d) // 2)


def has(root, test_id):
    return any(
        node.attrib.get("resource-id", "").split("/")[-1] == test_id
        for node in root.iter("node")
    )


def press(test_id, next_test_id=None, scroll=False):
    """Tap a UI control; on navigation require the destination to be visible.

    A cold emulator sometimes accepts an accessibility tap but never fires
    the first React Native navigation event. Recheck the destination and
    retry on the *same* screen instead of assuming the tap worked.
    """
    recovered = 0
    for attempt in range(12):
        root = snapshot(f"press-{test_id}-{attempt}")
        popup = pixel_launcher_close_button(root)
        if popup is not None:
            assert recovered < 2, "System launcher repeatedly not responding"
            tap(popup)
            recovered += 1
            time.sleep(0.6)
            shell("am", "start", "-W", "-n", ACTIVITY)
            continue
        if next_test_id is not None and has(root, next_test_id):
            return
        if has(root, test_id):
            tap(find(root, test_id))
            time.sleep(0.65 if next_test_id is not None else 0.25)
            if next_test_id is None:
                return
            if has(snapshot(f"after-{test_id}-{attempt}"), next_test_id):
                return
            print(f"Navigation {test_id} did not reach {next_test_id}; retry {attempt + 1}", flush=True)
            continue
        if scroll and (has(root, "screen-categories") or has(root, "screen-gallery")):
            size = shell("wm", "size").splitlines()[-1]
            a, b = map(int, re.findall(r"(\d+)x(\d+)", size)[0])
            w, h = max(a, b), min(a, b)
            shell("input", "swipe", w // 2, h * 4 // 5, w // 2, h // 3, 400)
        else:
            time.sleep(0.35)
    raise AssertionError(
        f"Navigation/control {test_id} did not reach {next_test_id or 'tap'}"
    )


def progress(expected, label):
    for _ in range(6):
        root = snapshot(label)
        got = find(root, "drawing-progress").attrib.get("text")
        if got == f"{expected} / 8":
            return root
        time.sleep(0.35)
    raise AssertionError(f"{label}: expected {expected}/8, got {got!r}")


def saved(label):
    for _ in range(8):
        root = snapshot(label)
        if find(root, "storage-status").attrib.get("text") == "Guardado":
            return
        time.sleep(0.25)
    raise AssertionError(f"{label}: data not saved")


def paint(x, y, label):
    root = snapshot(f"{label}-before")
    a, b, c, d = bounds(find(root, "drawing-canvas"))
    width, height = c - a - 4, d - b - 4
    scale = min(width / 640, height / 300)
    shell("input", "tap", round(a + 2 + (width - 640 * scale) / 2 + x * scale),
          round(b + 2 + (height - 300 * scale) / 2 + y * scale))
    saved(label)


def open_house():
    press("start-coloring", next_test_id="screen-categories")
    press("category-places", next_test_id="screen-gallery", scroll=True)
    press("drawing-house_001", next_test_id="drawing-progress", scroll=True)


def capture(label):
    (OUTPUT / f"{label}.png").write_bytes(
        subprocess.check_output(["adb", "exec-out", "screencap", "-p"], timeout=60))


def test_upgrade(old_apk, new_apk):
    global ACTIVITY
    old, new = apk_info(old_apk), apk_info(new_apk)
    assert old[0] == new[0] == PACKAGE, "Package identifiers differ"
    assert old[2] == new[2], "Certificates differ: upgrade would erase app data"
    assert new[1] > old[1], "versionCode did not increase"
    print(f"Same signer, versionCode {old[1]} -> {new[1]}.", flush=True)
    print(f"Launcher activities: {old[3]} -> {new[3]}.", flush=True)

    ACTIVITY = f"{PACKAGE}/{old[3]}"
    adb("install", old_apk)
    shell("pm", "clear", PACKAGE)  # Isolate the freshly installed baseline only.
    shell("settings", "put", "system", "accelerometer_rotation", 0)
    shell("settings", "put", "system", "user_rotation", 1)
    shell("wm", "size", "360x640")
    shell("wm", "density", 160)
    shell("cmd", "connectivity", "airplane-mode", "enable")
    shell("svc", "wifi", "disable")
    shell("svc", "data", "disable")
    assert shell("settings", "get", "global", "airplane_mode_on") == "1"
    shell("am", "start", "-W", "-n", ACTIVITY)
    open_house()
    root = progress(0, "baseline-empty")
    assert find(root, "sound-toggle").attrib.get("checked") == "true"
    press("sound-toggle")
    assert find(snapshot("baseline-muted"), "sound-toggle").attrib.get("checked") == "false"
    press("color-66BE96")
    paint(270, 75, "baseline-house-roof")
    press("color-62AFE2")
    paint(160, 250, "baseline-house-wall")
    progress(2, "baseline-house")
    press("drawing-next")
    press("color-EF6B6B")
    paint(320, 40, "baseline-castle")
    progress(1, "baseline-castle")
    capture("before-upgrade")

    shell("am", "force-stop", PACKAGE)
    install_result = adb("install", "-r", new_apk)  # Never uninstall or clear updated data.
    assert "Success" in install_result, f"Android refused upgrade: {install_result}"
    print("adb install -r succeeded: no uninstall, no pm clear.", flush=True)
    ACTIVITY = f"{PACKAGE}/{new[3]}"
    shell("am", "start", "-W", "-n", ACTIVITY)
    open_house()
    root = progress(2, "updated-house")
    assert find(root, "sound-toggle").attrib.get("checked") == "false", "Mute lost on upgrade"
    assert find(root, "color-F54536").attrib.get("selected") == "true", "Legacy red selection was not migrated"
    assert find(root, "action-undo").attrib.get("enabled") == "false", "Undo should not persist"
    capture("after-upgrade-house")
    press("drawing-next")
    progress(1, "updated-castle")
    capture("after-upgrade-castle")
    (OUTPUT / "results.json").write_text(json.dumps({
        "old_version_code": old[1], "new_version_code": new[1],
        "certificate_sha256": old[2], "offline_upgrade": "passed",
        "house_paint": "2 / 8", "castle_paint": "1 / 8",
        "muted_preserved": True, "palette_preserved": True
    }, indent=2) + "\n")
    print("PASS: upgrade preserves painted drawings, mute and palette offline.", flush=True)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python3 check-android-upgrade.py old.apk new.apk")
    try:
        test_upgrade(sys.argv[1], sys.argv[2])
    except Exception:
        try:
            capture("failure")
            (OUTPUT / "logcat.txt").write_text(adb("logcat", "-d", "-t", "1000"))
        except Exception:
            pass
        raise
    finally:
        try:
            shell("wm", "size", "reset")
            shell("wm", "density", "reset")
        except Exception:
            pass
