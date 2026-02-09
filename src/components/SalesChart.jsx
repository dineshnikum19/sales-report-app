import React from "react";
import { Bar, Line } from "react-chartjs-2";

const SalesChart = ({ chartData, chartOptions, chartType, selectedStore }) => {
  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">
          Sales by time slot for{" "}
          <span className="text-xl text-black font-bold italic bg-blue-300 rounded-md px-2 py-1">
            {selectedStore ? `${selectedStore}` : "all stores"}
          </span>
        </h3>
        <p className="text-sm text-gray-600 mt-0.5">
          {chartType === "bar" ? "Bar chart" : "Line chart"} — average amount
          per store/day/hour
        </p>
      </div>
      <div className="p-5 sm:p-6 bg-gray-50">
        <div className="h-80">
          {chartType === "bar" ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
