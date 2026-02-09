import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";

const DATA_URL = "/data.json";

function App() {
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Data must be an array of objects");
        }

        if (data.length === 0) {
          throw new Error("No data found in the JSON file");
        }

        setRawData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(DATA_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      setRawData(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-1">
            Loading data from server...
          </p>
          <p className="text-gray-500 text-sm">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={handleRefreshData}
            className="btn-primary w-full mb-4"
          >
            Try Again
          </button>
          <p className="text-xs text-gray-500">
            Data source:{" "}
            <span className="font-mono break-all text-gray-600">
              {DATA_URL}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header with gradient */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  Sales Report Dashboard
                </h1>
                <p className="text-xs text-blue-200 hidden sm:block">
                  Real-time analytics
                </p>
              </div>
            </div>
            {rawData.length > 0 && (
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 rounded-lg transition-all duration-200 disabled:opacity-50 border border-white/30"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Dashboard rawData={rawData} />
      </main>

      {/* Footer with matching gradient */}
      <footer className="mt-auto bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-300">
            <span className="font-medium text-white">
              Sales Report Dashboard
            </span>{" "}
            — Analyze store sales by day and hour
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
