/**
 * Data Processing Utilities for Sales Report App
 * 
 * This module handles:
 * 1. Parsing Excel data to JSON
 * 2. Validating and cleaning data
 * 3. Grouping data by Store + Day + Hour
 * 4. Calculating 4-week averages
 * 5. Sorting results by lowest AvgAmount first
 */

import * as XLSX from 'xlsx';

/**
 * Parse Excel file and convert to JSON array
 * 
 * @param {File} file - The uploaded Excel file
 * @returns {Promise<Array>} - Array of row objects from Excel
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        // Use xlsx library to read the workbook from binary data
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet (assuming data is in the first sheet)
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON with header row as keys
        // Expected columns: StoreName, StoreCode, Amount, Hour, Day, Date
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,  // Get formatted strings for dates
          defval: ''   // Default value for empty cells
        });
        
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Validate and clean a single data row
 * 
 * Validation rules:
 * - Amount: must be a number >= 0
 * - Hour: must be an integer between 0 and 23
 * - Day: must not be empty
 * - Date: must be a valid date string
 * - StoreCode: must not be empty
 * 
 * @param {Object} row - Single row from Excel data
 * @returns {Object|null} - Cleaned row object or null if invalid
 */
export const validateAndCleanRow = (row) => {
  // Extract and trim values
  const storeName = String(row.StoreName || '').trim();
  const storeCode = String(row.StoreCode || '').trim();
  const day = String(row.Day || '').trim();
  const dateStr = String(row.Date || '').trim();
  
  // Parse Amount - must be a valid number >= 0
  const amount = parseFloat(row.Amount);
  if (isNaN(amount) || amount < 0) {
    return null; // Invalid amount
  }
  
  // Parse Hour - must be integer between 0-23
  const hour = parseInt(row.Hour, 10);
  if (isNaN(hour) || hour < 0 || hour > 23) {
    return null; // Invalid hour
  }
  
  // Validate Day - must not be empty
  if (!day) {
    return null; // Empty day
  }
  
  // Validate Date - must be parseable as a date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return null; // Invalid date
  }
  
  // Validate StoreCode - must not be empty
  if (!storeCode) {
    return null; // Empty store code
  }
  
  // Return cleaned and validated row
  return {
    StoreName: storeName || storeCode, // Use StoreCode as fallback for name
    StoreCode: storeCode,
    Amount: amount,
    Hour: hour,
    Day: day,
    Date: dateStr
  };
};

/**
 * Validate and clean all data rows
 * 
 * @param {Array} data - Array of raw Excel rows
 * @returns {Object} - { validData: Array, invalidCount: number }
 */
export const validateAndCleanData = (data) => {
  const validData = [];
  let invalidCount = 0;
  
  for (const row of data) {
    const cleanedRow = validateAndCleanRow(row);
    if (cleanedRow) {
      validData.push(cleanedRow);
    } else {
      invalidCount++;
    }
  }
  
  return { validData, invalidCount };
};

/**
 * Group data by StoreCode + Day + Hour and calculate 4-week average
 * 
 * GROUPING LOGIC:
 * ===============
 * We create a unique key for each combination of StoreCode, Day, and Hour.
 * For example: "STORE001_Monday_9" groups all sales data for Store STORE001
 * on Mondays at 9 AM across all 4 weeks.
 * 
 * AVERAGE CALCULATION:
 * ====================
 * For each group, we sum all Amount values and divide by the count.
 * This gives us the average sales amount for that specific store,
 * on that specific day of the week, at that specific hour.
 * 
 * Since we have 4 weeks of data, each group typically has 4 data points
 * (one for each week), so the average is effectively a 4-week average.
 * 
 * @param {Array} data - Array of validated/cleaned data rows
 * @returns {Array} - Array of grouped results with averages
 */
export const groupAndCalculateAverages = (data) => {
  // Step 1: Create groups using a Map
  // Key format: "StoreCode_Day_Hour" (e.g., "STORE001_Monday_9")
  const groups = new Map();
  
  for (const row of data) {
    // Create unique grouping key by combining StoreCode, Day, and Hour
    // This ensures all records for the same store, day, and hour are grouped together
    const groupKey = `${row.StoreCode}_${row.Day}_${row.Hour}`;
    
    if (!groups.has(groupKey)) {
      // Initialize new group with metadata and empty amounts array
      groups.set(groupKey, {
        StoreName: row.StoreName,
        StoreCode: row.StoreCode,
        Day: row.Day,
        Hour: row.Hour,
        amounts: []  // Will store all Amount values for this group
      });
    }
    
    // Add this row's Amount to the group's amounts array
    groups.get(groupKey).amounts.push(row.Amount);
  }
  
  // Step 2: Calculate average for each group
  const results = [];
  
  for (const [, group] of groups) {
    // Calculate average: sum of all amounts / count of amounts
    // This is the 4-week average (assuming 4 weeks of data)
    const totalAmount = group.amounts.reduce((sum, amt) => sum + amt, 0);
    const avgAmount = totalAmount / group.amounts.length;
    
    results.push({
      StoreName: group.StoreName,
      StoreCode: group.StoreCode,
      Day: group.Day,
      Hour: group.Hour,
      AvgAmount: Math.round(avgAmount * 100) / 100, // Round to 2 decimal places
      DataPoints: group.amounts.length // Number of weeks/data points in this average
    });
  }
  
  return results;
};

/**
 * Sort results by AvgAmount in ascending order (lowest first)
 * 
 * SORTING LOGIC:
 * ==============
 * The business requirement is to show the lowest earning Day + Hour first.
 * This helps identify underperforming time slots that might need attention
 * (e.g., staffing adjustments, promotions, etc.)
 * 
 * By sorting ascending, the first row in the table will be the store/day/hour
 * combination with the lowest average sales, making it easy to identify
 * opportunities for improvement.
 * 
 * @param {Array} results - Array of grouped results with AvgAmount
 * @returns {Array} - Sorted array (lowest AvgAmount first)
 */
export const sortByLowestAvgAmount = (results) => {
  // Sort in ascending order: lowest AvgAmount comes first
  // This makes it easy to identify the weakest performing time slots
  return [...results].sort((a, b) => a.AvgAmount - b.AvgAmount);
};

/**
 * Merge existing and new processed data without overwriting existing entries
 *
 * Uses StoreCode + Day + Hour as the unique key. If a key already exists,
 * the existing entry is kept and the new one is ignored.
 *
 * @param {Array} existingData - Existing processed data
 * @param {Array} newData - Newly processed data
 * @returns {Array} - Merged and sorted processed data
 */
export const mergeProcessedData = (existingData = [], newData = []) => {
  const merged = new Map();

  for (const row of existingData) {
    const key = `${row.StoreCode}_${row.Day}_${row.Hour}`;
    merged.set(key, row);
  }

  for (const row of newData) {
    const key = `${row.StoreCode}_${row.Day}_${row.Hour}`;
    if (!merged.has(key)) {
      merged.set(key, row);
    }
  }

  return sortByLowestAvgAmount([...merged.values()]);
};

/**
 * Main processing function that orchestrates the entire data pipeline
 * 
 * Pipeline:
 * 1. Validate and clean raw data
 * 2. Group by StoreCode + Day + Hour
 * 3. Calculate 4-week averages
 * 4. Sort by lowest AvgAmount first
 * 
 * @param {Array} rawData - Raw data from Excel parsing
 * @returns {Object} - { processedData: Array, stats: Object }
 */
export const processData = (rawData) => {
  // Step 1: Validate and clean data
  const { validData, invalidCount } = validateAndCleanData(rawData);
  
  // Step 2: Group by Store + Day + Hour and calculate averages
  const groupedData = groupAndCalculateAverages(validData);
  
  // Step 3: Sort by lowest AvgAmount first
  const sortedData = sortByLowestAvgAmount(groupedData);
  
  // Return processed data along with statistics
  return {
    processedData: sortedData,
    stats: {
      totalRawRows: rawData.length,
      validRows: validData.length,
      invalidRows: invalidCount,
      uniqueGroups: sortedData.length,
      stores: [...new Set(validData.map(r => r.StoreCode))].length
    }
  };
};

/**
 * Get unique store codes from processed data
 * 
 * @param {Array} data - Processed data array
 * @returns {Array} - Array of unique store codes
 */
export const getUniqueStores = (data) => {
  const stores = new Set(data.map(row => row.StoreCode));
  return Array.from(stores).sort();
};

/**
 * Get unique days from processed data
 * 
 * @param {Array} data - Processed data array
 * @returns {Array} - Array of unique days
 */
export const getUniqueDays = (data) => {
  const days = new Set(data.map(row => row.Day));
  // Sort days in logical order (Monday to Sunday)
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return Array.from(days).sort((a, b) => {
    const indexA = dayOrder.indexOf(a);
    const indexB = dayOrder.indexOf(b);
    // If day not found in order array, put at end
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
};

/**
 * Filter data by store code
 * 
 * @param {Array} data - Processed data array
 * @param {string} storeCode - Store code to filter by (empty = all stores)
 * @returns {Array} - Filtered data
 */
export const filterByStore = (data, storeCode) => {
  if (!storeCode) return data;
  return data.filter(row => row.StoreCode === storeCode);
};

/**
 * Prepare data for chart visualization
 * Groups data by hour and calculates totals/averages for charting
 * 
 * @param {Array} data - Filtered/processed data
 * @param {string} groupBy - 'hour' or 'day'
 * @returns {Object} - { labels: Array, values: Array }
 */
export const prepareChartData = (data, groupBy = 'hour') => {
  const grouped = new Map();
  
  if (groupBy === 'hour') {
    // Hours to exclude from chart: 2, 3, 4, 5 (which show as 2-3, 3-4, 4-5, 5-6)
    const excludedHours = [2, 3, 4, 5];
    
    // Initialize all hours 0-23 with 0 values, except excluded hours
    for (let hour = 0; hour < 24; hour++) {
      if (!excludedHours.includes(hour)) {
        grouped.set(hour, { total: 0, count: 0 });
      }
    }
    
    // Group by hour (0-23) and accumulate data, excluding specified hours
    for (const row of data) {
      const key = row.Hour;
      if (!excludedHours.includes(key) && grouped.has(key)) {
        grouped.get(key).total += row.AvgAmount;
        grouped.get(key).count += 1;
      }
    }
    
    // Create sorted arrays for chart (excluding hours 2, 3, 4, 5)
    const sortedEntries = [...grouped.entries()].sort((a, b) => a[0] - b[0]);
    return {
      labels: sortedEntries.map(([hour]) => `${hour} - ${hour + 1}`),
      values: sortedEntries.map(([, { total, count }]) => 
        count > 0 ? Math.round((total / count) * 100) / 100 : 0
      )
    };
  } else {
    // Group by day
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const row of data) {
      const key = row.Day;
      if (!grouped.has(key)) {
        grouped.set(key, { total: 0, count: 0 });
      }
      grouped.get(key).total += row.AvgAmount;
      grouped.get(key).count += 1;
    }
    
    // Sort by day order
    const sortedEntries = [...grouped.entries()].sort((a, b) => {
      return dayOrder.indexOf(a[0]) - dayOrder.indexOf(b[0]);
    });
    
    return {
      labels: sortedEntries.map(([day]) => day),
      values: sortedEntries.map(([, { total, count }]) => 
        Math.round((total / count) * 100) / 100
      )
    };
  }
};

