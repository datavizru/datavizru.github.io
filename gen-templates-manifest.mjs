#!/usr/bin/env node
/**
 * Сканирует templates/*.json и обновляет templates/manifest.json
 *
 * Запуск: node gen-templates-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, "templates");
const OUT = path.join(TEMPLATES_DIR, "manifest.json");
const SKIP = new Set(["manifest.json"]);

function labelFromStem(stem) {
  return stem.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim()
    .replace(/\b\w/g, c => c.toUpperCase()) || stem;
}

function templateDisplayName(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    for (const key of ["name", "title", "label"]) {
      const val = data?.[key];
      if (typeof val === "string" && val.trim()) return val.trim();
    }
  } catch { /* ignore */ }
  return labelFromStem(path.basename(filePath, ".json"));
}

function main() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.error("Папка не найдена:", TEMPLATES_DIR);
    process.exit(1);
  }
  const items = fs.readdirSync(TEMPLATES_DIR)
    .filter(n => n.endsWith(".json") && !SKIP.has(n))
    .sort()
    .map(file => ({
      name: templateDisplayName(path.join(TEMPLATES_DIR, file)),
      file
    }));

  const manifest = { templates: items };
  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Записано ${items.length} шаблон(ов) → templates/manifest.json`);
  for (const it of items) console.log(`  · ${it.name}  (${it.file})`);
}

main();
