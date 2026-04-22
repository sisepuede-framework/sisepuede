#!/usr/bin/env python3
"""Locale parity lint for the SISEPUEDE Docusaurus course.

Walks ``docs/`` and verifies that every ``.md`` / ``.mdx`` file has a mirror
under ``i18n/es/docusaurus-plugin-content-docs/current/`` at the same relative
path. Exits non-zero if any EN file is missing an ES mirror. ES files without
an EN mirror produce a warning only.

Usage:
    python scripts/check_locale_parity.py
"""

from __future__ import annotations

import sys
from pathlib import Path


DOC_EXTS = {".md", ".mdx"}


def collect_docs(root: Path) -> set[Path]:
    """Return relative paths of all .md/.mdx files below *root*."""
    if not root.is_dir():
        return set()
    return {
        p.relative_to(root)
        for p in root.rglob("*")
        if p.is_file() and p.suffix.lower() in DOC_EXTS
    }


def main() -> int:
    # Resolve repo root relative to this script: course/scripts/ -> course/
    course_root = Path(__file__).resolve().parent.parent
    en_root = course_root / "docs"
    es_root = (
        course_root
        / "i18n"
        / "es"
        / "docusaurus-plugin-content-docs"
        / "current"
    )

    en_files = collect_docs(en_root)
    es_files = collect_docs(es_root)

    missing_es = sorted(en_files - es_files)
    orphan_es = sorted(es_files - en_files)

    if orphan_es:
        print("WARNING: ES docs without an EN mirror:", file=sys.stderr)
        for rel in orphan_es:
            print(f"  {es_root / rel}", file=sys.stderr)

    if missing_es:
        print("ERROR: EN docs missing an ES mirror:", file=sys.stderr)
        for rel in missing_es:
            print(f"  {es_root / rel}", file=sys.stderr)
        return 1

    print(
        f"OK: {len(en_files)} EN docs all have ES mirrors "
        f"({len(orphan_es)} ES-only file(s) warned)."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
