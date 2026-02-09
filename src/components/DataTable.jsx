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
  selectedStore,
}) => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, totalRecords);

  return (
    <div className="card overflow-hidden">
      <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sales Data by Store, Day & Hour for{" "}
            <span className="text-xl text-black font-bold italic bg-blue-300 rounded-md px-2 py-1">
              {selectedStore ? `${selectedStore}` : "all stores"}
            </span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {sortOrder === "lowest"
              ? "Sorted by lowest average amount first. The top row shows the worst performing time slot."
              : "Sorted by highest average amount first. The top row shows the best performing time slot."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <button
            type="button"
            onClick={() => onSortOrderChange("lowest")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              sortOrder === "lowest"
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            Lowest First
          </button>
          <button
            type="button"
            onClick={() => onSortOrderChange("highest")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              sortOrder === "highest"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            Highest First
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-r border-gray-400 bg-gray-100">
                #
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-r border-gray-400 bg-gray-100">
                Store Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-r border-gray-400 bg-gray-100">
                Store Code
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-r border-gray-400 bg-gray-100">
                Day
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-r border-gray-400 bg-gray-100">
                Hour
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-400 bg-gray-100">
                Avg Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const globalIndex = startIndex + index;
              const isFirst = globalIndex === 0;
              const isLowest = sortOrder === "lowest" && isFirst;
              const isHighest = sortOrder === "highest" && isFirst;

              return (
                <tr
                  key={`${row.StoreCode}-${row.Day}-${row.Hour}`}
                  className={`transition-colors duration-150 ${
                    isLowest
                      ? "bg-red-50 border-l-4 border-red-500"
                      : isHighest
                        ? "bg-emerald-50 border-l-4 border-emerald-500"
                        : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 border-b border-r border-gray-300">
                    {globalIndex + 1}
                    {isLowest && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                        Lowest
                      </span>
                    )}
                    {isHighest && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">
                        Highest
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-r border-gray-300">
                    {row.StoreName}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 font-mono border-b border-r border-gray-300">
                    {row.StoreCode}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 border-b border-r border-gray-300">
                    {row.Day}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 border-b border-r border-gray-300">
                    {formatHourRangeToAMPM(row.Hour, row.Hour + 1)}
                  </td>
                  <td
                    className={`px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-right font-semibold border-b border-gray-300 ${
                      isLowest
                        ? "text-red-600"
                        : isHighest
                          ? "text-emerald-600"
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

      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {startIndex + 1}–{endIndex}
            </span>{" "}
            of <span className="font-medium text-gray-900">{totalRecords}</span>{" "}
            results
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700 font-medium tabular-nums bg-white border border-gray-300 rounded-xl">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white"
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
