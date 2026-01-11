# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Grok API Not Working
- Check if `VITE_GROK_API_KEY` is set in `.env`
- Verify API key is valid at [console.x.ai](https://console.x.ai/)
- App works with fallback responses if API fails

### 3. Styles Not Loading
```bash
# Rebuild Tailwind
npm run build
npm run dev
```

### 4. LocalStorage Issues
- Clear browser storage: F12 → Application → Storage → Clear
- Data will reset but app will work normally

### 5. Build Errors
```bash
# Check for syntax errors
npm run lint
# Fix and rebuild
npm run build
```

### 6. Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

## Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support  
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support

## Performance Issues

1. **Slow animations**: Reduce motion in browser settings
2. **Memory usage**: Clear browser cache
3. **API timeouts**: Check network connection

## Data Persistence

- Syllabus progress: Stored in `localStorage`
- Daily checklist: Resets at midnight
- Chat history: Session-based (clears on refresh)

## Need Help?

1. Check browser console for errors (F12)
2. Verify all files are present in `src/` directory
3. Ensure Node.js version is 16+ 
4. Try incognito mode to rule out extensions

---

**Still stuck? The app is designed to be bulletproof! 💪**