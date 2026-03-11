/**
 * File processor service — parses CSV/XLSX files into structured data.
 *
 * Uses PapaParse for CSV and SheetJS (xlsx) for XLSX files.
 */
import Papa from 'papaparse';
import XLSX from 'xlsx';
import { logger } from '../utils/logger.js';

/**
 * Parse a file buffer into an array of row objects and metadata.
 *
 * @param {Buffer} buffer - Raw file content.
 * @param {string} extension - ".csv" or ".xlsx".
 * @returns {{ rows: object[], columns: string[], metadata: object }}
 */
export function parseFile(buffer, extension) {
  let rows;
  let columns;

  if (extension === '.csv') {
    const text = buffer.toString('utf-8');
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,       // auto-cast numbers & booleans
      transformHeader: (h) => h.trim(),
    });

    if (result.errors.length > 0) {
      logger.warn(`CSV parse warnings: ${result.errors.length}`, result.errors.slice(0, 3));
    }

    rows = result.data;
    columns = result.meta.fields || [];
  } else if (extension === '.xlsx') {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  } else {
    throw new Error(`Unsupported file extension: ${extension}`);
  }

  if (!rows || rows.length === 0) {
    throw new Error('Uploaded file contains no data.');
  }

  const metadata = {
    totalRows: rows.length,
    totalColumns: columns.length,
    columnNames: columns,
    sampleRows: rows.slice(0, 5),
  };

  logger.info(`Parsed file: ${metadata.totalRows} rows × ${metadata.totalColumns} columns`);

  return { rows, columns, metadata };
}
