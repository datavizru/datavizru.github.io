import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function editor() {
  const context = vm.createContext({
    console,
    document: {
      getElementById: () => null,
      createElement: () => ({ getContext: () => ({}) }),
      addEventListener() {}
    }
  });
  for (const file of ['i18n.js', 'js/csv.js', 'js/editor.js']) {
    vm.runInContext(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), context, { filename: file });
  }
  return expression => JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context));
}

const sample = 'Год,Значение\n2016,12.4\n2017,15.8\n2025,30.2';
function withData() {
  const run = editor();
  run(`(() => {
    state.csvValues = parseCsvText(${JSON.stringify(sample)}).rows;
    state.dataset = '__csv__';
    state.fields = {x:'Год', y:'Значение', series:''};
    plotW = 400; plotH = 300; frameContentW = 400;
    return true;
  })()`);
  return run;
}

test('CSV preserves numeric years and decimal values', () => {
  const run = withData();
  assert.deepEqual(run('currentValues()'), [{Год:2016,Значение:12.4},{Год:2017,Значение:15.8},{Год:2025,Значение:30.2}]);
});

for (const type of ['bar','barh','barStack','barhStack','barStackNorm','barhStackNorm','lollipop','lollipopH']) {
  test(`${type}: numeric categories and label layers use the same discrete scale`, () => {
    const run = withData();
    const horizontal = type.startsWith('barh') || type === 'lollipopH';
    const channel = horizontal ? 'y' : 'x';
    run(`(state.chartType = '${type}')`);
    assert.equal(run(`encodingDef().${channel}.type`), 'nominal');
    run('(state.style.valueLabels.show = true)');
    for (const layer of run('valueLabelLayers()')) {
      if (layer.encoding[channel]?.field === 'Год') assert.equal(layer.encoding[channel].type, 'nominal');
    }
    run(`(state.style.axes.${channel}.labels.step = 2)`);
    assert.deepEqual(run(`axisStepObj('${channel}').values`), [2016,2025]);
    if (type.startsWith('bar')) {
      run('(state.style.barGap = {mode:"gap", unit:"percent", value:30})');
      assert.equal(run(`encodingDef().${channel}.scale.paddingInner`), 0.3);
      run('(state.style.barGap = {mode:"gap", unit:"pixels", value:10})');
      assert.equal(run(`encodingDef().${channel}.scale.paddingInner`), horizontal ? 0.1 : 0.075);
      run('(state.style.barGap = {mode:"fixed", fixedWidth:24})');
      assert.equal(run(`markDef().${horizontal ? 'height' : 'width'}`), 24);
    }
  });
}

for (const type of ['line', 'area', 'point']) {
  test(`${type}: numeric coordinates remain continuous`, () => {
    const run = withData();
    run(`(state.chartType = '${type}')`);
    assert.equal(run('encodingDef().x.type'), 'quantitative');
  });
}

test('axis and value formats are independent and support all separators', () => {
  const run = withData();
  for (const [separator, char] of Object.entries({none:'',space:' ',nbsp:'\u00a0',narrow:'\u202f',comma:',',dot:'.'})) {
    run(`(state.style.axisNumberFormat.separator = '${separator}')`);
    const locales = run('configDef().numberFormatLocale');
    assert.equal(locales.chartAxis.thousands, char);
    assert.equal(locales.chart.thousands, ',');
    assert.deepEqual(locales.chartAxis.grouping, char ? [3] : []);
  }
  run('(state.style.valueLabels.numberFormat.separator = "comma")');
  run('(state.style.valueLabels.numberFormat.decimal = ".")');
  assert.equal(run('configDef().numberFormatLocale.chart.thousands'), ',');
  assert.equal(run('configDef().numberFormatLocale.chartAxis.thousands'), '.');
  assert.match(run('encodingDef().x.axis.labelExpr'), /chartAxis/);
  assert.match(run('vegaFormatNumberExpr("datum.value")'), /"chart"/);
});

test('old project formats migrate and new formats survive saving/loading', () => {
  const run = editor();
  for (const grouping of [true, false]) {
    const style = run(`mergeStyle(defaultState().style, {valueLabels:{numberFormat:{decimal:'.',grouping:${grouping}}}})`);
    assert.equal(style.axisNumberFormat.decimal, '.');
    assert.equal(style.axisNumberFormat.separator, grouping ? 'auto' : 'none');
    assert.equal(style.valueLabels.numberFormat.separator, grouping ? 'auto' : 'none');
  }
  run('(state.style.axisNumberFormat = {decimal:".",separator:"narrow"})');
  run('(state.style.valueLabels.numberFormat.separator = "none")');
  const restored = run('mergeStyle(defaultState().style, JSON.parse(JSON.stringify(state.style)))');
  assert.equal(restored.axisNumberFormat.separator, 'narrow');
  assert.equal(restored.valueLabels.numberFormat.separator, 'none');
});

test('centered bar value labels display the original value', () => {
  const run = withData();
  for (const type of ['bar', 'barh', 'lollipop', 'lollipopH']) {
    run(`(state.chartType = '${type}')`);
    run('(state.style.valueLabels.show = true)');
    run('(state.style.valueLabels.position = "center")');
    const layer = run('valueLabelLayers()[0]');
    const channel = type === 'barh' || type === 'lollipopH' ? 'x' : 'y';
    const position = layer.transform.find(t => t.as === layer.encoding[channel].field);
    assert.ok(position, `${type}: label coordinate must refer to a calculated field`);
    for (const datum of run('currentValues()')) {
      assert.equal(vm.runInNewContext(position.calculate, { datum }), datum['Значение'] / 2);
    }
    assert.equal(layer.encoding.text.field, '__vlFmt');
    assert.match(layer.transform.at(-1).calculate, /datum\["Значение"\]/);
    assert.doesNotMatch(layer.transform.at(-1).calculate, /__yLbl|__xLbl/);
  }
});

test('inside-base labels sit inside each bar or stacked segment and retain offsets', () => {
  const run = withData();
  run('(state.style.valueLabels = {...state.style.valueLabels, show:true, position:"base_in", offsetX:2, offsetY:1})');
  for (const type of ['bar', 'barh', 'lollipop', 'lollipopH', 'barStack', 'barhStack', 'barStackNorm', 'barhStackNorm']) {
    run(`(state.chartType = '${type}')`);
    const horizontal = type.startsWith('barh') || type === 'lollipopH';
    const layer = run('valueLabelLayers()[0]');
    const coordinate = layer.encoding[horizontal ? 'x' : 'y'];
    if (type.includes('Stack')) assert.equal(coordinate.field, '__stk0');
    else assert.equal(coordinate.datum, 0);
    assert.equal(layer.mark.align, horizontal ? 'left' : 'center');
    assert.equal(layer.mark.baseline, horizontal ? 'middle' : 'bottom');
    assert.equal(layer.mark.dx, horizontal ? 6 : 2);
    assert.equal(layer.mark.dy, horizontal ? 1 : -3);
  }
});


test('automatic formats follow the interface language for axes and values', () => {
  const run = editor();
  for (const lang of ['en', 'ru', 'en']) {
    run(`(i18nSetLang('${lang}'), true)`);
    const locales = run('configDef().numberFormatLocale');
    for (const locale of [locales.chart, locales.chartAxis]) {
      assert.equal(locale.decimal, lang === 'ru' ? ',' : '.');
      assert.equal(locale.thousands, lang === 'ru' ? ' ' : ',');
    }
  }
  run('(state.style.axisNumberFormat = {separator:"space", decimal:","})');
  run('(state.style.valueLabels.numberFormat = {separator:"none", decimal:"."})');
  for (const lang of ['ru', 'en']) {
    run(`(i18nSetLang('${lang}'), true)`);
    const locales = run('configDef().numberFormatLocale');
    assert.equal(locales.chartAxis.decimal, ',');
    assert.equal(locales.chartAxis.thousands, ' ');
    assert.equal(locales.chart.decimal, '.');
    assert.equal(locales.chart.thousands, '');
  }
});
