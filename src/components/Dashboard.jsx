import React, { useState, useMemo } from 'react';
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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { 
  getUniqueStores, 
  getUniqueDays, 
  filterByStore, 
  prepareChartData 
} from '../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ data }) => {
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartGroupBy, setChartGroupBy] = useState('hour');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('lowest');
  const rowsPerPage = 20;
  const stores = useMemo(() => getUniqueStores(data), [data]);
  const days = useMemo(() => getUniqueDays(data), [data]);

  const filteredData = useMemo(() => {
    let result = data;
    
    if (selectedStore) {
      result = result.filter(row => row.StoreCode === selectedStore);
    }
    
    if (selectedDay) {
      result = result.filter(row => row.Day === selectedDay);
    }
    
    const sorted = [...result].sort((a, b) => {
      return sortOrder === 'lowest' 
        ? a.AvgAmount - b.AvgAmount 
        : b.AvgAmount - a.AvgAmount;
    });
    
    return sorted;
  }, [data, selectedStore, selectedDay, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  // Reset page when filters or sort order change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStore, selectedDay, sortOrder]);

  /**
   * Prepare chart data based on current filters and grouping
   */
  const chartData = useMemo(() => {
    const { labels, values } = prepareChartData(filteredData, chartGroupBy);
    
    return {
      labels,
      datasets: [
        {
          label: 'Average Sales Amount',
          data: values,
          backgroundColor: chartType === 'bar' 
            ? 'rgba(59, 130, 246, 0.7)' 
            : 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: chartType === 'bar' ? 1 : 2,
          fill: chartType === 'line',
          tension: 0.3,
        },
      ],
    };
  }, [filteredData, chartGroupBy, chartType]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Average Sales by ${chartGroupBy === 'hour' ? 'Hour' : 'Day'}${selectedStore ? ` - ${selectedStore}` : ' - All Stores'}`,
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
          text: 'Average Amount ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: chartGroupBy === 'hour' ? 'Hour of Day' : 'Day of Week',
        },
      },
    },
  };

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const amounts = filteredData.map(r => r.AvgAmount);
    const total = amounts.reduce((sum, amt) => sum + amt, 0);
    const avg = total / amounts.length;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    
    // Find the lowest performing slot (first item since sorted by lowest)
    const lowest = filteredData[0];
    
    return {
      totalRecords: filteredData.length,
      avgAmount: avg.toFixed(2),
      minAmount: min.toFixed(2),
      maxAmount: max.toFixed(2),
      lowestSlot: lowest ? `${lowest.StoreName} - ${lowest.Day} ${lowest.Hour} - ${lowest.Hour + 1}` : '-',
    };
  }, [filteredData]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No Data Available</h3>
        <p className="text-gray-500">No data found in data.json file</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Records</p>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalRecords || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Amount</p>
          <p className="text-2xl font-bold text-blue-600">${stats?.avgAmount || '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Min Amount</p>
          <p className="text-2xl font-bold text-red-600">${stats?.minAmount || '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Max Amount</p>
          <p className="text-2xl font-bold text-green-600">${stats?.maxAmount || '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Lowest Slot</p>
          <p className="text-sm font-semibold text-orange-600 truncate" title={stats?.lowestSlot}>
            {stats?.lowestSlot || '-'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Store
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Stores</option>
              {stores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Days</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              value={chartGroupBy}
              onChange={(e) => setChartGroupBy(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
            </select>
          </div>
          {(selectedStore || selectedDay) && (
            <button
              onClick={() => {
                setSelectedStore('');
                setSelectedDay('');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mt-6"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
        <div className="h-80">
          {chartType === 'bar' ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Sales Data by Store, Day & Hour
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {sortOrder === 'lowest' 
                ? 'Sorted by lowest average amount first. The top row shows the worst performing time slot.'
                : 'Sorted by highest average amount first. The top row shows the best performing time slot.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <button
              onClick={() => setSortOrder('lowest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortOrder === 'lowest'
                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              Lowest First
            </button>
            <button
              onClick={() => setSortOrder('highest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortOrder === 'highest'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              Highest First
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Store Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Store Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hour
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Avg Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row, index) => {
                const globalIndex = (currentPage - 1) * rowsPerPage + index;
                const isFirst = globalIndex === 0;
                const isLowest = sortOrder === 'lowest' && isFirst;
                const isHighest = sortOrder === 'highest' && isFirst;
                
                return (
                  <tr 
                    key={`${row.StoreCode}-${row.Day}-${row.Hour}`}
                    className={`
                      ${isLowest ? 'bg-red-50' : isHighest ? 'bg-green-50' : 'hover:bg-gray-50'}
                      transition-colors
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {globalIndex + 1}
                      {isLowest && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Lowest
                        </span>
                      )}
                      {isHighest && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Highest
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.StoreName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {row.StoreCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.Day}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {row.Hour} - {row.Hour + 1}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                      isLowest ? 'text-red-600' : isHighest ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      ${row.AvgAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
