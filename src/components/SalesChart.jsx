import React from "react";
import { Bar, Line } from "react-chartjs-2";

const SalesChart = ({ chartData, chartOptions, chartType, selectedStore }) => {
  return (
    <div className="card overflow-hidden">
      <div className="card-header bg-gradient-to-r from-violet-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900">
          Sales by time slot for{" "}
          <span className="text-purple-700 font-bold italic bg-purple-100 rounded-md px-2 py-0.5">
            {selectedStore ? `${selectedStore}` : "all stores"}
          </span>
        </h3>
        <p className="text-sm text-gray-600 mt-0.5">
          {chartType === "bar" ? "Bar chart" : "Line chart"} — average amount
          per store/day/hour
        </p>
      </div>
      <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-50 to-white">
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
