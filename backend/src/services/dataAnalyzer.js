/**
 * Data analyzer service — extracts KPIs and insights from parsed sales data.
 *
 * Operates on plain JS arrays instead of Pandas DataFrames.
 */
import { logger } from '../utils/logger.js';

/**
 * Analyse an array of row objects and return a structured analysis result.
 *
 * @param {{ rows: object[], columns: string[] }} data
 * @returns {object} AnalysisResult
 */
export function analyzeData({ rows, columns }) {
  const numericColumns = [];
  const categoricalColumns = [];

  // ── Classify columns ─────────────────────────────────────────
  for (const col of columns) {
    const sampleValues = rows.slice(0, 50).map((r) => r[col]).filter((v) => v != null);
    const numericCount = sampleValues.filter((v) => typeof v === 'number' || !isNaN(Number(v))).length;

    if (numericCount > sampleValues.length * 0.7) {
      numericColumns.push(col);
    } else {
      categoricalColumns.push(col);
    }
  }

  // ── Numeric summary ──────────────────────────────────────────
  const numericSummary = {};
  for (const col of numericColumns) {
    const values = rows.map((r) => Number(r[col])).filter((v) => !isNaN(v));
    if (values.length === 0) continue;

    values.sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const median = values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];
    const min = values[0];
    const max = values[values.length - 1];
    const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
    const std = Math.sqrt(variance);

    numericSummary[col] = {
      count: values.length,
      sum: round(sum),
      mean: round(mean),
      median: round(median),
      std: round(std),
      min: round(min),
      max: round(max),
    };
  }

  // ── Data quality ─────────────────────────────────────────────
  const totalCells = rows.length * columns.length;
  const nullCounts = {};
  let totalNulls = 0;

  for (const col of columns) {
    const nullCount = rows.filter((r) => r[col] == null || r[col] === '').length;
    if (nullCount > 0) nullCounts[col] = nullCount;
    totalNulls += nullCount;
  }

  const duplicateRows = rows.length - new Set(rows.map((r) => JSON.stringify(r))).size;

  const dataQuality = {
    nullCounts,
    duplicateRows,
    totalNullCells: totalNulls,
    completenessPercent: round((1 - totalNulls / totalCells) * 100),
  };

  // ── Auto-detect insights ─────────────────────────────────────
  const insights = [];

  // Top values in categorical columns
  for (const col of categoricalColumns.slice(0, 3)) {
    const freq = {};
    rows.forEach((r) => {
      const v = r[col];
      if (v != null) freq[v] = (freq[v] || 0) + 1;
    });
    const top = Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k, v]) => `${k} (${v})`)
      .join(', ');
    insights.push(`Top '${col}' values: ${top}`);
  }

  // Revenue / sales column detection
  const revenueKeywords = ['revenue', 'amount', 'sales', 'total', 'price', 'value'];
  for (const col of numericColumns) {
    if (revenueKeywords.some((kw) => col.toLowerCase().includes(kw))) {
      const s = numericSummary[col];
      insights.push(
        `Column '${col}': Total = ${s.sum.toLocaleString()}, ` +
        `Avg = ${s.mean.toLocaleString()}, Max = ${s.max.toLocaleString()}`
      );
    }
  }

  if (insights.length === 0) {
    insights.push(`Dataset contains ${rows.length} records across ${columns.length} columns.`);
  }

  logger.info(`Analysis complete: ${insights.length} insights generated`);

  return {
    totalRows: rows.length,
    totalColumns: columns.length,
    columnNames: columns,
    numericColumns,
    categoricalColumns,
    numericSummary,
    topInsights: insights,
    dataQuality,
    sampleRows: rows.slice(0, 5),
  };
}

function round(n, decimals = 2) {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}
