# Vercel 500 Error - Troubleshooting Checklist

## ⚠️ Critical: Check Vercel Environment Variables

Go to **Vercel Dashboard → Project Settings → Environment Variables** and verify ALL are set:

### Required Environment Variables:
```
MONGODB_URI = your_mongodb_connection_string
DB_NAME = samarth
CORS_ORIGIN = https://samarthacadam.vercel.app
JWT_SECRET = your_jwt_secret_key
CLOUDINARY_CLOUD_NAME = your_cloudinary_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
NODE_ENV = production
```

## 🔍 How to Debug the 500 Error

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Project
   - Click "Deployments"
   - Select latest deployment
   - Click "Function Logs" to see the actual error

2. **Test Health Check (should work instantly):**
   - Visit: `https://your-backend-vercel-url/api/v1/health`
   - Should return: `{"status":"OK","message":"Server is running!"}`

3. **Check specific endpoint that's failing:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for 500 error request
   - Click it to see the response body with error details

## 🔧 Recent Fixes Applied:

✅ Fixed multer to use memory storage (not disk) for Vercel
✅ Re-enabled serverless-http for Vercel compatibility  
✅ Added global error handler to capture all errors
✅ Updated CORS origin to Vercel domain

## 📝 Next Steps:

1. **Set all environment variables above on Vercel**
2. **Redeploy:** Push code to GitHub (Vercel auto-deploys)
3. **Check Vercel logs** for the exact error message
4. **Report the error message** if still failing

## 💾 Deploy Changes:

```bash
cd Backend
git add .
git commit -m "Fix Vercel serverless config and multer storage"
git push
```

Vercel will auto-deploy. Check the function logs after deployment!
