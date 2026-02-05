# Quick Start Checklist ✅

Follow these steps in order. Check off each step as you complete it.

---

## ☐ Step 1: Install Git (If Not Already Installed)

**Check if you have Git:**
```bash
git --version
```

**If not installed:**
- Download from: https://git-scm.com/downloads
- Install and restart terminal

---

## ☐ Step 2: Set Up Git in Your Project

**Open terminal and run:**

```bash
cd C:\Users\admin\Desktop\sales-report-appx

git init
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git add .
git commit -m "Initial commit"
```

✅ Done when you see: "create mode" messages

---

## ☐ Step 3: Create GitHub Account

If you don't have one:
- Go to: https://github.com
- Sign up (it's free)
- Verify your email

---

## ☐ Step 4: Create GitHub Repository

1. Go to: https://github.com
2. Click **"+"** button (top right) → **"New repository"**
3. Fill in:
   - **Name**: `sales-report-app`
   - **Public** or **Private**: Your choice
   - ❌ Don't add README, .gitignore, or license
4. Click **"Create repository"**

✅ Done when you see the empty repo page

---

## ☐ Step 5: Connect Project to GitHub

**Copy the commands from GitHub** (they look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/sales-report-app.git
git branch -M main
git push -u origin main
```

**Run them in your terminal**

✅ Done when you can refresh GitHub and see your files

---

## ☐ Step 6: Create Data Repository

**Repeat Step 4, but:**
- Name it: `sales-data`
- After creating, **don't run any commands yet**

✅ Done when you have an empty `sales-data` repository

---

## ☐ Step 7: Prepare Your Data File

**Option A: Use sample data (recommended for testing)**

```bash
cd C:\Users\admin\Desktop
mkdir sales-data
cd sales-data
copy ..\sales-report-appx\public\data.json data.json
```

**Option B: Create your own data.json**

Create `C:\Users\admin\Desktop\sales-data\data.json` with your actual sales data.

See `data.json.example` in your project for format.

✅ Done when you have `sales-data\data.json`

---

## ☐ Step 8: Upload Data to GitHub

```bash
cd C:\Users\admin\Desktop\sales-data

git init
git add data.json
git commit -m "Add sales data"
git remote add origin https://github.com/YOUR_USERNAME/sales-data.git
git branch -M main
git push -u origin main
```

**Replace YOUR_USERNAME with your actual GitHub username!**

✅ Done when you can see `data.json` on GitHub

---

## ☐ Step 9: Get Your Data URL

1. Go to: `https://github.com/YOUR_USERNAME/sales-data`
2. Click on `data.json`
3. Click **"Raw"** button (top right)
4. **Copy the entire URL** - it looks like:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/sales-data/main/data.json
   ```

✅ Done when you have copied this URL

---

## ☐ Step 10: Update App Configuration

1. Open: `sales-report-appx\src\App.jsx`
2. Find line 27 (around there):
   ```javascript
   const DATA_URL = "/data.json";
   ```
3. Replace with your URL:
   ```javascript
   const DATA_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/sales-data/main/data.json";
   ```
4. **Save the file**

✅ Done when DATA_URL has your GitHub raw URL

---

## ☐ Step 11: Commit and Push Changes

```bash
cd C:\Users\admin\Desktop\sales-report-appx

git add src/App.jsx
git commit -m "Configure data source URL"
git push
```

✅ Done when push completes successfully

---

## ☐ Step 12: Test Your App

**Make sure dev server is running:**
```bash
npm run dev
```

**Open in browser:**
```
http://localhost:5173/
```

**Check:**
- ✅ Dashboard loads (no errors)
- ✅ Data appears in table
- ✅ Charts display
- ✅ Summary cards show numbers

✅ Done when everything works!

---

## 🎉 YOU'RE DONE!

Your app is now:
- ✅ Backed up on GitHub
- ✅ Fetching data from GitHub
- ✅ Working locally

---

## Next Steps (Optional but Recommended)

### ☐ Deploy Your App Online

**Easiest: Deploy to Vercel (Free)**

1. Install Vercel:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd C:\Users\admin\Desktop\sales-report-appx
   vercel login
   vercel
   ```

3. Answer prompts (mostly just press Enter)

4. Deploy to production:
   ```bash
   vercel --prod
   ```

You'll get a URL like: `https://sales-report-app-xyz.vercel.app`

✅ Share this URL with anyone!

---

## How to Update Data Later

### Method 1: Via GitHub Website (Easiest)

1. Go to: `https://github.com/YOUR_USERNAME/sales-data`
2. Click `data.json`
3. Click **pencil icon** (Edit)
4. Paste new data
5. Click **"Commit changes"**
6. In your app, click **"Refresh Data"** button

### Method 2: Via Upload Feature

1. In app, go to **"Upload Data"** tab
2. Upload Excel file
3. Click **"Download Merged JSON"**
4. Follow Method 1 to update on GitHub

### Method 3: Via Git

```bash
cd C:\Users\admin\Desktop\sales-data
# Edit data.json
git add data.json
git commit -m "Update data"
git push
```

---

## Quick Reference

### Your URLs:
- **App Code**: `https://github.com/YOUR_USERNAME/sales-report-app`
- **Data Code**: `https://github.com/YOUR_USERNAME/sales-data`
- **Data URL**: `https://raw.githubusercontent.com/YOUR_USERNAME/sales-data/main/data.json`
- **Live App**: (After deploying) `https://your-app.vercel.app`

### Common Commands:

**Update app code:**
```bash
cd C:\Users\admin\Desktop\sales-report-appx
git add .
git commit -m "Your changes"
git push
```

**Update data:**
```bash
cd C:\Users\admin\Desktop\sales-data
# Edit data.json
git add data.json
git commit -m "Update data"
git push
```

---

## Stuck? Check This:

### Git not found?
Install from: https://git-scm.com/downloads

### GitHub push asking for password?
- Use Personal Access Token instead
- Go to: GitHub → Settings → Developer settings → Personal access tokens
- Generate new token → Copy it → Use as password

### Data not loading in app?
- Check DATA_URL is correct in `src/App.jsx`
- Paste the URL in browser - should download JSON
- Wait 2-3 minutes after GitHub update (caching)

### App not updating after code changes?
- Make sure `npm run dev` is running
- Refresh browser (Ctrl+R)
- Check terminal for errors

---

## Simple Alternative (1 Repository Instead of 2)

If two repositories is too complicated:

**Put data.json in your app repository:**

1. Skip Steps 6-8
2. Your data is already in `sales-report-appx/public/data.json`
3. In Step 10, use:
   ```javascript
   const DATA_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/sales-report-app/main/public/data.json";
   ```

**Pros:** Only one repo to manage
**Cons:** Data and code mixed together

---

## Print This Checklist

Print or keep this open and check off items as you complete them!

Good luck! 🚀
