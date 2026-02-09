import React, { useMemo } from "react";
import { buildDayHourGrid } from "../utils/dayHourGrid";
import { formatHourRangeToAMPM } from "../utils/dataProcessing";

/**
 * Get heatmap background color based on value relative to min/max
 */
const getHeatmapColor = (value, minVal, maxVal) => {
  if (value <= 0) return "transparent";
  if (maxVal === minVal) return "rgba(59, 130, 246, 0.15)";

  const ratio = (value - minVal) / (maxVal - minVal);

  if (ratio < 0.2) return "rgba(239, 68, 68, 0.18)"; // red - low
  if (ratio < 0.4) return "rgba(249, 115, 22, 0.18)"; // orange
  if (ratio < 0.6) return "rgba(234, 179, 8, 0.15)"; // yellow - mid
  if (ratio < 0.8) return "rgba(34, 197, 94, 0.18)"; // green
  return "rgba(16, 185, 129, 0.25)"; // emerald - high
};

const getHeatmapTextColor = (value, minVal, maxVal) => {
  if (value <= 0) return "text-gray-400";
  if (maxVal === minVal) return "text-blue-700 font-semibold";

  const ratio = (value - minVal) / (maxVal - minVal);

  if (ratio < 0.2) return "text-red-700 font-semibold";
  if (ratio < 0.4) return "text-orange-700 font-semibold";
  if (ratio < 0.6) return "text-yellow-700 font-semibold";
  if (ratio < 0.8) return "text-green-700 font-semibold";
  return "text-emerald-800 font-bold";
};

const DayHourGrid = ({ data, selectedStore, fullView = false }) => {
  const { grid, dayOrder, hours } = useMemo(
    () => buildDayHourGrid(data),
    [data],
  );

  // Calculate min and max for heatmap coloring (excluding zeros)
  const { minVal, maxVal } = useMemo(() => {
    const nonZeroValues = [];
    for (const [, value] of grid) {
      if (value > 0) nonZeroValues.push(value);
    }
    if (nonZeroValues.length === 0) return { minVal: 0, maxVal: 0 };
    return {
      minVal: Math.min(...nonZeroValues),
      maxVal: Math.max(...nonZeroValues),
    };
  }, [grid]);

  const tableWrapperClass = fullView
    ? "overflow-x-auto"
    : "overflow-x-auto max-h-[500px] overflow-y-auto";

  return (
    <div className="card overflow-hidden">
      <div className="card-header bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sales by Day & Hour for{" "}
              <span className="text-blue-700 font-bold italic bg-blue-100 rounded-md px-2 py-0.5">
                {selectedStore ? `${selectedStore}` : "all stores"}
              </span>
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              Average amount per time slot (respects current filters)
            </p>
          </div>
          {/* Heatmap legend */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Low</span>
            <div className="flex gap-0.5">
              <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.3)" }} />
              <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "rgba(249, 115, 22, 0.3)" }} />
              <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "rgba(234, 179, 8, 0.25)" }} />
              <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "rgba(34, 197, 94, 0.3)" }} />
              <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "rgba(16, 185, 129, 0.4)" }} />
            </div>
            <span>High</span>
          </div>
        </div>
      </div>
      <div className={tableWrapperClass}>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gradient-to-r from-slate-100 to-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-r border-slate-300 min-w-[100px] bg-slate-100">
                Time
              </th>
              {dayOrder.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-r border-slate-300 last:border-r-0 min-w-[80px] bg-slate-100"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr
                key={hour}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                <td className="px-4 py-3 border-b border-r border-gray-200 font-medium text-slate-700 whitespace-nowrap bg-slate-50 sticky left-0 z-[5]">
                  {formatHourRangeToAMPM(hour, hour === 23 ? 24 : hour + 1)}
                </td>
                {dayOrder.map((day) => {
                  const value = grid.get(`${day}_${hour}`) ?? 0;
                  const displayValue =
                    value > 0 ? `$${Number(value).toFixed(2)}` : "\u2014";
                  return (
                    <td
                      key={`${day}_${hour}`}
                      className={`px-4 py-3 text-right border-b border-r border-gray-200 last:border-r-0 tabular-nums transition-colors ${getHeatmapTextColor(value, minVal, maxVal)}`}
                      style={{
                        backgroundColor: getHeatmapColor(value, minVal, maxVal),
                      }}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DayHourGrid;
