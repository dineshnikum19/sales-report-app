import React from "react";
import { Bar, Line } from "react-chartjs-2";

const SalesChart = ({ chartData, chartOptions, chartType }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
      <div className="h-80">
        {chartType === "bar" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default SalesChart;
