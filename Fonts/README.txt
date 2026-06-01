Локальные шрифты для редактора диаграмм
======================================

Положите сюда файлы шрифтов: .woff2, .woff, .ttf, .otf

Имена файлов (автоопределение начертания):
  MyFont-Regular.woff2     → семейство «My Font», 400
  MyFont-Bold.woff2        → 700
  MyFont-LightItalic.woff2 → 300, курсив

Опционально: fonts.json — точное описание семейств:

{
  "fonts": [
    {
      "family": "Accia Sans",
      "label": "Accia Sans",
      "category": "sans-serif",
      "faces": [
        { "src": "AcciaSans-Regular.woff2", "weight": 400, "style": "normal" },
        { "src": "AcciaSans-Bold.woff2", "weight": 700, "style": "normal" }
      ]
    }
  ]
}

После добавления или удаления файлов выполните в корне проекта:
  node gen-fonts-manifest.mjs

Это создаёт fonts-manifest.js — при открытии index.html шрифты
подключаются автоматически (в том числе по file://).

Опционально: локальный сервер (python3 -m http.server) — тогда
кнопка «Обновить из Fonts/» подхватит новые файлы без перегенерации.
