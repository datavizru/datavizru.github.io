# Visualize Your Data · Визуализируй свои данные

**A free, browser-based chart and layout editor. No install, no build step, no server, no sign-up.**

**Бесплатный редактор диаграмм и макета в браузере. Без установки, без сборки, без сервера и регистрации.**

Live app / Приложение: **[datavizru.github.io](https://datavizru.github.io/)** · Source / Код: **[github.com/datavizru/datavizru.github.io](https://github.com/datavizru/datavizru.github.io)**

[English](#english) · [Русский](#русский)

---

# English

Load a CSV, build a chart, control every typographic detail of the document (title, subtitle, legend, axis titles, comment, footer), then export a print-ready PNG or an editable SVG. Everything runs in your browser — your data never leaves the machine.

Rendering engine: [Vega-Lite 5](https://vega.github.io/vega-lite/) via [Vega-Embed 6](https://github.com/vega/vega-embed). Interface language: English by default, with an ENG/RUS switch in the header.

## Quick Start

### 1. Open the editor

The fastest way — just open the hosted version: **[datavizru.github.io](https://datavizru.github.io/)**

To work with your own copy, download or clone the repository and open `index.html` in the browser (double-click works). A local web server is recommended, because it enables loading fonts from `Fonts/` and templates from `templates/`:

```bash
git clone https://github.com/datavizru/datavizru.github.io.git
cd datavizru.github.io

# Python 3 (pre-installed on macOS and most Linux systems)
python3 -m http.server 8080

# or Node.js
npx --yes serve -p 8080
```

Then open `http://localhost:8080`.

You need a modern browser (Chrome, Firefox, Safari, Edge) and an internet connection on first load: Vega-Lite and Google Fonts come from a CDN.

### 2. Build your first chart in six steps

1. **Pick a chart type** — top-left panel, *Chart type*. Start with *Bar*.
2. **Choose data** — the *Data* section already contains sample datasets, so you can experiment right away. To use your own file, set the **field delimiter** (`,` `;` tab `|`) and the **decimal separator** (`.` or `,`), then press **Load CSV…**. If numbers look wrong, the decimal separator is usually the reason.
3. **Map the columns** — *X axis / category*, *Y axis / value* and, if your table has several series, *Series (color)*.
4. **Write the text** — title, subtitle, legend title, axis titles, comment below the chart, footer with copyright and sources. Alignment is available for each block.
5. **Style it** — the right panel controls size, margins, plot area, fonts, colors, palettes, axes, grid, value labels, legend. If you don't want to tune everything by hand, pick a ready-made **design template** at the top of the panel.
6. **Export** — *PNG 2×*, *PNG 4×* or *SVG* in the left panel. Use **Save** to keep the whole project (settings + data) as a `.json` file, and **Load** to continue later.

### 3. Useful things to know from the start

- **Zoom and pan work like Figma.** Mouse wheel or trackpad pinch zooms; hold <kbd>Space</kbd> and drag, or drag with the middle mouse button, to pan. The `−` / `+` buttons change zoom by 10%; clicking the percentage or `⟲` resets the view.
- **Nothing is uploaded anywhere.** CSV parsing, rendering and export all happen locally in the browser.
- **A project file is self-contained.** Saved `.json` includes the imported CSV rows, all style settings and the interface language, so you can hand it to a colleague.
- **Text supports typographic tokens.** Buttons above the text fields insert `{br}` (line break), `{nbsp}` (non-breaking space), `{shy}` (soft hyphen), `{zwsp}` (zero-width break opportunity), `{nbhy}` (non-breaking hyphen).
- **Learn on real briefs.** [`Tasks/`](Tasks/) contains 30 editorial assignments with data and a description of the expected result — see [`Tasks/README.md`](Tasks/README.md).

## Features

**Data**
- CSV import with a choice of field delimiter (`,`, `;`, tab, `|`) and decimal separator (`.` / `,`).
- Column mapping to X, Y and series; a separate point-label field and axis swap for scatter plots.
- Nine built-in sample datasets, including a multi-series time series (10 series × 200 days) and a heatmap matrix. Sample content follows the interface language.

**Chart types**

| Code | Chart |
|------|-------|
| `bar` / `barh` | Column / bar |
| `barStack` / `barhStack` | Stacked column / bar |
| `barStackNorm` / `barhStackNorm` | Normalized (100%) column / bar |
| `lollipop` / `lollipopH` | Lollipop, vertical / horizontal |
| `line` | Line |
| `lineStepBefore` / `lineStepAfter` | Step line (step before / after the value) |
| `area` | Area |
| `point` | Scatter |
| `heatmap` | Heatmap |

**Document layout**
- File width and height in pixels; chart margins; separate plot-area insets; per-block text spacing (title, legend, comment, footer).
- Plot area fill and border; canvas background behind the frame (preview only, not exported); optional document grid with adjustable cell size.
- Title, subtitle, legend title, axis titles, comment and footer (copyright + sources), each with alignment.

**Typography**
- Google Fonts collection plus local font files from `Fonts/` (`.woff`, `.woff2`, `.ttf`, `.otf`), or any folder you pick.
- One font and one color for all labels at once, or individual font, size, weight, italic, color and line height per text block.
- Fonts are embedded in the SVG export, so the file looks the same elsewhere.

**Axes and marks**
- Axis position, axis line, ticks, tick labels (padding, every N-th label, orientation), grid, manual min/max range, axis title gap.
- Bar gap in percent or pixels, or a fixed bar width; line thickness, point size, area opacity, lollipop stem and head size.
- Scatter projections to the X and Y axes; end markers for lines.

**Value labels**
- Position for bars (outside/inside the tip, center, base), pixel offsets, marker with optional stroke.
- Number format: decimal separator, thousands grouping, prefix and suffix.
- For scatter plots: name, series, X and Y on separate lines, with per-line styling.

**Color**
- Vega color schemes or per-series manual colors; element fill and background with opacity.
- Heatmap: a scheme-based gradient or a custom multi-stop gradient bound to the data min/max, with a gradient legend whose length and title are configurable.
- Legend marker is drawn as a vector shape (square or circle) sized in font points, so preview, PNG and SVG match exactly.

**Templates, export, sharing**
- Built-in design templates (Grotesque, Antiqua) plus JSON files from `templates/` (Golos, Public Types). Save the current design as a template, import someone else's, or reset to defaults.
- Export to PNG 2× / 4× and SVG; save and load the project as `.json` with data included.
- Collapsed/expanded state of panel sections, chosen language and local-font folder are remembered in the browser.

## Repository structure

```
datavizru.github.io/
├── index.html                  # the whole application: markup, styles, logic
├── i18n.js                     # RU→EN dictionary and language switching
├── logo.svg
├── Examples/                   # sample CSV files
├── CSV/                        # extra sample tables
├── Tasks/                      # 30 editorial briefs (tz.md + data.csv)
├── templates/                  # design templates + manifest
├── Fonts/                      # local font files + fonts-manifest.js
├── gen-examples-csv.mjs        # regenerate Examples/
├── gen-tasks-examples.mjs      # regenerate the task briefs
├── gen-fonts-manifest.py|.mjs  # rescan Fonts/ → fonts-manifest.js, fonts.json
└── gen-templates-manifest.py|.mjs  # rescan templates/ → manifest.json, templates-manifest.js
```

| Folder | Contents |
|--------|----------|
| [`Examples/`](Examples/) | Ready CSVs: months, categories, several series, scatter, heatmap matrix |
| [`Tasks/`](Tasks/) | 30 briefs — 01–20 in Russian, 21–30 in English — see the [catalog](Tasks/README.md) |
| [`templates/`](templates/) | Design templates shown in the *Design template* dropdown |
| [`Fonts/`](Fonts/) | Your own font files, picked up automatically via the manifest |

## Adding fonts and templates

The app cannot list a directory by itself, so both folders are described by generated manifests.

```bash
# after copying font files into Fonts/
python3 gen-fonts-manifest.py        # or: node gen-fonts-manifest.mjs

# after adding a *.json template into templates/
python3 gen-templates-manifest.py    # or: node gen-templates-manifest.mjs
```

Then reload the page (hard reload, <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>). The Node scripts need **Node.js 18+**; they are only for generating files, the editor itself needs nothing installed.

Sample data and briefs can be regenerated the same way:

```bash
node gen-examples-csv.mjs      # → Examples/
node gen-tasks-examples.mjs    # → Examples/Tasks/ (the shipped copy lives in Tasks/)
```

## Publishing your own copy on GitHub Pages

1. Push the repository to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Branch `main`, folder `/ (root)`.

`index.html` must stay in the repository root so that the relative paths `./Fonts/`, `./templates/`, `./i18n.js` keep working.

## Tech stack

- [Vega 5](https://vega.github.io/vega/), [Vega-Lite 5](https://vega.github.io/vega-lite/), [Vega-Embed 6](https://github.com/vega/vega-embed) — loaded from jsDelivr.
- Google Fonts plus optional local font files.
- No framework, no bundler, no dependencies to install: one HTML file and static assets next to it.

## License and feedback

[MIT License](LICENSE). Author: **Alexey Novichkov**. Current version: **0.1.0** (beta).

Third-party fonts in `Fonts/` and fonts loaded from Google Fonts are governed by their own licenses.

Issues and pull requests are welcome — CSV import bugs, ideas for new chart types, layout improvements.

---

# Русский

Загрузите CSV, постройте график, настройте типографику документа (заголовок, подзаголовок, легенду, заголовки осей, комментарий, футер) и выгрузите готовый PNG или редактируемый SVG. Всё работает в браузере — данные никуда не отправляются.

Движок отрисовки: [Vega-Lite 5](https://vega.github.io/vega-lite/) через [Vega-Embed 6](https://github.com/vega/vega-embed). Язык интерфейса: по умолчанию английский, переключатель ENG/RUS — в шапке.

## Быстрый старт

### 1. Откройте редактор

Самый быстрый способ — опубликованная версия: **[datavizru.github.io](https://datavizru.github.io/)**

Чтобы работать со своей копией, скачайте или клонируйте репозиторий и откройте `index.html` в браузере (достаточно двойного щелчка). Локальный сервер предпочтительнее: с ним подхватываются шрифты из `Fonts/` и шаблоны из `templates/`.

```bash
git clone https://github.com/datavizru/datavizru.github.io.git
cd datavizru.github.io

# Python 3 (уже есть в macOS и большинстве Linux)
python3 -m http.server 8080

# или Node.js
npx --yes serve -p 8080
```

Затем откройте `http://localhost:8080`.

Нужен современный браузер (Chrome, Firefox, Safari, Edge) и интернет при первой загрузке: Vega-Lite и Google Fonts подключаются с CDN.

### 2. Первый график за шесть шагов

1. **Выберите тип диаграммы** — левая панель, раздел «Тип диаграммы». Для начала подойдёт «Столбчатая».
2. **Возьмите данные** — в разделе «Данные» уже есть готовые наборы, можно экспериментировать сразу. Для своего файла укажите **разделитель полей** (`,` `;` табуляция `|`) и **десятичный разделитель** (`.` или `,`), затем нажмите **«Загрузить CSV…»**. Если числа выглядят неправильно, почти всегда виноват десятичный разделитель.
3. **Сопоставьте столбцы** — «Ось X / категория», «Ось Y / значение» и, если в таблице несколько рядов, «Ряд / серия (цвет)».
4. **Напишите текст** — заголовок, подзаголовок, заголовок легенды, заголовки осей, комментарий под диаграммой, футер с копирайтом и источниками. У каждого блока своё выравнивание.
5. **Настройте оформление** — правая панель отвечает за размер, поля, зону построения, шрифты, цвета, палитры, оси, сетку, подписи значений и легенду. Если не хочется настраивать всё вручную, выберите готовый **шаблон оформления** в самом верху панели.
6. **Экспортируйте** — «PNG 2×», «PNG 4×» или «SVG» в левой панели. Кнопка **«Сохранить»** складывает весь проект (настройки + данные) в файл `.json`, **«Загрузить»** — возвращает к работе позже.

### 3. Что полезно знать сразу

- **Зум и панорама работают как в Figma.** Колесо мыши или pinch на трекпаде масштабируют; перемещение — с зажатым <kbd>Space</kbd> либо перетаскиванием средней кнопкой мыши. Кнопки `−` / `+` меняют масштаб на 10%, клик по проценту или `⟲` возвращает вид к исходному.
- **Ничего не загружается на сервер.** Разбор CSV, отрисовка и экспорт происходят локально в браузере.
- **Файл проекта самодостаточен.** В сохранённом `.json` лежат строки импортированного CSV, все настройки оформления и язык интерфейса — такой файл можно передать коллеге.
- **В текстах работают типографские токены.** Кнопки над полями вставляют `{br}` (перенос строки), `{nbsp}` (неразрывный пробел), `{shy}` (мягкий перенос), `{zwsp}` (место переноса нулевой ширины), `{nbhy}` (неразрывный дефис).
- **Учитесь на реальных ТЗ.** В [`Tasks/`](Tasks/) — 30 редакционных заданий с данными и описанием ожидаемого результата, см. [`Tasks/README.md`](Tasks/README.md).

## Возможности

**Данные**
- Импорт CSV с выбором разделителя полей (`,`, `;`, табуляция, `|`) и десятичного разделителя (`.` / `,`).
- Сопоставление столбцов с осями X, Y и рядом; отдельное поле подписи точки и обмен осей для точечной диаграммы.
- Девять встроенных наборов данных, включая многорядный временной ряд (10 рядов × 200 дней) и матрицу для теплокарты. Содержимое наборов следует за языком интерфейса.

**Типы диаграмм**

| Код | Диаграмма |
|-----|-----------|
| `bar` / `barh` | Столбчатая / линейчатая |
| `barStack` / `barhStack` | С накоплением |
| `barStackNorm` / `barhStackNorm` | Нормированная (100%) |
| `lollipop` / `lollipopH` | Леденцовая, вертикальная / горизонтальная |
| `line` | Линейный график |
| `lineStepBefore` / `lineStepAfter` | Ступенчатый (ступень до / после значения) |
| `area` | Площадная |
| `point` | Точечная |
| `heatmap` | Тепловая карта |

**Макет документа**
- Ширина и высота файла в пикселях; поля диаграммы; отдельные отступы области построения; отступы каждого текстового блока (заголовок, легенда, комментарий, футер).
- Заливка и рамка зоны построения; фон холста за фреймом (только предпросмотр, в экспорт не попадает); модульная сетка документа с настраиваемым шагом.
- Заголовок, подзаголовок, заголовок легенды, заголовки осей, комментарий и футер (копирайт + источники) — у каждого выравнивание.

**Типографика**
- Коллекция Google Fonts плюс локальные файлы шрифтов из `Fonts/` (`.woff`, `.woff2`, `.ttf`, `.otf`) или из любой выбранной папки.
- Один шрифт и один цвет сразу для всех надписей — либо индивидуальные шрифт, кегль, насыщенность, курсив, цвет и интерлиньяж для каждого блока.
- Шрифты встраиваются в SVG-экспорт, поэтому файл выглядит одинаково на другом компьютере.

**Оси и формы**
- Расположение оси, линия оси, засечки, подписи засечек (отступ, каждая N-я, ориентация), сетка, ручной диапазон мин/макс, отступ заголовка оси.
- Зазор между столбиками в процентах или пикселях либо фиксированная ширина; толщина линий, размер точек, прозрачность области, ножка и головка «леденца».
- Проекции точек на оси X и Y; концевые маркеры линий.

**Подписи значений**
- Положение для столбиков (у вершины снаружи/внутри, по центру, у основания), сдвиги в пикселях, маркер с необязательной обводкой.
- Числовой формат: дробный разделитель, разделитель разрядов, префикс и суффикс.
- Для точечной: имя, ряд, X и Y отдельными строками, каждая со своим оформлением.

**Цвет**
- Цветовые схемы Vega или свои цвета для каждого ряда; заливка элементов и фон с прозрачностью.
- Тепловая карта: градиент по цветовой схеме или свой многоточечный градиент, привязанный к min/max данных, с легендой-градиентом (настраиваются длина и заголовок).
- Маркер легенды рисуется вектором (квадрат или круг) и задаётся в кеглях шрифта, поэтому превью, PNG и SVG совпадают.

**Шаблоны, экспорт, обмен**
- Встроенные шаблоны оформления («Гротеск», «Антиква») и JSON-файлы из `templates/` (Golos, Public Types). Текущее оформление можно сохранить как шаблон, импортировать чужой или сбросить к значениям по умолчанию.
- Экспорт в PNG 2× / 4× и SVG; сохранение и загрузка проекта в `.json` вместе с данными.
- Свёрнутые и развёрнутые разделы панелей, выбранный язык и папка локальных шрифтов запоминаются в браузере.

## Структура репозитория

```
datavizru.github.io/
├── index.html                  # всё приложение: разметка, стили, логика
├── i18n.js                     # словарь RU→EN и переключение языка
├── logo.svg
├── Examples/                   # примеры CSV
├── CSV/                        # дополнительные таблицы
├── Tasks/                      # 30 редакционных ТЗ (tz.md + data.csv)
├── templates/                  # шаблоны оформления + манифест
├── Fonts/                      # локальные шрифты + fonts-manifest.js
├── gen-examples-csv.mjs        # пересоздать Examples/
├── gen-tasks-examples.mjs      # пересоздать задания
├── gen-fonts-manifest.py|.mjs  # пересканировать Fonts/ → fonts-manifest.js, fonts.json
└── gen-templates-manifest.py|.mjs  # пересканировать templates/ → manifest.json, templates-manifest.js
```

| Папка | Содержимое |
|-------|------------|
| [`Examples/`](Examples/) | Готовые CSV: месяцы, категории, несколько рядов, точки, матрица теплокарты |
| [`Tasks/`](Tasks/) | 30 заданий — 01–20 на русском, 21–30 на английском, см. [каталог](Tasks/README.md) |
| [`templates/`](templates/) | Шаблоны для выпадающего списка «Шаблон оформления» |
| [`Fonts/`](Fonts/) | Собственные файлы шрифтов, подключаются автоматически через манифест |

## Как добавить шрифты и шаблоны

Приложение не может само прочитать содержимое папки, поэтому обе папки описаны сгенерированными манифестами.

```bash
# после копирования файлов шрифтов в Fonts/
python3 gen-fonts-manifest.py        # или: node gen-fonts-manifest.mjs

# после добавления *.json в templates/
python3 gen-templates-manifest.py    # или: node gen-templates-manifest.mjs
```

Затем обновите страницу с очисткой кэша (<kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>). Node-скриптам нужен **Node.js 18+**; они нужны только для генерации файлов, самому редактору устанавливать ничего не требуется.

Примеры данных и задания пересоздаются так же:

```bash
node gen-examples-csv.mjs      # → Examples/
node gen-tasks-examples.mjs    # → Examples/Tasks/ (готовый набор лежит в Tasks/)
```

## Публикация своей копии на GitHub Pages

1. Отправьте репозиторий на GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Ветка `main`, папка `/ (root)`.

`index.html` должен остаться в корне репозитория, чтобы продолжали работать относительные пути `./Fonts/`, `./templates/`, `./i18n.js`.

## Технологии

- [Vega 5](https://vega.github.io/vega/), [Vega-Lite 5](https://vega.github.io/vega-lite/), [Vega-Embed 6](https://github.com/vega/vega-embed) — подключаются с jsDelivr.
- Google Fonts и, при желании, локальные файлы шрифтов.
- Ни фреймворка, ни сборщика, ни зависимостей: один HTML-файл и статические ресурсы рядом.

## Лицензия и обратная связь

[MIT License](LICENSE). Автор: **Алексей Новичков**. Текущая версия: **0.1.0** (beta).

Права на сторонние шрифты в `Fonts/` и шрифты из Google Fonts регулируются их собственными лицензиями.

Issues и pull requests приветствуются: баги импорта CSV, идеи новых типов графиков, улучшения вёрстки документа.
