import React, { useMemo } from "react";
import { buildDayHourGrid } from "../utils/dayHourGrid";
import { formatHourRangeToAMPM } from "../utils/dataProcessing";

const DayHourGrid = ({ data, selectedStore, fullView = false }) => {
  const { grid, dayOrder, hours } = useMemo(
    () => buildDayHourGrid(data),
    [data],
  );

  const tableWrapperClass = fullView
    ? "overflow-x-auto"
    : "overflow-x-auto max-h-[500px] overflow-y-auto";

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">
          Sales by Day & Hour for{" "}
          <span className="text-xl text-black font-bold italic bg-blue-300 rounded-md px-2 py-1">
            {selectedStore ? `${selectedStore}` : "all stores"}
          </span>
        </h3>
        <p className="text-sm text-gray-600 mt-0.5">
          Average amount per time slot (respects current filters)
        </p>
      </div>
      <div className={tableWrapperClass}>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-r border-gray-400 min-w-[100px] bg-gray-100">
                Time
              </th>
              {dayOrder.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-r border-gray-400 last:border-r-0 min-w-[80px] bg-gray-100"
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
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 border-b border-r border-gray-300 font-medium text-gray-700 whitespace-nowrap bg-gray-50 sticky left-0 z-[5]">
                  {formatHourRangeToAMPM(hour, hour === 23 ? 24 : hour + 1)}
                </td>
                {dayOrder.map((day) => {
                  const value = grid.get(`${day}_${hour}`) ?? 0;
                  const displayValue =
                    value > 0 ? `$${Number(value).toFixed(2)}` : "—";
                  const isHighlighted = value > 0;
                  return (
                    <td
                      key={`${day}_${hour}`}
                      className={`px-4 py-3 text-right border-b border-r border-gray-300 last:border-r-0 tabular-nums transition-colors ${
                        isHighlighted
                          ? "font-medium text-gray-900"
                          : "text-gray-400"
                      }`}
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
