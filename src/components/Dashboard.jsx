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
  getUniqueStores,
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

const Dashboard = ({ rawData }) => {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("lowest");
  const rowsPerPage = 20;

  // Process raw data: filter by date range, then process
  const processedData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    // Filter by date range first
    const dateFilteredData = filterByDateRange(rawData, fromDate, toDate);

    // Process the filtered data
    const { processedData } = processData(dateFilteredData);
    return processedData;
  }, [rawData, fromDate, toDate]);

  const stores = useMemo(() => getUniqueStores(processedData), [processedData]);
  const days = useMemo(() => getUniqueDays(processedData), [processedData]);

  const filteredData = useMemo(() => {
    let result = processedData;

    if (selectedStore) {
      result = result.filter((row) => row.StoreCode === selectedStore);
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
    <div className="space-y-6">
      <SummaryCards stats={stats} />

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

      <SalesChart
        chartData={chartData}
        chartOptions={chartOptions}
        chartType={chartType}
      />

      <DataTable
        data={paginatedData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        totalRecords={filteredData.length}
        sortOrder={sortOrder}
        onPageChange={setCurrentPage}
        onSortOrderChange={setSortOrder}
      />
    </div>
  );
};

export default Dashboard;
