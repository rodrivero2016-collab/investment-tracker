# 📊 Investment Tracker & Analysis Dashboard

A comprehensive investment portfolio tracking application with real-time alerts, spending thresholds, and interactive analytics powered by Alpaca market data.

![Investment Tracker](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📈 Portfolio Management
- Track multiple stock positions with real-time pricing
- View comprehensive metrics: Total Value, Cost, Gains/Losses, Return %
- Interactive portfolio allocation pie chart
- Add/remove positions with ease

### 🚨 Smart Alerts System
- **Gain Alerts**: Get notified when stocks exceed your profit threshold
- **Loss Alerts**: Receive warnings when positions drop below your tolerance
- Customizable alert percentages for both gains and losses
- Real-time notifications displayed in the app

### 💰 Budget Management
- **Daily Spending Limits**: Set a maximum daily budget for new investments
- Budget validation before adding new positions
- Prevents overspending and helps maintain discipline

### 📊 Interactive Charts
- **Price Charts**: Area charts with high/low/close prices
- **Volume Charts**: Bar charts showing trading volume
- **Portfolio Allocation**: Visual breakdown of your investments
- Click any stock symbol to instantly view its chart

### 🎨 Modern UI/UX
- Responsive design works on desktop, tablet, and mobile
- Gradient-based color scheme
- Smooth animations and transitions
- Dark theme optimized for extended viewing

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Fork or clone this repository** to your GitHub account

2. **Upload your data**:
   - Replace `data.js` with your Alpaca market data
   - Or update the `MARKET_DATA` array in `data.js`

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "main" branch and "/(root)" folder
   - Click "Save"

4. **Access your app**:
   - Your site will be live at: `https://your-username.github.io/investment-tracker/`

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/investment-tracker.git

# Navigate to the directory
cd investment-tracker

# Open index.html in your browser
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

## 📁 File Structure

```
investment-tracker/
├── index.html          # Main HTML file
├── app.js             # React application code
├── styles.css         # Styling and animations
├── data.js            # Market data from Alpaca
└── README.md          # Documentation
```

## ⚙️ Configuration

### Setting Alert Thresholds

1. Click the **⚙️ Settings** button in the header
2. Adjust the following parameters:
   - **Daily Budget Limit**: Maximum amount to spend per day (default: $1,000)
   - **Gain Alert Threshold**: Alert when gains exceed this % (default: 10%)
   - **Loss Alert Threshold**: Alert when losses exceed this % (default: -5%)

### Adding Positions

1. Click **+ Add Position** in the Positions section
2. Select a stock symbol from the dropdown
3. Enter number of shares
4. Enter purchase price
5. Click **Add** (budget validation occurs automatically)

### Removing Positions

- Click the 🗑️ trash icon next to any position to remove it
- A confirmation notification will appear

## 📊 Data Format

The `data.js` file expects market data in this format:

```javascript
const MARKET_DATA = [
  {
    "time": "2025-12-09 23:00:00-06:00",
    "open": 37.85,
    "high": 39.09,
    "low": 37.81,
    "close": 39.05,
    "volume": 546404.0,
    "trade_count": 7449.0,
    "vwap": 38.904545,
    "symbol": "ACT"
  },
  // ... more records
];
```

## 🔄 Updating Your Data

### Using Alpaca API

```python
import json
from alpaca.data import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime, timedelta

# Initialize client
client = StockHistoricalDataClient('YOUR_API_KEY', 'YOUR_SECRET_KEY')

# Define request
request_params = StockBarsRequest(
    symbol_or_symbols=['NVDA', 'AAPL', 'MSFT'],
    timeframe=TimeFrame.Day,
    start=datetime.now() - timedelta(days=30)
)

# Get data
bars = client.get_stock_bars(request_params)

# Convert to JSON format
# Save to data.js
```

## 🎯 Use Cases

- **Day Traders**: Monitor positions and set tight loss alerts
- **Long-term Investors**: Track portfolio performance over time
- **Budget-Conscious**: Enforce daily spending limits
- **Risk Management**: Get alerted to significant price movements

## 🛠️ Technology Stack

- **React 18**: UI framework
- **Recharts**: Chart visualization library
- **Babel**: JavaScript transpilation
- **CSS3**: Modern styling with gradients and animations
- **Alpaca Markets**: Market data source

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Demo**: [Your GitHub Pages URL]
- **GitHub Repo**: https://github.com/rodrivero2016-collab/investment-tracker
- **Alpaca Markets**: https://alpaca.markets/

## 💡 Tips

- **Refresh Data**: Update `data.js` with fresh market data regularly
- **Customize Colors**: Edit the `COLORS` array in `app.js` for different chart colors
- **Mobile Use**: App is fully responsive - access from your phone!
- **Export Data**: Use browser dev tools to export your portfolio configuration

## ⚠️ Disclaimer

This tool is for educational and informational purposes only. It does not provide investment advice. Always do your own research and consult with a financial advisor before making investment decisions.

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ for smarter investing**
