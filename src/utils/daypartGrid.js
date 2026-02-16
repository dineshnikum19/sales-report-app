/**
 * Daypart definitions: name -> array of hours (0-23)
 * Breakfast: 8-10, Lunch: 11-13, Afternoon: 14-16, Dinner: 17-19,
 * Evening: 20-22, Late night: 23, 0, 1, 2, 3 (11pm–3am)
 */
export const DAYPARTS = [
  { name: "Breakfast", hours: [8, 9, 10], label: "8–10 AM" },
  { name: "Lunch", hours: [11, 12, 13], label: "11 AM–1 PM" },
  { name: "Afternoon", hours: [14, 15, 16], label: "2–4 PM" },
  { name: "Dinner", hours: [17, 18, 19], label: "5–7 PM" },
  { name: "Evening", hours: [20, 21, 22], label: "8–10 PM" },
  { name: "Late night", hours: [23, 0, 1, 2, 3], label: "11 PM–3 AM" },
];

/**
 * Build a grid of Day x Daypart from processed/filtered data.
 * First computes hourly averages (same as DayHourGrid), then sums those
 * averages per daypart. E.g. Breakfast = avg(8am) + avg(9am) + avg(10am).
 *
 * @param {Array} data - Processed data with Day, Hour, AvgAmount
 * @returns {Object} - { grid: Map<string, number|null>, dayOrder: string[], dayparts: Array }
 */
export const buildDaypartGrid = (data) => {
  const dayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Step 1: Build hourly averages (same logic as DayHourGrid)
  const hourAccumulator = new Map();
  dayOrder.forEach((day) => {
    for (let h = 0; h < 24; h++) {
      hourAccumulator.set(`${day}_${h}`, { total: 0, count: 0 });
    }
  });

  if (data && data.length > 0) {
    data.forEach((row) => {
      const key = `${row.Day}_${row.Hour}`;
      if (hourAccumulator.has(key)) {
        const cell = hourAccumulator.get(key);
        cell.total += row.AvgAmount;
        cell.count += 1;
      }
    });
  }

  const hourlyAverages = new Map();
  for (const [key, { total, count }] of hourAccumulator) {
    hourlyAverages.set(key, count > 0 ? total / count : null);
  }

  // Step 2: For each Day+Daypart, sum the hourly averages (not average them)
  const grid = new Map();
  dayOrder.forEach((day) => {
    DAYPARTS.forEach((dp) => {
      let sum = 0;
      let hasAny = false;
      for (const hour of dp.hours) {
        const val = hourlyAverages.get(`${day}_${hour}`);
        if (val !== null) {
          sum += val;
          hasAny = true;
        }
      }
      grid.set(`${day}_${dp.name}`, hasAny ? Math.round(sum * 100) / 100 : null);
    });
  });

  return { grid, dayOrder, dayparts: DAYPARTS };
};
