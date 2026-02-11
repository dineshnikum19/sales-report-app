import * as XLSX from "xlsx";

/**
 * Sample Data Generator
 *
 * Generates realistic sample sales data for testing the application.
 * Creates 4 weeks of data for multiple stores with varying sales patterns.
 */

// Store configurations
const STORES = [
  { name: "Downtown Store", code: "STORE001" },
  { name: "Mall Center", code: "STORE002" },
  { name: "Airport Shop", code: "STORE003" },
  { name: "University Plaza", code: "STORE004" },
  { name: "Suburban Outlet", code: "STORE005" },
  { name: "Beach Front", code: "STORE006" },
  { name: "Business District", code: "STORE007" },
  { name: "Highway Rest Stop", code: "STORE008" },
  { name: "Train Station", code: "STORE009" },
  { name: "Shopping Village", code: "STORE010" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Operating hours (stores typically open 8 AM to 10 PM)
const START_HOUR = 8;
const END_HOUR = 22;

/**
 * Generate a random sales amount based on store, day, and hour patterns
 * This creates realistic-looking data with patterns like:
 * - Higher sales during lunch/dinner hours
 * - Higher weekend sales
 * - Varying baseline by store type
 */
const generateAmount = (store, day, hour) => {
  // Base amount varies by store (some stores are busier)
  const storeMultipliers = {
    STORE001: 1.2, // Downtown - high traffic
    STORE002: 1.5, // Mall - highest traffic
    STORE003: 1.3, // Airport - steady traffic
    STORE004: 0.8, // University - moderate
    STORE005: 0.7, // Suburban - lower
    STORE006: 1.1, // Beach - seasonal
    STORE007: 1.4, // Business - weekday heavy
    STORE008: 0.6, // Highway - lowest
    STORE009: 1.0, // Train - moderate
    STORE010: 0.9, // Shopping Village - moderate
  };

  // Hour multipliers (peak hours have higher sales)
  let hourMultiplier = 1.0;
  if (hour >= 11 && hour <= 13)
    hourMultiplier = 1.4; // Lunch rush
  else if (hour >= 17 && hour <= 19)
    hourMultiplier = 1.5; // Dinner rush
  else if (hour < 10)
    hourMultiplier = 0.5; // Early morning slow
  else if (hour > 20) hourMultiplier = 0.6; // Late evening slow

  // Day multipliers (weekends busier for retail)
  let dayMultiplier = 1.0;
  if (day === "Saturday") dayMultiplier = 1.4;
  else if (day === "Sunday") dayMultiplier = 1.3;
  else if (day === "Monday")
    dayMultiplier = 0.8; // Monday blues
  else if (day === "Friday") dayMultiplier = 1.2; // TGIF

  // Special patterns for certain stores
  if (store.code === "STORE007" && (day === "Saturday" || day === "Sunday")) {
    // Business district is slower on weekends
    dayMultiplier = 0.5;
  }
  if (store.code === "STORE004" && day === "Sunday") {
    // University area slower on Sunday
    dayMultiplier = 0.4;
  }

  // Base amount with some randomness
  const baseAmount = 500;
  const storeMultiplier = storeMultipliers[store.code] || 1.0;
  const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 random variance

  const amount =
    baseAmount *
    storeMultiplier *
    hourMultiplier *
    dayMultiplier *
    randomFactor;

  // Round to 2 decimal places
  return Math.round(amount * 100) / 100;
};

/**
 * Generate date string for a given week offset and day
 * @param {number} weekOffset - 0 for current week, 1 for last week, etc.
 * @param {number} dayIndex - 0 for Monday, 6 for Sunday
 * @returns {string} - Date in YYYY-MM-DD format
 */
const getDateForWeek = (weekOffset, dayIndex) => {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const date = new Date(today);
  date.setDate(today.getDate() + mondayOffset - weekOffset * 7 + dayIndex);

  return date.toISOString().split("T")[0];
};

/**
 * Generate sample data for all stores across 4 weeks
 * @returns {Array} - Array of sales records
 */
export const generateSampleData = () => {
  const data = [];

  // Generate data for 4 weeks
  for (let week = 0; week < 4; week++) {
    // For each store
    for (const store of STORES) {
      // For each day of the week
      for (let dayIndex = 0; dayIndex < DAYS.length; dayIndex++) {
        const day = DAYS[dayIndex];
        const date = getDateForWeek(week, dayIndex);

        // For each operating hour
        for (let hour = START_HOUR; hour < END_HOUR; hour++) {
          const amount = generateAmount(store, day, hour);

          data.push({
            StoreName: store.name,
            StoreCode: store.code,
            Amount: amount,
            Hour: hour,
            Day: day,
            Date: date,
          });
        }
      }
    }
  }

  // Shuffle the data to make it look more realistic
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }

  return data;
};

/**
 * Download sample data as an Excel file
 */
export const downloadSampleExcel = () => {
  const data = generateSampleData();

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for better readability
  worksheet["!cols"] = [
    { wch: 20 }, // StoreName
    { wch: 12 }, // StoreCode
    { wch: 10 }, // Amount
    { wch: 6 }, // Hour
    { wch: 12 }, // Day
    { wch: 12 }, // Date
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

  // Generate and download
  XLSX.writeFile(workbook, "sample_sales_data.xlsx");
};

/**
 * Get statistics about the sample data
 */
export const getSampleDataStats = () => {
  const data = generateSampleData();

  return {
    totalRecords: data.length,
    stores: STORES.length,
    weeks: 4,
    daysPerWeek: DAYS.length,
    hoursPerDay: END_HOUR - START_HOUR,
    expectedRecordsPerStore: 4 * DAYS.length * (END_HOUR - START_HOUR),
  };
};
