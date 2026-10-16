"""Classify only the known Pixel Launcher system ANR, never an app crash."""
import xml.etree.ElementTree as ET


def pixel_launcher_close_button(root: ET.Element):
    nodes = tuple(root.iter("node"))
    title = any(
        node.attrib.get("text") == "Pixel Launcher isn't responding"
        and node.attrib.get("package") == "android"
        for node in nodes
    )
    if not title:
        return None
    return next(
        (
            node for node in nodes
            if node.attrib.get("resource-id") == "android:id/aerr_close"
            and node.attrib.get("package") == "android"
        ),
        None,
    )


def immersive_intro_ok_button(root: ET.Element):
    """Dismiss only Android's first-use immersive-mode tutorial, not app dialogs."""
    nodes = tuple(root.iter("node"))
    shown_by_android = any(
        node.attrib.get("resource-id") == "android:id/immersive_cling_title"
        and node.attrib.get("package") == "android"
        for node in nodes
    )
    if not shown_by_android:
        return None
    return next(
        (
            node for node in nodes
            if node.attrib.get("resource-id") == "android:id/ok"
            and node.attrib.get("package") == "android"
        ),
        None,
    )
