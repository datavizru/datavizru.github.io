#!/usr/bin/env node
/**
 * Сканирует папку Fonts/ и создаёт fonts-manifest.js + fonts.json
 * для автоподключения шрифтов при открытии index.html (в т.ч. file://).
 *
 * Запуск: node gen-fonts-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = path.join(__dirname, "Fonts");
const OUT_JS = path.join(FONTS_DIR, "fonts-manifest.js");
const OUT_JSON = path.join(FONTS_DIR, "fonts.json");

const WEIGHT_FROM_TOKEN = {
  thin: 100, hairline: 100, extralight: 200, ultralight: 200, light: 300,
  regular: 400, normal: 400, book: 400, medium: 500, semibold: 600, demibold: 600,
  bold: 700, extrabold: 800, ultrabold: 800, black: 900, heavy: 900,
};

function parseFontFilename(name) {
  const base = String(name).replace(/\.(woff2?|ttf|otf)$/i, "");
  let style = "normal", weight = 400, fam = base;
  const suffixRe = /[-_]?(italic|oblique|regular|normal|book|thin|hairline|extralight|ultralight|light|medium|semibold|demibold|bold|extrabold|ultrabold|black|heavy)(italic|oblique)?$/i;
  for (let guard = 0; guard < 6; guard++) {
    const m = fam.match(suffixRe);
    if (!m) break;
    const part = m[1].toLowerCase();
    if (part === "italic" || part === "oblique") style = "italic";
    else if (WEIGHT_FROM_TOKEN[part] != null) weight = WEIGHT_FROM_TOKEN[part];
    if (m[2]) style = "italic";
    fam = fam.slice(0, -m[0].length).replace(/[-_]+$/, "");
  }
  fam = (fam || base).replace(/[-_]+/g, " ").trim();
  return { family: fam || base, weight, style };
}

function scanFonts() {
  if (!fs.existsSync(FONTS_DIR)) return [];
  const files = fs.readdirSync(FONTS_DIR).filter(f => /\.(woff2?|ttf|otf)$/i.test(f));
  const map = new Map();
  for (const file of files) {
    const meta = parseFontFilename(file);
    if (!map.has(meta.family)) {
      map.set(meta.family, { family: meta.family, label: meta.family, faces: [] });
    }
    map.get(meta.family).faces.push({
      src: file,
      weight: meta.weight,
      style: meta.style,
    });
  }
  return [...map.values()].sort((a, b) => a.family.localeCompare(b.family));
}

const fonts = scanFonts();
const manifest = { fonts };

fs.writeFileSync(
  OUT_JSON,
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

const js = `/* Автогенерация: node gen-fonts-manifest.mjs — не редактировать вручную */\nwindow.__CHART_FONTS_MANIFEST__ = ${JSON.stringify(manifest, null, 2)};\n`;
fs.writeFileSync(OUT_JS, js, "utf8");

console.log(`Шрифтов: ${fonts.length} семейств, ${fonts.reduce((n, f) => n + f.faces.length, 0)} файлов`);
console.log("Записано:", OUT_JS, OUT_JSON);
