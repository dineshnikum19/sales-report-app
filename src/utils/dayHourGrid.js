/** All 24 hours displayed in the grid (0-23) */
export const GRID_HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * Build a grid of Day x Hour from processed/filtered data.
 *
 * Only rows that exist in the data contribute to a cell.
 * If no store has data for a given Day+Hour, the cell is null (not 0).
 * null = "no store open / no data" and is displayed as "—" in the UI.
 * This ensures missing hours never pollute averages.
 *
 * @param {Array} data - Processed data with Day, Hour, AvgAmount
 * @returns {Object} - { grid: Map<string, number|null>, dayOrder: string[], hours: number[] }
 */
export const buildDayHourGrid = (data) => {
  const dayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Accumulator: key -> { total, count }
  const accumulator = new Map();

  dayOrder.forEach((day) => {
    GRID_HOURS.forEach((hour) => {
      accumulator.set(`${day}_${hour}`, { total: 0, count: 0 });
    });
  });

  if (!data || data.length === 0) {
    const grid = new Map();
    for (const [key] of accumulator) {
      grid.set(key, null);
    }
    return { grid, dayOrder, hours: GRID_HOURS };
  }

  data.forEach((row) => {
    const key = `${row.Day}_${row.Hour}`;
    if (accumulator.has(key)) {
      const cell = accumulator.get(key);
      cell.total += row.AvgAmount;
      cell.count += 1;
    }
  });

  // count > 0 → average; count === 0 → null (no data, not $0)
  const grid = new Map();
  for (const [key, { total, count }] of accumulator) {
    grid.set(key, count > 0 ? Math.round((total / count) * 100) / 100 : null);
  }

  return { grid, dayOrder, hours: GRID_HOURS };
};
