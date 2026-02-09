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
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 13, weight: "500" },
        },
      },
      title: {
        display: true,
        text: `Average Sales by Hour${
          selectedStore ? ` - ${selectedStore}` : " - All Stores"
        }`,
        font: { size: 16, weight: "600" },
        color: "#1e293b",
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 13, weight: "600" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
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
          font: { size: 12, weight: "500" },
          color: "#64748b",
        },
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
        },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
      },
      x: {
        title: {
          display: true,
          text: "Hour of Day",
          font: { size: 12, weight: "500" },
          color: "#64748b",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
        },
      },
    },
  };
};

export const createChartData = (filteredData, chartType) => {
  const { labels, values } = prepareChartData(filteredData, "hour");

  // Generate gradient-like colors for bar chart
  const barColors = values.map((val, i) => {
    const ratio = values.length > 1 ? i / (values.length - 1) : 0;
    // Gradient from blue to purple to indigo
    const r = Math.round(59 + ratio * 40);
    const g = Math.round(130 - ratio * 60);
    const b = Math.round(246 - ratio * 30);
    return `rgba(${r}, ${g}, ${b}, 0.75)`;
  });

  const barBorderColors = values.map((val, i) => {
    const ratio = values.length > 1 ? i / (values.length - 1) : 0;
    const r = Math.round(59 + ratio * 40);
    const g = Math.round(130 - ratio * 60);
    const b = Math.round(246 - ratio * 30);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  });

  return {
    labels,
    datasets: [
      {
        label: "Average Sales Amount",
        data: values,
        backgroundColor:
          chartType === "bar" ? barColors : "rgba(99, 102, 241, 0.15)",
        borderColor:
          chartType === "bar" ? barBorderColors : "rgba(99, 102, 241, 1)",
        borderWidth: chartType === "bar" ? 1 : 2.5,
        fill: chartType === "line",
        tension: 0.4,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: chartType === "line" ? 4 : 0,
        pointHoverRadius: 6,
        borderRadius: chartType === "bar" ? 6 : 0,
      },
    ],
  };
};
