#!/usr/bin/env node
/**
 * Генерирует Examples/Tasks/task-NN-name/ (tz.md + data.csv).
 * Запуск: node gen-tasks-examples.mjs
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "Examples", "Tasks");
const MD_PREVIEW_ROWS = 18;

const MONTHS_RU = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
];

const MONTHS_ISO = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"
];

/** Длинный формат: период × серия → значение (для grouped/stacked/line). */
function seriesGrid(periods, series, valueFn, fmt = v => String(v)) {
  const rows = [];
  for (const p of periods) {
    for (const s of series) {
      rows.push([p, s, fmt(valueFn(p, s))]);
    }
  }
  return rows;
}

/** Теплокарта: ось1 × ось2 → значение. */
function heatmapGrid(rows, cols, valueFn, fmt = v => String(v)) {
  const out = [];
  for (const r of rows) {
    for (const c of cols) {
      out.push([r, c, fmt(valueFn(r, c))]);
    }
  }
  return out;
}

function escapeMdCell(s) {
  return String(s).replace(/\|/g, "\\|");
}

function buildMdTable(headers, rows) {
  const head = "| " + headers.map(escapeMdCell).join(" | ") + " |";
  const sep = "| " + headers.map(() => "---").join(" | ") + " |";
  const body = rows.map(r => "| " + r.map(escapeMdCell).join(" | ") + " |").join("\n");
  return `${head}\n${sep}\n${body}`;
}

function previewForMd(headers, rows, lang) {
  if (rows.length <= MD_PREVIEW_ROWS) return { headers, rows, note: null };
  const note =
    lang === "en"
      ? `*Table shows the first ${MD_PREVIEW_ROWS} of ${rows.length} rows. Full dataset: \`data.csv\`.*`
      : `*В таблице показаны первые ${MD_PREVIEW_ROWS} строк из ${rows.length}. Полный набор — в \`data.csv\`.*`;
  return { headers, rows: rows.slice(0, MD_PREVIEW_ROWS), note };
}

function buildTzMd(task) {
  const en = task.lang === "en";
  const { delimiter, decimal } = task.csv;
  const delimNote = en
    ? delimiter === ";"
      ? "semicolon (`;`)"
      : delimiter === "\t"
        ? "tab"
        : "comma (`,`)"
    : delimiter === ";"
      ? "точка с запятой (`;`)"
      : delimiter === "\t"
        ? "табуляция"
        : "запятая (`,`)";
  const decNote = en ? "period (`.`)" : decimal === "," ? "запятая" : "точка";
  const prev = previewForMd(task.headers, task.rows, task.lang);
  const tableNote = prev.note ? `\n\n${prev.note}\n` : "";
  const brief = task.brief
    ? en
      ? `\n### Visualization brief\n\n${task.brief}\n`
      : `\n### Задание для визуализации\n\n${task.brief}\n`
    : "";

  const rowsLabel = en ? "rows" : "строк";
  const seriesLabel = en ? "series" : "рядов";
  const meta = en
    ? `**CSV settings:** field delimiter — ${delimNote}; decimal separator — ${decNote}. File: \`data.csv\` (${task.rows.length} ${rowsLabel}${task.seriesCount ? `, ${task.seriesCount} ${seriesLabel}` : ""}).`
    : `**Параметры CSV:** разделитель полей — ${delimNote}; десятичный разделитель — ${decNote}. Файл: \`data.csv\` (${task.rows.length} ${rowsLabel}${task.seriesCount ? `, ${task.seriesCount} ${seriesLabel}` : ""}).`;

  return `# ${task.title}

## ${task.subtitle}
${brief}
### ${en ? "Data" : "Данные"}

${buildMdTable(prev.headers, prev.rows)}${tableNote}

${meta}

### ${en ? "Analytical caption" : "Краткая аналитическая подпись"}

${task.caption}

---

${task.copyright}

### ${en ? "Sources" : "Источники"}

${task.sources}
`;
}

function buildCsv(task) {
  const { delimiter } = task.csv;
  const lines = [task.headers.join(delimiter)];
  for (const row of task.rows) lines.push(row.join(delimiter));
  return lines.join("\n") + "\n";
}

// --- Данные с множеством рядов ---

const FUEL_SERIES = ["АИ-92", "АИ-95", "ДТ"];
const fuelRows = seriesGrid(
  MONTHS_ISO,
  FUEL_SERIES,
  (m, s) => {
    const i = MONTHS_ISO.indexOf(m);
    const base = s === "АИ-92" ? 52 : s === "АИ-95" ? 56 : 58;
    return (base + i * 0.35 + (s === "ДТ" ? 1.2 : 0)).toFixed(2);
  }
);

const INDUSTRIES = [
  "Строительство", "Образование", "Здравоохранение", "Торговля", "Транспорт",
  "IT и связь", "Финансы", "Промышленность", "Сельское хоз.", "Госуправление"
];
const wageRows = seriesGrid(
  MONTHS_ISO.slice(0, 8),
  INDUSTRIES,
  (m, s) => {
    const i = MONTHS_ISO.indexOf(m);
    const b = 42000 + INDUSTRIES.indexOf(s) * 2800;
    return Math.round(b + i * 450 + ((INDUSTRIES.indexOf(s) * 3 + i) % 5) * 120);
  }
);

const REGIONS_DEATHS = [
  "Москва", "СПб", "Московская обл.", "Краснодарский край", "Свердловская обл.",
  "Респ. Татарстан", "Новосибирская обл.", "Ростовская обл.", "Башкортостан",
  "Приморский край", "Самарская обл.", "Красноярский край"
];

const POLLUTION_CITIES = [
  "Москва", "СПб", "Казань", "Новосибирск", "Екатеринбург",
  "Красноярск", "Челябинск", "Омск", "Уфа", "Волгоград"
];
const days30 = Array.from({ length: 30 }, (_, d) => {
  const dt = new Date(2025, 10, 1 + d);
  return dt.toISOString().slice(0, 10);
});
const pm25Rows = seriesGrid(
  days30,
  POLLUTION_CITIES,
  (day, city) => {
    const d = days30.indexOf(day);
    const c = POLLUTION_CITIES.indexOf(city);
    return Math.max(8, Math.round(28 + c * 1.8 + Math.sin((d + c) / 4) * 12 + (d % 7) * 2));
  }
);

const PRODUCT_LINES = [
  "Молочные", "Выпечка", "Напитки", "Заморозка", "Бакалея", "Снеки", "Детское", "Гигиена"
];
const retailRows = seriesGrid(
  ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"],
  PRODUCT_LINES,
  (q, line) => {
    const qi = ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"].indexOf(q);
    const li = PRODUCT_LINES.indexOf(line);
    const v = 85 + li * 12 + qi * 4 + (li + qi) % 3 * 7;
    return v.toFixed(1).replace(".", ",");
  }
);

const HEAT_REGIONS = [
  "Центр", "СЗ", "Юг", "Кавказ", "Поволжье", "Урал", "Сибирь", "ДВ"
];
const heatMonths = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const tariffRows = heatmapGrid(
  HEAT_REGIONS,
  heatMonths,
  (reg, mon) => {
    const r = HEAT_REGIONS.indexOf(reg);
    const m = heatMonths.indexOf(mon);
    return (4.2 + r * 0.15 + (m > 5 ? 0.8 : 0) + m * 0.05).toFixed(1);
  }
);

const EXPORT_COUNTRIES = ["Германия", "Нидерланды", "Франция", "Италия", "Польша", "Китай", "Турция", "Казахстан"];
const exportRows = [];
for (const m of MONTHS_ISO) {
  const i = MONTHS_ISO.indexOf(m);
  const row = [m];
  for (let c = 0; c < EXPORT_COUNTRIES.length; c++) {
    row.push((8 + c * 1.2 + i * 0.45 + (c + i) % 4).toFixed(1).replace(".", ","));
  }
  exportRows.push(row);
}

const AGE_GROUPS = ["0–14", "15–29", "30–44", "45–59", "60+"];
const weeks12 = Array.from({ length: 12 }, (_, i) => String(40 + i));
const orviRows = seriesGrid(
  weeks12,
  AGE_GROUPS,
  (w, age) => {
    const wi = weeks12.indexOf(w);
    const ai = AGE_GROUPS.indexOf(age);
    return Math.round(12 + wi * 2 + ai * 3 + Math.sin(wi / 2) * 8 + (wi === 7 ? 18 : 0));
  }
);

const UNIVERSITIES = [
  "МГУ", "СПбГУ", "МФТИ", "ВШЭ", "ИТМО", "УрФУ", "НГУ", "КФУ",
  "ДВФУ", "РУДН", "МГИМО", "Бауманка", "РАНХиГС", "МИСиС", "Сеченовский"
];

const HOTLINE_REASONS = [
  "ЖКХ и коммуналка", "Дороги и транспорт", "Медицина", "Образование",
  "Экология", "Безопасность", "Соцвыплаты", "Занятость", "Жильё",
  "Связь и интернет", "Торговля и услуги", "Прочее"
];

const HOUSING_CITIES = ["Москва", "СПб", "Казань", "Новосибирск", "Екатеринбург", "Краснодар"];
const HOUSING_QUARTERS = [
  "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"
];
const housingRows = [];
for (const q of HOUSING_QUARTERS) {
  for (const city of HOUSING_CITIES) {
    const qi = HOUSING_QUARTERS.indexOf(q);
    const ci = HOUSING_CITIES.indexOf(city);
    const base = [320, 210, 145, 118, 125, 132][ci];
    const v = base + qi * 4 + ci * 2;
    const sec = v.toFixed(1).replace(".", ",");
    const neu = (v * 0.91).toFixed(1).replace(".", ",");
    housingRows.push([q, city, "Вторичка", sec]);
    housingRows.push([q, city, "Новострой", neu]);
  }
}

const IPC_COMPONENTS = ["Продукты", "Услуги", "Непродовольственные"];
const ipcRows = seriesGrid(
  MONTHS_RU,
  IPC_COMPONENTS,
  (mon, comp) => {
    const m = MONTHS_RU.indexOf(mon);
    const c = IPC_COMPONENTS.indexOf(comp);
    const v = 0.3 + m * 0.05 + c * 0.08 + (m > 4 ? 0.15 : 0);
    return v.toFixed(1).replace(".", ",");
  }
);

const TASKS_RU = [
  {
    dir: "task-01-ceny-benzin",
    title: "Цены на топливо на АЗС выросли восьмой месяц подряд",
    subtitle: "Средняя розничная цена, ₽/л, федеральная выборка, 2025",
    brief: "Постройте динамику по маркам топлива. Акцент — на расхождении дизеля и бензина к осени.",
    caption:
      "С января АИ-95 подорожал на 4,2 ₽/л, дизель — на 5,1 ₽/л. Разрыв между ДТ и АИ-92 сократился с 6 до 4,8 ₽ к декабрю.",
    copyright: "© 2026 Редакция «Макет данных». Учебный материал, не новостной выпуск.",
    sources: "Росстат; еженедельный срез цен на АЗС (агрегат по 85 регионам). Методика — медиана по сети.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Месяц", "Марка", "Цена"],
    rows: fuelRows,
    seriesCount: FUEL_SERIES.length
  },
  {
    dir: "task-02-ocheredi-poliklinik",
    title: "В трёх регионах время ожидания к врачу превысило три недели",
    subtitle: "Медиана дней до приёма по специализации «терапия», ноябрь 2025",
    brief: "Сравните регионы. Подпись должна отвечать на вопрос: где очередь критичнее всего.",
    caption:
      "Лидер — Дальний Восток (24 дня). В Центре и на Северо-Западе показатель впервые за год опустился ниже 10 дней.",
    copyright: "© 2026 «Здоровье+Данные», совместный разбор с открытой статистикой.",
    sources: "Минздрав, открытая панель записи к врачу; медиана по первичным обращениям.",
    csv: { delimiter: ";", decimal: "," },
    headers: ["Регион", "Дней_ожидания"],
    rows: [
      ["Москва", "7,5"], ["Санкт-Петербург", "8,2"], ["Центр", "9,1"],
      ["Северо-Запад", "9,8"], ["Юг", "14,3"], ["Поволжье", "13,0"],
      ["Урал", "15,7"], ["Сибирь", "18,4"], ["Дальний Восток", "24,0"],
      ["Крым", "12,1"], ["Северный Кавказ", "11,6"]
    ]
  },
  {
    dir: "task-03-zhara-po-gorodam",
    title: "Рекордная жара на юге: +2,4 °C к норме",
    subtitle: "Отклонение средней температуры июля 2025 от многолетней нормы, °C",
    brief: "Карта или столбцы по городам. Покажите контраст юг/север без привязки к абстрактным осям X/Y.",
    caption:
      "Сочи и Краснодар — выше нормы более чем на 2 °C. Мурманск остаётся в пределах климатической нормы (+0,3 °C).",
    copyright: "© 2026 ClimateDesk (учебный выпуск).",
    sources: "Росгидромет; норма 1991–2020; городские метеостанции.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Город", "Аномалия_С"],
    rows: [
      ["Мурманск", "0.3"], ["Архангельск", "0.9"], ["Москва", "1.4"],
      ["Казань", "1.6"], ["Самара", "1.9"], ["Ростов-на-Дону", "2.1"],
      ["Краснодар", "2.4"], ["Сочи", "2.5"], ["Волгоград", "2.0"],
      ["Новосибирск", "1.2"], ["Иркутск", "0.8"]
    ]
  },
  {
    dir: "task-04-dtp-po-regionam",
    title: "ДТП с пострадавшими: южные регионы вне топа впервые за пять лет",
    subtitle: "Число погибших на 100 тыс. жителей, 10 мес. 2025 (накопительно)",
    brief: "Рейтинг по регионам. Ищите выбросы и группировку «центр vs периферия».",
    caption:
      "Максимум — Приморье (11,2). Москва и СПб — ниже 4,0 за счёт инфраструктуры и ограничений скорости.",
    copyright: "© 2026 «Безопасные дороги», аналитическая колонка.",
    sources: "ГИБДД, статистическая форма 1-ДТП; население — оценка на 01.10.2025.",
    csv: { delimiter: ";", decimal: "," },
    headers: ["Регион", "Погибшие_на_100k"],
    rows: REGIONS_DEATHS.map((r, i) => [
      r,
      (4.2 + (i % 5) * 0.9 + (i > 8 ? 2.1 : 0) + (i === 10 ? 1.5 : 0)).toFixed(1).replace(".", ",")
    ])
  },
  {
    dir: "task-05-byudzhet-municipalitet",
    title: "Почти половина муниципального бюджета уходит на соцсферу",
    subtitle: "Структура расходов, млрд ₽, город N, 2025",
    brief: "Доля статей в общем объёме. Подпись — в рублях и процентах от суммы.",
    caption:
      "Образование и здравоохранение — 31% совокупно; на дороги — 8%, меньше, чем в 2024 (10%).",
    copyright: "© 2026 Городская дата-студия.",
    sources: "Открытый бюджет municipality N; исполнение на 01.12.2025.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Статья", "Млрд_руб"],
    rows: [
      ["Образование", "18.4"], ["Здравоохранение", "14.2"], ["ЖКХ", "9.8"],
      ["Дороги", "4.1"], ["Культура", "2.6"], ["Безопасность", "3.5"],
      ["Соцподдержка", "6.9"], ["Администрирование", "5.0"], ["Прочее", "3.2"]
    ]
  },
  {
    dir: "task-06-zarplaty-po-otraslyam",
    title: "IT сохраняет разрыв с бюджетниками, но рост замедлился",
    subtitle: "Начисленная зарплата, ₽, медиана по отраслям, янв–авг 2025",
    brief: "Многорядовый график: 10 отраслей × 8 месяцев. Покажите лидеров и отстающих.",
    caption:
      "Разрыв IT и «Госуправление» — 2,4× в августе против 2,6× в январе. Сильнее всех растут «Транспорт» и «Строительство».",
    copyright: "© 2026 «Экономика в цифрах».",
    sources: "ФНС (обезличенные агрегаты); отрасль по ОКВЭД-2, медиана наёмных.",
    csv: { delimiter: ";", decimal: "." },
    headers: ["Месяц", "Отрасль", "Зарплата"],
    rows: wageRows,
    seriesCount: INDUSTRIES.length
  },
  {
    dir: "task-07-zhkkh-zhaloby",
    title: "Жалобы на отопление вышли на пик за пять лет",
    subtitle: "Обращения на городскую горячую линию, шт., январь–декабрь 2025",
    brief: "12 тематик × 12 месяцев. Найдите сезонный всплеск ЖКХ и спад летом.",
    caption:
      "В ноябре «ЖКХ и коммуналка» — 4 820 обращений (+38% к октябрю). Летом лидирует «Дороги и транспорт».",
    copyright: "© 2026 Мэрия (открытые данные), учебная выборка.",
    sources: "Единый контакт-центр; классификатор тем, без персональных данных.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Месяц", "Тема", "Обращения"],
    rows: seriesGrid(
      MONTHS_RU,
      HOTLINE_REASONS,
      (mon, topic) => {
        const m = MONTHS_RU.indexOf(mon);
        const t = HOTLINE_REASONS.indexOf(topic);
        let v = 180 + t * 22 + m * 8;
        if (topic === "ЖКХ и коммуналка") v += m >= 9 ? 1200 : m <= 1 ? 800 : 200;
        if (topic === "Дороги и транспорт" && m >= 5 && m <= 8) v += 400;
        return String(Math.round(v));
      }
    ),
    seriesCount: HOTLINE_REASONS.length
  },
  {
    dir: "task-08-retail-kategorii",
    title: "Сети переключают полки: растут «Снеки» и «Гигиена»",
    subtitle: "Выручка категорий, млрд ₽, кварталы 2024–2025",
    brief: "8 категорий × 8 кварталов. Сравните доли в Q4 2025 vs Q1 2024.",
    caption:
      "«Снеки» +19% за два года; «Молочные» теряют долю в пользу «Заморозки». Суммарный рынок — +11%.",
    copyright: "© 2026 RetailScope (аналитика ритейла).",
    sources: "Кассовые агрегаты 4 федеральных сетей; без учёта алкоголя.",
    csv: { delimiter: ";", decimal: "," },
    headers: ["Квартал", "Категория", "Выручка_млрд"],
    rows: retailRows,
    seriesCount: PRODUCT_LINES.length
  },
  {
    dir: "task-09-tarify-teplo",
    title: "Плата за отопление: разброс между регионами вдвое",
    subtitle: "Средний тариф, ₽/Гкал, помесячно, 8 федеральных округов, 2025",
    brief: "Тепловая карта: регион × месяц. Выделите зимний сезон.",
    caption:
      "Дальний Восток и Сибирь — самые высокие тарифы в январе; юг растёт к лету из‑за кондиционирования в коммерции.",
    copyright: "© 2026 «Тарифы и люди».",
    sources: "ФАС; реестр утверждённых тарифов, усреднение по муниципалитетам округа.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Округ", "Месяц", "Тариф"],
    rows: tariffRows,
    seriesCount: HEAT_REGIONS.length
  },
  {
    dir: "task-10-eksport-po-stranam",
    title: "Экспорт в Азию обогнал Европу во втором полугодии",
    subtitle: "млн USD, помесячно, 8 стран назначения, 2025",
    brief: "Широкая таблица или несколько рядов. Проследите перелом в июле–августе.",
    caption:
      "Китай и Казахстан дают +22% с июня; Германия стагнирует на уровне 15–16 млн USD/мес.",
    copyright: "© 2026 TradeWatch (учебные таможенные агрегаты).",
    sources: "ФТС России; коды ТН ВЭД 01–24, 84–85 (условная корзина).",
    csv: { delimiter: ";", decimal: "," },
    headers: ["Месяц", ...EXPORT_COUNTRIES],
    rows: exportRows,
    seriesCount: EXPORT_COUNTRIES.length
  },
  {
    dir: "task-11-doverie-smi",
    title: "Доверие к телевидению упало ниже соцсетей впервые",
    subtitle: "Доля респондентов «доверяю полностью или скорее да», %, волна 2025",
    brief: "Рейтинг источников информации. Один срез — столбцы или леденцы.",
    caption:
      "Телеканалы — 28% (−9 п.п. к 2024). Telegram-каналы — 34%, лидируют среди цифровых.",
    copyright: "© 2026 «Медиаметрика», опросная панель.",
    sources: "CATI, n=1 800, 18+; город 100k+; полевые работы 09–11.2025.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Источник", "Доверие_%"],
    rows: [
      ["Телевидение", "28"], ["Telegram", "34"], ["YouTube", "31"],
      ["Сайты СМИ", "36"], ["VK", "27"], ["Радио", "22"],
      ["Печатные СМИ", "19"], ["Друзья и родственники", "41"]
    ]
  },
  {
    dir: "task-12-vetryaki-vyработka",
    title: "Ветропарки на юге дали рекордную неделю",
    subtitle: "Выработка, МВт·ч, 10 площадок, неделя 48/2025",
    brief: "Сравните площадки. Укажите долю лидера в общей выработке.",
    caption:
      "«Степной» и «Прибрежный» — 54% суммарной выработки. «Горный» простаивал из‑за ремонта (−62% к среднему).",
    copyright: "© 2026 «Энергопереход».",
    sources: "АО «Сетевая ветро»; SCADA, часовые суммы.",
    csv: { delimiter: ";", decimal: "." },
    headers: ["Площадка", "МВтч"],
    rows: [
      ["Степной", "1240.5"], ["Прибрежный", "980.0"], ["Холмовой", "755.3"],
      ["Речной", "620.8"], ["Полевой", "410.0"], ["Горный", "88.2"],
      ["Северный", "540.0"], ["Восточный", "612.4"], ["Западный", "701.1"],
      ["Южный", "890.6"]
    ]
  },
  {
    dir: "task-13-migranty-trud",
    title: "Патенты на работу: рост в строительстве и логистике",
    subtitle: "Оформлено патентов, тыс., по отраслям, III кв. 2025",
    brief: "10 отраслей. Подпись — про отрасли с ускорением и замедлением.",
    caption:
      "Строительство (+14% к II кв.) обгоняет общепит. Сельское хозяйство — единственное снижение (−3%).",
    copyright: "© 2026 «Труд и миграция».",
    sources: "МВД; реестр патентов, агрегат по ОКВЭД работодателя.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Отрасль", "Патенты_тыс"],
    rows: [
      ["Строительство", "142"], ["Логистика", "98"], ["Общепит", "76"],
      ["Торговля", "88"], ["Сельхоз", "34"], ["Уборка", "52"],
      ["Производство", "61"], ["Такси", "47"], ["IT-аутсорс", "12"], ["Прочее", "29"]
    ]
  },
  {
    dir: "task-14-shkoly-rejting",
    title: "Рейтинг вузов: столичные держат топ, но регионы догоняют",
    subtitle: "Индекс выпускников на рынке труда, 0–100, 2025",
    brief: "15 вузовов. Покажите разрыв 1-го и 15-го и кластер «50+».",
    caption:
      "МГУ — 92, но ИТМО и КФУ сократили отставание до 6–8 пунктов за два года методики.",
    copyright: "© 2026 «Образование в цифрах».",
    sources: "Мониторинг занятости выпускников; индекс нормирован, методика v3.",
    csv: { delimiter: ";", decimal: "," },
    headers: ["ВУЗ", "Индекс"],
    rows: UNIVERSITIES.map((u, i) => [u, String(92 - i * 1.4 - (i % 3))])
  },
  {
    dir: "task-15-pm25-megapoly",
    title: "Смог в Новосибирске: 18 дней подряд выше нормы",
    subtitle: "PM2.5, мкг/м³, суточное среднее, 10 городов, ноябрь 2025",
    brief: "10 городов × 30 дней — линейный или тепловой сюжет. Без scatter по X/Y.",
    caption:
      "Новосибирск и Красноярск — серия из 18 «жёлтых» дней. Москва — 4 дня выше 25 мкг/м³.",
    copyright: "© 2026 «Воздух города».",
    sources: "Росгидромет + городские сенсоры; суточное среднее, ПДК 25 мкг/м³.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Дата", "Город", "PM25"],
    rows: pm25Rows,
    seriesCount: POLLUTION_CITIES.length
  },
  {
    dir: "task-16-stoimost-zhilya",
    title: "Вторичка подорожала быстрее новостроек",
    subtitle: "Средняя цена м², тыс. ₽, 6 городов-миллионников, кварталы 2024–2025",
    brief: "6 городов × 2 типа жилья × 8 кварталов. Два ряда на город: вторичка/новострой.",
    caption:
      "В Казани разрыв вторичка/новостройка — 18%; в Москве сократился до 9% за год.",
    copyright: "© 2026 «Дом и рынок».",
    sources: "Росреестр + агрегаторы объявлений; медиана сделок и предложений.",
    csv: { delimiter: ";", decimal: "," },
    headers: ["Квартал", "Город", "Тип", "Цена_тыс"],
    rows: housingRows,
    seriesCount: 12
  },
  {
    dir: "task-17-indeks-cen-potrebitely",
    title: "Инфляция ускорилась из‑за продуктовой корзины",
    subtitle: "ИПЦ к предыдущему месяцу, %, помесячно, 3 компоненты, 2025",
    brief: "Три ряда на одном графике. Покажите расхождение «Продукты» и «Услуги» летом.",
    caption:
      "Пик в июне (+1,2% по индексу в целом) — за счёт овощей; услуги стабильнее (+0,7–0,9%).",
    copyright: "© 2026 «Кошелёк и индексы».",
    sources: "Росстат (учебная декомпозиция индекса); MoM, не сезонно очищено.",
    csv: { delimiter: ",", decimal: "," },
    headers: ["Месяц", "Компонента", "ИПЦ_%"],
    rows: ipcRows,
    seriesCount: IPC_COMPONENTS.length
  },
  {
    dir: "task-18-orvi-vozrast",
    title: "ОРВИ бьёт по школьникам раньше пенсионеров",
    subtitle: "Заболеваемость, случаев на 10 000, по возрастам, недели 40–51/2025",
    brief: "5 возрастных групп × 12 недель. Отметьте пик и спад на графике.",
    caption:
      "Пик 47-й недели: 0–14 лет — 52 на 10 000; 60+ — 38. К 51-й неделе у молодых −27%.",
    copyright: "© 2026 «Эпидемиологическая сводка» (учебные данные).",
    sources: "Роспотребнадзор; уведомляемость, усечённая выборка регионов.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Неделя", "Возраст", "Случаи_на_10k"],
    rows: orviRows,
    seriesCount: AGE_GROUPS.length
  },
  {
    dir: "task-19-voda-v-regionah",
    title: "Каждый пятый дом в двух регионах без центральной воды",
    subtitle: "Доля домовладений без водопровода, %, перепись 2025",
    brief: "Региональный рейтинг. Подпись — в человекочитаемых долях населения.",
    caption:
      "Максимум — Тыва (23%) и Северный Кавказ (21%). Москва и СЗ — ниже 4%.",
    copyright: "© 2026 «Инфраструктура и быт».",
    sources: "Микроперепись 2025; агрегат по субъектам РФ.",
    csv: { delimiter: ";", decimal: "," },
    headers: ["Регион", "Без_водопровода_%"],
    rows: [
      ["Москва", "1,2"], ["СПб", "1,5"], ["Центр", "3,8"], ["СЗ", "4,1"],
      ["Юг", "8,4"], ["Кавказ", "21,0"], ["Поволжье", "9,2"], ["Урал", "7,5"],
      ["Сибирь", "12,3"], ["ДВ", "11,8"], ["Тыва", "23,0"], ["Якутия", "18,4"]
    ]
  },
  {
    dir: "task-20-kurs-rublya",
    title: "Рубль ослаб к корзине валют за месяц до отчётности ЦБ",
    subtitle: "Курс ЦБ, ₽ за единицу, на 29.05.2026",
    brief: "Снимок на дату — столбцы или леденцы. Сравните волатильность TRY и CNY.",
    caption:
      "USD 92,45 ₽ (+1,8% к 29.04); TRY — самая волатильная в корзине за 30 дней.",
    copyright: "© 2026 «Валютный обозреватель».",
    sources: "Банк России; официальные курсы на 15:00 МСК.",
    csv: { delimiter: ";", decimal: "," },
    headers: ["Валюта", "Курс_руб"],
    rows: [
      ["USD", "92,45"], ["EUR", "99,80"], ["CNY", "12,78"],
      ["GBP", "118,20"], ["TRY", "2,87"], ["KZT", "0,19"], ["BYN", "28,10"]
    ]
  }
];

// --- English tasks (decimal separator: period only) ---

const US_STATES_UNEMP = [
  "California", "Texas", "Florida", "New York", "Pennsylvania",
  "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan"
];
const usUnemploymentRows = seriesGrid(
  MONTHS_ISO.slice(0, 10),
  US_STATES_UNEMP,
  (m, st) => {
    const i = MONTHS_ISO.indexOf(m);
    const s = US_STATES_UNEMP.indexOf(st);
    return (3.2 + s * 0.08 + i * 0.04 + (s === 0 ? 0.6 : 0)).toFixed(1);
  }
);

const UK_SUPPLIERS = [
  "British Gas", "EDF", "E.ON", "Octopus", "Ovo", "Scottish Power"
];
const ukEnergyRows = seriesGrid(
  MONTHS_ISO,
  UK_SUPPLIERS,
  (m, sup) => {
    const i = MONTHS_ISO.indexOf(m);
    const s = UK_SUPPLIERS.indexOf(sup);
    return (142 + s * 3.5 + i * 1.8 + (i > 8 ? 12 : 0)).toFixed(2);
  }
);

const ASYLUM_COUNTRIES = [
  "Germany", "France", "Italy", "Spain", "Greece", "Netherlands",
  "Austria", "Poland", "Sweden", "Belgium"
];

const TECH_FIRMS = [
  "Meta", "Amazon", "Google", "Microsoft", "Salesforce",
  "Intel", "Dell", "SAP", "IBM", "Oracle"
];
const layoffQuarters = [
  "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"
];
const layoffRows = seriesGrid(
  layoffQuarters,
  TECH_FIRMS,
  (q, firm) => {
    const qi = layoffQuarters.indexOf(q);
    const fi = TECH_FIRMS.indexOf(firm);
    return String(Math.round(800 + fi * 120 + qi * 90 + ((fi + qi) % 4) * 200));
  }
);

const SUBWAY_LINES = [
  "A", "C", "E", "L", "1", "2", "3", "4", "5", "7"
];
const subwayRows = seriesGrid(
  MONTHS_ISO,
  SUBWAY_LINES,
  (m, line) => {
    const i = MONTHS_ISO.indexOf(m);
    const l = SUBWAY_LINES.indexOf(line);
    return String(Math.round(4200 + l * 180 + i * 35 + (i > 5 && i < 9 ? -200 : 0)));
  }
);

const GRID_SOURCES = ["Coal", "Gas", "Nuclear", "Wind", "Solar"];
const usStatesGrid = ["CA", "TX", "NY", "FL", "IL", "PA", "OH", "WA"];
const gridMixRows = heatmapGrid(
  usStatesGrid,
  GRID_SOURCES,
  (state, src) => {
    const s = usStatesGrid.indexOf(state);
    const r = GRID_SOURCES.indexOf(src);
    const base = r === 0 ? 18 : r === 1 ? 32 : r === 2 ? 12 : r === 3 ? 14 : 8;
    return (base + s * 0.9 - r * 1.1).toFixed(1);
  }
);

const SEA_STATIONS = [
  "Boston", "New York", "Charleston", "Miami", "Galveston", "San Diego"
];
const seaLevelMonths = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(2024, 0, 1);
  d.setMonth(d.getMonth() + i);
  return d.toISOString().slice(0, 7);
});
const seaLevelRows = seriesGrid(
  seaLevelMonths,
  SEA_STATIONS,
  (mon, st) => {
    const i = seaLevelMonths.indexOf(mon);
    const s = SEA_STATIONS.indexOf(st);
    return (3.82 + s * 0.04 + i * 0.008 + Math.sin(i / 4) * 0.05).toFixed(3);
  }
);

const TASKS_EN = [
  {
    dir: "task-21-us-state-unemployment",
    lang: "en",
    title: "Jobless rates fall in nine states but stall in Michigan",
    subtitle: "Unemployment, %, seasonally adjusted, Jan–Oct 2025",
    brief: "Chart 10 state series over time. Highlight the Midwest outlier and the national downward trend.",
    caption:
      "California peaked at 4.6% in March before easing to 4.0%; Michigan is the only state still above 4.5% in October.",
    copyright: "© 2026 DataDesk US (training dataset). Not BLS official release.",
    sources: "Bureau of Labor Statistics LAUS; 10-state teaching extract.",
    csv: { delimiter: ";", decimal: "." },
    headers: ["Month", "State", "Unemployment_pct"],
    rows: usUnemploymentRows,
    seriesCount: US_STATES_UNEMP.length
  },
  {
    dir: "task-22-uk-household-energy",
    lang: "en",
    title: "Typical UK energy bill heads for a winter spike again",
    subtitle: "Average annual bill, GBP, by supplier, monthly track 2025",
    brief: "Six supplier series across 12 months. Emphasize divergence after October.",
    caption:
      "Bills climb 9–14% between September and December; Octopus remains the lowest typical tariff in the sample.",
    copyright: "© 2026 EnergyWatch UK (illustrative Ofgem-style figures).",
    sources: "Ofgem price cap model; supplier standard variable tariffs, teaching aggregate.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Month", "Supplier", "Bill_GBP"],
    rows: ukEnergyRows,
    seriesCount: UK_SUPPLIERS.length
  },
  {
    dir: "task-23-eu-asylum-applications",
    lang: "en",
    title: "Asylum applications concentrate in five EU gateways",
    subtitle: "First-time applications, thousands, Q3 2025",
    brief: "Single-period ranking across countries. Use bars or lollipops; annotate top three share of total.",
    caption:
      "Germany alone accounts for 31% of the sample total; Greece and Italy together add another 28%.",
    copyright: "© 2026 Migration Monitor EU.",
    sources: "Eurostat migr_asyappctza; Q3 2025, rounded teaching figures.",
    csv: { delimiter: ";", decimal: "." },
    headers: ["Country", "Applications_k"],
    rows: ASYLUM_COUNTRIES.map((c, i) => [
      c,
      (42 - i * 2.8 + (i === 0 ? 8 : 0) + (i > 6 ? -3 : 0)).toFixed(1)
    ])
  },
  {
    dir: "task-24-texas-reservoir-levels",
    lang: "en",
    title: "Three Texas reservoirs drop below 40% as drought lingers",
    subtitle: "Storage, % of conservation capacity, weekly snapshot Nov 2025",
    brief: "Compare reservoirs in one week. Flag any below the 40% emergency band.",
    caption:
      "Travis and Buchanan are at 37.2% and 38.5%; Amistad is the healthiest large reservoir at 61.4%.",
    copyright: "© 2026 Texas Water Desk.",
    sources: "Texas Water Development Board; conservation storage, 18 Nov 2025.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Reservoir", "Storage_pct"],
    rows: [
      ["Travis", "37.2"], ["Buchanan", "38.5"], ["Canyon", "42.1"],
      ["Amistad", "61.4"], ["Falcon", "45.8"], ["Livingston", "52.3"],
      ["Texoma", "48.9"], ["Meadows", "55.0"]
    ]
  },
  {
    dir: "task-25-tech-layoffs-tracker",
    lang: "en",
    title: "Tech layoffs slow but remain above pre-2024 levels",
    subtitle: "Announced job cuts, headcount, 10 firms, by quarter",
    brief: "Multi-series quarterly chart. Show cumulative pain vs recent quarter relief.",
    caption:
      "2024-Q4 was the peak quarter in the sample (12,400 cuts); 2025-Q4 is down 38% from that peak but still double 2024-Q1.",
    copyright: "© 2026 LayoffLedger (compiled press & SEC 8-K, teaching set).",
    sources: "Company announcements; sample of 10 large tech employers.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Quarter", "Company", "Layoffs"],
    rows: layoffRows,
    seriesCount: TECH_FIRMS.length
  },
  {
    dir: "task-26-nyc-subway-ridership",
    lang: "en",
    title: "Weekend subway lines still lag pre-pandemic ridership",
    subtitle: "Average weekday entries, thousands, by line, 2025",
    brief: "Ten line series through the year. Contrast summer recovery with autumn plateau.",
    caption:
      "Lines 4 and 7 recover strongest (+12% Jan–Jun); L train ridership flat after April despite weekend service boosts.",
    copyright: "© 2026 TransitLab NYC.",
    sources: "MTA turnstile counts; OMNY aggregated by line, teaching subset.",
    csv: { delimiter: ";", decimal: "." },
    headers: ["Month", "Line", "Entries_k"],
    rows: subwayRows,
    seriesCount: SUBWAY_LINES.length
  },
  {
    dir: "task-27-opioid-deaths-by-state",
    lang: "en",
    title: "Opioid deaths edge down but Appalachia stays elevated",
    subtitle: "Age-adjusted rate per 100,000, 12 states, 2024 vs 2025 YTD",
    brief: "State comparison snapshot or paired bars. Focus on highest and steepest decline.",
    caption:
      "West Virginia remains highest at 52.3; Ohio posts the largest drop (−6.8 points) in the sample.",
    copyright: "© 2026 HealthStats US (provisional teaching data).",
    sources: "CDC WONDER provisional overdose deaths; state-level rates.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["State", "Rate_2024", "Rate_2025_YTD"],
    rows: [
      ["West Virginia", "58.1", "52.3"], ["Ohio", "41.2", "34.4"], ["Pennsylvania", "38.5", "35.1"],
      ["Kentucky", "45.0", "42.8"], ["Tennessee", "36.2", "33.5"], ["Florida", "28.4", "26.9"],
      ["California", "12.8", "12.1"], ["New York", "18.6", "17.2"], ["Texas", "14.1", "13.8"],
      ["Massachusetts", "32.0", "29.4"], ["Arizona", "24.5", "23.0"], ["Colorado", "19.8", "18.6"]
    ]
  },
  {
    dir: "task-28-us-grid-mix-by-state",
    lang: "en",
    title: "Coal share shrinks on the coasts but holds in the Midwest",
    subtitle: "Electricity generation mix, %, 8 states × 5 sources, 2025",
    brief: "Heatmap or stacked bars: state vs fuel type. Compare WA renewables vs PA coal.",
    caption:
      "Washington wind+solar reach 28.1% combined; Pennsylvania coal still 38.4% of in-state generation in the sample.",
    copyright: "© 2026 PowerMap US.",
    sources: "EIA Form 923 teaching extract; percent of total generation by source.",
    csv: { delimiter: ";", decimal: "." },
    headers: ["State", "Source", "Share_pct"],
    rows: gridMixRows,
    seriesCount: GRID_SOURCES.length
  },
  {
    dir: "task-29-uk-nhs-wait-times",
    lang: "en",
    title: "Two in five NHS trusts miss the 18-week elective target",
    subtitle: "Median wait, weeks, elective care, October 2025",
    brief: "Trust-level league table. Mark the 18-week NHS operational standard.",
    caption:
      "Norfolk and Black Country report 24.6 and 23.1 weeks; London and Manchester clusters perform better (11–13 weeks).",
    copyright: "© 2026 NHS Data Bulletin (fictional trust names, teaching figures).",
    sources: "NHS England RTT statistics; median wait, admitted patients.",
    csv: { delimiter: ",", decimal: "." },
    headers: ["Trust", "Median_wait_weeks"],
    rows: [
      ["Norfolk & Waveney", "24.6"], ["Black Country", "23.1"], ["Cornwall", "21.8"],
      ["Somerset", "20.4"], ["Leeds", "17.2"], ["Bristol", "16.5"],
      ["Manchester", "13.1"], ["Guy's & St Thomas'", "12.4"], ["Imperial", "11.9"],
      ["Royal Free", "11.2"]
    ]
  },
  {
    dir: "task-30-sea-level-tide-gauges",
    lang: "en",
    title: "Sea level rise accelerates at Gulf stations in the sample",
    subtitle: "Monthly mean sea level anomaly, mm vs 1993–2010 baseline, 2024–2025",
    brief: "Six station series over 24 months. Highlight Gulf vs Pacific slope.",
    caption:
      "Galveston anomaly reaches +84.2 mm by late 2025; San Diego shows the steadiest climb (+3.1 mm over the period in the sample).",
    copyright: "© 2026 Coastal Climate Wire.",
    sources: "NOAA CO-OPS tide gauges; monthly means, teaching baseline adjustment.",
    csv: { delimiter: ";", decimal: "." },
    headers: ["Month", "Station", "Anomaly_mm"],
    rows: seaLevelRows,
    seriesCount: SEA_STATIONS.length
  }
];

const TASKS = [...TASKS_RU, ...TASKS_EN];

async function main() {
  await mkdir(ROOT, { recursive: true });
  const keep = new Set(TASKS.map(t => t.dir));
  const { readdir } = await import("node:fs/promises");
  for (const name of await readdir(ROOT)) {
    if (name.startsWith("task-") && !keep.has(name)) {
      await rm(join(ROOT, name), { recursive: true, force: true });
      console.log("− удалена устаревшая папка:", name);
    }
  }
  for (const task of TASKS) {
    const dir = join(ROOT, task.dir);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "tz.md"), buildTzMd(task), "utf8");
    await writeFile(join(dir, "data.csv"), buildCsv(task), "utf8");
    console.log("✓", task.dir, `(${task.rows.length} строк)`);
  }
  console.log(`\nСоздано ${TASKS.length} заданий в ${ROOT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
