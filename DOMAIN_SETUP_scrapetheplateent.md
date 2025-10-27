# Custom Domain Setup Instructions for scrapetheplateent.com

## 🌐 Domain: scrapetheplateent.com

### Step 1: Upgrade Ngrok to Pro
1. Go to https://dashboard.ngrok.com/billing
2. Upgrade to Pro plan ($10/month)
3. This enables custom domain features

### Step 2: Add Domain to Ngrok
1. Go to https://dashboard.ngrok.com/cloud-edge/domains
2. Click "Create Domain"
3. Enter: `scrapetheplateent.com`
4. Save the domain

### Step 3: Configure DNS
**If you own scrapetheplateent.com:**
- Add CNAME record: `scrapetheplateent.com` → `tunnel.us.ngrok.com`

**If you need to register the domain:**
1. Go to any domain registrar (GoDaddy, Namecheap, etc.)
2. Register `scrapetheplateent.com`
3. Point DNS to ngrok as above

### Step 4: Start with Custom Domain
```cmd
cd "d:\scarpe-the-plate-website"
start-custom-domain.bat
```

### Step 5: Verify Setup
Your site will be available at: **https://scrapetheplateent.com**

## ⚡ Quick Test (Without Pro Plan)
If you want to test first without upgrading:
```cmd
cd "d:\scarpe-the-plate-website"
start-single-tunnel.bat
```
This gives you a temporary URL like: `https://abc123.ngrok-free.app`

## 🔧 Configuration Files Updated:
- ✅ `ngrok-custom.yml` - configured for scrapetheplateent.com
- ✅ `start-custom-domain.bat` - ready to use your domain
- ✅ `.env.production` - production environment with your domain

## 📋 Requirements Checklist:
- [ ] Own domain `scrapetheplateent.com` OR register it
- [ ] Ngrok Pro account ($10/month)
- [ ] DNS configured to point to ngrok
- [ ] Domain added in ngrok dashboard

Once all requirements are met, your Scrape the Plate website will be live at **https://scrapetheplateent.com**!