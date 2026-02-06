# 🚀 SAMARTH-ACADAMY DEPLOYMENT CHECKLIST

## ✅ Completed Setup

- [x] Created `vercel.json` for monorepo configuration
- [x] Created `Backend/vercel.json` for backend
- [x] Added `start` script to Backend/package.json
- [x] Updated frontend API to use environment variables
- [x] Created `.env.production` files
- [x] Created `.env.example` with sample variables
- [x] Created `.gitignore` files
- [x] Pushed all changes to GitHub

## 📋 Next Steps for Deployment

### 1. Set Up MongoDB Atlas (5 minutes)
```
1. Go to https://mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a free cluster
4. Create database user: vikram / (strong password)
5. Whitelist IP: Add 0.0.0.0/0 (allows all, or add Vercel's IPs)
6. Click "Connect" → Copy connection string
7. Replace <password> with your password
```

### 2. Set Up Cloudinary (optional, for image uploads)
```
1. Go to https://cloudinary.com
2. Sign up
3. Dashboard → Get API credentials:
   - Cloud Name
   - API Key
   - API Secret
```

### 3. Deploy to Vercel

**Option 1: Single Deployment (Recommended)**
```
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import Git Repository → Select SAMARTH-ACADAMY
4. Configure Project:
   - Root Directory: ./ (leave empty)
   - Framework Preset: Other
   - Build Command: (leave default)
   - Output Directory: (leave default)

5. Add Environment Variables:
   MONGODB_URI = mongodb+srv://vikram:password@cluster.mongodb.net/samarth
   JWT_SECRET = some-random-secret-key-here
   CORS_ORIGIN = https://your-project.vercel.app
   CLOUDINARY_NAME = (if you set up cloudinary)
   CLOUDINARY_API_KEY = (if you set up cloudinary)
   CLOUDINARY_API_SECRET = (if you set up cloudinary)

6. Click "Deploy"
7. Wait 3-5 minutes
8. Your app is LIVE! 🎉
```

**Option 2: Separate Deployments**
```
Backend:
- Create project from /Backend folder
- Add all environment variables

Frontend:
- Create project from /frontend folder
- Add VITE_API_URL = https://your-backend-url.vercel.app/api
```

## 🔑 Environment Variables Needed

### Backend
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/samarth-acadamy
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=https://samarth-acadamy.vercel.app
PORT=3000
CLOUDINARY_NAME=your-name (optional)
CLOUDINARY_API_KEY=your-key (optional)
CLOUDINARY_API_SECRET=your-secret (optional)
```

### Frontend
```
VITE_API_URL=https://samarth-acadamy.vercel.app/api
```

## ✨ What Was Done

1. **Vercel Configuration**
   - Created root `vercel.json` for monorepo routing
   - Created `Backend/vercel.json` for Node.js support

2. **Backend Updates**
   - Added `start` script to package.json
   - Updated CORS to use env variable
   - Ready for production

3. **Frontend Updates**
   - Updated `api.js` to use `VITE_API_URL` env variable
   - Falls back to localhost for development

4. **Environment Files**
   - `.env.production` in root and frontend
   - `.env.example` for reference
   - Proper `.gitignore` setup

5. **Git Ready**
   - All changes committed and pushed
   - Ready for Vercel import

## 🧪 Testing After Deployment

```
1. Visit https://your-domain.vercel.app
2. Check homepage loads
3. Click on courses → should load from API
4. Click on notifications → should load from API
5. Test admin login
6. Check browser console for errors
7. Check network tab for API calls
```

## 📱 API Endpoints

After deployment:
- Frontend: https://samarth-acadamy.vercel.app
- Backend API: https://samarth-acadamy.vercel.app/api
- Courses: /api/courses
- Notifications: /api/notifications
- Results: /api/results
- Current Affairs: /api/current-affairs
- Admin: /api/admin

## 🆘 Troubleshooting

**"Cannot GET /api/notifications"**
- Check Vercel logs for backend errors
- Verify MONGODB_URI is correct

**"CORS error" or "Failed to fetch"**
- Check CORS_ORIGIN matches deployment URL
- Clear browser cache and reload

**Build fails**
- Check if all dependencies are in package.json
- Verify no syntax errors in code

**Database not connecting**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

## 🎯 Final Status

✅ All setup complete! Ready for deployment.

To deploy now:
1. Go to vercel.com
2. Import the GitHub repository
3. Add environment variables
4. Click Deploy!

That's it! Your app will be live in minutes! 🚀
