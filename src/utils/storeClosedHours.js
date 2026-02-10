/**
 * Store Closed Hours Configuration
 *
 * Defines which stores are closed during certain hours.
 * Rows matching a store + closed hour are EXCLUDED from all calculations:
 *   - They are stripped from raw data BEFORE grouping/averaging
 *   - They do NOT count as $0 sales
 *   - They do NOT appear in the denominator of any average
 *
 * Format:  StoreName → array of closed hours (0-23, where 6 = 6 AM, 8 = 8 AM)
 *
 * "Closed 6–9 AM" means hours 6, 7, 8 are closed.
 * Hour 9 (9:00–9:59 AM) is when the store opens, so it is NOT excluded.
 */

const CLOSED_6_TO_9 = [6, 7, 8];

/**
 * Map of StoreName → closed hours.
 * Keys must match the StoreName field in data.json exactly (case-sensitive).
 */
export const STORE_CLOSED_HOURS = {
  // StoreCode → StoreName (for reference)
  "Clinton": CLOSED_6_TO_9,          // 13589
  "Doylestown": CLOSED_6_TO_9,       // 2444
  "Norristown 1": CLOSED_6_TO_9,     // 8616
  "Dresher": CLOSED_6_TO_9,          // 527  (not in current data — ready for future)
  "Souderton": CLOSED_6_TO_9,        // 2686
  "Morrisville": CLOSED_6_TO_9,      // 8612
  "King of Prussia": CLOSED_6_TO_9,  // 8617
  "Hatfield": CLOSED_6_TO_9,         // 11807
  "Point Pleasant": CLOSED_6_TO_9,   // 8186
  "Toms River": CLOSED_6_TO_9,       // 10803
  "Point Pleasant Beach": CLOSED_6_TO_9, // 11870
  "Horsham": CLOSED_6_TO_9,          // 1400
  "Collegeville": CLOSED_6_TO_9,     // 1879
  "Phoenixville": CLOSED_6_TO_9,     // 2230
  "Exton": CLOSED_6_TO_9,            // 11228
  "Lansdale 2": CLOSED_6_TO_9,       // 1875
  "Norristown 2": CLOSED_6_TO_9,     // 11187
  "Montgomeryville": CLOSED_6_TO_9,  // 11971
  "Eatontown": CLOSED_6_TO_9,        // 13248
};

/**
 * Check if a given store is closed at a given hour.
 *
 * @param {string} storeName - The store name (must match data exactly)
 * @param {number} hour - The hour (0-23)
 * @returns {boolean} - true if the store is CLOSED at that hour
 */
export const isStoreClosed = (storeName, hour) => {
  const closedHours = STORE_CLOSED_HOURS[storeName];
  if (!closedHours) return false;
  return closedHours.includes(hour);
};

/**
 * Filter out rows where a store is closed.
 * This should be called on raw/validated data BEFORE grouping and averaging.
 *
 * Rows for closed hours are completely removed — they never enter
 * the grouping pipeline, so they cannot affect any average or count.
 *
 * @param {Array} data - Array of rows with { StoreName, Hour, ... }
 * @returns {{ filteredData: Array, closedRowsRemoved: number }}
 */
export const filterClosedHours = (data) => {
  let closedRowsRemoved = 0;
  const filteredData = [];

  for (const row of data) {
    if (isStoreClosed(row.StoreName, row.Hour)) {
      closedRowsRemoved++;
    } else {
      filteredData.push(row);
    }
  }

  return { filteredData, closedRowsRemoved };
};
