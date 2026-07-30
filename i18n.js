/* ════════════════════════ ЛОКАЛИЗАЦИЯ ИНТЕРФЕЙСА ════════════════════════
   Ключ словаря — русская строка (как в разметке и в коде), значение — перевод.
   Русский режим отдаёт ключ как есть, поэтому словарь нужен только для EN.

   Панели правой части генерируются по-русски, а затем переводятся обходом DOM
   (i18nApplyDom), поэтому новые надписи достаточно добавить в I18N_UI.
   ═══════════════════════════════════════════════════════════════════════ */

const I18N_LANG_STORAGE_KEY = "myc.lang";
const I18N_DEFAULT_LANG = "en";

/* Надписи интерфейса: разметка, генерируемые панели, статусы, подсказки.
   {name} в статусах — подстановка через t(key, vars). */
const I18N_UI = {
  /* ── Шапка и общее ── */
  "Визуализируй свои данные": "Visualize Your Data",
  "движок:": "engine:",
  "Готово": "Ready",
  "Раздел": "Section",
  "Слева": "Left",
  "По центру": "Center",
  "Справа": "Right",
  "Сверху": "Top",
  "Снизу": "Bottom",
  "Показывать": "Show",
  "Цвет": "Color",
  "Прозрачность": "Opacity",
  "Толщина": "Width",
  "Длина": "Length",
  "Значение": "Value",
  "Ряд": "Series",
  "Сохранить": "Save",
  "Загрузить": "Load",
  "Импорт…": "Import…",
  "авто": "auto",
  "все": "all",
  "— нет —": "— none —",

  /* ── Тип диаграммы ── */
  "Тип диаграммы": "Chart type",
  "Вид графика": "Chart kind",
  "Столбчатая": "Column",
  "Столбчатая с накоплением": "Stacked column",
  "Столбчатая нормированая": "100% stacked column",
  "Линейчатая": "Bar",
  "Линейчатая с накоплением": "Stacked bar",
  "Линейчатая нормированая": "100% stacked bar",
  "Леденцовая горизонтальная": "Lollipop horizontal",
  "Леденцовая вертикальная": "Lollipop vertical",
  "Линейный график": "Line",
  "Ступенчатый график (ступень до значения)": "Step line (step before)",
  "Ступенчатый график (ступень после значения)": "Step line (step after)",
  "Площадная": "Area",
  "Точечная": "Scatter",
  "Тепловая карта": "Heatmap",

  /* ── Данные ── */
  "Данные": "Data",
  "Набор для предпросмотра": "Preview dataset",
  "Сопоставление полей": "Field mapping",
  "Ось X / категория": "X axis / category",
  "Ось Y / значение": "Y axis / value",
  "Ряд / серия (цвет)": "Series (color)",
  "Ось X / столбцы": "X axis / columns",
  "Ось Y / строки": "Y axis / rows",
  "Значение (цвет)": "Value (color)",
  "Поменять оси X и Y": "Swap X and Y axes",
  "Подпись точки (имя)": "Point label (name)",
  "Файл CSV": "CSV file",
  "Разделитель полей": "Field delimiter",
  "Запятая (,)": "Comma (,)",
  "Точка с запятой (;)": "Semicolon (;)",
  "Табуляция": "Tab",
  "Вертикальная черта (|)": "Pipe (|)",
  "Дес. разделитель": "Decimal separator",
  "Точка (1.25)": "Period (1.25)",
  "Запятая (1,25)": "Comma (1,25)",
  "Загрузить CSV…": "Load CSV…",
  "Мои данные (CSV)": "My data (CSV)",

  /* ── Наборы данных ── */
  "Продажи по месяцам": "Monthly sales",
  "Категории": "Categories",
  "Доли браузеров": "Browser share",
  "Точки (x, y)": "Points (x, y)",
  "Точки (имя, x, y)": "Points (name, x, y)",
  "10 значений (десятки тысяч)": "10 values (tens of thousands)",
  "Несколько рядов": "Multiple series",
  "Тепловая карта: регионы × месяцы": "Heatmap: regions × months",
  "10 рядов × 200 дней": "10 series × 200 days",

  /* ── Текст ── */
  "Текст": "Text",
  "Заголовок и подзаголовок": "Title and subtitle",
  "Заголовок": "Title",
  "Подзаголовок": "Subtitle",
  "Выравнивание": "Alignment",
  "Выравнивание футера": "Footer alignment",
  "Легенда": "Legend",
  "Заголовок легенды": "Legend title",
  "пусто — без заголовка": "empty — no title",
  "Заголовки осей": "Axis titles",
  "Заголовок оси X": "X axis title",
  "Заголовок оси Y": "Y axis title",
  "пусто — без подписи": "empty — no title",
  "Сбросить: подставить имена столбцов X и Y": "Reset: use the X and Y column names",
  "Подписи внизу": "Bottom captions",
  "Комментарий под диаграммой": "Comment below the chart",
  "Необязательно": "Optional",
  "Футер · копирайт": "Footer · copyright",
  "Футер · источники": "Footer · sources",
  "Подзаголовок диаграммы": "Chart subtitle",
  "Источник: тестовые данные": "Source: sample data",
  "© Визуализируй свои данные. 2026": "© Visualize Your Data. 2026",

  /* ── Спецсимволы в текстах ── */
  "перенос строки": "line break",
  "неразрывный пробел": "non-breaking space",
  "мягкий перенос (дефис при переносе)": "soft hyphen (hyphen when wrapped)",
  "место переноса (нулевая ширина)": "break opportunity (zero width)",
  "неразрывный дефис": "non-breaking hyphen",

  /* ── Экспорт и проект ── */
  "Экспорт": "Export",
  "Проект": "Project",

  /* ── Масштаб холста ── */
  "Уменьшить (−10%). Масштаб колесом: ⌘/Ctrl + прокрутка или pinch на трекпаде": "Zoom out (−10%). Wheel zoom: ⌘/Ctrl + scroll or trackpad pinch",
  "Увеличить (+10%). Масштаб колесом: ⌘/Ctrl + прокрутка или pinch на трекпаде": "Zoom in (+10%). Wheel zoom: ⌘/Ctrl + scroll or trackpad pinch",
  "Сбросить до 100%": "Reset to 100%",

  /* ── Правая панель: навигация и шаблоны ── */
  "Раздел панели": "Panel section",
  "Быстрый переход к разделу оформления": "Quick jump to a styling section",
  "— перейти к разделу —": "— jump to section —",
  "Шаблон оформления": "Style template",
  "— выберите шаблон —": "— select a template —",
  "Сбросить оформление": "Reset styling",
  "Встроенные": "Built-in",
  "Из папки templates": "From the templates folder",
  "Гротеск": "Grotesque",
  "Антиква": "Antiqua",

  /* ── Фон холста и сетка ── */
  "Фон холста": "Canvas background",
  "Заливка области позади фрейма диаграммы (не входит в экспорт).":
    "Fill behind the chart frame (not included in the export).",
  "Сетка документа": "Document grid",
  "Ячейка, px": "Cell, px",

  /* ── Размер и поля ── */
  "Размер": "Size",
  "Ширина файла, px": "File width, px",
  "Высота файла, px": "File height, px",
  "Поля диаграммы": "Chart margins",
  "Верхнее, px": "Top, px",
  "Нижнее, px": "Bottom, px",
  "Левое, px": "Left, px",
  "Правое, px": "Right, px",

  /* ── Отступы области построения ── */
  "Отступы области построения": "Plot area insets",
  "Дополнительно к полям макета и отступам текстов. По умолчанию — 0.":
    "In addition to layout margins and text spacing. Default is 0.",
  "Верхний, px": "Top, px",
  "Нижний, px": "Bottom, px",
  "Левый, px": "Left, px",
  "Правый, px": "Right, px",

  /* ── Зона построения ── */
  "Зона построения": "Plot area",
  "Заливка": "Fill",
  "Цвет заливки": "Fill color",
  "Рамка": "Border",
  "Цвет рамки": "Border color",
  "Толщина рамки, px": "Border width, px",

  /* ── Отступы текстов ── */
  "Отступы текстов": "Text spacing",
  "Верхний отступ, px": "Top spacing, px",
  "Отступ между, px": "Spacing between, px",
  "Нижний отступ, px": "Bottom spacing, px",
  "Сверху, px": "Top, px",
  "Снизу, px": "Bottom, px",
  "Между заголовком и рядом, px": "Between title and items, px",
  "Комментарий": "Comment",
  "Футер": "Footer",

  /* ── Локальные шрифты ── */
  "Локальные шрифты": "Local fonts",
  "Обновить из Fonts/": "Reload from Fonts/",
  "Другая папка…": "Another folder…",
  "Системный": "System",
  "Локальные (Fonts/)": "Local (Fonts/)",
  "Шрифты в Fonts/ не найдены. Добавьте файлы и выполните: python3 gen-fonts-manifest.py":
    "No fonts found in Fonts/. Add files and run: python3 gen-fonts-manifest.py",
  "Добавлено семейств: {count}{src}. {names}": "Font families added: {count}{src}. {names}",
  "из выбранной папки": "from the selected folder",

  /* ── Надписи ── */
  "Надписи": "Text styles",
  "Шрифт всех надписей": "Font for all text",
  "Один шрифт для заголовка, осей, легенды, подписей и футера":
    "One font for the title, axes, legend, labels and footer",
  "Цвет всех надписей": "Color for all text",
  "Один цвет для заголовка, осей, легенды, подписей и футера":
    "One color for the title, axes, legend, labels and footer",
  "Один цвет для всех надписей": "One color for all text",
  "Сейчас у надписей разные цвета — выберите, чтобы унифицировать":
    "Text colors differ — pick one to unify them",
  "Начертание": "Face",
  "Интерлиньяж": "Line height",
  "Ж": "B",
  "К": "I",
  "HEX — вставьте цвет из Figma": "HEX — paste a color from Figma",
  "Подписи оси X": "X axis labels",
  "Подписи оси Y": "Y axis labels",
  "Текст легенды": "Legend text",
  "Подписи значений": "Value labels",
  "Точечная — имя точки": "Scatter — point name",
  "Точечная — ряд": "Scatter — series",
  "Точечная — значение X": "Scatter — X value",
  "Точечная — значение Y": "Scatter — Y value",
  "Концевая подпись — ряд": "End label — series",
  "Концевая подпись — значение": "End label — value",

  /* ── Оси ── */
  "Ось X": "X axis",
  "Ось Y": "Y axis",
  "Расположение": "Position",
  "Заголовок оси": "Axis title",
  "До подписей засечек, px": "To tick labels, px",
  "Линия оси": "Axis line",
  "Засечки": "Ticks",
  "Подписи засечек": "Tick labels",
  "Отступ от засечки": "Offset from tick",
  "Шаг (каждая N-я)": "Step (every Nth)",
  "Ориентация": "Orientation",
  "Горизонтально": "Horizontal",
  "Вертикально": "Vertical",
  "Вертикально (вниз)": "Vertical (downward)",
  "Сетка": "Grid",
  "Диапазон значений (для числовой оси)": "Value range (numeric axis)",
  "Пустые минимум и максимум — шкала по данным автоматически.":
    "Empty minimum and maximum — the scale fits the data automatically.",
  "Минимум": "Minimum",
  "Максимум": "Maximum",

  /* ── Цветовая шкала (тепловая карта) ── */
  "Цветовая шкала": "Color scale",
  "Градиент": "Gradient",
  "Цветовая схема": "Color scheme",
  "Свой градиент": "Custom gradient",
  "Схема": "Scheme",
  "Начальное, промежуточные и конечное значения с цветом. Нужно минимум 2 точки.":
    "Start, intermediate and end values with colors. At least 2 stops are required.",
  "+ Точка": "+ Stop",
  "Из данных (min–max)": "From data (min–max)",
  "Удалить точку": "Remove stop",
  "Диапазон данных: {min} … {max}": "Data range: {min} … {max}",
  "Легенда шкалы": "Scale legend",
  "Ширина градиента, px": "Gradient width, px",
  "Текст заголовка — из «Заголовок оси Y» в блоке «Текст».":
    "The title text comes from “Y axis title” in the Text block.",

  /* ── Заливка и палитра ── */
  "Заливка и палитра": "Fill and palette",
  "Цвет элементов": "Element color",
  "Фон": "Background",
  "Цвета рядов": "Series colors",
  "Свои цвета": "Custom colors",
  "Цветовая палитра": "Color palette",
  "Категориальные": "Categorical",
  "Последовательные": "Sequential",
  "Расходящиеся": "Diverging",
  "Цвет линии задаётся полем «Цвет элементов». Для отдельной раскраски выберите поле ряда в разделе «Данные».":
    "The line color comes from “Element color”. To color series separately, pick a series field in the Data section.",

  /* ── Формы ── */
  "Формы": "Shapes",
  "Столбики и линейки": "Columns and bars",
  "Зазор между": "Gap between",
  "Фиксированная ширина": "Fixed width",
  "Зазор между столбиками": "Gap between columns",
  "Ширина, px": "Width, px",
  "Толщина ножки, px": "Stem width, px",
  "0 — ножка скрыта": "0 — stem hidden",
  "Диаметр окружности, px": "Head diameter, px",
  "0 — головка скрыта": "0 — head hidden",
  "Толщина линий": "Line width",
  "Размер точек": "Point size",
  "Прозрачность области": "Area opacity",

  /* ── Проекции на оси ── */
  "Проекции на оси": "Axis projections",
  "Линии от точки до нуля на выбранной оси (начало отсчёта). Оси можно включать по отдельности.":
    "Lines from the point to zero on the chosen axis (the origin). Axes can be enabled separately.",
  "На ось X — вертикальные": "To the X axis — vertical",
  "На ось Y — горизонтальные": "To the Y axis — horizontal",
  "На ось X ({px}) — вертикальные": "To the X axis ({px}) — vertical",
  "На ось Y ({py}) — горизонтальные": "To the Y axis ({py}) — horizontal",
  "нижняя": "bottom",
  "левая": "left",
  "Толщина, px": "Width, px",

  /* ── Подписи значений ── */
  "Только значения": "Values only",
  "Выключено: «название оси: значение». Включено: только число.":
    "Off: “axis name: value”. On: the number only.",
  "Имя точки": "Point name",
  "Значение X": "X value",
  "Значение Y": "Y value",
  "Точечная: строки подписи друг над другом (имя → ряд → X → Y). Оформление каждой строки — в разделе «Надписи».":
    "Scatter: label lines are stacked (name → series → X → Y). Style each line in the Text styles section.",
  "Положение (столбики/линейки)": "Position (columns/bars)",
  "У вершины снаружи": "Outside the end",
  "У вершины внутри": "Inside the end",
  "У основания": "At the base",
  "Сдвиг по горизонтали, px": "Horizontal offset, px",
  "Сдвиг по вертикали, px": "Vertical offset, px",
  "Числовой формат значений": "Number format",
  "Дробная часть": "Decimal mark",
  "Разделитель разрядов": "Thousands separator",
  "Тепловая карта: подписи значений всегда по центру ячейки.":
    "Heatmap: value labels are always centered in the cell.",
  "Влияет на подписи значений и числовые подписи осей. При запятой в дробной части — пробел между разрядами; при точке — запятая.":
    "Applies to value labels and numeric axis labels. With a comma decimal mark thousands are separated by a space; with a period, by a comma.",
  "Префикс": "Prefix",
  "Суффикс": "Suffix",
  "например $ или ~": "e.g. $ or ~",
  "например % или млн": "e.g. % or M",
  "Маркер (линии / области)": "Marker (lines / areas)",
  "Диаметр маркера, px": "Marker diameter, px",
  "Обводка маркера": "Marker stroke",
  "Цвет обводки": "Stroke color",
  "Толщина обводки, px": "Stroke width, px",

  /* ── Концевые маркеры ── */
  "Концевые маркеры линий": "Line end markers",
  "Маркер": "Marker",
  "Подпись ряда": "Series label",
  "Подпись значения": "Value label",
  "{label} — смещение от маркера": "{label} — offset from the marker",
  "По горизонтали, px": "Horizontal, px",
  "По вертикали, px": "Vertical, px",
  "Шрифт, размер, цвет и начертание — в разделе «Надписи» (Концевая подпись — ряд / значение).":
    "Font, size, color and face are in the Text styles section (End label — series / value).",
  "Слева (начало линии)": "Left (line start)",
  "Справа (конец линии)": "Right (line end)",

  /* ── Отображение ── */
  "Отображение": "Display",
  "Маркер в легенде": "Legend marker",
  "Квадрат ■": "Square ■",
  "Круг ●": "Circle ●",
  "Кегль маркера": "Marker font size",
  "Размер маркера в кеглях шрифта легенды. Пусто — как у текста легенды":
    "Marker size in legend font points. Empty — same as the legend text",

  /* ── Статусы ── */
  "Готово · {type} · {w}×{h}": "Ready · {type} · {w}×{h}",
  "Ошибка: ": "Error: ",
  "Экспорт PNG {n}×…": "Exporting PNG {n}×…",
  "PNG {n}×: график…": "PNG {n}×: chart…",
  "PNG {n}×: надписи…": "PNG {n}×: text…",
  "Сохранено: PNG {n}×": "Saved: PNG {n}×",
  "Ошибка PNG: ": "PNG error: ",
  "Экспорт SVG…": "Exporting SVG…",
  "Сохранено: SVG": "Saved: SVG",
  " · шрифты как в превью": " · fonts as in the preview",
  " · без встраивания шрифтов": " · without embedding fonts",
  " · шрифты встроены": " · fonts embedded",
  " · шрифты не встроены": " · fonts not embedded",
  " · шрифты не встроены (системные или сеть)": " · fonts not embedded (system or network)",
  "Проект сохранён ({n} строк CSV в файле)": "Project saved ({n} CSV rows in the file)",
  "Проект сохранён в JSON": "Project saved to JSON",
  "Проект загружен · {n} строк CSV{name}": "Project loaded · {n} CSV rows{name}",
  "Проект загружен из JSON": "Project loaded from JSON",
  "Не удалось прочитать CSV из проекта: ": "Could not read the CSV from the project: ",
  "Не удалось прочитать JSON: ": "Could not read the JSON: ",
  "CSV загружен": "CSV loaded",
  "CSV перечитан с новыми настройками": "CSV re-parsed with the new settings",
  "Ошибка CSV: ": "CSV error: ",
  "{file} · {n} строк": "{file} · {n} rows",
  "{file} · {n} строк · «{d}» · {dec}": "{file} · {n} rows · “{d}” · {dec}",
  "{n} строк · «{d}» · {dec}": "{n} rows · “{d}” · {dec}",
  "запятая": "comma",
  "точка": "period",
  "таб": "tab",
  "Шаблон сохранён": "Template saved",
  "Шаблон импортирован: ": "Template imported: ",
  "Шаблон применён: ": "Template applied: ",
  "Ошибка шаблона: ": "Template error: ",
  "Не удалось загрузить шаблон: ": "Could not load the template: ",
  "Оформление сброшено": "Styling reset",
  "Из папки templates: {n} (без сервера)": "From the templates folder: {n} (no server)",
  "Плюс из папки templates: {n}": "Plus from the templates folder: {n}",
  "Встроенные шаблоны доступны": "Built-in templates are available",
  "Добавьте шаблоны в templates/ и выполните gen-templates-manifest. Или «Импорт…».":
    "Add templates to templates/ and run gen-templates-manifest. Or use “Import…”.",
  "Язык интерфейса": "Interface language",

  /* ── Ошибки ── */
  "vegaEmbed не загружен — проверьте интернет и обновите страницу (Cmd+Shift+R)":
    "vegaEmbed is not loaded — check your internet connection and reload the page (Cmd+Shift+R)",
  "нет области графика": "no plot area",
  "экспорт графика недоступен": "chart export is unavailable",
  "нужно не меньше двух столбцов": "at least two columns are required",
  "пустой файл": "empty file",
  "нет манифеста": "no manifest",

  /* ── Подпись в футере страницы ── */
  "© 2026 · Алексей Новичков · v{v} (alpha) · MIT · {github} · Счастье для всех, даром, и пусть никто не уйдет обиженный!":
    "© 2026 · Aleksei Novichkov · v{v} (alpha) · MIT · {github} · Happiness for everyone, free of charge, and let no one be left behind!"
};

/* Блоки с внутренней разметкой (<code>) переводятся целиком по data-i18n-html. */
const I18N_HTML = {
  "note.templates": {
    ru: `Новый файл в <code>templates/</code> → в корне репозитория:
          <code>python3 gen-templates-manifest.py</code>
          (или <code>node gen-templates-manifest.mjs</code>), затем обновите страницу.`,
    en: `A new file in <code>templates/</code> → in the repository root run:
          <code>python3 gen-templates-manifest.py</code>
          (or <code>node gen-templates-manifest.mjs</code>), then reload the page.`
  },
  "note.localFonts": {
    ru: `Положите файлы в <code>Fonts/</code> и выполните <code>python3 gen-fonts-manifest.py</code>, затем обновите страницу (Cmd+Shift+R). Кнопка «Обновить» — при локальном сервере.
          При открытии страницы шрифты подключаются автоматически.`,
    en: `Put the files into <code>Fonts/</code> and run <code>python3 gen-fonts-manifest.py</code>, then reload the page (Cmd+Shift+R). The reload button needs a local server.
          Fonts are attached automatically when the page opens.`
  }
};

/* Содержимое предустановленных наборов: имена полей и категориальные значения. */
const I18N_DATA_TERMS = {
  "Месяц": "Month",
  "Продажи": "Sales",
  "Категория": "Category",
  "Значение": "Value",
  "Браузер": "Browser",
  "Доля": "Share",
  "Имя": "Name",
  "Серия": "Series",
  "Регион": "Region",
  "День": "Day",
  "Янв": "Jan", "Фев": "Feb", "Мар": "Mar", "Апр": "Apr", "Май": "May", "Июн": "Jun",
  "Июл": "Jul", "Авг": "Aug", "Сен": "Sep", "Окт": "Oct", "Ноя": "Nov", "Дек": "Dec",
  "Дизайн": "Design",
  "Разработка": "Development",
  "Маркетинг": "Marketing",
  "Поддержка": "Support",
  "Прочие": "Other",
  "Россия": "Russia", "Германия": "Germany", "Франция": "France", "Италия": "Italy",
  "Испания": "Spain", "Польша": "Poland", "Турция": "Turkey", "Китай": "China",
  "Индия": "India", "Бразилия": "Brazil",
  "Север": "North", "Юг": "South", "Запад": "West", "Восток": "East"
};
for (let i = 1; i <= 10; i++) I18N_DATA_TERMS["Ряд " + i] = "Series " + i;

const I18N_DATA_TERMS_INV = {};
for (const ru in I18N_DATA_TERMS) I18N_DATA_TERMS_INV[I18N_DATA_TERMS[ru]] = ru;

/* Не переводим: сама диаграмма (это контент пользователя) и блоки,
   которые заполняются из кода уже переведёнными строками. */
const I18N_SKIP_TAGS = new Set(["SCRIPT", "STYLE"]);
// У textarea переводим только placeholder: содержимое — текст пользователя.
const I18N_ATTRS_ONLY_TAGS = new Set(["TEXTAREA", "INPUT"]);
const I18N_SKIP_IDS = new Set([
  "chartFrame", "viz", "status", "appMeta",
  "csvName", "localFontsStatus", "tplNote", "heatmapDataRange",
  "dataset", "fieldX", "fieldY", "fieldSeries", "fieldPointLabel"
]);
const I18N_ATTRS = ["title", "placeholder", "aria-label", "alt", "label"];

let I18N_LANG = I18N_DEFAULT_LANG;
const _i18nTextOrig = new WeakMap();
const _i18nAttrOrig = new WeakMap();

function i18nLang(){ return I18N_LANG; }
function i18nNormalizeLang(l){ return l === "ru" ? "ru" : "en"; }
function i18nSetLang(l){ I18N_LANG = i18nNormalizeLang(l); }
function i18nStoredLang(){
  try { return localStorage.getItem(I18N_LANG_STORAGE_KEY); } catch (e) { return null; }
}
function i18nStoreLang(l){
  try { localStorage.setItem(I18N_LANG_STORAGE_KEY, i18nNormalizeLang(l)); } catch (e) {}
}

/* Перевод строки. vars подставляет {name} — работает в обоих языках. */
function L(key, vars){
  let s = String(key == null ? "" : key);
  if (I18N_LANG === "en" && Object.prototype.hasOwnProperty.call(I18N_UI, s)) s = I18N_UI[s];
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}
/* Перевод на английский независимо от текущего языка (для сборки EN-наборов данных). */
function tEn(key){
  const s = String(key == null ? "" : key);
  return Object.prototype.hasOwnProperty.call(I18N_UI, s) ? I18N_UI[s] : s;
}
/* Термин данных из RU в целевой язык и обратно. */
function i18nDataTerm(term, lang){
  const s = String(term == null ? "" : term);
  const map = i18nNormalizeLang(lang) === "en" ? I18N_DATA_TERMS : I18N_DATA_TERMS_INV;
  return Object.prototype.hasOwnProperty.call(map, s) ? map[s] : s;
}

function i18nTranslateText(orig){
  const key = orig.replace(/\s+/g, " ").trim();
  if (!key) return null;
  const tr = L(key);
  if (tr === key) return null;
  return orig.match(/^\s*/)[0] + tr + orig.match(/\s*$/)[0];
}
function i18nApplyTextNode(node){
  if (!_i18nTextOrig.has(node)) {
    if (!/[А-Яа-яЁё]/.test(node.nodeValue || "")) return;
    _i18nTextOrig.set(node, node.nodeValue);
  }
  const orig = _i18nTextOrig.get(node);
  node.nodeValue = i18nTranslateText(orig) ?? orig;
}
function i18nApplyAttrs(el){
  let store = _i18nAttrOrig.get(el);
  for (const attr of I18N_ATTRS) {
    if (!el.hasAttribute(attr)) continue;
    if (!store || !(attr in store)) {
      const cur = el.getAttribute(attr);
      if (!/[А-Яа-яЁё]/.test(cur)) continue;
      if (!store) { store = {}; _i18nAttrOrig.set(el, store); }
      store[attr] = cur;
    }
    const orig = store[attr];
    el.setAttribute(attr, i18nTranslateText(orig) ?? orig);
  }
}
function i18nApplyNode(node){
  if (node.nodeType === Node.TEXT_NODE) { i18nApplyTextNode(node); return; }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (I18N_SKIP_TAGS.has(node.tagName)) return;
  if (node.id && I18N_SKIP_IDS.has(node.id)) return;
  const htmlKey = node.dataset ? node.dataset.i18nHtml : null;
  if (htmlKey && I18N_HTML[htmlKey]) {
    node.innerHTML = I18N_HTML[htmlKey][I18N_LANG] ?? I18N_HTML[htmlKey].ru;
    return;
  }
  i18nApplyAttrs(node);
  if (I18N_ATTRS_ONLY_TAGS.has(node.tagName)) return;
  for (const child of [...node.childNodes]) i18nApplyNode(child);
}
/* Перевести уже готовый DOM (разметку и сгенерированные панели). */
function i18nApplyDom(root){
  i18nApplyNode(root || document.body);
}
function i18nIsSkipped(node){
  let el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  while (el) {
    if (I18N_SKIP_TAGS.has(el.tagName)) return true;
    if (el.id && I18N_SKIP_IDS.has(el.id)) return true;
    el = el.parentElement;
  }
  return false;
}
/* Панели правой части перестраиваются из кода по-русски, поэтому переводим
   добавленные узлы на месте. Наблюдаем только childList: правка nodeValue и
   атрибутов не порождает новых событий, поэтому цикла нет. */
function i18nObserveDom(root){
  if (!root || typeof MutationObserver !== "function") return;
  new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (!i18nIsSkipped(node)) i18nApplyNode(node);
      }
    }
  }).observe(root, { childList: true, subtree: true });
}
function i18nApplyDocumentMeta(){
  document.documentElement.lang = I18N_LANG;
  document.title = L("Визуализируй свои данные");
}
