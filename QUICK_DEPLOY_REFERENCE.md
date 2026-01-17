# 🚀 AVION - Quick Deploy Reference

## ⚡ 2-Minute Deployment

### **Step 1: Get API Key**
- Go to [console.groq.com/keys](https://console.groq.com/keys)
- Sign up (free) → Create API Key
- Copy key (starts with `gsk_`)

### **Step 2: Deploy**
```bash
vercel --prod
```

### **Step 3: Add Environment Variable**
- Vercel Dashboard → Settings → Environment Variables
- Add: `VITE_GROQ_API_KEY` = `gsk_your_key_here`
- Environment: Production ✅
- Save → Redeploy

### **Step 4: Test**
- Visit deployed URL
- Take a quiz
- Verify functionality

---

## 🔧 **Fixed Configuration Issues**

### ✅ **All Resolved:**
- ~~`functions` cannot be used with `builds`~~ ✅
- ~~`routes` cannot be used with `headers`~~ ✅  
- ~~Secret "groq_api_key" does not exist~~ ✅

### ✅ **Current Status:**
- Clean `vercel.json` configuration
- Direct environment variable setup
- No secret references
- Production-ready

---

## 📋 **Environment Variables**

### **Required:**
```bash
VITE_GROQ_API_KEY=gsk_your_actual_key_here
```

### **Optional (Cloud Features):**
```bash
VITE_JSONBIN_API_KEY=your_jsonbin_key_here
VITE_JSONBIN_BIN_ID=your_bin_id_here
```

---

## 🎯 **Deployment Commands**

### **Vercel (Recommended):**
```bash
# Install CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Alternative Methods:**
```bash
# Netlify
npm run deploy:netlify

# Manual build
npm run build
# Upload dist/ folder to any static host
```

---

## 🔍 **Troubleshooting**

### **Build Fails:**
```bash
# Test locally first
npm run build
npm run preview
```

### **Environment Variables Not Working:**
- Check variable names start with `VITE_`
- Verify values have no extra spaces
- Redeploy after adding variables
- Check "Production" environment is selected

### **API Errors:**
- Verify GroqCloud API key is valid
- Check browser console for error messages
- Test API key at console.groq.com

---

## ✅ **Success Checklist**

- [ ] GroqCloud account created
- [ ] API key copied (starts with `gsk_`)
- [ ] Vercel CLI installed
- [ ] Project deployed (`vercel --prod`)
- [ ] Environment variable added in dashboard
- [ ] Project redeployed
- [ ] Deployed URL tested
- [ ] Quiz functionality verified

---

## 🎉 **Your App is Live!**

**URL:** `https://your-project-name.vercel.app`

**Features Working:**
- ✅ CUET-realistic question generation
- ✅ Mistake-based learning system
- ✅ Offline functionality
- ✅ Progress tracking
- ✅ Mobile-responsive design
- ✅ PWA capabilities

---

## 📞 **Need Help?**

### **Common Solutions:**
- **Build errors**: Check `npm run build` locally
- **API issues**: Verify environment variables
- **Routing issues**: Already fixed in vercel.json
- **Performance**: Already optimized

### **Resources:**
- [Vercel Documentation](https://vercel.com/docs)
- [GroqCloud Console](https://console.groq.com)
- [JSONBin Setup](./JSONBIN_SETUP_GUIDE.md)

---

**🚀 AVION is ready to help CUET aspirants succeed! 🎓**

*Quick Reference - January 17, 2026*