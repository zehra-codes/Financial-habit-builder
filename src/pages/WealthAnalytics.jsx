import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function WealthAnalytics() {
  const savings = 25000;

  const [investments, setInvestments] = useState([
    {
      id: 1,
      name: "Monthly SIP",
      type: "Mutual Fund",
      amount: 10000,
    },
  ]);

  const [assets, setAssets] = useState([
    {
      id: 1,
      name: "Savings Account",
      type: "Cash",
      amount: 50000,
    },
  ]);

  const [investmentName, setInvestmentName] = useState("");
  const [investmentType, setInvestmentType] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");

  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetAmount, setAssetAmount] = useState("");

  const totalInvestments = investments.reduce(
    (total, investment) => total + investment.amount,
    0
  );

  const totalAssets = assets.reduce(
    (total, asset) => total + asset.amount,
    0
  );

  const netWorth = savings + totalInvestments + totalAssets;

  const wealthGrowthData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Estimated Net Worth",
        data: [50000, 60000, 70000, 85000, 100000, netWorth],
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const wealthGrowthOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Net Worth Growth",
      },
    },
  };

  const addInvestment = (event) => {
    event.preventDefault();

    if (!investmentName || !investmentType || !investmentAmount) {
      return;
    }

    const newInvestment = {
      id: Date.now(),
      name: investmentName,
      type: investmentType,
      amount: Number(investmentAmount),
    };

    setInvestments([...investments, newInvestment]);

    setInvestmentName("");
    setInvestmentType("");
    setInvestmentAmount("");
  };

  const addAsset = (event) => {
    event.preventDefault();

    if (!assetName || !assetType || !assetAmount) {
      return;
    }

    const newAsset = {
      id: Date.now(),
      name: assetName,
      type: assetType,
      amount: Number(assetAmount),
    };

    setAssets([...assets, newAsset]);

    setAssetName("");
    setAssetType("");
    setAssetAmount("");
  };

  return (
    <div className="page-container">
      <h1>Wealth Analytics</h1>

      <p>
        Track your savings, investments, assets, and overall wealth growth.
      </p>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Savings</h3>
          <p>₹{savings.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Investments</h3>
          <p>₹{totalInvestments.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Assets</h3>
          <p>₹{totalAssets.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Estimated Net Worth</h3>
          <p>₹{netWorth.toLocaleString()}</p>
        </div>
      </div>

      <div className="wealth-section">
        <h2>Add Investment</h2>

        <form onSubmit={addInvestment}>
          <input
            type="text"
            placeholder="Investment name"
            value={investmentName}
            onChange={(event) => setInvestmentName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Investment type"
            value={investmentType}
            onChange={(event) => setInvestmentType(event.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={investmentAmount}
            onChange={(event) => setInvestmentAmount(event.target.value)}
          />

          <button type="submit">Add Investment</button>
        </form>
      </div>

      <div className="wealth-section">
        <h2>Investments</h2>

        {investments.map((investment) => (
          <div key={investment.id}>
            <strong>{investment.name}</strong>
            <p>
              {investment.type} — ₹{investment.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="wealth-section">
        <h2>Add Asset</h2>

        <form onSubmit={addAsset}>
          <input
            type="text"
            placeholder="Asset name"
            value={assetName}
            onChange={(event) => setAssetName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Asset type"
            value={assetType}
            onChange={(event) => setAssetType(event.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={assetAmount}
            onChange={(event) => setAssetAmount(event.target.value)}
          />

          <button type="submit">Add Asset</button>
        </form>
      </div>

      <div className="wealth-section">
        <h2>Assets</h2>

        {assets.map((asset) => (
          <div key={asset.id}>
            <strong>{asset.name}</strong>
            <p>
              {asset.type} — ₹{asset.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="wealth-section">
        <h2>Wealth Growth</h2>

        <p>
          Your current estimated net worth is ₹
          {netWorth.toLocaleString()}.
        </p>

        <Line
          data={wealthGrowthData}
          options={wealthGrowthOptions}
        />
      </div>
    </div>
  );
}

export default WealthAnalytics;