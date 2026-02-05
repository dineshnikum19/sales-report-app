import React, { useState, useEffect } from 'react';
import UploadData from './components/UploadData';
import Dashboard from './components/Dashboard';
import { processData } from './utils/dataProcessing';

const DATA_URL = "/data.json";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [salesData, setSalesData] = useState([]);
  const [rawDataFromUrl, setRawDataFromUrl] = useState([]);
  const [uploadedRawData, setUploadedRawData] = useState(null);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(DATA_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const rawData = await response.json();
        
        if (!Array.isArray(rawData)) {
          throw new Error('Data must be an array of objects');
        }
        
        if (rawData.length === 0) {
          throw new Error('No data found in the JSON file');
        }
        
        setRawDataFromUrl(rawData);
        const { processedData } = processData(rawData);
        
        if (processedData.length === 0) {
          throw new Error('No valid data after processing');
        }
        
        setSalesData(processedData);
        setIsLoading(false);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDataUploaded = (newProcessedData, rawNewData) => {
    setSalesData(newProcessedData);
    setUploadedRawData(rawNewData);
    setShowDownloadPrompt(true);
    setTimeout(() => setActiveTab('dashboard'), 500);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(DATA_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const rawData = await response.json();
      setRawDataFromUrl(rawData);
      
      const { processedData } = processData(rawData);
      
      setSalesData(processedData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleDownloadMergedJson = () => {
    if (!uploadedRawData) return;
    
    const merged = [...rawDataFromUrl];
    const existingKeys = new Set(
      rawDataFromUrl.map(row => 
        `${row.StoreCode}_${row.Day}_${row.Hour}_${row.Date}`
      )
    );
    
    for (const newRow of uploadedRawData) {
      const key = `${newRow.StoreCode}_${newRow.Day}_${newRow.Hour}_${newRow.Date}`;
      if (!existingKeys.has(key)) {
        merged.push(newRow);
        existingKeys.add(key);
      }
    }
    
    merged.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
      if (a.StoreCode !== b.StoreCode) return a.StoreCode.localeCompare(b.StoreCode);
      if (a.Day !== b.Day) return a.Day.localeCompare(b.Day);
      return a.Hour - b.Hour;
    });
    
    const jsonString = JSON.stringify(merged, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-merged-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowDownloadPrompt(false);
    setUploadedRawData(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading data from server...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Failed to Load Data</h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <button
              onClick={handleRefreshData}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Data source: <span className="font-mono break-all">{DATA_URL}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h1 className="text-xl font-bold text-gray-800">Sales Report Dashboard</h1>
            </div>

            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Data
                </span>
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Dashboard
                  {salesData.length > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {salesData.length}
                    </span>
                  )}
                </span>
              </button>
            </nav>

            {salesData.length > 0 && (
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDownloadPrompt && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <svg className="w-8 h-8 text-green-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 mb-2">Excel Data Uploaded Successfully!</h3>
                  <p className="text-green-800 mb-4">
                    Your uploaded data has been merged with the existing data. Download the merged JSON file and upload it to GitHub to make it permanent.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Next Steps:</p>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Click "Download Merged JSON" below</li>
                      <li>Go to your GitHub repository</li>
                      <li>Replace the old data.json with the downloaded file</li>
                      <li>Click "Refresh Data" to see the updated data</li>
                    </ol>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadMergedJson}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Merged JSON
                    </button>
                    <button
                      onClick={() => setShowDownloadPrompt(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' ? (
          <UploadData onDataUploaded={handleDataUploaded} />
        ) : (
          <Dashboard data={salesData} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Sales Report Dashboard - Analyze store sales by day and hour
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
