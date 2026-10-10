
import { useCallback, useEffect, useMemo, useState } from "react";
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

const API = "http://localhost:5000/api";

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function WealthAnalytics() {
  const [investments, setInvestments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [investmentName, setInvestmentName] = useState("");
  const [investmentType, setInvestmentType] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [editingInvestment, setEditingInvestment] = useState(null);

  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetAmount, setAssetAmount] = useState("");
  const [editingAsset, setEditingAsset] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const responses = await Promise.all([
        fetch(`${API}/investments`),
        fetch(`${API}/assets`),
        fetch(`${API}/transactions`),
      ]);

      if (responses.some((response) => !response.ok)) {
        throw new Error("Could not load all financial data.");
      }

      const [investmentData, assetData, transactionData] =
        await Promise.all(responses.map((response) => response.json()));

      setInvestments(investmentData.investments || []);
      setAssets(assetData.assets || []);
      setTransactions(transactionData.transactions || []);
    } catch (err) {
      setError(`${err.message} Check that the backend is running.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  // This is net cash flow, not a verified bank balance or savings balance.
  const estimatedSavings = totalIncome - totalExpenses;

  const totalInvestments = investments.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const totalAssets = assets.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  // Avoid double-counting: asset entries should exclude cash already
  // represented by estimated savings and investments.
  const netWorth = estimatedSavings + totalInvestments + totalAssets;

  const resetInvestmentForm = () => {
    setInvestmentName("");
    setInvestmentType("");
    setInvestmentAmount("");
    setEditingInvestment(null);
  };

  const resetAssetForm = () => {
    setAssetName("");
    setAssetType("");
    setAssetAmount("");
    setEditingAsset(null);
  };

  const saveRecord = async (event, kind) => {
    event.preventDefault();
    setError("");

    const isInvestment = kind === "investment";
    const name = isInvestment ? investmentName.trim() : assetName.trim();
    const type = isInvestment ? investmentType.trim() : assetType.trim();
    const amountText = isInvestment ? investmentAmount : assetAmount;
    const amount = Number(amountText);
    const editing = isInvestment ? editingInvestment : editingAsset;

    if (!name || !type || !amountText || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a name, type, and amount greater than zero.");
      return;
    }

    const endpoint = isInvestment ? "investments" : "assets";
    const url = editing
      ? `${API}/${endpoint}/${editing._id}`
      : `${API}/${endpoint}`;
    const method = editing ? "PUT" : "POST";

    setSaving(true);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save the record.");
      }

      if (isInvestment) resetInvestmentForm();
      else resetAssetForm();

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (kind, id) => {
    if (!window.confirm("Delete this record?")) return;

    setError("");
    const endpoint = kind === "investment" ? "investments" : "assets";

    try {
      const response = await fetch(`${API}/${endpoint}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete the record.");
      }

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const chartData = useMemo(() => ({
    labels: ["Current"],
    datasets: [
      {
        label: "Current Estimated Net Worth",
        data: [netWorth],
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  }), [netWorth]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Current Estimated Net Worth" },
      tooltip: {
        callbacks: {
          label: (context) => money(context.raw),
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => money(value),
        },
      },
    },
  };

  if (loading) {
    return <div className="page-container"><h1>Wealth Analytics</h1><p>Loading financial data...</p></div>;
  }

  return (
    <div className="page-container">
      <h1>Wealth Analytics</h1>
      <p>Track your transactions, investments, assets, and estimated wealth.</p>

      {error && (
        <p role="alert" style={{ color: "#ff6b6b" }}>
          {error}
        </p>
      )}

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Net Cash Flow</h3>
          <p>{money(estimatedSavings)}</p>
          <small>Income minus recorded expenses; not a verified savings balance.</small>
        </div>
        <div className="summary-card">
          <h3>Investments</h3>
          <p>{money(totalInvestments)}</p>
        </div>
        <div className="summary-card">
          <h3>Other Assets</h3>
          <p>{money(totalAssets)}</p>
        </div>
        <div className="summary-card">
          <h3>Estimated Net Worth</h3>
          <p>{money(netWorth)}</p>
        </div>
      </div>

      <section className="wealth-section">
        <h2>{editingInvestment ? "Edit Investment" : "Add Investment"}</h2>
        <form onSubmit={(event) => saveRecord(event, "investment")}>
          <input
            required
            maxLength={100}
            placeholder="Investment name"
            value={investmentName}
            onChange={(event) => setInvestmentName(event.target.value)}
          />
          <input
            required
            maxLength={100}
            placeholder="Investment type"
            value={investmentType}
            onChange={(event) => setInvestmentType(event.target.value)}
          />
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            placeholder="Amount (₹)"
            value={investmentAmount}
            onChange={(event) => setInvestmentAmount(event.target.value)}
          />
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingInvestment ? "Update Investment" : "Add Investment"}
          </button>
          {editingInvestment && (
            <button type="button" onClick={resetInvestmentForm}>Cancel</button>
          )}
        </form>
      </section>

      <section className="wealth-section">
        <h2>Investments</h2>
        {investments.length === 0 && <p>No investments added yet.</p>}
        {investments.map((item) => (
          <div key={item._id} className="wealth-record">
            <strong>{item.name}</strong>
            <p>{item.type} — {money(item.amount)}</p>
            <button type="button" onClick={() => {
              setEditingInvestment(item);
              setInvestmentName(item.name);
              setInvestmentType(item.type);
              setInvestmentAmount(String(item.amount));
            }}>Edit</button>{" "}
            <button type="button" onClick={() => deleteRecord("investment", item._id)}>
              Delete
            </button>
          </div>
        ))}
      </section>

      <section className="wealth-section">
        <h2>{editingAsset ? "Edit Asset" : "Add Asset"}</h2>
        <form onSubmit={(event) => saveRecord(event, "asset")}>
          <input
            required
            maxLength={100}
            placeholder="Asset name"
            value={assetName}
            onChange={(event) => setAssetName(event.target.value)}
          />
          <input
            required
            maxLength={100}
            placeholder="Asset type"
            value={assetType}
            onChange={(event) => setAssetType(event.target.value)}
          />
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            placeholder="Amount (₹)"
            value={assetAmount}
            onChange={(event) => setAssetAmount(event.target.value)}
          />
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingAsset ? "Update Asset" : "Add Asset"}
          </button>
          {editingAsset && (
            <button type="button" onClick={resetAssetForm}>Cancel</button>
          )}
        </form>
      </section>

      <section className="wealth-section">
        <h2>Assets</h2>
        {assets.length === 0 && <p>No assets added yet.</p>}
        {assets.map((item) => (
          <div key={item._id} className="wealth-record">
            <strong>{item.name}</strong>
            <p>{item.type} — {money(item.amount)}</p>
            <button type="button" onClick={() => {
              setEditingAsset(item);
              setAssetName(item.name);
              setAssetType(item.type);
              setAssetAmount(String(item.amount));
            }}>Edit</button>{" "}
            <button type="button" onClick={() => deleteRecord("asset", item._id)}>
              Delete
            </button>
          </div>
        ))}
      </section>

      <section className="wealth-section">
        <h2>Wealth Growth</h2>
        <p>Current estimated net worth: {money(netWorth)}</p>
        <Line data={chartData} options={chartOptions} />
        <small>
          Historical records are not available yet, so this chart shows only the current estimate.
        </small>
      </section>

      <button type="button" onClick={loadData}>Refresh Financial Data</button>
    </div>
  );
}

export default WealthAnalytics;
