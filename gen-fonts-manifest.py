#!/usr/bin/env python3
"""
Сканирует папку Fonts/ и создаёт fonts-manifest.js + fonts.json.

Запуск (без Node.js):
  python3 gen-fonts-manifest.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FONTS_DIR = ROOT / "Fonts"
OUT_JS = FONTS_DIR / "fonts-manifest.js"
OUT_JSON = FONTS_DIR / "fonts.json"

WEIGHT_FROM_TOKEN = {
    "thin": 100, "hairline": 100, "extralight": 200, "ultralight": 200, "light": 300,
    "regular": 400, "normal": 400, "book": 400, "medium": 500, "semibold": 600,
    "demibold": 600, "bold": 700, "extrabold": 800, "ultrabold": 800, "black": 900,
    "heavy": 900,
}

SUFFIX_RE = re.compile(
    r"[-_]?(italic|oblique|regular|normal|book|thin|hairline|extralight|ultralight|"
    r"light|medium|semibold|demibold|bold|extrabold|ultrabold|black|heavy)"
    r"(italic|oblique)?$",
    re.I,
)


def parse_font_filename(name: str) -> dict:
    base = re.sub(r"\.(woff2?|ttf|otf)$", "", name, flags=re.I)
    style = "normal"
    weight = 400
    fam = base
    for _ in range(6):
        m = SUFFIX_RE.search(fam)
        if not m:
            break
        part = m.group(1).lower()
        if part in ("italic", "oblique"):
            style = "italic"
        elif part in WEIGHT_FROM_TOKEN:
            weight = WEIGHT_FROM_TOKEN[part]
        if m.group(2):
            style = "italic"
        fam = fam[: m.start()].rstrip("-_")
    fam = re.sub(r"[-_]+", " ", fam or base).strip()
    return {"family": fam or base, "weight": weight, "style": style}


def scan_fonts() -> list:
    if not FONTS_DIR.is_dir():
        return []
    families: dict[str, dict] = {}
    for path in sorted(FONTS_DIR.iterdir()):
        if not path.is_file() or path.suffix.lower() not in (".woff", ".woff2", ".ttf", ".otf"):
            continue
        meta = parse_font_filename(path.name)
        fam = meta["family"]
        if fam not in families:
            families[fam] = {"family": fam, "label": fam, "faces": []}
        families[fam]["faces"].append({
            "src": path.name,
            "weight": meta["weight"],
            "style": meta["style"],
        })
    return sorted(families.values(), key=lambda x: x["family"].lower())


def main() -> None:
    fonts = scan_fonts()
    manifest = {"fonts": fonts}
    OUT_JSON.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    js = (
        "/* Автогенерация: python3 gen-fonts-manifest.py — не редактировать вручную */\n"
        f"window.__CHART_FONTS_MANIFEST__ = {json.dumps(manifest, ensure_ascii=False, indent=2)};\n"
    )
    OUT_JS.write_text(js, encoding="utf-8")
    n_files = sum(len(f["faces"]) for f in fonts)
    print(f"Шрифтов: {len(fonts)} семейств, {n_files} файлов")
    print("Записано:", OUT_JS, OUT_JSON)


if __name__ == "__main__":
    main()
