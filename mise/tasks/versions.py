#!/usr/bin/env -S uv run
# fmt: off
#MISE description="Create version manifest file."
#MISE depends=["ref-branches"]
# fmt: on

from lkdoc.versions import list_versions
from pathlib import Path
import json

URL_BASE = "https://lenskit.org"
SITE_BASE = Path("site")
VERSION_FILE = SITE_BASE / "versions.json"

versions = list_versions()
versions.reverse()

current = versions[0]

manifest = [
    {
        "name": "Latest",
        "version": "main",
        "url": f"{URL_BASE}/latest/",
    },
    {
        "name": f"{current.label} (stable)",
        "version": current.label,
        "url": f"{URL_BASE}/stable/",
        "preferred": True,
    },
]

for ver in versions[1:]:
    manifest.append(
        {
            "name": ver.label,
            "version": ver.label,
            "url": f"{URL_BASE}/{ver.label}/",
        }
    )

SITE_BASE.mkdir(exist_ok=True)
with open(VERSION_FILE, "wt") as jsf:
    print(json.dumps(manifest, indent=2), file=jsf)
