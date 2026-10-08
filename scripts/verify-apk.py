"""Validate the actual APK, not just its source configuration."""
import os
from pathlib import Path
import subprocess
import sys
from zipfile import ZipFile

apk = Path(sys.argv[1]).resolve()
tools = Path(os.environ["ANDROID_HOME"]) / "build-tools" / "36.0.0"
subprocess.run([str(tools / "apksigner"), "verify", "--verbose", str(apk)], check=True)
badging = subprocess.check_output([str(tools / "aapt2"), "dump", "badging", str(apk)], text=True)
permissions = subprocess.check_output([str(tools / "aapt2"), "dump", "permissions", str(apk)], text=True)
if "name='com.carlossan1993.colores.preview'" not in badging:
    raise SystemExit("Unexpected package: this must be the preview APK")
if "application-debuggable" in badging:
    raise SystemExit("Preview must not require a development server")
# AndroidX may add a signature-only permission for the app's own receivers.
# It grants no device data or network access. Reject every other used permission.
internal_permission = "com.carlossan1993.colores.preview.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"
used = [line for line in permissions.splitlines() if "uses-permission:" in line]
unexpected = [line for line in used if "name='" + internal_permission + "'" not in line]
if unexpected:
    raise SystemExit("Preview requests external permissions:\n" + "\n".join(unexpected))
with ZipFile(apk) as archive:
    if archive.getinfo("assets/index.android.bundle").file_size == 0:
        raise SystemExit("Missing embedded JavaScript")
    if not any(name.startswith("lib/arm64-v8a/") for name in archive.namelist()):
        raise SystemExit("Missing native ARM64 libraries")
print("APK verified: signed test build, ARM64, embedded JavaScript, no external permissions.")
