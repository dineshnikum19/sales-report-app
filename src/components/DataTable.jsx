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
      <div className="card-header bg-gradient-to-r from-amber-50 to-orange-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sales Data by Store, Day & Hour for{" "}
            <span className="text-amber-700 font-bold italic bg-amber-100 rounded-md px-2 py-0.5">
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
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md"
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
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            Highest First
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-r border-slate-300 bg-slate-100">
                #
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-r border-slate-300 bg-slate-100">
                Store Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-r border-slate-300 bg-slate-100">
                Store Code
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-r border-slate-300 bg-slate-100">
                Day
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-r border-slate-300 bg-slate-100">
                Hour
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider border-b-2 border-slate-300 bg-slate-100">
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
                      ? "bg-red-50 border-l-4 border-l-red-500"
                      : isHighest
                        ? "bg-emerald-50 border-l-4 border-l-emerald-500"
                        : index % 2 === 0
                          ? "bg-white hover:bg-blue-50/50"
                          : "bg-slate-50/50 hover:bg-blue-50/50"
                  }`}
                >
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 border-b border-r border-gray-200">
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
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-r border-gray-200">
                    {row.StoreName}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 font-mono border-b border-r border-gray-200">
                    {row.StoreCode}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 border-b border-r border-gray-200">
                    {row.Day}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600 border-b border-r border-gray-200">
                    {formatHourRangeToAMPM(row.Hour, row.Hour + 1)}
                  </td>
                  <td
                    className={`px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-right font-semibold border-b border-gray-200 ${
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
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-slate-50 to-gray-50">
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
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-white font-medium tabular-nums bg-blue-600 rounded-xl shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white"
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
