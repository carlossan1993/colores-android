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


def exercise(name, width, height, full_controls=False):
    shell("am", "force-stop", PACKAGE)
    # Portrait physical dimensions; the app requests sensorLandscape.
    shell("wm", "size", f"{height}x{width}")
    shell("wm", "density", 160)
    shell("am", "start", "-W", "-n", ACTIVITY)
    time.sleep(1)
    root = stable_layout(progress(0, name), name)
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
    result = {
        "size_dp": [width, height],
        "layout": "sidebar" if sidebar else "bottom",
        "visible_colors": len(visible_swatches),
        "accessible_colors": 12,
        "palette_scroll": "not needed" if sidebar else "passed",
        "canvas_bounds": bounds(canvas),
        "paint_undo_redo": "passed",
        "erase_reset_confirmation": "passed" if full_controls else "covered on phone",
    }
    print(f"PASS {name}: {json.dumps(result)}", flush=True)
    return result


results = {}
try:
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
    (OUTPUT / "results.json").write_text(json.dumps(results, indent=2) + "\n")
except Exception:
    capture("failure")
    (OUTPUT / "logcat.txt").write_bytes(adb("logcat", "-d", "-t", "1000"))
    raise
finally:
    shell("wm", "size", "reset")
    shell("wm", "density", "reset")
