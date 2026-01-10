# 🚀 GitHub Deployment Guide

## Quick Deployment to Your Existing Repo

Follow these steps to update your GitHub repository at:
https://github.com/rodrivero2016-collab/investment-tracker

### Step 1: Download Files
Download all the project files from Claude

### Step 2: Navigate to Your Local Repo
```bash
cd /path/to/your/investment-tracker
```

### Step 3: Replace Files
Copy these files into your repository:
- `index.html` - Main entry point
- `app.js` - React application
- `styles.css` - Styling
- `data.js` - Your Alpaca market data
- `README.md` - Documentation

### Step 4: Commit and Push
```bash
git add .
git commit -m "Enhanced investment tracker with alerts and budgets"
git push origin main
```

### Step 5: Enable GitHub Pages
1. Go to your repo: https://github.com/rodrivero2016-collab/investment-tracker
2. Click "Settings" tab
3. Scroll to "Pages" section (left sidebar)
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click "Save"

### Step 6: Access Your Live App
After 1-2 minutes, your app will be live at:
```
https://rodrivero2016-collab.github.io/investment-tracker/
```

## 🎯 What's New in This Version

### Features Added:
✅ **Alert System** - Get notified on gains/losses
✅ **Budget Limits** - Daily spending thresholds
✅ **Enhanced Charts** - Area charts with gradients
✅ **Notifications** - Real-time alerts in the UI
✅ **Settings Panel** - Customize your preferences
✅ **Responsive Design** - Works on all devices

### Technical Improvements:
- Modern React hooks
- Better state management
- Smoother animations
- Mobile-optimized UI

## 🔧 Customization

### Change Default Portfolio
Edit `app.js` line 13-17:
```javascript
const [portfolio, setPortfolio] = useState([
  { symbol: 'NVDA', shares: 10, purchasePrice: 120.50 },
  { symbol: 'HOG', shares: 50, purchasePrice: 32.00 },
  { symbol: 'SHOP', shares: 20, purchasePrice: 85.00 },
]);
```

### Update Alert Defaults
Edit `app.js` lines 21-23:
```javascript
const [dailyBudget, setDailyBudget] = useState(1000);
const [gainAlertPercent, setGainAlertPercent] = useState(10);
const [lossAlertPercent, setLossAlertPercent] = useState(-5);
```

### Refresh Market Data
Replace the contents of `data.js` with fresh Alpaca data.

## 📱 Testing Locally

Before pushing, test locally:
1. Open `index.html` in your browser
2. Verify all features work
3. Test on mobile (use browser dev tools)
4. Check console for errors (F12)

## 🐛 Troubleshooting

### Charts not showing?
- Check browser console for errors
- Ensure data.js is loading properly
- Verify CDN links are accessible

### GitHub Pages not updating?
- Wait 2-3 minutes for deployment
- Clear browser cache
- Check GitHub Actions tab for build status

### Budget alerts not working?
- Verify settings in the Settings panel
- Check that budget > 0
- Look for console errors

## 💡 Pro Tips

1. **Bookmark your live URL** for quick access
2. **Update data weekly** for accurate tracking
3. **Set realistic thresholds** to avoid alert fatigue
4. **Use mobile app** by adding to home screen

## 📞 Need Help?

If you encounter issues:
1. Check the browser console (F12)
2. Review the README.md
3. Open an issue on GitHub
4. Ask Claude for assistance!

---

Happy Investing! 📈💰
