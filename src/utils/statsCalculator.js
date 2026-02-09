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

  // Find the lowest performing slot (first item since sorted by lowest)
  const lowest = filteredData[0];

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
