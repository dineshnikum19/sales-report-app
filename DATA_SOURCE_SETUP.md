# Data Source Setup Guide

## Overview

This app now fetches sales data from a **hosted JSON file** instead of using localStorage. This allows all users to see the same data without needing to upload files individually.

## Quick Setup

### Step 1: Prepare Your Data File

Create a JSON file with your sales data. The file must be an array of objects with these fields:

- `StoreName` (string): Name of the store
- `StoreCode` (string): Unique store identifier
- `Amount` (number): Sales amount (must be ≥ 0)
- `Hour` (number): Hour of day (0-23)
- `Day` (string): Day of week (e.g., "Monday", "Tuesday")
- `Date` (string): Date in any parseable format (e.g., "2024-01-15")

**Example:**
```json
[
  {
    "StoreName": "Downtown Store",
    "StoreCode": "STORE001",
    "Amount": 1250.50,
    "Hour": 9,
    "Day": "Monday",
    "Date": "2024-01-01"
  },
  {
    "StoreName": "Downtown Store",
    "StoreCode": "STORE001",
    "Amount": 1150.75,
    "Hour": 9,
    "Day": "Monday",
    "Date": "2024-01-08"
  }
]
```

See `data.json.example` for a complete example.

### Step 2: Host Your JSON File

You have several options:

#### Option A: GitHub (Recommended for Static Data)

1. Create a GitHub repository (can be private or public)
2. Add your `data.json` file to the repo
3. Commit and push
4. Get the raw URL:
   - Go to your file on GitHub
   - Click "Raw" button
   - Copy the URL (format: `https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/data.json`)

**Example URL:**
```
https://raw.githubusercontent.com/mycompany/sales-data/main/data.json
```

#### Option B: Cloud Storage with CORS

- **AWS S3**: Upload file, make it public, enable CORS
- **Google Cloud Storage**: Upload file, make it public, enable CORS
- **Azure Blob Storage**: Upload file, make it public, enable CORS

**Important:** Make sure CORS is enabled for your domain!

#### Option C: Your Own API/Server

If you have a backend:
```
https://api.yourdomain.com/sales-data
```

Make sure:
- Response is JSON array
- CORS headers allow your app domain
- Response includes proper `Content-Type: application/json` header

### Step 3: Update the App Configuration

Open `src/App.jsx` and update the `DATA_URL` constant:

```javascript
const DATA_URL = "https://raw.githubusercontent.com/USERNAME/REPO/main/data.json";
```

Replace with your actual URL.

### Step 4: Deploy Your App

Build and deploy your app as usual:

```bash
npm run build
```

The app will now fetch data from your hosted JSON file on every page load.

## How It Works

### Data Flow

1. **User opens app** → App shows "Loading data from server..."
2. **App fetches data** → `fetch(DATA_URL)` retrieves raw JSON
3. **Data processing** → App validates, groups by Store+Day+Hour, calculates 4-week averages
4. **Display results** → Dashboard shows processed data (table + charts)

### Processing Steps

The app automatically:
- ✅ Validates each row (checks Amount ≥ 0, Hour 0-23, required fields present)
- ✅ Groups by `StoreCode + Day + Hour` (e.g., "STORE001_Monday_9")
- ✅ Calculates 4-week averages for each group
- ✅ Sorts by lowest average amount first
- ✅ Displays in table and charts

### Refresh Data

Users can click the **"Refresh Data"** button in the header to reload the latest data from the URL.

## Updating Your Data

To update the sales data shown in the app:

1. Update your `data.json` file on GitHub (or your hosting platform)
2. Commit and push changes
3. Users click "Refresh Data" button (or reload the page)
4. App fetches and displays the new data

**Note:** GitHub raw URLs may cache for a few minutes. For instant updates, consider using a proper API.

## Error Handling

The app handles common errors:

- ❌ **Network error** → Shows "Failed to Load Data" with retry button
- ❌ **Invalid JSON** → Shows error message
- ❌ **Empty data** → Shows "No data found" message
- ❌ **Missing columns** → Skips invalid rows, processes valid ones

## Testing Locally

During development, you can:

1. **Use the Upload tab** to test with local Excel files (temporary, not saved)
2. **Host JSON locally** using a simple HTTP server:
   ```bash
   npx http-server . --cors
   ```
   Then use `http://localhost:8080/data.json` as DATA_URL

## CORS Issues

If you see errors like "blocked by CORS policy":

### For GitHub:
No CORS issues! GitHub raw URLs work out of the box.

### For Your Own Server:
Add these headers to your response:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

### For Cloud Storage:
Configure CORS rules. Example for AWS S3:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

## Security Notes

- ✅ Use HTTPS URLs only (not HTTP)
- ✅ Data is read-only (fetch only, no writes)
- ✅ No authentication needed (data is public)
- ⚠️ Anyone with the URL can access the data
- ⚠️ Don't include sensitive information in the JSON

## Troubleshooting

### "Failed to fetch data: 404"
- Check that the URL is correct
- Verify the file exists at that URL
- For GitHub, make sure you're using the "raw" URL

### "Failed to fetch data: CORS error"
- Use GitHub raw URLs (no CORS issues)
- Or configure CORS on your server/storage

### "No valid data after processing"
- Check JSON format matches the required fields
- Verify Amount is a number ≥ 0
- Verify Hour is 0-23
- Check that required fields aren't empty

### Data looks wrong
- Verify your JSON file structure
- Check that StoreCode, Day, and Hour are consistent
- Remember: app groups by Store+Day+Hour and calculates averages

## Migration from localStorage

If you're migrating from the old localStorage version:

1. **Export your data:**
   - Open browser console
   - Run: `console.log(JSON.stringify(JSON.parse(localStorage.getItem('salesReportData')), null, 2))`
   - Copy the output

2. **Format as raw data:**
   - The exported data is already processed (has AvgAmount, etc.)
   - You need the ORIGINAL raw data (before processing)
   - Use the Upload feature to export sample data, or recreate from your Excel files

3. **Upload to GitHub** and configure DATA_URL

## Need Help?

- Check `data.json.example` for a sample file
- Verify your JSON at https://jsonlint.com
- Test your URL in browser first (should download/show JSON)
- Check browser console for detailed error messages
