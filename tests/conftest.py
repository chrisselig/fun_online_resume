"""Pytest configuration — ensures the project root is importable."""

import sys
from pathlib import Path

# Project root (contains src/, tests/, web/)
_ROOT = Path(__file__).parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))
