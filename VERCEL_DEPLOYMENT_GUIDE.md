# 🚀 Vercel Deployment Guide for AVION

## ✅ Quick Deploy (2 minutes)

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/avion)

### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔧 Vercel Configuration Fixed

### ❌ **Common Vercel Errors Fixed:**
1. ~~`functions` property cannot be used with `builds`~~ ✅ Fixed
2. ~~`routes` cannot be used with `headers`~~ ✅ Fixed

### ✅ **Current Configuration:**
- Uses `rewrites` instead of `routes` for SPA routing
- Includes security headers for production
- Service worker support configured
- Modern Vercel v2 format

### 🔄 **If You Still Get Errors:**
Replace `vercel.json` with the minimal version:

```bash
# Rename current config
mv vercel.json vercel-full.json

# Use minimal config
mv vercel-minimal.json vercel.json

# Deploy
vercel --prod
```

## 🔧 Environment Variables Setup

After deployment, add these environment variables in Vercel dashboard:

### Required Variables:
```bash
VITE_GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

### Optional Variables (for cloud features):
```bash
VITE_JSONBIN_API_KEY=your_jsonbin_api_key_here
VITE_JSONBIN_BIN_ID=your_jsonbin_bin_id_here
```

### How to Add Environment Variables:
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `VITE_GROQ_API_KEY`
   - **Value**: Your actual API key (starts with `gsk_`)
   - **Environment**: Production ✅ (and Preview if needed)
4. Click **Save**
5. **Redeploy** your project for changes to take effect

### Get Your API Keys:
- **GroqCloud**: [console.groq.com/keys](https://console.groq.com/keys) (Required)
- **JSONBin**: [jsonbin.io](https://jsonbin.io) → API Keys (Optional)

## 📋 Pre-Deployment Checklist

### ✅ Before Deploying:
- [ ] Get GroqCloud API key from [console.groq.com](https://console.groq.com/keys)
- [ ] (Optional) Set up JSONBin account and get API key + Bin ID
- [ ] Test build locally: `npm run build`
- [ ] Verify no console errors in production build

### ✅ After Deployment:
- [ ] Visit your deployed URL
- [ ] Test quiz functionality
- [ ] Check browser console for errors
- [ ] Verify offline functionality works
- [ ] Test on mobile device

## 🔍 Troubleshooting Common Issues

### Issue 1: "Build failed" Error
**Solution**: Check build logs in Vercel dashboard
```bash
# Test build locally first
npm run build
npm run preview
```

### Issue 2: "Environment variables not working"
**Solution**: 
1. Verify variables are set in Vercel dashboard
2. Variable names must start with `VITE_`
3. Redeploy after adding variables

### Issue 3: "404 on page refresh"
**Solution**: Already handled by `vercel.json` routing configuration

### Issue 4: "Service Worker not loading"
**Solution**: Service worker headers are configured in `vercel.json`

### Issue 5: "API calls failing"
**Solution**: 
1. Check API key is valid
2. Verify CORS settings
3. Check browser network tab for errors

## 📊 Vercel Configuration Explained

Our `vercel.json` includes:

### Build Configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### SPA Routing:
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Security Headers:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Service Worker Support:
```json
{
  "source": "/sw.js",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=0, must-revalidate"
    },
    {
      "key": "Service-Worker-Allowed",
      "value": "/"
    }
  ]
}
```

## 🎯 Performance Optimizations

### Automatic Optimizations:
- ✅ **Edge Network**: Global CDN for fast loading
- ✅ **Compression**: Automatic gzip/brotli compression
- ✅ **Image Optimization**: Automatic image optimization
- ✅ **Caching**: Smart caching for static assets
- ✅ **HTTP/2**: Modern protocol support

### Bundle Analysis:
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/stats.html
```

## 🔒 Security Features

### Enabled by Default:
- ✅ **HTTPS**: Automatic SSL certificates
- ✅ **Security Headers**: XSS protection, content type sniffing prevention
- ✅ **Environment Variables**: Secure server-side storage
- ✅ **DDoS Protection**: Built-in protection

## 📈 Monitoring & Analytics

### Vercel Analytics (Optional):
1. Go to project dashboard
2. Click **Analytics** tab
3. Enable Web Analytics
4. View performance metrics

### Custom Monitoring:
AVION includes built-in monitoring:
- Error tracking
- Performance metrics
- User analytics
- Health checks

## 🌍 Custom Domain (Optional)

### Add Custom Domain:
1. Go to project **Settings** → **Domains**
2. Add your domain (e.g., `avion.yourdomain.com`)
3. Configure DNS records as shown
4. Wait for SSL certificate generation

### DNS Configuration:
```
Type: CNAME
Name: avion (or @)
Value: cname.vercel-dns.com
```

## 🔄 Continuous Deployment

### Automatic Deployments:
- ✅ **Git Integration**: Auto-deploy on push to main branch
- ✅ **Preview Deployments**: Every PR gets preview URL
- ✅ **Rollback**: Easy rollback to previous versions

### Manual Deployment:
```bash
# Deploy specific branch
vercel --prod --target production

# Deploy with custom name
vercel --name avion-production
```

## 📱 Mobile Optimization

### PWA Features:
- ✅ **Service Worker**: Offline functionality
- ✅ **Web App Manifest**: Install prompt
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Touch Optimization**: Touch-friendly interface

## 🎉 Post-Deployment Success

### Your AVION app will have:
- 🚀 **Lightning Fast**: Global CDN delivery
- 🔒 **Secure**: HTTPS and security headers
- 📱 **Mobile Ready**: PWA capabilities
- 🌐 **Global**: Available worldwide
- 📊 **Monitored**: Built-in analytics
- 🔄 **Reliable**: 99.99% uptime

### Share Your App:
- **URL**: `https://your-project.vercel.app`
- **Custom Domain**: `https://avion.yourdomain.com`
- **QR Code**: Generate QR code for easy mobile access

## 🆘 Support

### Vercel Support:
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel](https://github.com/vercel/vercel)
- Support: [vercel.com/support](https://vercel.com/support)

### AVION Support:
- Check browser console for errors
- Use `exportAvionLogs()` in console for debugging
- Verify environment variables are set correctly

---

## ✅ Deployment Complete!

Your AVION app is now live and ready to help CUET aspirants worldwide! 🎓

**Next Steps:**
1. Share the URL with users
2. Monitor performance in Vercel dashboard
3. Set up custom domain (optional)
4. Enable analytics (optional)

**Your app is production-ready and scalable! 🚀**