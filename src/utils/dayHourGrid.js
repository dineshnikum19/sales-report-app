// Hours to exclude from grid: 2 AM, 3 AM, 4 AM, 5 AM, 6 AM (slots 2-3, 3-4, 4-5, 5-6, 6-7)
const EXCLUDED_HOURS = [2, 3, 4, 5, 6];

/** List of hours to display in the grid (0-23 excluding 2–6) */
export const GRID_HOURS = Array.from({ length: 24 }, (_, i) => i).filter(
  (h) => !EXCLUDED_HOURS.includes(h),
);

/**
 * Build a grid of Day x Hour from processed/filtered data.
 * Returns a 2D structure: for each hour (excluding 2am–6am) and each day,
 * the **average** amount across all stores that have data for that cell.
 *
 * Previously this was summing AvgAmounts, which inflated values when
 * multiple stores contributed to the same Day+Hour cell.
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
    // Return grid of zeros
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
    // Skip hours not in grid (2–6)
  });

  // Build final grid: average = total / count (or 0 if no data)
  const grid = new Map();
  for (const [key, { total, count }] of accumulator) {
    grid.set(key, count > 0 ? Math.round((total / count) * 100) / 100 : 0);
  }

  return { grid, dayOrder, hours: GRID_HOURS };
};
