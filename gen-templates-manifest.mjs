#!/usr/bin/env node
/**
 * Сканирует templates/*.json и обновляет:
 *   templates/manifest.json       — для сервера / GitHub Pages
 *   templates/templates-manifest.js — встроенный список + данные (file://)
 *
 * Запуск: node gen-templates-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, "templates");
const OUT_JSON = path.join(TEMPLATES_DIR, "manifest.json");
const OUT_JS = path.join(TEMPLATES_DIR, "templates-manifest.js");
const SKIP = new Set(["manifest.json"]);

function labelFromStem(stem) {
  return stem.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
    .replace(/\b\w/g, c => c.toUpperCase()) || stem;
}

function templateDisplayName(filePath, data) {
  if (data && typeof data === "object") {
    for (const key of ["name", "title", "label"]) {
      const val = data[key];
      if (typeof val === "string" && val.trim()) return val.trim();
    }
  }
  return labelFromStem(path.basename(filePath, ".json"));
}

function main() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.error("Папка не найдена:", TEMPLATES_DIR);
    process.exit(1);
  }
  const items = [];
  const data = {};
  for (const file of fs.readdirSync(TEMPLATES_DIR).filter(n => n.endsWith(".json") && !SKIP.has(n)).sort()) {
    const filePath = path.join(TEMPLATES_DIR, file);
    let parsed;
    try { parsed = JSON.parse(fs.readFileSync(filePath, "utf8")); }
    catch (e) {
      console.warn(`Пропуск ${file}: ${e.message}`);
      continue;
    }
    items.push({ name: templateDisplayName(filePath, parsed), file });
    data[file] = parsed;
  }

  const manifest = { templates: items };
  fs.writeFileSync(OUT_JSON, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  const js = `/* Автогенерация: node gen-templates-manifest.mjs — не редактировать вручную */
window.__CHART_TEMPLATES_MANIFEST__ = ${JSON.stringify({ templates: items, data }, null, 2)};
`;
  fs.writeFileSync(OUT_JS, js, "utf8");

  console.log(`Записано ${items.length} шаблон(ов) → templates/manifest.json, templates/templates-manifest.js`);
  for (const it of items) console.log(`  · ${it.name}  (${it.file})`);
}

main();
