import hashlib
import json
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parents[1]
site = root / "site"
site.mkdir(exist_ok=True)
for name in ["experiment-guide", "unity", "assets", "network-test"]:
    shutil.copytree(root / name, site / name, dirs_exist_ok=True)
for name in ["index.html", "app.js", "config.js", "academic.css", "style.css", ".nojekyll"]:
    shutil.copy2(root / name, site / name)
manifest = json.loads((root / "release-assets.json").read_text())
for asset in manifest["assets"]:
    dest = site / asset["path"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["gh", "release", "download", asset.get("release", manifest["release"]),
                    "--repo", "Siriuess/robot-virtual-lab-demo", "--pattern", asset["name"],
                    "--output", str(dest), "--clobber"], check=True)
    with dest.open("rb") as stream:
        digest = hashlib.file_digest(stream, "sha256").hexdigest()
    if dest.stat().st_size != asset["size"] or digest != asset["sha256"]:
        raise RuntimeError("Release asset verification failed: " + asset["name"])
    print("Verified", asset["path"], flush=True)
