import React, { useState, useMemo, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getUniqueStoreNames,
  getUniqueDays,
  processData,
  filterByDateRange,
} from "../utils/dataProcessing";
import SummaryCards from "./SummaryCards";
import Filters from "./Filters";
import SalesChart from "./SalesChart";
import DataTable from "./DataTable";
import EmptyState from "./EmptyState";
import { createChartData, createChartOptions } from "../utils/chartConfig";
import { calculateStats } from "../utils/statsCalculator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = ({ rawData, onOpenDayHourGrid }) => {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("lowest");
  const rowsPerPage = 10;

  // Process raw data: filter by date range, then process
  const processedData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    // Filter by date range first
    const dateFilteredData = filterByDateRange(rawData, fromDate, toDate);

    // Process the filtered data
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

    const sorted = [...result].sort((a, b) => {
      return sortOrder === "lowest"
        ? a.AvgAmount - b.AvgAmount
        : b.AvgAmount - a.AvgAmount;
    });

    return sorted;
  }, [processedData, selectedStore, selectedDay, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  // Reset page when filters or sort order change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStore, selectedDay, sortOrder, fromDate, toDate]);

  // Prepare chart data
  const chartData = useMemo(
    () => createChartData(filteredData, chartType),
    [filteredData, chartType],
  );

  // Chart options
  const chartOptions = useMemo(
    () => createChartOptions(selectedStore),
    [selectedStore],
  );

  // Calculate summary statistics
  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  if (!rawData || rawData.length === 0) {
    return <EmptyState />;
  }

  const handleClearFilters = () => {
    setSelectedStore("");
    setSelectedDay("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-gray-900">
      <section aria-label="Summary">
        <SummaryCards stats={stats} />
      </section>

      <section aria-label="Filters">
        <Filters
          stores={stores}
          days={days}
          selectedStore={selectedStore}
          selectedDay={selectedDay}
          fromDate={fromDate}
          toDate={toDate}
          chartType={chartType}
          onStoreChange={setSelectedStore}
          onDayChange={setSelectedDay}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onChartTypeChange={setChartType}
          onClearFilters={handleClearFilters}
        />
      </section>

      <section aria-label="Chart">
        {onOpenDayHourGrid && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() =>
                onOpenDayHourGrid(
                  selectedStore,
                  selectedDay,
                  fromDate,
                  toDate
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
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
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              View Day & Hour Grid
            </button>
          </div>
        )}
        <SalesChart
          selectedStore={selectedStore}
          chartData={chartData}
          chartOptions={chartOptions}
          chartType={chartType}
        />
      </section>

      <section aria-label="Data table">
        <DataTable
          data={paginatedData}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          totalRecords={filteredData.length}
          sortOrder={sortOrder}
          onPageChange={setCurrentPage}
          onSortOrderChange={setSortOrder}
          selectedStore={selectedStore}
        />
      </section>
    </div>
  );
};

export default Dashboard;
