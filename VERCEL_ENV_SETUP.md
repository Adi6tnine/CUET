# 🔑 Vercel Environment Variables Setup Guide

## ✅ ISSUE FIXED: Secret References Removed

### ❌ **Previous Error:**
```
Environment Variable "VITE_GROQ_API_KEY" references Secret "groq_api_key", which does not exist.
```

### ✅ **Solution Applied:**
- Removed secret references from `vercel.json`
- Environment variables now set directly in Vercel dashboard
- No more `@secret_name` references

---

## 🚀 **Step-by-Step Environment Setup**

### **Step 1: Get Your API Keys**

#### **GroqCloud API Key (Required):**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up/Sign in (free account available)
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)

#### **JSONBin API Key (Optional - for cloud features):**
1. Go to [jsonbin.io](https://jsonbin.io)
2. Sign up for free account
3. Go to "API Keys" section
4. Create new API key
5. Copy the key (starts with `$2a$10$...`)
6. Create a new bin and copy the Bin ID

### **Step 2: Add Environment Variables in Vercel**

#### **Method 1: Vercel Dashboard (Recommended)**
1. Go to your Vercel project dashboard
2. Click **Settings** tab
3. Click **Environment Variables** in sidebar
4. Add each variable:

**Required Variable:**
- **Name**: `VITE_GROQ_API_KEY`
- **Value**: `gsk_your_actual_groq_api_key_here`
- **Environment**: Production ✅ (and Preview if needed)

**Optional Variables (for cloud features):**
- **Name**: `VITE_JSONBIN_API_KEY`
- **Value**: `$2a$10$your_actual_jsonbin_api_key_here`
- **Environment**: Production ✅

- **Name**: `VITE_JSONBIN_BIN_ID`
- **Value**: `your_bin_id_here`
- **Environment**: Production ✅

5. Click **Save** for each variable
6. **Redeploy** your project (important!)

#### **Method 2: Vercel CLI**
```bash
# Set environment variables via CLI
vercel env add VITE_GROQ_API_KEY production
# Enter your API key when prompted

vercel env add VITE_JSONBIN_API_KEY production
# Enter your JSONBin API key when prompted

vercel env add VITE_JSONBIN_BIN_ID production
# Enter your Bin ID when prompted

# Redeploy
vercel --prod
```

### **Step 3: Verify Environment Variables**
1. Go to **Settings** → **Environment Variables**
2. You should see your variables listed
3. Values should be hidden/masked for security

---

## 🔧 **Updated vercel.json (No Secret References)**

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

**Key Changes:**
- ❌ Removed `env` and `build.env` sections
- ❌ No more `@secret_name` references
- ✅ Environment variables set directly in dashboard
- ✅ Clean, simple configuration

---

## 🎯 **Environment Variable Requirements**

### **Required for Basic Functionality:**
```bash
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
```

### **Optional for Cloud Features:**
```bash
VITE_JSONBIN_API_KEY=your_jsonbin_api_key_here
VITE_JSONBIN_BIN_ID=your_bin_id_here
```

### **Automatic Variables (Set by App):**
```bash
VITE_APP_NAME=AVION
VITE_APP_VERSION=2.0.0
VITE_PRIMARY_AI_PROVIDER=groq
VITE_AI_MODEL=llama-3.3-70b-versatile
```

---

## 🔍 **Troubleshooting Environment Variables**

### **Issue: Variables Not Working**
**Solutions:**
1. **Check Variable Names**: Must start with `VITE_`
2. **Verify Values**: No extra spaces or quotes
3. **Redeploy**: Always redeploy after adding variables
4. **Check Environment**: Set for "Production" environment

### **Issue: API Key Invalid**
**Solutions:**
1. **GroqCloud**: Regenerate key at console.groq.com
2. **JSONBin**: Check API key format and permissions
3. **Test Locally**: Add to `.env` file and test

### **Issue: Build Fails**
**Solutions:**
1. **Check Build Logs**: Look for specific error messages
2. **Test Locally**: Run `npm run build` with variables
3. **Verify Syntax**: No typos in variable names

---

## 🧪 **Testing Your Setup**

### **Local Testing:**
1. Create `.env` file in project root:
   ```bash
   VITE_GROQ_API_KEY=gsk_your_key_here
   VITE_JSONBIN_API_KEY=your_jsonbin_key_here
   VITE_JSONBIN_BIN_ID=your_bin_id_here
   ```

2. Test build:
   ```bash
   npm run build
   npm run preview
   ```

3. Test functionality:
   - Take a quiz
   - Check question generation
   - Verify no console errors

### **Production Testing:**
1. Deploy to Vercel
2. Visit deployed URL
3. Open browser DevTools → Console
4. Take a quiz to test API integration
5. Check for any error messages

---

## 🔒 **Security Best Practices**

### **✅ Do:**
- Set variables in Vercel dashboard (secure)
- Use environment-specific settings
- Keep API keys private
- Regenerate keys if compromised

### **❌ Don't:**
- Put API keys in code
- Commit `.env` files to git
- Share API keys publicly
- Use same keys for dev/prod

---

## 🚀 **Final Deployment Steps**

### **1. Set Environment Variables:**
```bash
# In Vercel Dashboard:
# Settings → Environment Variables → Add

VITE_GROQ_API_KEY = gsk_your_actual_key_here
```

### **2. Deploy:**
```bash
vercel --prod
```

### **3. Verify:**
- Visit your deployed URL
- Test quiz functionality
- Check browser console for errors
- Confirm API calls are working

---

## ✅ **Success Checklist**

- [ ] GroqCloud API key obtained
- [ ] Environment variables added in Vercel dashboard
- [ ] Variables set for "Production" environment
- [ ] Project redeployed after adding variables
- [ ] Deployed app tested and working
- [ ] No console errors
- [ ] Quiz functionality confirmed

---

## 🎉 **You're Ready to Deploy!**

With environment variables properly configured:
- ✅ **No more secret reference errors**
- ✅ **API integration working**
- ✅ **Secure key management**
- ✅ **Production-ready deployment**

### **🚀 Deploy Command:**
```bash
vercel --prod
```

**Your AVION app will now deploy successfully with full functionality! 🎓**

---

*Environment Setup Fixed: January 17, 2026*  
*Status: READY FOR DEPLOYMENT ✅*