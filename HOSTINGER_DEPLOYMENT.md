# Hostinger Deployment Guide

## Backend Deployment (Node.js/Express)

### Step 1: Prepare Backend
```bash
cd Backend
npm install
```

### Step 2: Create .env file on Hostinger
Create a `.env` file in the `/Backend` directory with:
```
MONGODB_URI=your_mongodb_connection_string
DB_NAME=samarth
PORT=5000
CORS_ORIGIN=https://yourdomain.com
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

### Step 3: Upload Backend to Hostinger
1. Go to **Hostinger Control Panel** → **File Manager**
2. Create a folder: `/public_html/api` (or similar)
3. Upload the `/Backend` folder contents
4. Ensure `/src/index.js` is the entry point

### Step 4: Setup Node.js App
1. In Hostinger Control Panel → **Node.js** or **Application Manager**
2. Create new Node.js application:
   - **Application Root**: Point to your Backend folder
   - **Application URL**: `api.yourdomain.com` or `/api`
   - **Node.js Version**: 18+ (or latest)
   - **Entry Point**: `src/index.js`
   - **Port**: 5000 (internal)

3. Set Environment Variables in the Node.js app settings with your `.env` values

### Step 5: Install Dependencies
In Hostinger's terminal (if available) or through Node.js manager:
```bash
npm install
```

### Step 6: Start Application
The Node.js app manager will handle starting `npm start`

---

## Frontend Deployment (React/Vite)

### Step 1: Build Frontend
```bash
cd frontend
npm install
npm run build
```

This creates a `/dist` folder with static files.

### Step 2: Update API URL
In `frontend/src/utils/api.js`, update the `VITE_API_URL`:
```javascript
const rawUrl = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com/api';
```

Or use environment variable in deployment.

### Step 3: Upload Frontend
1. Go to **Hostinger File Manager** → `/public_html`
2. Upload all files from `/frontend/dist` to `/public_html`
3. Configure `.htaccess` for React Router:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Domain Configuration

### DNS Records
Point your domain to Hostinger:
```
API Subdomain (Optional):
- Type: CNAME
- Name: api
- Value: api.yourdomain.com

Main Domain:
- Type: A
- Name: @
- Value: Your Hostinger IP
```

---

## Testing

### Test Backend Health
```
curl https://api.yourdomain.com/api/v1/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running!"
}
```

### Test Frontend
Visit `https://yourdomain.com` - should load React app

### Test API Connection
Open browser console and check API calls in Network tab

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check Node.js app status, restart application |
| CORS errors | Verify CORS_ORIGIN in .env matches frontend domain |
| Static files not loading | Ensure `/dist` files are in `/public_html` |
| API 404 errors | Check Node.js app routing, verify port matching |
| Environment variables not working | Set them in Hostinger Node.js app manager, not just .env |

---

## Key Differences from Vercel

✅ **No serverless-http** - Traditional server listening on port
✅ **Port-based routing** - Backend runs on port 5000
✅ **Manual environment variables** - Set in Hostinger control panel
✅ **Traditional file upload** - Upload files directly to File Manager
✅ **Always-on server** - Runs continuously (no cold starts)
