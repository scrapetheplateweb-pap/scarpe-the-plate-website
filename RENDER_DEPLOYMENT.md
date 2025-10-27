# 🚀 Render Deployment Guide for Scrape the Plate

## Why Render is Great
✅ **Free tier** with good limits  
✅ **Easier setup** than Railway  
✅ **Free PostgreSQL** database  
✅ **Custom domains** included  
✅ **Automatic SSL/HTTPS**  
✅ **GitHub integration** - auto-deploy on push  

## Step-by-Step Render Deployment

### 1. **Go to Render**
- Visit: https://render.com/
- **Sign up** with your GitHub account

### 2. **Create Web Service**
1. **Click "New"** → **"Web Service"**
2. **Connect GitHub** repository: `scrapetheplateweb-pap/scarpe-the-plate-website`
3. **Configure the service:**

### 3. **Service Configuration**

**Basic Settings:**
```
Name: scrape-the-plate
Environment: Node
Region: US West (or your preferred)
Branch: main
```

**Build & Deploy:**
```
Root Directory: ./
Build Command: cd frontend && npm install && npm run build && cd ../backend && npm install
Start Command: cd backend && npm start
```

**Advanced:**
```
Auto-Deploy: Yes
```

### 4. **Add Environment Variables**

In Render dashboard, add these environment variables:

```env
NODE_ENV=production
SESSION_SECRET=your-super-secret-session-key-change-this
PORT=10000
```

**Optional (for full functionality):**
```env
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
```

### 5. **Create PostgreSQL Database** (Optional)

1. **Click "New"** → **"PostgreSQL"**
2. **Name**: `scrape-the-plate-db`
3. **Plan**: Free
4. **Region**: Same as your web service

**Then add to web service environment variables:**
```env
DATABASE_URL=postgresql://[provided by Render]
```

### 6. **Custom Domain Setup**

1. **In your web service** → **Settings** → **Custom Domains**
2. **Add domain**: `scrapetheplateent.com`
3. **Configure DNS** at your domain registrar:
   - Add CNAME: `scrapetheplateent.com` → `your-app.onrender.com`

### 7. **Deploy!**

1. **Click "Create Web Service"**
2. **Render will automatically:**
   - Clone your repository
   - Install dependencies
   - Build your frontend
   - Start your backend
   - Provide a live URL

## 🎯 **Result**

Your site will be live at:
- **Render URL**: `https://scrape-the-plate.onrender.com`
- **Custom Domain**: `https://scrapetheplateent.com`

## 💡 **Render vs Railway**

**Why Render might be better:**
- ✅ **Simpler configuration**
- ✅ **More reliable free tier**
- ✅ **Better documentation**
- ✅ **Easier environment variable management**
- ✅ **Built-in database backups**

## 🚀 **Ready to Deploy?**

1. **Go to**: https://render.com/
2. **Sign up** with GitHub
3. **Create Web Service**
4. **Connect your repo**
5. **Use the configuration above**

Your Scrape the Plate website will be live in 5-10 minutes! 🌍