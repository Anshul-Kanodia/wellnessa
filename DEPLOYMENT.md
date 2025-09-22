# Wellnessa Deployment Guide

## 🚀 Deploy Wellnessa to the Internet with Custom Domain

### Prerequisites
- GitHub account
- Domain name (purchase from Namecheap, GoDaddy, etc.)
- Vercel account (free)
- Render account (free)

---

## Step 1: Prepare for Deployment

### 1.1 Create GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial Wellnessa deployment"

# Create repository on GitHub and push
git remote add origin https://github.com/Anshul-Kanodia/wellnessa.git
git branch -M main
git push -u origin main
```

### 1.2 Build Production Version
```bash
# Build the React app
cd client
npm run build
cd ..
```

---

## Step 2: Deploy Backend (Render - FREE)

### 2.1 Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure settings:
   - **Name:** wellnessa-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js`
   - **Plan:** Free

### 2.2 Configure Environment Variables
In Render dashboard → Environment tab:
```
NODE_ENV=production
JWT_SECRET=wellnessa_production_jwt_secret_key_2024_secure
FRONTEND_URL=https://your-domain.com
PORT=10000
BCRYPT_ROUNDS=12
```

### 2.3 Get Backend URL
- Copy your Render app URL (e.g., `https://wellnessa-backend.onrender.com`)

---

## Step 3: Deploy Frontend (Vercel)

### 3.1 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### 3.2 Update API Endpoints
Update the `vercel.json` file with your actual Render backend URL:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://wellnessa-backend.onrender.com/api/$1"
    }
  ]
}
```

### 3.3 Configure Environment Variables in Vercel
In Vercel dashboard → Settings → Environment Variables:
```
REACT_APP_API_URL=https://wellnessa-backend.onrender.com
```

---

## Step 4: Configure Custom Domain

### 4.1 Purchase Domain
- Buy domain from Namecheap, GoDaddy, or Cloudflare
- Example: `wellnessa.com`

### 4.2 Add Domain to Vercel
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain: `wellnessa.com`
3. Add www subdomain: `www.wellnessa.com`
4. Vercel will provide DNS records

### 4.3 Configure DNS Records
In your domain registrar's DNS settings, add:

**For Vercel (Frontend):**
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**For Render Backend (Optional Subdomain):**
```
Type: CNAME
Name: api
Value: wellnessa-backend.onrender.com
```

### 4.4 Update Environment Variables
Update Render backend environment:
```
FRONTEND_URL=https://wellnessa.com
```

Update Vercel frontend environment:
```
REACT_APP_API_URL=https://api.wellnessa.com
```

---

## Step 5: SSL Certificate & Security

### 5.1 SSL Certificate
- Vercel automatically provides SSL certificates
- Render also provides SSL for backend

### 5.2 Update CORS Settings
Ensure your backend allows your custom domain in CORS settings.

---

## Step 6: Testing Deployment

### 6.1 Test Frontend
- Visit `https://wellnessa.com`
- Test login with demo accounts:
  - User: `user1` / `password123`
  - Admin: `admin1` / `admin123`
  - Super Admin: `superadmin` / `super123`

### 6.2 Test Backend API
- Test API endpoints: `https://api.wellnessa.com/api/health`

---

## Alternative Deployment Options

### Option 1: All-in-One (Render)
- Deploy both frontend and backend to Render
- Single domain with API routes

### Option 2: Netlify + Render
- Frontend: Netlify
- Backend: Render
- Similar process to Vercel

### Option 3: Railway (Paid)
- More expensive but reliable
- $5/month after free credits

---

## Custom Domain Examples

### Professional Domains
- `wellnessa.com` - Main site
- `app.wellnessa.com` - Application
- `api.wellnessa.com` - Backend API
- `admin.wellnessa.com` - Admin panel

### DNS Configuration Example
```
wellnessa.com → Vercel (Frontend)
www.wellnessa.com → Vercel (Frontend)
api.wellnessa.com → Render (Backend)
app.wellnessa.com → Vercel (Frontend)
```

---

## Monitoring & Maintenance

### 1. Set up monitoring
- Vercel Analytics (free)
- Render Metrics
- Google Analytics

### 2. Regular updates
- Update dependencies monthly
- Monitor security vulnerabilities
- Backup user data

### 3. Performance optimization
- Enable Vercel Edge Functions
- Use Render's auto-scaling
- Optimize images and assets

---

## Troubleshooting

### Common Issues
1. **CORS Errors:** Update FRONTEND_URL in Render
2. **API Not Found:** Check vercel.json rewrites
3. **Domain Not Working:** Verify DNS propagation (24-48 hours)
4. **SSL Issues:** Wait for certificate generation
5. **Render Sleep:** Free tier sleeps after 15 minutes of inactivity

### Support Resources
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Render Documentation: [render.com/docs](https://render.com/docs)
- DNS Checker: [dnschecker.org](https://dnschecker.org)

---

## Cost Estimation

### Free Tier Limits
- **Vercel:** 100GB bandwidth, unlimited static sites
- **Render:** 750 hours/month, sleeps after 15 min inactivity
- **Domain:** $10-15/year

### Scaling Costs
- **Vercel Pro:** $20/month (team features)
- **Render Starter:** $7/month (no sleep, better performance)
- **Total:** ~$10-15/year (free tiers) or ~$35/month (paid tiers)

---

## Security Checklist

- ✅ HTTPS enabled (SSL certificates)
- ✅ Environment variables secured
- ✅ JWT secrets are strong
- ✅ CORS properly configured
- ✅ No sensitive data in client code
- ✅ Regular dependency updates

---

**Your Wellnessa platform is now ready for FREE production deployment!**
