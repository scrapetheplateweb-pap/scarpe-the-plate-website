# Custom Domain Configuration Guide

## 🌐 Setting Up Custom Domain

### Prerequisites:
1. **Own a domain** (e.g., scrapetheplateent.com)
2. **Ngrok Pro account** (custom domains require paid plan)
3. **DNS access** to your domain

### Method 1: Ngrok Custom Domain (Recommended)

1. **Upgrade to Ngrok Pro:**
   - Go to https://dashboard.ngrok.com/billing
   - Upgrade to Pro plan ($10/month)

2. **Add Custom Domain:**
   - Go to https://dashboard.ngrok.com/cloud-edge/domains
   - Click "Create Domain"
   - Enter: `scrapetheplateent.com` (or your actual domain)

3. **Configure DNS:**
   - Add CNAME record in your DNS:
   - `scrapetheplateent.com` → `tunnel.us.ngrok.com`

4. **Update ngrok config:**
   ```yaml
   version: "2"
   authtoken: 34eth2Ahoj4Lp8Gf0bHfZbiiuNQ_51wCdrdLMSxnB2bNwEZTo
   tunnels:
     frontend:
       addr: 5000
       proto: http
       hostname: scrapetheplateent.com
   ```

### Method 2: Reverse Proxy (Free Alternative)

Use Cloudflare Tunnel (free) with your domain:

1. **Register domain** with any registrar
2. **Add to Cloudflare** (free plan)
3. **Use Cloudflare Tunnel** instead of ngrok
4. **Points to your local server**

### Method 3: VPS Deployment

Deploy to a VPS with your domain:
1. **Rent VPS** (DigitalOcean, Linode, etc.)
2. **Deploy application** to VPS
3. **Point domain** to VPS IP
4. **Setup SSL** with Let's Encrypt

## ⚠️ Important Notes:

- `.eat` is not a valid internet TLD
- Standard TLDs: .com, .net, .org, .io, etc.
- Custom domains with ngrok require Pro plan
- Free alternatives exist (Cloudflare Tunnel)

## 🚀 Quick Setup with Actual Domain:

If you have `scrapetheplateent.com`:
1. Upgrade ngrok to Pro
2. Add domain in ngrok dashboard
3. Update DNS CNAME record
4. Use custom domain in tunnel config