# 🚀 Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### 2. Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### 3. GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

## Environment Variables

For production deployment, set these environment variables:

- `VITE_GROK_API_KEY`: Your Grok API key from console.x.ai

## Build Commands

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Dev**: `npm run dev`

## Performance Tips

1. The app uses localStorage for persistence - no backend needed
2. Grok API calls are optional - app works with fallback responses
3. All animations are optimized with Framer Motion
4. Responsive design works on all devices

## Domain Setup

Once deployed, you can access:
- Dashboard: `/` (Command HQ)
- Syllabus: Click "Battle Plan" tab
- Grok Chat: Floating button (bottom-right)

---

**Your cyberpunk command center is ready to dominate! 🔥**