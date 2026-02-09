/**
 * Chart configuration utilities
 */
import { prepareChartData } from "./dataProcessing";

export const createChartOptions = (selectedStore) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Average Sales by Hour${
          selectedStore ? ` - ${selectedStore}` : " - All Stores"
        }`,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Avg Amount: $${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Average Amount ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Hour of Day",
        },
      },
    },
  };
};

export const createChartData = (filteredData, chartType) => {
  const { labels, values } = prepareChartData(filteredData, "hour");

  return {
    labels,
    datasets: [
      {
        label: "Average Sales Amount",
        data: values,
        backgroundColor:
          chartType === "bar"
            ? "rgba(59, 130, 246, 0.7)"
            : "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: chartType === "bar" ? 1 : 2,
        fill: chartType === "line",
        tension: 0.3,
      },
    ],
  };
};
