import { formatHourRangeToAMPM } from "./dataProcessing";

/**
 * Calculate summary statistics from filtered data
 */
export const calculateStats = (filteredData) => {
  if (filteredData.length === 0) return null;

  const amounts = filteredData.map((r) => r.AvgAmount);
  const total = amounts.reduce((sum, amt) => sum + amt, 0);
  const avg = total / amounts.length;
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);

  // Find the lowest performing slot by scanning for the minimum AvgAmount
  // (do NOT rely on sort order — the caller may sort ascending or descending)
  const lowest = filteredData.reduce(
    (min, row) => (!min || row.AvgAmount < min.AvgAmount ? row : min),
    null,
  );

  return {
    totalRecords: filteredData.length,
    avgAmount: avg.toFixed(2),
    minAmount: min.toFixed(2),
    maxAmount: max.toFixed(2),
    lowestSlot: lowest
      ? `${lowest.StoreName} - ${lowest.Day} ${formatHourRangeToAMPM(
          lowest.Hour,
          lowest.Hour + 1,
        )}`
      : "-",
  };
};
