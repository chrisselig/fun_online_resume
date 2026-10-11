#!/usr/bin/env python3
"""Export resume data to JSON for the Next.js frontend (web/src/data/resume.json).

Usage:
    python scripts/export_resume_json.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from linkedin_project.pipelines.export_resume import load_resume  # noqa: E402

OUTPUT_PATH = (
    Path(__file__).resolve().parent.parent / "web" / "src" / "data" / "resume.json"
)


def main() -> None:
    data = load_resume()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(data, indent=2, default=str) + "\n")
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
