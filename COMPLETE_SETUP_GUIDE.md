# Complete Setup Guide (From Scratch)

This guide assumes you have **no Git setup yet** and walks you through everything step-by-step.

---

## Prerequisites

Before starting, make sure you have:
- ✅ Node.js installed (you already have this since npm works)
- ✅ A GitHub account (create one at https://github.com if you don't have one)
- ✅ Git installed on your computer

### Check if Git is installed:
```bash
git --version
```

If not installed, download from: https://git-scm.com/downloads

---

## Part 1: Initialize Git in Your Project

### Step 1: Open Terminal in Your Project Folder

```bash
cd C:\Users\admin\Desktop\sales-report-appx
```

### Step 2: Initialize Git

```bash
git init
```

You should see: `Initialized empty Git repository`

### Step 3: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

### Step 4: Add All Files to Git

```bash
git add .
```

This stages all your project files.

### Step 5: Create Your First Commit

```bash
git commit -m "Initial commit - Sales Report Dashboard"
```

✅ Your project is now a Git repository!

---

## Part 2: Create GitHub Repositories

You need **TWO** GitHub repositories:

### Repository 1: For Your App Code
### Repository 2: For Your Data (can be private)

### Step 1: Go to GitHub

Open: https://github.com

### Step 2: Create App Repository

1. Click the **"+"** button (top right)
2. Click **"New repository"**
3. Fill in:
   - **Repository name**: `sales-report-app` (or any name you want)
   - **Description**: "Sales analytics dashboard"
   - **Public** or **Private** (your choice)
   - ❌ **DO NOT** check "Add a README file"
   - ❌ **DO NOT** add .gitignore or license
4. Click **"Create repository"**

### Step 3: Copy the Repository URL

You'll see instructions. Copy the HTTPS URL that looks like:
```
https://github.com/YOUR_USERNAME/sales-report-app.git
```

### Step 4: Connect Your Local Project to GitHub

In your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sales-report-app.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

✅ Your app code is now on GitHub!

### Step 5: Create Data Repository

Repeat steps 1-4 but name it: `sales-data` (or any name)

You'll get a second URL:
```
https://github.com/YOUR_USERNAME/sales-data.git
```

---

## Part 3: Prepare Your Data File

### Option A: Use Existing Sample Data (Recommended for Testing)

Your project already has `public/data.json` with sample data!

**Copy it:**

```bash
# Create a new folder for your data repo
cd C:\Users\admin\Desktop
mkdir sales-data
cd sales-data

# Copy the sample data
copy ..\sales-report-appx\public\data.json data.json
```

### Option B: Create Your Own Data

Create a file `data.json` with your actual sales data:

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

**Required fields:**
- `StoreName` - Name of the store
- `StoreCode` - Unique store ID
- `Amount` - Sales amount (number, ≥ 0)
- `Hour` - Hour of day (0-23)
- `Day` - Day of week (Monday, Tuesday, etc.)
- `Date` - Date in any format (YYYY-MM-DD recommended)

---

## Part 4: Upload Data to GitHub

### Step 1: Initialize the Data Repository

```bash
# Make sure you're in the sales-data folder
cd C:\Users\admin\Desktop\sales-data

git init
git add data.json
git commit -m "Add sales data"
```

### Step 2: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/sales-data.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

✅ Your data is now on GitHub!

### Step 3: Get the Raw Data URL

1. Go to: `https://github.com/YOUR_USERNAME/sales-data`
2. Click on `data.json`
3. Click the **"Raw"** button (top right of file view)
4. Copy the URL - it should look like:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/sales-data/main/data.json
   ```

✅ This is your DATA_URL!

---

## Part 5: Update Your App Configuration

### Step 1: Open App.jsx

File: `src/App.jsx`

### Step 2: Find This Line (around line 27):

```javascript
const DATA_URL = "/data.json"; // Using local data.json for development
```

### Step 3: Replace With Your GitHub URL:

```javascript
const DATA_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/sales-data/main/data.json";
```

**Example:**
```javascript
const DATA_URL = "https://raw.githubusercontent.com/johnsmith/sales-data/main/data.json";
```

### Step 4: Save the File

### Step 5: Commit and Push Changes

```bash
cd C:\Users\admin\Desktop\sales-report-appx

git add src/App.jsx
git commit -m "Update DATA_URL to GitHub"
git push
```

---

## Part 6: Test Your App Locally

### Step 1: Make Sure Dev Server is Running

```bash
npm run dev
```

### Step 2: Open in Browser

Go to: http://localhost:5173/

You should see:
- ✅ Dashboard loads with your data
- ✅ No errors
- ✅ Charts and tables show your sales data

---

## Part 7: Deploy Your App (Optional)

### Option A: Deploy to Vercel (Recommended - Free)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Deploy

```bash
cd C:\Users\admin\Desktop\sales-report-appx
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- What's your project's name? **sales-report-app** (or keep default)
- In which directory is your code? **./** (just press Enter)
- Want to override settings? **N**

Wait for deployment... Done! ✅

You'll get a URL like: `https://sales-report-app-xyz.vercel.app`

#### Step 4: Deploy to Production

```bash
vercel --prod
```

Your app is now live!

### Option B: Deploy to Netlify (Also Free)

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login

```bash
netlify login
```

#### Step 3: Build Your App

```bash
npm run build
```

#### Step 4: Deploy

```bash
netlify deploy --prod --dir=dist
```

Follow the prompts. You'll get a URL like: `https://sales-report-app.netlify.app`

### Option C: Deploy to GitHub Pages

#### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Step 2: Update package.json

Add these lines to `package.json`:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/sales-report-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### Step 3: Update vite.config.js

Add base path:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/sales-report-app/'
})
```

#### Step 4: Deploy

```bash
npm run deploy
```

Your app will be live at: `https://YOUR_USERNAME.github.io/sales-report-app`

---

## Part 8: Update Your Data (Future Updates)

### When You Have New Sales Data:

#### Method 1: Via GitHub Website (Easy)

1. Go to: `https://github.com/YOUR_USERNAME/sales-data`
2. Click on `data.json`
3. Click the **pencil icon** (Edit this file)
4. Paste your updated data
5. Scroll down and click **"Commit changes"**
6. In your app, click **"Refresh Data"** button

#### Method 2: Via Upload in App + Manual Update

1. In your app, go to **"Upload Data"** tab
2. Upload Excel file
3. Click **"Download Merged JSON"**
4. Go to GitHub → Edit `data.json` → Paste content → Commit
5. Click **"Refresh Data"** in app

#### Method 3: Via Git Command Line

```bash
cd C:\Users\admin\Desktop\sales-data

# Edit data.json with your text editor
# Then:

git add data.json
git commit -m "Update sales data for week 5"
git push
```

In your app, click **"Refresh Data"** button.

---

## Summary: Your Setup

### File Structure:

```
Desktop/
├── sales-report-appx/          ← Your app code
│   ├── src/
│   │   ├── App.jsx            ← DATA_URL configured here
│   │   └── components/
│   ├── public/
│   │   └── data.json          ← Local test data
│   └── package.json
│
└── sales-data/                 ← Your production data
    └── data.json              ← This is what your app fetches
```

### GitHub Repositories:

1. **App Repository**: `https://github.com/YOUR_USERNAME/sales-report-app`
   - Contains: React code, components, styles
   - Deployed to: Vercel/Netlify/GitHub Pages

2. **Data Repository**: `https://github.com/YOUR_USERNAME/sales-data`
   - Contains: `data.json`
   - Raw URL: Used by your app to fetch data

### URLs to Remember:

- **App Code**: `https://github.com/YOUR_USERNAME/sales-report-app`
- **Data Code**: `https://github.com/YOUR_USERNAME/sales-data`
- **Data URL** (for fetching): `https://raw.githubusercontent.com/YOUR_USERNAME/sales-data/main/data.json`
- **Live App**: `https://your-app.vercel.app` (or Netlify/GitHub Pages)

---

## Quick Reference Commands

### Update App Code:
```bash
cd C:\Users\admin\Desktop\sales-report-appx
git add .
git commit -m "Your message"
git push
```

### Update Data:
```bash
cd C:\Users\admin\Desktop\sales-data
# Edit data.json
git add data.json
git commit -m "Update sales data"
git push
```

### Redeploy App (if using Vercel):
```bash
cd C:\Users\admin\Desktop\sales-report-appx
vercel --prod
```

---

## Troubleshooting

### "git: command not found"
Install Git from: https://git-scm.com/downloads

### "Permission denied (publickey)"
Use HTTPS URLs instead of SSH, or set up SSH keys: https://docs.github.com/en/authentication

### "Failed to fetch data: 404"
- Check DATA_URL is correct
- Verify the raw URL works (paste in browser)
- Make sure data.json is pushed to GitHub

### "Data not updating after GitHub commit"
- Wait 2-3 minutes (GitHub caches raw URLs)
- Click "Refresh Data" button in app
- Try hard refresh in browser (Ctrl+Shift+R)

### "npm run build fails"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Next Steps

1. ✅ Follow Part 1-3 to set up Git and GitHub
2. ✅ Follow Part 4 to upload your data
3. ✅ Follow Part 5 to configure your app
4. ✅ Test locally (Part 6)
5. ✅ Deploy (Part 7) - Optional but recommended
6. 🎉 Share your app URL with your team!

---

## Need Help?

- Git basics: https://docs.github.com/en/get-started
- Vercel docs: https://vercel.com/docs
- Netlify docs: https://docs.netlify.com
- Check browser console (F12) for detailed errors

## Alternative: Simple Setup (No Separate Data Repo)

If you want to keep it simple and don't mind your data being public:

1. Put `data.json` in your app's `public/` folder
2. Push to GitHub
3. Use this DATA_URL:
   ```javascript
   const DATA_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/sales-report-app/main/public/data.json";
   ```

This means you only need ONE repository instead of two!

**Pros:** Simpler, one repo
**Cons:** Data and code are together, harder to update data separately
