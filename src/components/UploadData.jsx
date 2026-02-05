import React, { useState, useRef } from 'react';
import { parseExcelFile, processData } from '../utils/dataProcessing';
import { downloadSampleExcel, getSampleDataStats } from '../utils/sampleDataGenerator';

/**
 * UploadData Component
 * 
 * Handles the admin flow for manual data uploads (testing/development):
 * 1. File selection via drag-and-drop or click
 * 2. Excel file parsing using xlsx library
 * 3. Data validation and cleaning
 * 4. Pass processed data to parent component
 * 
 * NOTE: This component NO LONGER saves to localStorage.
 * Data is only stored in React state and is temporary.
 * For production, use the hosted JSON file instead.
 */
const UploadData = ({ onDataUploaded }) => {
  // State for tracking upload status and results
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  /**
   * Handle file selection from input or drop
   */
  const handleFile = async (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['xlsx', 'xls', 'csv'];
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError('Please upload a valid Excel file (.xlsx, .xls) or CSV file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setUploadResult(null);

    try {
      // Step 1: Parse Excel file to JSON using xlsx library
      const rawData = await parseExcelFile(file);
      
      if (!rawData || rawData.length === 0) {
        throw new Error('The file appears to be empty or has no valid data.');
      }

      // Step 2: Validate columns exist
      const requiredColumns = ['StoreName', 'StoreCode', 'Amount', 'Hour', 'Day', 'Date'];
      const firstRow = rawData[0];
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      // Step 3: Process data (validate, clean, group, calculate averages, sort)
      const { processedData, stats } = processData(rawData);

      if (processedData.length === 0) {
        throw new Error('No valid data found after processing. Please check your data format.');
      }

      // Step 4: Pass both processed and raw data to parent component
      // - processedData: For immediate display in dashboard
      // - rawData: For merging with existing data.json and downloading
      // 
      // NOTE: Data is NOT automatically saved.
      // User must download the merged JSON and manually upload to GitHub.

      // Update state with success result
      setUploadResult({
        fileName: file.name,
        stats: stats,
        timestamp: new Date().toLocaleString()
      });

      // Notify parent component that data is ready
      // Pass both processed data (for display) and raw data (for merging)
      onDataUploaded(processedData, rawData);

    } catch (err) {
      setError(err.message || 'An error occurred while processing the file.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle drag events for drag-and-drop functionality
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  /**
   * Handle click on drop zone to trigger file input
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Sales Data</h2>
        <p className="text-gray-600">
          Upload an Excel file containing 4 weeks of sales data. The file should have columns:
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded ml-2">
            StoreName, StoreCode, Amount, Hour, Day, Date
          </span>
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center">
            {/* Loading Spinner */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Processing file...</p>
            <p className="text-gray-500 text-sm mt-2">Validating and calculating averages</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Upload Icon */}
            <svg 
              className={`w-16 h-16 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-700 font-medium mb-2">
              {isDragging ? 'Drop your file here' : 'Drag and drop your Excel file here'}
            </p>
            <p className="text-gray-500 text-sm">
              or <span className="text-blue-600 underline">browse</span> to choose a file
            </p>
            <p className="text-gray-400 text-xs mt-4">
              Supported formats: .xlsx, .xls, .csv
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-red-800 font-medium">Upload Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {uploadResult && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-green-800 font-semibold text-lg">Upload Successful!</h4>
              <p className="text-green-700 text-sm mt-1">
                File <span className="font-mono">{uploadResult.fileName}</span> processed at {uploadResult.timestamp}
              </p>
              
              {/* Statistics */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Rows</p>
                  <p className="text-xl font-bold text-gray-800">{uploadResult.stats.totalRawRows}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Valid Rows</p>
                  <p className="text-xl font-bold text-green-600">{uploadResult.stats.validRows}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Stores</p>
                  <p className="text-xl font-bold text-gray-800">{uploadResult.stats.stores}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Data Groups</p>
                  <p className="text-xl font-bold text-gray-800">{uploadResult.stats.uniqueGroups}</p>
                </div>
              </div>
              
              {uploadResult.stats.invalidRows > 0 && (
                <p className="mt-3 text-amber-700 text-sm">
                  Note: {uploadResult.stats.invalidRows} rows were skipped due to invalid data.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Download */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-purple-800 font-semibold mb-2">Need Sample Data?</h3>
            <p className="text-purple-700 text-sm mb-3">
              Download a sample Excel file with 4 weeks of realistic sales data for 10 stores.
            </p>
            <p className="text-purple-600 text-xs">
              Contains {getSampleDataStats().totalRecords.toLocaleString()} records across {getSampleDataStats().stores} stores
            </p>
          </div>
          <button
            onClick={downloadSampleExcel}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Sample Excel
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-blue-800 font-semibold mb-3">Expected Data Format</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-blue-700">
                <th className="pb-2 pr-4">Column</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2">Example</th>
              </tr>
            </thead>
            <tbody className="text-blue-900">
              <tr>
                <td className="py-1 pr-4 font-mono">StoreName</td>
                <td className="py-1 pr-4">Text</td>
                <td className="py-1">Downtown Store</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">StoreCode</td>
                <td className="py-1 pr-4">Text</td>
                <td className="py-1">STORE001</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">Amount</td>
                <td className="py-1 pr-4">Number (≥0)</td>
                <td className="py-1">1250.50</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">Hour</td>
                <td className="py-1 pr-4">Integer (0-23)</td>
                <td className="py-1">14</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">Day</td>
                <td className="py-1 pr-4">Text</td>
                <td className="py-1">Monday</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">Date</td>
                <td className="py-1 pr-4">Date</td>
                <td className="py-1">2024-01-15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadData;
