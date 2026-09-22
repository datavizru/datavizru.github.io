/* CSV parsing is independent of editor state and the DOM.
 * Inject Vega's reader and the current translator when creating a parser.
 * Classic scripts preserve support for opening index.html through file://.
 */
const CsvParser = (() => {
  function create({ read, translate = text => text } = {}) {
    function normalizeCsvCell(val, decimalSep){
      if (val == null || val === "") return val;
      if (typeof val === "number") return val;
      const s = String(val).trim();
      if (decimalSep === ",") {
        if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s))
          return parseFloat(s.replace(/\./g, "").replace(",", "."));
        if (/^-?\d+(,\d+)?$/.test(s))
          return parseFloat(s.replace(",", "."));
      }
      const n = Number(s.replace(/\s/g, ""));
      if (!isNaN(n) && isFinite(n)) return n;
      return val;
    }

    function stripCsvBom(text){
      return String(text || "").replace(/^\uFEFF/, "");
    }
    function splitCsvLine(line, delimiter){
      const out = [];
      let cur = "", inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQ) {
          if (ch === '"') {
            if (line[i + 1] === '"') { cur += '"'; i++; }
            else inQ = false;
          } else cur += ch;
        } else if (ch === '"') inQ = true;
        else if (ch === delimiter) { out.push(cur); cur = ""; }
        else cur += ch;
      }
      out.push(cur);
      return out.map(s => s.trim());
    }
    function detectCsvDelimiter(headerLine){
      const candidates = [";", "\t", "|", ","];
      let best = ",", bestN = 0;
      for (const d of candidates) {
        const n = splitCsvLine(headerLine, d).length;
        if (n > bestN) { bestN = n; best = d; }
      }
      return bestN > 1 ? best : ",";
    }
    function preprocessCsvDecimals(text, decimal){
      if (decimal !== ",") return text;
      return text.replace(/(\d)\s*,\s*(\d)/g, "$1.$2");
    }
    function parseDelimitedRows(text, delimiter){
      const lines = stripCsvBom(text).split(/\r?\n/).filter(l => l.trim() !== "");
      if (!lines.length) return [];
      const header = splitCsvLine(lines[0], delimiter);
      if (header.length < 2) throw new Error(translate("нужно не меньше двух столбцов"));
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = splitCsvLine(lines[i], delimiter);
        if (!cells.some(c => c !== "")) continue;
        const row = {};
        header.forEach((h, j) => { row[h] = cells[j] != null ? cells[j] : ""; });
        rows.push(row);
      }
      return rows;
    }
    function vegaCsvReadFormat(delimiter){
      if (delimiter === ",") return { type: "csv", parse: false };
      if (delimiter === "\t") return { type: "tsv", parse: false };
      return { type: "dsv", delimiter, parse: false };
    }
    function readCsvRows(src, delimiter){
      try {
        const rows = read(src, vegaCsvReadFormat(delimiter));
        if (rows?.length) return rows;
      } catch (e) { /* fallback ниже */ }
      return parseDelimitedRows(src, delimiter);
    }
    function parse(text, opts){
      opts = opts || {};
      let src = stripCsvBom(text);
      const decimal = opts.decimal != null ? opts.decimal : ".";
      let delimiter = opts.delimiter != null ? opts.delimiter : ",";
      const firstLine = src.split(/\r?\n/).find(l => l.trim() !== "") || "";
      if (opts.autoDelimiter !== false && firstLine)
        delimiter = detectCsvDelimiter(firstLine);
      src = preprocessCsvDecimals(src, decimal);
      const rawRows = readCsvRows(src, delimiter);
      if (!rawRows.length) throw new Error(translate("пустой файл"));
      const keyMap = sanitizeKeys(Object.keys(rawRows[0]));
      const cellDec = decimal === "," ? "." : decimal;
      const rows = rawRows.map(row => {
        const out = {};
        for (const [k, v] of Object.entries(row))
          out[keyMap[k] || k] = normalizeCsvCell(v, cellDec);
        return out;
      });
      return { rows, delimiter };
    }
    // Безопасные имена колонок (без «.», «[», «]»), с устранением дублей.
    function sanitizeKeys(keys){
      const map = {}, used = new Set();
      keys.forEach((k, i) => {
        let name = String(k).replace(/[.\[\]]/g, "").replace(/\s+/g, " ").trim() || `col${i + 1}`;
        let n = name, j = 2;
        while (used.has(n)) n = `${name} ${j++}`;
        used.add(n); map[k] = n;
      });
      return map;
    }

    return { parse };
  }
  return { create };
})();
