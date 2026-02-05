# Upload & Merge Data Guide

## Overview

This app now supports **uploading new Excel files and merging them with existing data**. The workflow involves:

1. ✅ Upload Excel file through the app
2. ✅ App merges with existing data.json automatically
3. ✅ Download the merged JSON file
4. ✅ Manually upload to GitHub (or your hosting platform)
5. ✅ Refresh to see updated data

---

## How It Works

### Step 1: Upload Excel File

1. Click the **"Upload Data"** tab in the app
2. Drag and drop your Excel file (or click to browse)
3. The app will:
   - ✅ Parse the Excel file
   - ✅ Validate the data (checks columns, formats, values)
   - ✅ Fetch current data.json from your hosted URL
   - ✅ Merge the new data with existing data
   - ✅ Show success message with download button

### Step 2: Download Merged JSON

After upload, you'll see a **green success banner** with:
- ✅ Confirmation that data was merged
- ✅ Step-by-step instructions
- ✅ **"Download Merged JSON"** button

Click the button to download `data-merged-YYYY-MM-DD.json`

### Step 3: Upload to GitHub

**Option A: Via GitHub Website**
1. Go to your GitHub repository
2. Navigate to your `data.json` file
3. Click the **pencil icon** (Edit)
4. Delete all content
5. Open your downloaded `data-merged-YYYY-MM-DD.json`
6. Copy all content and paste into GitHub editor
7. Scroll down and click **"Commit changes"**

**Option B: Via Git Command Line**
```bash
# Replace data.json with the downloaded file
cp data-merged-2024-01-15.json data.json

# Commit and push
git add data.json
git commit -m "Update sales data"
git push
```

### Step 4: Refresh in App

1. Click **"Refresh Data"** button in the app header
2. The app will fetch the updated data.json from GitHub
3. Dashboard updates with new data

---

## Merging Logic

### Duplicate Prevention

The app uses a **unique key** to prevent duplicates:
```
Key = StoreCode + Day + Hour + Date
```

**Example:**
- `STORE001_Monday_9_2024-01-01` = unique record
- If you upload the same record twice, only one copy is kept

### What Gets Merged?

✅ **Existing records** from data.json are preserved  
✅ **New records** from uploaded Excel are added  
❌ **Duplicate records** (same Store + Day + Hour + Date) are skipped

### Processing After Merge

After merging, the app automatically:
1. **Groups** by StoreCode + Day + Hour (across all dates)
2. **Calculates** 4-week averages
3. **Sorts** by lowest average amount first
4. **Displays** in dashboard

---

## Excel File Format

Your Excel file must have these columns:

| Column | Type | Example | Rules |
|--------|------|---------|-------|
| **StoreName** | Text | Downtown Store | Can be empty (uses StoreCode) |
| **StoreCode** | Text | STORE001 | Required, unique identifier |
| **Amount** | Number | 1250.50 | Required, must be ≥ 0 |
| **Hour** | Integer | 9 | Required, must be 0-23 |
| **Day** | Text | Monday | Required, day of week |
| **Date** | Date | 2024-01-01 | Required, any date format |

**Supported file formats:**
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma-separated)

---

## Example Workflow

### Scenario: Adding New Week's Data

**Current data.json has:**
- Weeks 1-4 (Jan 1-28)
- 10 stores
- 24 hours per day

**You want to add:**
- Week 5 (Jan 29 - Feb 4)
- Same 10 stores
- Same hours

**Steps:**

1. **Prepare Excel file** with Week 5 data:
   ```
   StoreName     | StoreCode | Amount  | Hour | Day      | Date
   Downtown Store| STORE001  | 1250.50 | 9    | Monday   | 2024-01-29
   Downtown Store| STORE001  | 1100.25 | 10   | Monday   | 2024-01-29
   ...
   ```

2. **Upload to app**
   - Go to Upload Data tab
   - Drop the Excel file
   - Wait for "Upload Successful" message

3. **Download merged JSON**
   - Click "Download Merged JSON" button
   - File saved as `data-merged-2024-02-05.json`

4. **Upload to GitHub**
   - Replace `data.json` in your repo with the downloaded file
   - Commit changes

5. **Refresh in app**
   - Click "Refresh Data" button
   - Dashboard now shows 5-week averages!

---

## Important Notes

### ⚠️ Data Is Not Automatically Saved

- Uploading Excel **does NOT** automatically update GitHub
- You **must download** the merged JSON and **manually upload** to GitHub
- This is intentional (prevents accidental overwrites)

### ✅ Merging Is Smart

- **No duplicates**: Same Store + Day + Hour + Date = only one record kept
- **Preserves existing**: All old data is kept
- **Sorted**: Final JSON is sorted by Date → Store → Day → Hour

### 📊 Averaging Recalculates

When you add new weeks:
- Old: 4-week average (Weeks 1-4)
- New: 5-week average (Weeks 1-5)
- The dashboard automatically recalculates averages across all weeks

### 🔄 Multiple Uploads

You can upload multiple times:
1. Upload Excel #1 → Download merged JSON → Upload to GitHub
2. Upload Excel #2 → Download merged JSON → Upload to GitHub
3. Each time, new data is added (no duplicates)

---

## Troubleshooting

### "Failed to fetch data"
- Check that DATA_URL in App.jsx is correct
- Verify the URL is accessible (try opening in browser)
- Check GitHub is not down

### "Missing required columns"
- Excel must have all 6 columns: StoreName, StoreCode, Amount, Hour, Day, Date
- Check column names match exactly (case-sensitive)

### "No valid data after processing"
- Check Amount values are numbers ≥ 0
- Check Hour values are integers 0-23
- Check Date values are valid dates
- Check StoreCode is not empty

### Download button not working
- Check browser allows downloads
- Try right-click → "Save link as"
- Check popup blocker settings

### Data not updating after upload to GitHub
- Wait 2-3 minutes (GitHub caches raw URLs)
- Try hard refresh in browser (Ctrl+Shift+R / Cmd+Shift+R)
- Check the file was actually updated on GitHub
- Verify DATA_URL points to correct branch (main vs master)

---

## Advanced: Automated Backend (Optional)

If you want fully automated updates without manual GitHub uploads, you need a backend service:

### Option 1: Serverless Function (Vercel/Netlify)

Create an API endpoint:
```javascript
// api/update-data.js
export default async function handler(req, res) {
  // 1. Receive uploaded data
  // 2. Fetch current data.json from GitHub
  // 3. Merge data
  // 4. Update GitHub file using GitHub API
  // 5. Return success
}
```

### Option 2: Simple Backend (Node.js/Express)

```javascript
app.post('/api/update-data', async (req, res) => {
  const { newData } = req.body;
  
  // Use GitHub API to update file
  await updateGitHubFile(newData);
  
  res.json({ success: true });
});
```

### Requirements for Backend:
- GitHub Personal Access Token (for API authentication)
- CORS enabled for your app domain
- Secure token storage (environment variables)

**Benefits:**
✅ Fully automated (no manual upload)  
✅ Users don't need GitHub access  
✅ Can add validation/authentication  

**Downsides:**
❌ Requires backend hosting  
❌ More complex setup  
❌ Costs money (usually minimal)  

---

## Security Notes

### Current Implementation (Client-Side)
- ✅ No backend = no security vulnerabilities
- ✅ Users can't accidentally break data (manual upload)
- ✅ Simple and free

### If Using Backend
- ⚠️ Protect API endpoints with authentication
- ⚠️ Validate all uploaded data server-side
- ⚠️ Rate limit to prevent abuse
- ⚠️ Store GitHub token securely (never in frontend code)

---

## FAQ

**Q: Can I delete old data?**  
A: Yes, edit data.json on GitHub and remove unwanted records, then commit.

**Q: What if I upload wrong data?**  
A: Don't click "Download" - just dismiss the prompt. Your GitHub data.json stays unchanged.

**Q: Can multiple people upload data?**  
A: Yes, but coordinate to avoid conflicts. Last upload to GitHub wins.

**Q: Does this work with CSV files?**  
A: Yes! The upload feature accepts .xlsx, .xls, and .csv files.

**Q: How big can my data.json be?**  
A: GitHub has 100MB file limit. For typical sales data (thousands of records), this is plenty.

**Q: Can I undo an upload to GitHub?**  
A: Yes! GitHub keeps version history. Go to the file, click "History", find the old version, copy it back.

---

## Summary

### Current Workflow (No Backend)
```
Excel file → Upload to app → Merge → Download JSON → Upload to GitHub → Refresh
```

**Pros:** Simple, free, secure  
**Cons:** Manual step (upload to GitHub)

### Future Workflow (With Backend)
```
Excel file → Upload to app → Backend updates GitHub automatically → Done
```

**Pros:** Fully automated  
**Cons:** Requires backend, costs money, more complex

---

## Need Help?

1. Check browser console for detailed error messages (F12)
2. Verify Excel file format matches requirements
3. Test with sample data first
4. Check DATA_SOURCE_SETUP.md for URL configuration
5. Verify GitHub file is accessible (open URL in browser)
