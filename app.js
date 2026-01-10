const { useState, useEffect, useMemo, useCallback } = React;
const { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } = Recharts;

function InvestmentTracker() {
  // State management
  const [stockData, setStockData] = useState({});
  const [portfolio, setPortfolio] = useState([
    { symbol: 'NVDA', shares: 10, purchasePrice: 120.50 },
    { symbol: 'HOG', shares: 50, purchasePrice: 32.00 },
    { symbol: 'SHOP', shares: 20, purchasePrice: 85.00 },
  ]);
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [loading, setLoading] = useState(true);
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [newPosition, setNewPosition] = useState({ symbol: '', shares: '', purchasePrice: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Alert & Threshold Settings
  const [alerts, setAlerts] = useState([]);
  const [dailyBudget, setDailyBudget] = useState(1000);
  const [gainAlertPercent, setGainAlertPercent] = useState(10);
  const [lossAlertPercent, setLossAlertPercent] = useState(-5);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load and process market data
  useEffect(() => {
    try {
      setLoading(true);
      const dataBySymbol = {};
      
      MARKET_DATA.forEach(item => {
        if (!dataBySymbol[item.symbol]) {
          dataBySymbol[item.symbol] = [];
        }
        dataBySymbol[item.symbol].push({
          date: new Date(item.time).toLocaleDateString(),
          timestamp: new Date(item.time).getTime(),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
          vwap: item.vwap
        });
      });
      
      Object.keys(dataBySymbol).forEach(symbol => {
        dataBySymbol[symbol].sort((a, b) => a.timestamp - b.timestamp);
      });
      
      setStockData(dataBySymbol);
      setAvailableSymbols(Object.keys(dataBySymbol).sort());
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }, []);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    if (!stockData || Object.keys(stockData).length === 0) return null;

    let totalValue = 0, totalCost = 0, totalGainLoss = 0;

    const positions = portfolio.map(pos => {
      const symbolData = stockData[pos.symbol];
      if (!symbolData || symbolData.length === 0) {
        return { ...pos, currentPrice: 0, value: 0, gainLoss: 0, gainLossPercent: 0 };
      }

      const latestPrice = symbolData[symbolData.length - 1].close;
      const value = pos.shares * latestPrice;
      const cost = pos.shares * pos.purchasePrice;
      const gainLoss = value - cost;
      const gainLossPercent = ((latestPrice - pos.purchasePrice) / pos.purchasePrice) * 100;

      totalValue += value;
      totalCost += cost;
      totalGainLoss += gainLoss;

      return {
        ...pos,
        currentPrice: latestPrice,
        value,
        cost,
        gainLoss,
        gainLossPercent
      };
    });

    const totalGainLossPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

    return {
      positions,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent
    };
  }, [portfolio, stockData]);

  // Check for alerts
  useEffect(() => {
    if (!portfolioMetrics) return;

    const newAlerts = [];
    portfolioMetrics.positions.forEach(pos => {
      if (pos.gainLossPercent >= gainAlertPercent) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'gain',
          symbol: pos.symbol,
          percent: pos.gainLossPercent,
          message: `${pos.symbol} is up ${pos.gainLossPercent.toFixed(2)}%! 📈`
        });
      }
      if (pos.gainLossPercent <= lossAlertPercent) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'loss',
          symbol: pos.symbol,
          percent: pos.gainLossPercent,
          message: `${pos.symbol} is down ${Math.abs(pos.gainLossPercent).toFixed(2)}%! 📉`
        });
      }
    });

    if (newAlerts.length > 0) {
      setNotifications(prev => [...newAlerts, ...prev].slice(0, 10));
    }
  }, [portfolioMetrics, gainAlertPercent, lossAlertPercent]);

  // Chart data
  const chartData = useMemo(() => {
    if (!stockData[selectedStock]) return [];
    return stockData[selectedStock];
  }, [selectedStock, stockData]);

  const stockPerformance = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    const firstPrice = chartData[0].close;
    const lastPrice = chartData[chartData.length - 1].close;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    return { firstPrice, lastPrice, change, changePercent };
  }, [chartData]);

  // Portfolio actions
  const addPosition = () => {
    if (!newPosition.symbol || !newPosition.shares || !newPosition.purchasePrice) return;
    
    const cost = parseFloat(newPosition.shares) * parseFloat(newPosition.purchasePrice);
    if (cost > dailyBudget) {
      alert(`This purchase ($${cost.toFixed(2)}) exceeds your daily budget ($${dailyBudget.toFixed(2)})`);
      return;
    }

    setPortfolio([...portfolio, {
      symbol: newPosition.symbol.toUpperCase(),
      shares: parseFloat(newPosition.shares),
      purchasePrice: parseFloat(newPosition.purchasePrice)
    }]);
    
    setNewPosition({ symbol: '', shares: '', purchasePrice: '' });
    setShowAddForm(false);

    // Add notification
    setNotifications(prev => [{
      id: Date.now(),
      type: 'info',
      message: `Added ${newPosition.shares} shares of ${newPosition.symbol.toUpperCase()}`
    }, ...prev].slice(0, 10));
  };

  const removePosition = (index) => {
    const pos = portfolio[index];
    setPortfolio(portfolio.filter((_, i) => i !== index));
    setNotifications(prev => [{
      id: Date.now(),
      type: 'info',
      message: `Removed ${pos.symbol} from portfolio`
    }, ...prev].slice(0, 10));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div>Loading market data...</div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="app">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification notification-${notif.type}`}>
            <span>{notif.message}</span>
            <button onClick={() => dismissNotification(notif.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="container">
        {/* Header */}
        <div className="header-card">
          <div>
            <h1>Investment Portfolio Tracker</h1>
            <p>Real-time tracking with alerts & budgets • {availableSymbols.length} symbols</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowSettings(!showSettings)}>
            ⚙️ Settings
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <h2>Alert & Budget Settings</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Daily Budget Limit</label>
                <input
                  type="number"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(parseFloat(e.target.value))}
                  className="input"
                />
                <small>Maximum amount to spend per day</small>
              </div>
              <div className="setting-item">
                <label>Gain Alert Threshold</label>
                <input
                  type="number"
                  value={gainAlertPercent}
                  onChange={(e) => setGainAlertPercent(parseFloat(e.target.value))}
                  className="input"
                />
                <small>Alert when stock gains exceed this %</small>
              </div>
              <div className="setting-item">
                <label>Loss Alert Threshold</label>
                <input
                  type="number"
                  value={lossAlertPercent}
                  onChange={(e) => setLossAlertPercent(parseFloat(e.target.value))}
                  className="input"
                />
                <small>Alert when stock losses exceed this %</small>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Summary */}
        {portfolioMetrics && (
          <div className="metrics-grid">
            <div className="metric-card blue">
              <div className="metric-label">Total Value</div>
              <div className="metric-value">${portfolioMetrics.totalValue.toFixed(2)}</div>
              <div className="metric-footer">Portfolio worth</div>
            </div>
            
            <div className="metric-card purple">
              <div className="metric-label">Total Cost</div>
              <div className="metric-value">${portfolioMetrics.totalCost.toFixed(2)}</div>
              <div className="metric-footer">Amount invested</div>
            </div>
            
            <div className={`metric-card ${portfolioMetrics.totalGainLoss >= 0 ? 'green' : 'red'}`}>
              <div className="metric-label">Total Gain/Loss</div>
              <div className="metric-value">
                {portfolioMetrics.totalGainLoss >= 0 ? '+' : ''}${portfolioMetrics.totalGainLoss.toFixed(2)}
              </div>
              <div className="metric-footer">Net profit/loss</div>
            </div>
            
            <div className={`metric-card ${portfolioMetrics.totalGainLossPercent >= 0 ? 'green' : 'red'}`}>
              <div className="metric-label">Return %</div>
              <div className="metric-value">
                {portfolioMetrics.totalGainLossPercent >= 0 ? '+' : ''}{portfolioMetrics.totalGainLossPercent.toFixed(2)}%
              </div>
              <div className="metric-footer">Total return</div>
            </div>

            <div className="metric-card orange">
              <div className="metric-label">Daily Budget</div>
              <div className="metric-value">${dailyBudget.toFixed(2)}</div>
              <div className="metric-footer">Spending limit</div>
            </div>
          </div>
        )}

        {/* Portfolio Positions */}
        <div className="card">
          <div className="card-header">
            <h2>Your Positions</h2>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              + Add Position
            </button>
          </div>

          {showAddForm && (
            <div className="add-form">
              <select
                value={newPosition.symbol}
                onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value})}
                className="input"
              >
                <option value="">Select Symbol</option>
                {availableSymbols.map(sym => (
                  <option key={sym} value={sym}>{sym}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Shares"
                value={newPosition.shares}
                onChange={(e) => setNewPosition({...newPosition, shares: e.target.value})}
                className="input"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Purchase Price"
                value={newPosition.purchasePrice}
                onChange={(e) => setNewPosition({...newPosition, purchasePrice: e.target.value})}
                className="input"
              />
              <button onClick={addPosition} className="btn btn-success">
                Add
              </button>
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th className="text-right">Shares</th>
                  <th className="text-right">Purchase Price</th>
                  <th className="text-right">Current Price</th>
                  <th className="text-right">Value</th>
                  <th className="text-right">Gain/Loss</th>
                  <th className="text-right">Return %</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolioMetrics?.positions.map((pos, idx) => (
                  <tr key={idx}>
                    <td>
                      <button
                        onClick={() => setSelectedStock(pos.symbol)}
                        className="symbol-btn"
                      >
                        {pos.symbol}
                      </button>
                    </td>
                    <td className="text-right">{pos.shares}</td>
                    <td className="text-right">${pos.purchasePrice.toFixed(2)}</td>
                    <td className="text-right">${pos.currentPrice.toFixed(2)}</td>
                    <td className="text-right">${pos.value.toFixed(2)}</td>
                    <td className={`text-right ${pos.gainLoss >= 0 ? 'text-green' : 'text-red'}`}>
                      {pos.gainLoss >= 0 ? '+' : ''}${pos.gainLoss.toFixed(2)}
                    </td>
                    <td className={`text-right ${pos.gainLossPercent >= 0 ? 'text-green' : 'text-red'}`}>
                      {pos.gainLossPercent >= 0 ? '+' : ''}{pos.gainLossPercent.toFixed(2)}%
                    </td>
                    <td className="text-right">
                      <button onClick={() => removePosition(idx)} className="btn-delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-card large">
            <div className="card-header">
              <h2>{selectedStock} Price Chart</h2>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="input"
              >
                {availableSymbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>
            {stockPerformance && (
              <div className="chart-stats">
                <span>First: ${stockPerformance.firstPrice.toFixed(2)}</span>
                <span>Latest: ${stockPerformance.lastPrice.toFixed(2)}</span>
                <span className={stockPerformance.change >= 0 ? 'text-green' : 'text-red'}>
                  {stockPerformance.change >= 0 ? '+' : ''}${stockPerformance.change.toFixed(2)} 
                  ({stockPerformance.changePercent >= 0 ? '+' : ''}{stockPerformance.changePercent.toFixed(2)}%)
                </span>
              </div>
            )}
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff80" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="close" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClose)" />
                <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} name="High" />
                <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} name="Low" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Portfolio Allocation</h2>
            {portfolioMetrics && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioMetrics.positions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ symbol, value }) => `${symbol}: $${value.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioMetrics.positions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Volume Chart */}
        <div className="card">
          <h2>{selectedStock} Trading Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff80" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#ffffff80" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="volume" fill="#8b5cf6" name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Data provided by Alpaca Markets • {availableSymbols.length} symbols tracked • Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<InvestmentTracker />, document.getElementById('root'));
