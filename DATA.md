# Sales data

- **`public/data.json`** — Real data; not committed (in `.gitignore`). Add your own file here for production.
- **`public/data.sample.json`** — Sample data committed in the repo. The app uses this automatically if `public/data.json` is missing.

## Git: stop tracking real data and keep it local

Run these in the project root:

```bash
# 1. Add public/data.json to .gitignore (already done)
# 2. Remove from Git index but keep the file on disk
git rm --cached public/data.json

# 3. Commit the change (stops tracking; file stays locally)
git add .gitignore public/data.sample.json src/App.jsx DATA.md
git commit -m "Ignore real data, add sample data and fallback"
```

From the next commit onward, `public/data.json` will no longer be tracked. Your local copy remains; others cloning the repo will get sample data only.

---

## Removing real data from Git history

If `public/data.json` was committed in the past, it still exists in old commits. To remove it from **all** history (rewrites history; use with care):

### Option A: Remove one file from entire history (BFG or filter-branch)

**Using git filter-repo (recommended, fast):**

```bash
# Install: pip install git-filter-repo
git filter-repo --path public/data.json --invert-paths
```

**Using git filter-branch (no extra install):**

```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch public/data.json" --prune-empty --tag-name-filter cat -- --all
```

Then:

```bash
# Force-push (overwrites remote history)
git push origin --force --all
git push origin --force --tags
```

**Important:**

- Everyone who has cloned the repo should re-clone or follow [GitHub’s guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) to reset their copies.
- If the repo is shared, coordinate the force-push and tell the team to re-clone or rebase.
- Consider rotating any secrets that were in the removed file.

### Option B: Don’t rewrite history

If you only need to stop tracking from now on, the `git rm --cached` + `.gitignore` steps above are enough. Old commits will still contain the file until/unless you run Option A.
