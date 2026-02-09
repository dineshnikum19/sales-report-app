// Hours to exclude from grid: 2 AM, 3 AM, 4 AM, 5 AM, 6 AM (slots 2-3, 3-4, 4-5, 5-6, 6-7)
const EXCLUDED_HOURS = [2, 3, 4, 5, 6];

/** List of hours to display in the grid (0-23 excluding 2–6) */
export const GRID_HOURS = Array.from({ length: 24 }, (_, i) => i).filter(
  (h) => !EXCLUDED_HOURS.includes(h),
);

/**
 * Build a grid of Day x Hour from processed/filtered data.
 * Returns a 2D structure: for each hour (excluding 2am–6am) and each day, the total amount.
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

  // grid key: "Day_Hour" -> sum of AvgAmount for that cell (only for displayed hours)
  const grid = new Map();

  dayOrder.forEach((day) => {
    GRID_HOURS.forEach((hour) => {
      grid.set(`${day}_${hour}`, 0);
    });
  });

  if (!data || data.length === 0) {
    return { grid, dayOrder, hours: GRID_HOURS };
  }

  data.forEach((row) => {
    const key = `${row.Day}_${row.Hour}`;
    if (grid.has(key)) {
      grid.set(key, grid.get(key) + row.AvgAmount);
    }
    // Skip hours not in grid (2–6)
  });

  return { grid, dayOrder, hours: GRID_HOURS };
};
