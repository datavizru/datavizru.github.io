#!/usr/bin/env python3
"""
Сканирует templates/*.json и обновляет templates/manifest.json.

Запуск из корня репозитория:
  python3 gen-templates-manifest.py

В каждом шаблоне можно задать человекочитаемое имя полем "name" в корне JSON.
Иначе имя берётся из имени файла (minimal-light → Minimal light).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TEMPLATES_DIR = ROOT / "templates"
OUT = TEMPLATES_DIR / "manifest.json"
SKIP = {"manifest.json"}


def label_from_stem(stem: str) -> str:
    s = stem.replace("_", " ").replace("-", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s.title() if s else stem


def template_display_name(path: Path) -> str:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return label_from_stem(path.stem)
    if isinstance(data, dict):
        for key in ("name", "title", "label"):
            val = data.get(key)
            if isinstance(val, str) and val.strip():
                return val.strip()
    return label_from_stem(path.stem)


def main() -> None:
    if not TEMPLATES_DIR.is_dir():
        raise SystemExit(f"Папка не найдена: {TEMPLATES_DIR}")

    items = []
    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        if path.name in SKIP:
            continue
        items.append({"name": template_display_name(path), "file": path.name})

    manifest = {"templates": items}
    OUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Записано {len(items)} шаблон(ов) → {OUT.relative_to(ROOT)}")
    for it in items:
        print(f"  · {it['name']}  ({it['file']})")


if __name__ == "__main__":
    main()
