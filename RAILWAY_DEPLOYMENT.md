# 🚀 Railway Deployment Guide for Scrape the Plate

## Step-by-Step Railway Deployment

### 1. **Prepare Your Repository**

✅ **Your code is ready for deployment!** I've configured:
- `railway.toml` - Railway configuration
- `server-production.js` - Production server setup
- Updated package.json with proper scripts

### 2. **Push to GitHub** (if not already done)

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 3. **Deploy to Railway**

1. **Go to Railway**: https://railway.app/
2. **Sign up** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `scrapetheplateweb-pap/scarpe-the-plate-website`

### 4. **Configure Services**

Railway will automatically detect and deploy:

**Backend Service (Main):**
- Automatically detected from `railway.toml`
- Serves both API and frontend
- Gets a Railway URL like: `https://your-app.railway.app`

### 5. **Set Environment Variables**

In the Railway dashboard, add these variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-super-secret-session-key-here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
PORT=3000
```

**Railway will provide:**
- Free PostgreSQL database (automatically)
- Environment variables for database connection
- SSL certificates

### 6. **Add Custom Domain**

1. In Railway dashboard, go to **Settings** → **Domains**
2. **Add custom domain**: `scrapetheplateent.com`
3. **Configure DNS** at your domain registrar:
   - Add CNAME: `scrapetheplateent.com` → `your-app.railway.app`
4. **SSL certificate** will be automatic

### 7. **Frontend Build Process**

Railway will automatically:
1. Install frontend dependencies
2. Build the React app (`npm run build`)
3. Serve static files through the backend
4. Handle all routing

## 🎯 **Result**

After deployment, your site will be live at:
- **Railway URL**: `https://your-app.railway.app`
- **Custom domain**: `https://scrapetheplateent.com`

## 💡 **Why Railway is Perfect**

✅ **Free tier** with generous limits
✅ **Automatic database** (PostgreSQL)
✅ **Custom domains** included
✅ **SSL/HTTPS** automatic
✅ **Global CDN** for speed
✅ **Auto-scaling** based on traffic
✅ **GitHub integration** - auto-deploy on push

## 🚀 **Ready to Deploy?**

1. **Push your code** to GitHub
2. **Go to Railway.app**
3. **Connect your repo**
4. **Deploy in 5 minutes!**

Your Scrape the Plate website will be live and accessible worldwide! 🌍