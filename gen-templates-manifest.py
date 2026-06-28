#!/usr/bin/env python3
"""
Сканирует templates/*.json и обновляет:
  templates/manifest.json         — для сервера / GitHub Pages
  templates/templates-manifest.js — встроенный список + данные (file://)

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
OUT_JSON = TEMPLATES_DIR / "manifest.json"
OUT_JS = TEMPLATES_DIR / "templates-manifest.js"
SKIP = {"manifest.json"}


def label_from_stem(stem: str) -> str:
    s = stem.replace("_", " ").replace("-", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s.title() if s else stem


def template_display_name(path: Path, data: dict | None) -> str:
    if isinstance(data, dict):
        for key in ("name", "title", "label"):
            val = data.get(key)
            if isinstance(val, str) and val.strip():
                return val.strip()
    return label_from_stem(path.stem)


def main() -> None:
    if not TEMPLATES_DIR.is_dir():
        raise SystemExit(f"Папка не найдена: {TEMPLATES_DIR}")

    items: list[dict[str, str]] = []
    data: dict[str, object] = {}
    for path in sorted(TEMPLATES_DIR.glob("*.json")):
        if path.name in SKIP:
            continue
        try:
            parsed = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as e:
            print(f"Пропуск {path.name}: {e}")
            continue
        items.append({"name": template_display_name(path, parsed), "file": path.name})
        data[path.name] = parsed

    manifest = {"templates": items}
    OUT_JSON.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    payload = {"templates": items, "data": data}
    js = (
        "/* Автогенерация: python3 gen-templates-manifest.py — не редактировать вручную */\n"
        f"window.__CHART_TEMPLATES_MANIFEST__ = {json.dumps(payload, ensure_ascii=False, indent=2)};\n"
    )
    OUT_JS.write_text(js, encoding="utf-8")

    print(f"Записано {len(items)} шаблон(ов) → {OUT_JSON.relative_to(ROOT)}, {OUT_JS.relative_to(ROOT)}")
    for it in items:
        print(f"  · {it['name']}  ({it['file']})")


if __name__ == "__main__":
    main()
