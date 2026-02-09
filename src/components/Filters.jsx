import React from "react";

const Filters = ({
  stores,
  days,
  selectedStore,
  selectedDay,
  fromDate,
  toDate,
  chartType = "bar",
  onStoreChange,
  onDayChange,
  onFromDateChange,
  onToDateChange,
  onChartTypeChange,
  onClearFilters,
  hideChartType = false,
}) => {
  const hasActiveFilters = selectedStore || selectedDay || fromDate || toDate;

  return (
    <div className="card p-4 sm:p-5 border-l-4 border-l-blue-500">
      <h3 className="section-title mb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>
        Filters
        {hasActiveFilters && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Active
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-4 sm:gap-5 items-end">
        <div className="flex-1 min-w-[160px] sm:min-w-[180px]">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Filter by Store
          </label>
          <select
            value={selectedStore}
            onChange={(e) => onStoreChange(e.target.value)}
            className="input-base py-2.5"
          >
            <option value="">All Stores</option>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[160px] sm:min-w-[180px]">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Filter by Day
          </label>
          <select
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
            className="input-base py-2.5"
          >
            <option value="">All Days</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px] sm:min-w-[160px]">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="input-base py-2.5"
          />
        </div>
        <div className="flex-1 min-w-[140px] sm:min-w-[160px]">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="input-base py-2.5"
          />
        </div>
        {!hideChartType && (
          <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => onChartTypeChange(e.target.value)}
              className="input-base py-2.5"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        )}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 border border-red-300 hover:border-red-500 rounded-xl transition-all duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
