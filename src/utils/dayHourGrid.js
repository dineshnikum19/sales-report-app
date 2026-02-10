/** All 24 hours displayed in the grid (0-23) */
export const GRID_HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * Build a grid of Day x Hour from processed/filtered data.
 * Returns a 2D structure: for each hour and each day,
 * the **average** amount across all stores that have data for that cell.
 *
 * @param {Array} data - Processed data with Day, Hour, AvgAmount
 * @returns {Object} - { grid: Map<string, number>, dayOrder: string[], hours: number[] }
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

  // Accumulator: key -> { total, count } so we can compute the average
  const accumulator = new Map();

  dayOrder.forEach((day) => {
    GRID_HOURS.forEach((hour) => {
      accumulator.set(`${day}_${hour}`, { total: 0, count: 0 });
    });
  });

  if (!data || data.length === 0) {
    const grid = new Map();
    for (const [key] of accumulator) {
      grid.set(key, 0);
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

  // Build final grid: average = total / count (or 0 if no data)
  const grid = new Map();
  for (const [key, { total, count }] of accumulator) {
    grid.set(key, count > 0 ? Math.round((total / count) * 100) / 100 : 0);
  }

  return { grid, dayOrder, hours: GRID_HOURS };
};
