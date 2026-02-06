name: Automatic Deployment Guide

## How Automatic Deployment Works

### Method 1: Vercel Git Integration (Recommended - Easiest)

This requires NO additional setup! Vercel automatically deploys when you push to GitHub.

**Steps:**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"
5. Set environment variables
6. Click "Deploy"

**Done!** Now every time you push to GitHub:
```bash
git add .
git commit -m "your message"
git push
```

Vercel will automatically:
- Detect the push
- Run builds
- Deploy the changes
- Your app updates in 2-5 minutes ✨

### Method 2: GitHub Actions (Advanced - With Testing)

If you want to run tests before deployment:

1. Get Vercel tokens:
   - Go to https://vercel.com/account/tokens
   - Create "Automation" token
   - Copy the token

2. Add GitHub Secrets:
   - Go to your GitHub repo
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add:
     ```
     VERCEL_TOKEN = (paste your token)
     VERCEL_ORG_ID = (from Vercel dashboard)
     VERCEL_PROJECT_ID = (from Vercel dashboard)
     ```

3. The workflow file is already set up (.github/workflows/deploy.yml)

4. Now every push will:
   - Run tests
   - Deploy to Vercel automatically

### Verification

To verify automatic deployment is working:

1. Make a small change to your code
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "test deployment"
   git push
   ```
3. Check your Vercel dashboard - deployment should start automatically
4. In 2-5 minutes, your changes will be live!

### Environment Variables

Make sure these are set in Vercel Dashboard:
```
MONGODB_URI
JWT_SECRET
CORS_ORIGIN
CLOUDINARY_NAME (optional)
CLOUDINARY_API_KEY (optional)
CLOUDINARY_API_SECRET (optional)
```

### Rollback

If deployment fails or you need to revert:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find the previous working version
4. Click "Promote to Production"

That's it! Your app automatically updates with every git push! 🚀
