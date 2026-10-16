"""Exercise the built offline APK through native Android input and accessibility.

Uses only Python's standard library and the SDK tools provided by Actions.
Screenshots and UI dumps are retained for review, including on failure.
"""

import json
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

from android_ui_helpers import pixel_launcher_close_button

PACKAGE = "com.carlossan1993.colores.preview"
ACTIVITY = f"{PACKAGE}/com.carlossan1993.colores.MainActivity"
OUTPUT = Path("ui-artifacts")
OUTPUT.mkdir(exist_ok=True)


def adb(*args):
    return subprocess.check_output(["adb", *args], timeout=45)


def shell(*args):
    return adb("shell", *map(str, args)).decode().strip()


def snapshot(name):
    shell("uiautomator", "dump", "/sdcard/colores-ui.xml")
    xml = adb("exec-out", "cat", "/sdcard/colores-ui.xml")
    (OUTPUT / f"{name}.xml").write_bytes(xml)
    return ET.fromstring(xml)

def bounds(node):
    return tuple(map(int, re.findall(r"\d+", node.attrib["bounds"])))


def find(root, test_id):
    for node in root.iter("node"):
        if node.attrib.get("resource-id", "").split("/")[-1] == test_id:
            return node
    raise AssertionError(f"Native view missing: {test_id}")


def tap(node):
    left, top, right, bottom = bounds(node)
    shell("input", "tap", (left + right) // 2, (top + bottom) // 2)


def progress(expected, name):
    root = None
    for attempt in range(4):
        time.sleep(0.25)
        root = snapshot(name)
        text = find(root, "drawing-progress").attrib.get("text", "")
        if text == f"{expected} / 8":
            return root
    raise AssertionError(f"Expected {expected} / 8; native text is {text!r}")


def capture(name):
    (OUTPUT / f"{name}.png").write_bytes(adb("exec-out", "screencap", "-p"))


def stable_layout(root, name):
    # Android can deliver a second inset/dimension update after cold startup.
    previous = bounds(find(root, "drawing-canvas"))
    for attempt in range(5):
        time.sleep(0.25)
        root = snapshot(name)
        current = bounds(find(root, "drawing-canvas"))
        if current == previous:
            return root
        previous = current
    raise AssertionError(f"Layout did not settle in {name}")


def swatches(root):
    return [
        n for n in root.iter("node")
        if n.attrib.get("resource-id", "").split("/")[-1].startswith("color-")
    ]


def scroll_palette(root, name, to_end):
    left, top, right, bottom = bounds(find(root, "layout-bottom"))
    node = swatches(root)[0]
    y = (bounds(node)[1] + bounds(node)[3]) // 2
    # Stay away from Android's edge-back gesture regions.
    near_left = left + (right - left) // 4
    near_right = left + 3 * (right - left) // 4
    start, end = (near_right, near_left) if to_end else (near_left, near_right)
    shell("input", "swipe", start, y, end, y, 400)
    return snapshot(f"{name}-palette-{'end' if to_end else 'start'}")


def check_palette(root, name, sidebar):
    seen = set()

    def collect(tree):
        for node in swatches(tree):
            left, top, right, bottom = bounds(node)
            if right - left >= 48 and bottom - top >= 48:
                seen.add(node.attrib["resource-id"])

    collect(root)
    if not sidebar:
        root = scroll_palette(root, name, True)
        collect(root)
        capture(f"{name}-palette-end")
        root = scroll_palette(root, name, False)
        collect(root)
    assert len(seen) == 12, f"Only {len(seen)} full 48dp color targets reachable in {name}"
    return root


def dialog_button(root, text):
    for node in root.iter("node"):
        if node.attrib.get("text", "").casefold() == text.casefold():
            return node
    raise AssertionError(f"Dialog button missing: {text}")


def assert_target(node, size):
    left, top, right, bottom = bounds(node)
    assert right - left >= size, node.attrib
    assert bottom - top >= size, node.attrib


def press_view(test_id, name, scroll=False):
    recoveries = 0
    for attempt in range(10):
        root = snapshot(name)
        # Launcher can ANR before any first action (including opening Settings).
        # Only dismiss the exact Android system dialog, never a COLORES ANR.
        system_close = pixel_launcher_close_button(root)
        if system_close is not None:
            if recoveries >= 2:
                raise AssertionError("Pixel Launcher ANR repeated despite recovery")
            capture(f"{name}-launcher-anr-{recoveries + 1}")
            print(f"Recovering Pixel Launcher system ANR before {test_id} in {name}", flush=True)
            tap(system_close)
            recoveries += 1
            time.sleep(0.7)
            if test_id in ("settings-open", "start-coloring"):
                # Home is the expected screen in both cases; ensure activity resumed.
                shell("am", "start", "-W", "-n", ACTIVITY)
                time.sleep(0.4)
            continue
        try:
            node = find(root, test_id)
            left, top, right, bottom = bounds(node)
            if right - left >= 48 and bottom - top >= 48:
                tap(node)
                time.sleep(0.25)
                return
        except AssertionError:
            pass
        if not scroll:
            time.sleep(0.2)
            continue
        size = shell("wm", "size").splitlines()[-1]
        a, b = map(int, re.findall(r"(\d+)x(\d+)", size)[0])
        w, h = max(a, b), min(a, b)
        shell("input", "swipe", w // 2, h * 4 // 5, w // 2, h // 3, 400)
    raise AssertionError(f"Could not reach {test_id} in {name}")


def open_house(name):
    press_view("start-coloring", name)
    capture(f"{name}-categories")
    press_view("category-places", name, scroll=True)
    capture(f"{name}-gallery")
    press_view("drawing-house_001", name)


def exercise(name, width, height, full_controls=False):
    shell("am", "force-stop", PACKAGE)
    shell("pm", "clear", PACKAGE)  # Isolate matrix fixtures now that progress persists.
    # Portrait physical dimensions; the app requests sensorLandscape.
    shell("wm", "size", f"{height}x{width}")
    shell("wm", "density", 160)
    shell("am", "start", "-W", "-n", ACTIVITY)
    time.sleep(1)
    capture(f"{name}-home")
    if full_controls:
        # Settings must remain usable offline, accessible, and reversible.
        press_view("settings-open", name)
        settings = snapshot(f"{name}-settings")
        assert find(settings, "settings-privacy") is not None
        assert find(settings, "sound-toggle").attrib.get("checked") == "true"
        capture(f"{name}-settings")
        press_view("sound-toggle", name)
        settings = snapshot(f"{name}-settings-muted")
        assert find(settings, "sound-toggle").attrib.get("checked") == "false"
        capture(f"{name}-settings-muted")
        press_view("settings-back", name)
        press_view("settings-open", name)
        settings = snapshot(f"{name}-settings-reopened")
        assert find(settings, "sound-toggle").attrib.get("checked") == "false"
        press_view("sound-toggle", name)
        press_view("settings-back", name)
    open_house(name)
    root = stable_layout(progress(0, name), name)
    sound_node = find(root, "sound-toggle")
    assert_target(sound_node, 48)
    assert sound_node.attrib.get("checked") == "true"
    if full_controls:
        tap(sound_node)
        root = snapshot(f"{name}-sound-muted")
        assert find(root, "sound-toggle").attrib.get("checked") == "false"
        capture(f"{name}-sound-muted")
        tap(find(root, "sound-toggle"))
        root = snapshot(f"{name}-sound-unmuted")
        assert find(root, "sound-toggle").attrib.get("checked") == "true"
    canvas = find(root, "drawing-canvas")
    left, top, right, bottom = bounds(canvas)
    assert right - left > 150 and bottom - top > 80, canvas.attrib

    visible_swatches = swatches(root)
    assert visible_swatches, "No native palette buttons visible"
    # All 12 fit in the sidebar. Small windows deliberately scroll horizontally.
    sidebar = any(
        n.attrib.get("resource-id", "").endswith("layout-sidebar")
        for n in root.iter("node")
    )
    if sidebar:
        assert len(visible_swatches) == 12, f"Only {len(visible_swatches)} colors fit in {name}"
        for node in visible_swatches:
            assert_target(node, 48)
    root = check_palette(root, name, sidebar)
    for action in ("undo", "redo", "reset"):
        assert_target(find(root, f"action-{action}"), 48)

    # Default color is red. Map an interior roof point through xMidYMid meet.
    inner_width, inner_height = right - left - 4, bottom - top - 4
    scale = min(inner_width / 640, inner_height / 300)
    x = left + 2 + (inner_width - 640 * scale) / 2 + 270 * scale
    y = top + 2 + (inner_height - 300 * scale) / 2 + 75 * scale
    shell("input", "tap", round(x), round(y))
    root = progress(1, name)
    capture(name)
    tap(find(root, "action-undo"))
    root = progress(0, name)
    tap(find(root, "action-redo"))
    root = progress(1, name)

    if full_controls:
        # Palette selection and erasure reach the actual native SVG, not a mock.
        if not sidebar:
            root = scroll_palette(root, name, True)
        assert_target(find(root, "color-FFFFFF"), 48)
        tap(find(root, "color-FFFFFF"))
        shell("input", "tap", round(x), round(y))
        root = progress(0, name)
        tap(find(root, "action-undo"))
        root = progress(1, name)
        tap(find(root, "action-reset"))
        tap(dialog_button(snapshot(f"{name}-dialog"), "Cancelar"))
        root = progress(1, name)
        tap(find(root, "action-reset"))
        tap(dialog_button(snapshot(f"{name}-dialog"), "Borrar"))
        root = progress(0, name)
        tap(find(root, "action-undo"))
        root = progress(1, name)
    # Leave a painted drawing, inspect the preview and return without losing it.
    press_view("coloring-back", name)
    root = snapshot(f"{name}-session-gallery")
    assert "En progreso" in find(root, "drawing-house_001").attrib.get("content-desc", "")
    capture(f"{name}-session-gallery")
    press_view("drawing-house_001", name)
    root = progress(1, name)
    assert_target(find(root, "drawing-next"), 48)
    tap(find(root, "drawing-next"))
    root = progress(0, name)
    place_count = len([item for item in json.loads(Path("assets/drawings/catalog.json").read_text()) if item["category"] == "places"])
    assert find(root, "drawing-position").attrib.get("text") == f"2 / {place_count}"
    assert find(root, "drawing-next").attrib.get("enabled") == "true"
    capture(f"{name}-castle")
    tap(find(root, "drawing-previous"))
    root = progress(1, name)
    shell("input", "keyevent", 4)
    root = snapshot(f"{name}-android-back")
    assert "En progreso" in find(root, "drawing-house_001").attrib.get("content-desc", "")

    if full_controls:
        press_view("browse-back", name)
        for category, drawing, point in (
            ("animals", "cat_001", (320, 110)),
            ("fruits", "apple_001", (320, 180)),
            ("vehicles", "car_001", (320, 180)),
        ):
            press_view(f"category-{category}", name, scroll=True)
            capture(f"{name}-gallery-{category}")
            press_view(f"drawing-{drawing}", name)
            press_view("color-F54536", name)
            root = stable_layout(snapshot(f"{name}-{drawing}"), name)
            left, top, right, bottom = bounds(find(root, "drawing-canvas"))
            iw, ih = right - left - 4, bottom - top - 4
            scale = min(iw / 640, ih / 300)
            x = left + 2 + (iw - 640 * scale) / 2 + point[0] * scale
            y = top + 2 + (ih - 300 * scale) / 2 + point[1] * scale
            shell("input", "tap", round(x), round(y))
            root = snapshot(f"{name}-{drawing}-painted")
            assert find(root, "drawing-progress").attrib.get("text", "").startswith("1 / ")
            assert find(root, "drawing-next").attrib.get("enabled") == "true"
            capture(f"{name}-{drawing}")
            press_view("coloring-back", name)
            root = snapshot(f"{name}-{drawing}-preview")
            assert "En progreso" in find(root, f"drawing-{drawing}").attrib.get("content-desc", "")
            press_view("browse-back", name)
        press_view("browse-back", name)
        assert_target(find(snapshot(f"{name}-home-again"), "start-coloring"), 48)

        # Exercise one NEW drawing per category; check actual SVG touches.
        press_view("start-coloring", name)
        for category, drawing, point in (
            ("animals", "dog_001", (340, 214)),
            ("fruits", "banana_001", (310, 246)),
            ("places", "school_001", (270, 235)),
            ("vehicles", "boat_001", (320, 252)),
        ):
            press_view(f"category-{category}", name, scroll=True)
            press_view(f"drawing-{drawing}", name, scroll=True)
            press_view("color-F54536", name)
            root = stable_layout(snapshot(f"{name}-{drawing}-opened"), name)
            left, top, right, bottom = bounds(find(root, "drawing-canvas"))
            iw, ih = right - left - 4, bottom - top - 4
            scale = min(iw / 640, ih / 300)
            x = left + 2 + (iw - 640 * scale) / 2 + point[0] * scale
            y = top + 2 + (ih - 300 * scale) / 2 + point[1] * scale
            shell("input", "tap", round(x), round(y))
            root = snapshot(f"{name}-{drawing}-painted")
            assert find(root, "drawing-progress").attrib.get("text", "").startswith("1 / ")
            capture(f"{name}-{drawing}-new")
            press_view("coloring-back", name)
            press_view("browse-back", name)
        press_view("browse-back", name)

        # Stage 7 batch 2: confirm one new drawing per category on a real SVG canvas.
        press_view("start-coloring", name)
        for category, drawing, point in (
            ("animals", "turtle_001", (330, 149)),
            ("fruits", "orange_001", (315, 154)),
            ("places", "lighthouse_001", (319, 128)),
            ("vehicles", "train_001", (346, 202)),
        ):
            press_view(f"category-{category}", name, scroll=True)
            press_view(f"drawing-{drawing}", name, scroll=True)
            press_view("color-F54536", name)
            root = stable_layout(snapshot(f"{name}-{drawing}-opened"), name)
            left, top, right, bottom = bounds(find(root, "drawing-canvas"))
            iw, ih = right - left - 4, bottom - top - 4
            scale = min(iw / 640, ih / 300)
            x = left + 2 + (iw - 640 * scale) / 2 + point[0] * scale
            y = top + 2 + (ih - 300 * scale) / 2 + point[1] * scale
            shell("input", "tap", round(x), round(y))
            root = snapshot(f"{name}-{drawing}-painted")
            assert find(root, "drawing-progress").attrib.get("text", "").startswith("1 / ")
            capture(f"{name}-{drawing}-new")
            press_view("coloring-back", name)
            press_view("browse-back", name)
        press_view("browse-back", name)


        # Stage 7 batch 3: touch the new art in each category without network.
        press_view("start-coloring", name)
        for category, drawing, point in (
            ("animals", "fox_001", (330, 239)),
            ("fruits", "pear_001", (321, 185)),
            ("places", "library_001", (276, 237)),
            ("vehicles", "rocket_001", (320, 181)),
        ):
            press_view(f"category-{category}", name, scroll=True)
            press_view(f"drawing-{drawing}", name, scroll=True)
            press_view("color-F54536", name)
            root = stable_layout(snapshot(f"{name}-{drawing}-opened"), name)
            left, top, right, bottom = bounds(find(root, "drawing-canvas"))
            iw, ih = right - left - 4, bottom - top - 4
            scale = min(iw / 640, ih / 300)
            x = left + 2 + (iw - 640 * scale) / 2 + point[0] * scale
            y = top + 2 + (ih - 300 * scale) / 2 + point[1] * scale
            shell("input", "tap", round(x), round(y))
            root = snapshot(f"{name}-{drawing}-painted")
            assert find(root, "drawing-progress").attrib.get("text", "").startswith("1 / ")
            capture(f"{name}-{drawing}-new")
            press_view("coloring-back", name)
            press_view("browse-back", name)
        press_view("browse-back", name)


        # Stage 7 final batch: actual offline SVG paint in one new drawing per category.
        press_view("start-coloring", name)
        for category, drawing, point in (
            ("animals", "elephant_001", (364, 185)),
            ("fruits", "cherries_001", (266, 178)),
            ("places", "shop_001", (278, 249)),
            ("vehicles", "helicopter_001", (358, 200)),
        ):
            press_view(f"category-{category}", name, scroll=True)
            press_view(f"drawing-{drawing}", name, scroll=True)
            press_view("color-F54536", name)
            root = stable_layout(snapshot(f"{name}-{drawing}-opened"), name)
            left, top, right, bottom = bounds(find(root, "drawing-canvas"))
            iw, ih = right - left - 4, bottom - top - 4
            scale = min(iw / 640, ih / 300)
            x = left + 2 + (iw - 640 * scale) / 2 + point[0] * scale
            y = top + 2 + (ih - 300 * scale) / 2 + point[1] * scale
            shell("input", "tap", round(x), round(y))
            root = snapshot(f"{name}-{drawing}-painted")
            assert find(root, "drawing-progress").attrib.get("text", "").startswith("1 / ")
            capture(f"{name}-{drawing}-new")
            press_view("coloring-back", name)
            press_view("browse-back", name)
        press_view("browse-back", name)

        # Finish the three-region apple to exercise the brief visual celebration.
        press_view("start-coloring", name)
        press_view("category-fruits", name, scroll=True)
        press_view("drawing-apple_001", name)
        press_view("color-F54536", name)
        root = stable_layout(snapshot(f"{name}-apple-completion-opened"), name)
        left, top, right, bottom = bounds(find(root, "drawing-canvas"))
        iw, ih = right - left - 4, bottom - top - 4
        scale = min(iw / 640, ih / 300)
        for px, py in ((320, 180), (321, 60), (370, 42)):
            x = left + 2 + (iw - 640 * scale) / 2 + px * scale
            y = top + 2 + (ih - 300 * scale) / 2 + py * scale
            shell("input", "tap", round(x), round(y))
        time.sleep(0.18)
        capture(f"{name}-completion-celebration")
        root = snapshot(f"{name}-apple-completed")
        assert find(root, "drawing-progress").attrib.get("text") == "¡Lo lograste!"

    result = {
        "size_dp": [width, height],
        "layout": "sidebar" if sidebar else "bottom",
        "visible_colors": len(visible_swatches),
        "accessible_colors": 12,
        "palette_scroll": "not needed" if sidebar else "passed",
        "canvas_bounds": bounds(canvas),
        "paint_undo_redo": "passed",
        "navigation_session_android_back": "passed",
        "erase_reset_confirmation": "passed" if full_controls else "covered on phone",
    }
    print(f"PASS {name}: {json.dumps(result)}", flush=True)
    return result


def wait_saved(name):
    for attempt in range(5):
        root = snapshot(f"{name}-saved")
        if find(root, "storage-status").attrib.get("text") == "Guardado":
            return root
        time.sleep(0.2)
    raise AssertionError("Disk write was not acknowledged")


def paint_point(name, px, py):
    root = stable_layout(snapshot(name), name)
    left, top, right, bottom = bounds(find(root, "drawing-canvas"))
    iw, ih = right - left - 4, bottom - top - 4
    scale = min(iw / 640, ih / 300)
    x = left + 2 + (iw - 640 * scale) / 2 + px * scale
    y = top + 2 + (ih - 300 * scale) / 2 + py * scale
    shell("input", "tap", round(x), round(y))
    return wait_saved(name)


def restart_house(name):
    shell("am", "force-stop", PACKAGE)
    shell("am", "start", "-W", "-n", ACTIVITY)
    open_house(name)


def exercise_persistence(apk):
    name = "persistence"
    shell("am", "force-stop", PACKAGE)
    shell("pm", "clear", PACKAGE)
    shell("wm", "size", "360x640")
    shell("wm", "density", 160)
    shell("am", "start", "-W", "-n", ACTIVITY)
    open_house(name)
    root = snapshot("persistence-sound-before")
    assert find(root, "sound-toggle").attrib.get("checked") == "true"
    tap(find(root, "sound-toggle"))
    assert find(snapshot("persistence-sound-muted"), "sound-toggle").attrib.get("checked") == "false"
    wait_saved(name)
    press_view("color-66BE96", name)
    paint_point(name, 270, 75)
    press_view("color-0A35F5", name)
    paint_point(name, 160, 250)
    progress(2, name)
    press_view("drawing-next", name)
    press_view("color-F54536", name)
    paint_point(name, 320, 40)
    progress(1, name)
    restart_house(name)
    root = progress(2, name)
    assert find(root, "sound-toggle").attrib.get("checked") == "false"
    assert find(root, "color-F54536").attrib.get("selected") == "true"
    assert find(root, "action-undo").attrib.get("enabled") == "false"
    capture("persistence-house-restored")
    press_view("drawing-next", name)
    progress(1, name)
    capture("persistence-castle-restored")

    # Installing the same signed APK over itself must keep app-private data.
    wait_saved(name)
    shell("am", "force-stop", PACKAGE)
    adb("install", "-r", apk)
    shell("am", "start", "-W", "-n", ACTIVITY)
    open_house(name)
    root = progress(2, name)
    assert find(root, "sound-toggle").attrib.get("checked") == "false"
    capture("persistence-in-place-install")

    press_view("action-reset", name)
    tap(dialog_button(snapshot("persistence-reset"), "Borrar"))
    wait_saved(name)
    restart_house(name)
    progress(0, name)
    press_view("drawing-next", name)
    progress(1, name)
    capture("persistence-reset-isolated")
    root = snapshot("persistence-white")
    sidebar = any(n.attrib.get("resource-id", "").endswith("layout-sidebar") for n in root.iter("node"))
    if not sidebar:
        scroll_palette(root, name, True)
    press_view("color-FFFFFF", name)
    paint_point(name, 320, 40)
    progress(0, name)
    restart_house(name)
    progress(0, name)
    press_view("drawing-next", name)
    progress(0, name)
    capture("persistence-erased-restored")

    # Back from Home must show a parental-style confirmation, not exit instantly.
    # System Home/Recents gestures remain outside our control.
    press_view("coloring-back", name)
    press_view("browse-back", name)
    press_view("browse-back", name)
    assert find(snapshot("exit-home"), "start-coloring") is not None
    shell("input", "keyevent", 4)
    dialog = snapshot("exit-confirmation")
    assert dialog_button(dialog, "Seguir coloreando") is not None
    assert dialog_button(dialog, "Salir") is not None
    capture("exit-confirmation")
    tap(dialog_button(dialog, "Seguir coloreando"))
    assert find(snapshot("exit-cancelled"), "start-coloring") is not None
    return {"offline_force_stop_restore": "passed", "selected_color_restore": "passed", "mute_restore": "passed", "separate_drawings": "passed", "same_apk_in_place_install": "passed", "reset_and_erase_restore": "passed", "history_after_restart": "empty by design", "exit_cancel_keeps_app_open": "passed"}


results = {}
try:
    # Official AOSP UI-test practice: mark the Android OS immersive-mode
    # education dialog as already acknowledged on this disposable emulator.
    # Otherwise a stale UI dump can make an automated tap hit Colorimbo.
    # This is EMULATOR SETUP ONLY; no setting is changed on users' phones.
    shell("settings", "put", "secure", "immersive_mode_confirmations", "confirmed")
    assert shell("settings", "get", "secure", "immersive_mode_confirmations") == "confirmed"
    adb("install", "-r", sys.argv[1])
    shell("settings", "put", "system", "accelerometer_rotation", 0)
    shell("settings", "put", "system", "user_rotation", 1)
    shell("cmd", "connectivity", "airplane-mode", "enable")
    shell("svc", "wifi", "disable")
    shell("svc", "data", "disable")
    assert shell("settings", "get", "global", "airplane_mode_on") == "1"
    for name, width, height in (
        ("phone", 640, 360),
        ("large-phone", 892, 412),
        ("tablet", 1024, 600),
        ("large-tablet", 1280, 800),
        ("short-window", 892, 300),
        ("narrow-window", 540, 320),
    ):
        results[name] = exercise(name, width, height, name == "phone")
    results["persistence"] = exercise_persistence(sys.argv[1])
    (OUTPUT / "results.json").write_text(json.dumps(results, indent=2) + "\n")
except Exception:
    capture("failure")
    (OUTPUT / "logcat.txt").write_bytes(adb("logcat", "-d", "-t", "1000"))
    raise
finally:
    shell("wm", "size", "reset")
    shell("wm", "density", "reset")
