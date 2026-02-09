import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List your CSV files here (update with actual filenames)
const files = ["FinalSheet.csv"];

let allRows = [];
const seenRows = new Set(); // Track unique rows to prevent duplicates
let totalRowsRead = 0; // Track total rows read (including duplicates)

console.log("📁 Reading CSV files...\n");

files.forEach((file) => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} (not found)`);
    return;
  }

  console.log(`✓ Reading ${file}...`);
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  let addedCount = 0;
  let duplicateCount = 0;

  rows.forEach((row) => {
    totalRowsRead++;
    // Create a unique key from all data fields to detect duplicates
    const key = JSON.stringify({
      StoreName: String(row.StoreName || "").trim(),
      StoreCode: String(row.StoreCode || "").trim(),
      Amount: Number(row.Amount),
      Hour: Number(row.Hour),
      Day: String(row.Day || "").trim(),
      Date: String(row.Date || "").trim(),
    });

    if (!seenRows.has(key)) {
      seenRows.add(key);
      allRows.push(row);
      addedCount++;
    } else {
      duplicateCount++;
    }
  });

  console.log(rows[0]);

  console.log(`  Added ${addedCount} new rows`);
  if (duplicateCount > 0) {
    console.log(`  ⚠️  Skipped ${duplicateCount} duplicate rows`);
  }
});

const totalDuplicates = totalRowsRead - allRows.length;
console.log(`\n📊 Total rows read: ${totalRowsRead}`);
console.log(`📊 Total unique rows collected: ${allRows.length}`);
if (totalDuplicates > 0) {
  console.log(`📊 Total duplicates skipped: ${totalDuplicates}\n`);
} else {
  console.log(`📊 No duplicates found\n`);
}

// Helper function to convert Excel serial date to YYYY-MM-DD
function excelDateToISO(serial) {
  if (typeof serial === "string") return serial; // Already a string date
  if (isNaN(serial)) return null;

  // Excel serial date starts from 1900-01-01
  const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
  const date = new Date(excelEpoch.getTime() + serial * 86400000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Clean and normalize data
const cleaned = allRows.map((row) => {
  const storeName = String(row.StoreName || "").trim();
  let storeCode = String(row.StoreCode || "").trim();

  // If StoreCode is empty, use StoreName as fallback
  if (!storeCode && storeName) {
    storeCode = storeName;
  }

  // Source data uses hours 1-24 where 24 = midnight; normalize to 0-23
  let hour = Number(row.Hour);
  if (hour === 24) {
    hour = 0;
  }

  return {
    StoreName: storeName || storeCode,
    StoreCode: storeCode,
    Amount: Number(row.Amount),
    Hour: hour,
    Day: String(row.Day || "").trim(),
    Date: excelDateToISO(row.Date),
  };
});

// Save to data.json in tools folder
const outputPath = path.join(__dirname, "data.json");
fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2));

console.log("✅ data.json created successfully!");
console.log(`📄 Location: ${outputPath}`);
console.log(`📊 Total rows: ${cleaned.length}`);

// Also copy to public folder for the app
const publicDataPath = path.join(__dirname, "..", "public", "data.json");
fs.writeFileSync(publicDataPath, JSON.stringify(cleaned, null, 2));
console.log(`\n✅ Also copied to: ${publicDataPath}`);
console.log("\n🎉 Done! You can now use this data in your app.");
