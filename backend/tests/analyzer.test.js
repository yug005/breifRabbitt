/**
 * Tests for the data analyzer service.
 */
import { analyzeData } from '../src/services/dataAnalyzer.js';

describe('analyzeData', () => {
  it('should analyze a basic sales dataset', () => {
    const data = {
      rows: [
        { product: 'Widget A', region: 'North', revenue: 1500 },
        { product: 'Widget B', region: 'South', revenue: 2300 },
        { product: 'Widget C', region: 'East',  revenue: 1800 },
      ],
      columns: ['product', 'region', 'revenue'],
    };

    const result = analyzeData(data);

    expect(result.totalRows).toBe(3);
    expect(result.totalColumns).toBe(3);
    expect(result.numericSummary).toHaveProperty('revenue');
    expect(result.numericSummary.revenue.sum).toBe(5600);
    expect(result.dataQuality.completenessPercent).toBe(100);
    expect(result.topInsights.length).toBeGreaterThan(0);
  });

  it('should detect null values in data quality', () => {
    const data = {
      rows: [
        { product: 'A', sales: 100 },
        { product: null, sales: 200 },
        { product: 'C', sales: null },
      ],
      columns: ['product', 'sales'],
    };

    const result = analyzeData(data);

    expect(result.dataQuality.totalNullCells).toBe(2);
    expect(result.dataQuality.completenessPercent).toBeLessThan(100);
  });
});
