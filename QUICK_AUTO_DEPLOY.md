# Vercel Automatic Deployment - Quick Setup

## ✨ The Easiest Way (Recommended)

Just connect your GitHub repo to Vercel - that's it!

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Import Your Repository**
   - Click "Add New" → "Project"
   - Click "Import Git Repository"
   - Select `GYANN-SAMARTH-ACADAMY`

3. **Configure Project**
   - Root Directory: (leave empty)
   - Framework: Other
   - Build Command: (default)
   - Environment Variables: Add your keys
   - Click "Deploy"

4. **Enable Auto-Deployment** (Usually enabled by default)
   - Go to Project Settings
   - Git → Production Branch: `main`
   - Auto-deploy on push: ✅ Enabled

### Now What?

Every time you push to GitHub, Vercel automatically:
```
git push 
    ↓
GitHub receives code
    ↓
Vercel detects changes
    ↓
Auto-trigger build
    ↓
Auto-deploy to production
    ↓
Your site updates in 2-5 mins ✨
```

### Test It

Make a small change and push:
```bash
# Make a change to any file
git add .
git commit -m "test auto-deploy"
git push
```

Then watch your Vercel dashboard - it will deploy automatically!

## Environment Variables in Vercel

Click "Settings" → "Environment Variables" and add:
```
MONGODB_URI = your_connection_string
JWT_SECRET = random_secret
CORS_ORIGIN = https://samarth-acadamy.vercel.app
```

## Done! 🎉

Your deployment is now fully automatic. Every git push = automatic deployment!
