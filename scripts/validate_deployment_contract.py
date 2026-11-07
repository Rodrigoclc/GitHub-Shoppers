#!/usr/bin/env python3
"""Static checks for the application/infrastructure deployment contract."""
from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTRACT = json.loads((ROOT / "deployment-contract.json").read_text())

assert CONTRACT["schema_version"] == 1
assert CONTRACT["images"]["api"]["repository"] == "ghcr.io/rodrigoclc/github-shoppers-api"
assert CONTRACT["images"]["web"]["repository"] == "ghcr.io/rodrigoclc/github-shoppers-web"
for image in CONTRACT["images"].values():
    assert image["platform"] == "linux/amd64"
    assert image["tag_format"] == "sha-<full-git-commit>"

api = CONTRACT["runtime"]["api"]
assert api["container_port"] == 8082
assert api["health"] == {"path": "/api/health", "method": "GET", "expected_status": 200}
assert api["migration"]["command"] == ["node", "dist/database/migrate.js"]
assert CONTRACT["database"] == {
    "engine": "postgresql",
    "database": "github_shoppers",
    "role": "github_shoppers_app",
    "provisioning": "central-infrastructure",
}
assert CONTRACT["runtime"]["web"]["container_port"] == 8083
assert CONTRACT["images"]["web"]["build_args"]["VITE_API_URL"].endswith("/api")
print("deployment contract: ok")
