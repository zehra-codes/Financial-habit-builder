function WealthAnalytics() {
  const savings = 25000;
  const investments = 10000;
  const assets = 50000;

  const netWorth = savings + investments + assets;

  return (
    <div className="page-container">
      <h1>Wealth Analytics</h1>
      <p>Track your savings, investments, assets, and overall wealth growth.</p>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Savings</h3>
          <p>₹{savings.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Investments</h3>
          <p>₹{investments.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Assets</h3>
          <p>₹{assets.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Estimated Net Worth</h3>
          <p>₹{netWorth.toLocaleString()}</p>
        </div>
      </div>

      <div className="wealth-section">
        <h2>Wealth Growth</h2>
        <p>
          Your current estimated net worth is ₹
          {netWorth.toLocaleString()}.
        </p>
      </div>
    </div>
  );
}

export default WealthAnalytics;