import React, { useState, useMemo } from "react";
import {
  getUniqueStoreNames,
  getUniqueDays,
  processData,
  filterByDateRange,
} from "../utils/dataProcessing";
import Filters from "./Filters";
import DayHourGrid from "./DayHourGrid";

const DayHourGridPage = ({
  rawData,
  initialSelectedStore = "",
  initialSelectedDay = "",
  initialFromDate = "",
  initialToDate = "",
  onBack,
}) => {
  const [selectedStore, setSelectedStore] = useState(initialSelectedStore);
  const [selectedDay, setSelectedDay] = useState(initialSelectedDay);
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);

  const processedData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    const dateFilteredData = filterByDateRange(rawData, fromDate, toDate);
    const { processedData } = processData(dateFilteredData);
    return processedData;
  }, [rawData, fromDate, toDate]);

  const stores = useMemo(
    () => getUniqueStoreNames(processedData),
    [processedData],
  );
  const days = useMemo(() => getUniqueDays(processedData), [processedData]);

  const filteredData = useMemo(() => {
    let result = processedData;
    if (selectedStore) {
      result = result.filter((row) => row.StoreName === selectedStore);
    }
    if (selectedDay) {
      result = result.filter((row) => row.Day === selectedDay);
    }
    return result;
  }, [processedData, selectedStore, selectedDay]);

  const handleClearFilters = () => {
    setSelectedStore("");
    setSelectedDay("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-gray-900">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          Day & Hour Grid — Full View
        </h2>
      </div>

      <section aria-label="Filters">
        <Filters
          stores={stores}
          days={days}
          selectedStore={selectedStore}
          selectedDay={selectedDay}
          fromDate={fromDate}
          toDate={toDate}
          chartType="bar"
          onStoreChange={setSelectedStore}
          onDayChange={setSelectedDay}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onChartTypeChange={() => {}}
          onClearFilters={handleClearFilters}
          hideChartType
        />
      </section>

      <section aria-label="Day and hour grid">
        <DayHourGrid
          data={filteredData}
          selectedStore={selectedStore}
          fullView={true}
        />
      </section>
    </div>
  );
};

export default DayHourGridPage;
