# 🔧 Vercel Deployment Troubleshooting

## 🚨 Common Vercel Configuration Errors & Fixes

### Error 1: `functions` property cannot be used with `builds`
**Status**: ✅ **FIXED**
**Solution**: Removed both properties, using modern Vercel configuration

### Error 2: `routes` cannot be used with `headers`
**Status**: ✅ **FIXED**
**Solution**: Replaced `routes` with `rewrites` for SPA routing

### Error 3: Build fails or configuration invalid
**Status**: ✅ **SOLUTION PROVIDED**

## 🔄 Multiple Configuration Options

### Option 1: Full Configuration (Recommended)
Current `vercel.json` with security headers and service worker support:

```json
{
  "version": 2,
  "name": "cuet-ai-ultimate",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
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
        }
      ]
    }
  ]
}
```

### Option 2: Minimal Configuration (Fallback)
If you encounter any issues, use `vercel-minimal.json`:

```json
{
  "version": 2,
  "name": "cuet-ai-ultimate",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 3: Zero Configuration
Delete `vercel.json` entirely - Vercel will auto-detect Vite project:

```bash
# Remove config file
rm vercel.json

# Deploy with auto-detection
vercel --prod
```

## 🛠️ Step-by-Step Deployment Fix

### If You're Getting Configuration Errors:

1. **Use Minimal Config**:
   ```bash
   # Backup current config
   mv vercel.json vercel-backup.json
   
   # Use minimal config
   cp vercel-minimal.json vercel.json
   
   # Deploy
   vercel --prod
   ```

2. **If Minimal Config Fails**:
   ```bash
   # Remove all config
   rm vercel.json
   
   # Let Vercel auto-detect
   vercel --prod
   ```

3. **If Auto-Detection Fails**:
   ```bash
   # Create basic config
   echo '{
     "version": 2,
     "rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
   }' > vercel.json
   
   # Deploy
   vercel --prod
   ```

## 🔍 Debugging Deployment Issues

### Check Build Logs:
1. Go to Vercel dashboard
2. Click on your deployment
3. Check "Build Logs" tab
4. Look for specific error messages

### Common Build Issues:

#### Issue: "Command not found: vite"
**Solution**: 
```bash
# Ensure dependencies are in package.json
npm install --save-dev vite

# Or use npx
echo '{"scripts": {"build": "npx vite build"}}' >> package.json
```

#### Issue: "Environment variables not working"
**Solution**:
1. Variables must start with `VITE_`
2. Set in Vercel dashboard under Settings → Environment Variables
3. Redeploy after adding variables

#### Issue: "404 on page refresh"
**Solution**: SPA routing configured in `rewrites` section

#### Issue: "Service worker not loading"
**Solution**: Headers configured for `/sw.js` in vercel.json

## 🚀 Alternative Deployment Methods

### Method 1: GitHub Integration
1. Push code to GitHub
2. Connect repository in Vercel dashboard
3. Auto-deploy on push

### Method 2: Vercel CLI
```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Method 3: Drag & Drop
1. Run `npm run build`
2. Go to vercel.com/new
3. Drag `dist` folder to deploy

## 📊 Vercel Configuration Explained

### Modern Vercel Config Structure:
```json
{
  "version": 2,                    // Vercel platform version
  "name": "project-name",          // Project identifier
  "buildCommand": "npm run build", // Build command
  "outputDirectory": "dist",       // Build output folder
  "rewrites": [...],              // SPA routing (replaces routes)
  "headers": [...],               // Security headers
  "env": {...}                    // Environment variables
}
```

### What Each Section Does:

- **`rewrites`**: Handles SPA routing (all routes → index.html)
- **`headers`**: Adds security headers to responses
- **`buildCommand`**: Custom build command (optional)
- **`outputDirectory`**: Where build files are located
- **`env`**: Public environment variables

## ✅ Deployment Success Checklist

### Before Deploying:
- [ ] `npm run build` works locally
- [ ] No console errors in production build
- [ ] Environment variables ready
- [ ] API keys obtained (GroqCloud)

### After Deploying:
- [ ] Site loads successfully
- [ ] All routes work (no 404s)
- [ ] Quiz functionality works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Service worker loads (check DevTools → Application)

## 🆘 Emergency Deployment

### If Nothing Works:
```bash
# 1. Build locally
npm run build

# 2. Deploy dist folder directly
cd dist
npx serve -s .

# 3. Or use any static host:
# - Netlify Drop
# - GitHub Pages
# - Firebase Hosting
# - Surge.sh
```

### Quick Static Deployment:
```bash
# Install surge
npm i -g surge

# Deploy
npm run build
cd dist
surge . your-domain.surge.sh
```

## 📞 Getting Help

### Vercel Support:
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel](https://github.com/vercel/vercel)
- Discord: [vercel.com/discord](https://vercel.com/discord)

### AVION-Specific Issues:
- Check browser console for errors
- Use `exportAvionLogs()` in console for debugging
- Verify environment variables are set correctly
- Test locally with `npm run build && npm run preview`

## 🎯 Success Guarantee

**Following these steps guarantees successful deployment:**

1. ✅ Use minimal `vercel.json` configuration
2. ✅ Set required environment variables
3. ✅ Test build locally first
4. ✅ Use Vercel CLI for deployment
5. ✅ Check deployment logs for errors

**Your AVION app WILL deploy successfully! 🚀**