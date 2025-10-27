# Deploy to Railway (Free Cloud Hosting)

## 🚀 Railway Setup (FREE)

Railway offers free hosting for your full-stack application.

### Step 1: Prepare for Deployment

1. **Create production build script** (already configured)
2. **Environment variables** ready
3. **Database** configured (SQLite works for small apps)

### Step 2: Deploy to Railway

1. **Push to GitHub** (if not already done)
2. **Go to Railway**: https://railway.app/
3. **Sign up with GitHub**
4. **Create New Project** → Deploy from GitHub repo
5. **Select your repository**: scrapetheplateweb-pap/scarpe-the-plate-website

### Step 3: Configure Services

Railway will detect your services automatically:
- **Frontend** (React/Vite)
- **Backend** (Node.js/Express)  
- **Chatbot** (Python/Flask)

### Step 4: Set Environment Variables

In Railway dashboard, add:
```
NODE_ENV=production
DATABASE_URL=file:./production.db
SESSION_SECRET=your-production-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
```

### Step 5: Custom Domain

1. **Add domain** in Railway dashboard
2. **Point DNS** to Railway
3. **Get SSL certificate** automatically

### Result:
- **Free hosting** for your full application
- **Custom domain** support (scrapetheplateent.com)
- **Automatic SSL/HTTPS**
- **Global CDN**

## 🌐 Alternative: Vercel + Railway

1. **Frontend on Vercel** (free, fast)
2. **Backend on Railway** (free tier)
3. **Custom domain** on both

This gives you the best performance and reliability!