# GitHub Setup Guide

Follow these steps to properly push your Study Planner project to GitHub:

## Step 1: Clean up Git repository (if needed)

Your repository currently shows deleted files from an old project. Let's clean it up:

```bash
# Remove all deleted files from git tracking
git rm -r --cached 01vite 2>$null

# Clean up any old references
git reset HEAD 2>$null
```

## Step 2: Add all project files

```bash
# Add the root .gitignore and README
git add .gitignore README.md

# Add frontend files (excluding node_modules and dist)
git add 01vite-project/

# Add backend files (excluding node_modules)
git add backend/

# Verify what will be committed
git status
```

## Step 3: Commit your changes

```bash
git commit -m "Initial commit: Study Planner MERN stack application"
```

## Step 4: Create GitHub repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it (e.g., "study-planner" or "mern-study-tracker")
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 5: Connect local repository to GitHub

```bash
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub username and repo name
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Files that WILL be pushed:

✅ All source code files (.js, .jsx, .json)
✅ Configuration files (package.json, vite.config.js, eslint.config.js)
✅ README.md
✅ .gitignore
✅ Public assets (vite.svg, react.svg)

## Files that will NOT be pushed (ignored):

❌ node_modules/ (dependencies)
❌ dist/ (build output)
❌ .env (environment variables - contains secrets)
❌ *.log (log files)
❌ .vscode/ (editor settings)

## Important Notes:

1. **Never commit .env files** - They contain sensitive information like JWT secrets and database URLs
2. **Create .env.example files** - These show what environment variables are needed without exposing secrets
3. **Make sure MongoDB URI doesn't expose credentials** - Use environment variables for production
4. **Update README.md** - Add your actual name and any additional information

## If you need to update later:

```bash
git add .
git commit -m "Your commit message"
git push
```

