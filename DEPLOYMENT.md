# SAMARTH-ACADAMY Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (for cloud database)

## Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist your Vercel IP (or allow all: 0.0.0.0/0)
5. Copy your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/samarth-acadamy
   ```

## Step 2: Prepare Your Code for Git

1. Open PowerShell in your project root
2. Initialize git (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit for deployment"
   ```

## Step 3: Push to GitHub

1. Create a new repository on [github.com](https://github.com/new)
2. Name it `SAMARTH-ACADAMY`
3. Copy the connection URL
4. In PowerShell, run:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/SAMARTH-ACADAMY.git
   git branch -M main
   git push -u origin main
   ```

## Step 4: Deploy on Vercel

### Option A: Deploy as Single App (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Project Settings:**
   - Framework Preset: Other
   - Root Directory: `./` (leave empty)
   - Build Command: Leave default
   - Output Directory: Leave default

5. **Environment Variables** (click "Add" for each):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/samarth-acadamy
   JWT_SECRET=your_super_secret_key_here
   CORS_ORIGIN=https://YOUR_VERCEL_DOMAIN.vercel.app
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

6. Click "Deploy"
7. Wait 3-5 minutes for deployment to complete
8. Your app will be live at `https://samarth-acadamy.vercel.app`

### Option B: Separate Deployments

**Deploy Backend:**
1. Create new Vercel project from `Backend` folder
2. Add all environment variables

**Deploy Frontend:**
1. Create new Vercel project from `frontend` folder
2. Add `VITE_API_URL=your-backend-url/api`

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Check that all pages load
3. Test database operations (courses, notifications, etc.)
4. Check browser console for errors

## Troubleshooting

### "Cannot find module" errors
- Delete node_modules and package-lock.json
- Run `npm install` in both folders
- Commit and push changes

### API calls fail
- Check CORS_ORIGIN in backend env variables
- Verify VITE_API_URL is correct in frontend
- Check MongoDB connection string

### Database connection fails
- Verify IP whitelist in MongoDB Atlas
- Check username/password are correct
- Ensure network access is enabled

## Future Deployments

Just push your changes to GitHub and Vercel will automatically redeploy:
```
git add .
git commit -m "Your message"
git push
```

The deployment will be live in 2-5 minutes!
