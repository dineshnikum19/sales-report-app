import React from "react";
import { formatHourRangeToAMPM } from "../utils/dataProcessing";

const DataTable = ({
  data,
  currentPage,
  rowsPerPage,
  totalPages,
  totalRecords,
  sortOrder,
  onPageChange,
  onSortOrderChange,
}) => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, totalRecords);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Sales Data by Store, Day & Hour
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {sortOrder === "lowest"
              ? "Sorted by lowest average amount first. The top row shows the worst performing time slot."
              : "Sorted by highest average amount first. The top row shows the best performing time slot."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <button
            onClick={() => onSortOrderChange("lowest")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortOrder === "lowest"
                ? "bg-red-100 text-red-700 border-2 border-red-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent"
            }`}
          >
            Lowest First
          </button>
          <button
            onClick={() => onSortOrderChange("highest")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortOrder === "highest"
                ? "bg-green-100 text-green-700 border-2 border-green-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent"
            }`}
          >
            Highest First
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Store Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Store Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hour
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Avg Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => {
              const globalIndex = startIndex + index;
              const isFirst = globalIndex === 0;
              const isLowest = sortOrder === "lowest" && isFirst;
              const isHighest = sortOrder === "highest" && isFirst;

              return (
                <tr
                  key={`${row.StoreCode}-${row.Day}-${row.Hour}`}
                  className={`
                    ${
                      isLowest
                        ? "bg-red-50"
                        : isHighest
                          ? "bg-green-50"
                          : "hover:bg-gray-50"
                    }
                    transition-colors
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {globalIndex + 1}
                    {isLowest && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Lowest
                      </span>
                    )}
                    {isHighest && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Highest
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.StoreName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {row.StoreCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {row.Day}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatHourRangeToAMPM(row.Hour, row.Hour + 1)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                      isLowest
                        ? "text-red-600"
                        : isHighest
                          ? "text-green-600"
                          : "text-gray-900"
                    }`}
                  >
                    ${row.AvgAmount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {endIndex} of {totalRecords} results
            </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
