import API_BASE_URL from "../api";
import { useCallback, useEffect, useMemo, useState } from "react";

const API = `${API_BASE_URL}/api`;

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const safeAmount = (amount) => Math.max(0, Number(amount) || 0);

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

      setInvestments(
        Array.isArray(investmentData.investments)
          ? investmentData.investments
          : []
      );

      setAssets(
        Array.isArray(assetData.assets) ? assetData.assets : []
      );

      setTransactions(
        Array.isArray(transactionData.transactions)
          ? transactionData.transactions
          : []
      );
    } catch (err) {
      setError(`${err.message} Check that the backend is running.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter(
          (item) => String(item.type || "").toLowerCase() === "income"
        )
        .reduce((total, item) => total + safeAmount(item.amount), 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter(
          (item) => String(item.type || "").toLowerCase() === "expense"
        )
        .reduce((total, item) => total + safeAmount(item.amount), 0),
    [transactions]
  );

  // Net cash flow is not a verified bank or savings balance.
  const netCashFlow = totalIncome - totalExpenses;

  const totalInvestments = useMemo(
    () =>
      investments.reduce(
        (total, item) => total + safeAmount(item.amount),
        0
      ),
    [investments]
  );

  const totalAssets = useMemo(
    () =>
      assets.reduce(
        (total, item) => total + safeAmount(item.amount),
        0
      ),
    [assets]
  );

  // Asset entries should exclude cash and investments already counted.
  const estimatedNetWorth = netCashFlow + totalInvestments + totalAssets;

  const totalRecordedWealth =
    totalInvestments + totalAssets;

  const investmentShare =
    totalRecordedWealth > 0
      ? (totalInvestments / totalRecordedWealth) * 100
      : 0;

  const assetShare =
    totalRecordedWealth > 0
      ? (totalAssets / totalRecordedWealth) * 100
      : 0;

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
    const name = isInvestment
      ? investmentName.trim()
      : assetName.trim();

    const type = isInvestment
      ? investmentType.trim()
      : assetType.trim();

    const amountText = isInvestment
      ? investmentAmount
      : assetAmount;

    const amount = Number(amountText);

    const editing = isInvestment
      ? editingInvestment
      : editingAsset;

    if (
      !name ||
      !type ||
      !amountText ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError("Enter a name, type, and amount greater than zero.");
      return;
    }

    const endpoint = isInvestment ? "investments" : "assets";

    const url = editing
      ? `${API}/${endpoint}/${editing._id}`
      : `${API}/${endpoint}`;

    setSaving(true);

    try {
      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
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

  const startEditingInvestment = (item) => {
    setEditingInvestment(item);
    setInvestmentName(item.name || "");
    setInvestmentType(item.type || "");
    setInvestmentAmount(String(item.amount ?? ""));
    setError("");
  };

  const startEditingAsset = (item) => {
    setEditingAsset(item);
    setAssetName(item.name || "");
    setAssetType(item.type || "");
    setAssetAmount(String(item.amount ?? ""));
    setError("");
  };

  if (loading) {
    return (
      <main className="page-container wealth-page">
        <div className="wealth-loading">
          <span className="wealth-loading-ring" />
          <h1>Wealth Analytics</h1>
          <p>Gathering your financial overview...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container wealth-page">
      {/* Page heading */}
      <header className="wealth-hero">
        <div>
          <span className="section-label">YOUR MONEY, YOUR PROGRESS</span>
          <h1>Wealth Analytics<span>.</span></h1>
          <p>
            Understand your cash flow, investments, and recorded assets
            in one place.
          </p>
        </div>

        <button
          type="button"
          className="wealth-refresh"
          onClick={loadData}
          disabled={loading}
        >
          ↻ Refresh data
        </button>
      </header>

      {error && (
        <div className="wealth-message" role="alert">
          <span>!</span>
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      {/* Summary */}
      <section className="wealth-summary-grid">
        <article className="wealth-summary-card wealth-summary-featured">
          <div className="wealth-summary-top">
            <span>ESTIMATED NET WORTH</span>
            <span className="wealth-summary-symbol">₹</span>
          </div>

          <strong className="wealth-summary-value">
            {money(estimatedNetWorth)}
          </strong>

          <p>Based on recorded cash flow, investments, and assets</p>
        </article>

        <article className="wealth-summary-card">
          <div className="wealth-summary-top">
            <span>NET CASH FLOW</span>
            <span className="wealth-mini-symbol">↗</span>
          </div>

          <strong
            className={
              netCashFlow < 0
                ? "wealth-negative"
                : "wealth-positive"
            }
          >
            {money(netCashFlow)}
          </strong>

          <p>Income minus recorded expenses</p>
        </article>

        <article className="wealth-summary-card">
          <div className="wealth-summary-top">
            <span>INVESTMENTS</span>
            <span className="wealth-mini-symbol">◈</span>
          </div>

          <strong>{money(totalInvestments)}</strong>
          <p>{investments.length} recorded investment(s)</p>
        </article>

        <article className="wealth-summary-card">
          <div className="wealth-summary-top">
            <span>OTHER ASSETS</span>
            <span className="wealth-mini-symbol">◇</span>
          </div>

          <strong>{money(totalAssets)}</strong>
          <p>{assets.length} recorded asset(s)</p>
        </article>
      </section>

      {/* Visual overview */}
      <section className="wealth-section wealth-visual-section">
        <div className="wealth-section-heading">
          <div>
            <span className="section-label">YOUR PORTFOLIO</span>
            <h2>Wealth composition</h2>
            <p>See how your recorded investments and assets compare.</p>
          </div>
        </div>

        {totalRecordedWealth === 0 ? (
          <div className="wealth-empty">
            <span>◌</span>
            <h3>Your portfolio starts here</h3>
            <p>
              Add an investment or asset to see your wealth composition.
            </p>
          </div>
        ) : (
          <div className="wealth-composition">
            <div
              className="wealth-composition-ring"
              style={{
                background: `conic-gradient(
                  #D9A6A0 0% ${investmentShare}%,
                  #9F233A ${investmentShare}% 100%
                )`,
              }}
              role="img"
              aria-label={`Investments ${investmentShare.toFixed(0)} percent, assets ${assetShare.toFixed(0)} percent`}
            >
              <div className="wealth-ring-center">
                <span>RECORDED TOTAL</span>
                <strong>{money(totalRecordedWealth)}</strong>
              </div>
            </div>

            <div className="wealth-composition-details">
              <div className="wealth-composition-row">
                <span className="wealth-legend-dot investment-dot" />
                <div>
                  <strong>Investments</strong>
                  <small>{investmentShare.toFixed(1)}% of recorded total</small>
                </div>
                <b>{money(totalInvestments)}</b>
              </div>

              <div className="wealth-composition-row">
                <span className="wealth-legend-dot asset-dot" />
                <div>
                  <strong>Other assets</strong>
                  <small>{assetShare.toFixed(1)}% of recorded total</small>
                </div>
                <b>{money(totalAssets)}</b>
              </div>

              <p className="wealth-note">
                This view excludes net cash flow to avoid presenting it as
                a verified cash balance. Ensure asset entries do not
                duplicate investments.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Investments */}
      <section className="wealth-section">
        <div className="wealth-section-heading">
          <div>
            <span className="section-label">GROW YOUR PORTFOLIO</span>
            <h2>{editingInvestment ? "Edit investment" : "Investments"}</h2>
            <p>
              Record investments and maintain their current recorded values.
            </p>
          </div>

          <span className="wealth-count">{investments.length} records</span>
        </div>

        <form
          className="wealth-form"
          onSubmit={(event) => saveRecord(event, "investment")}
        >
          <label>
            Investment name
            <input
              required
              maxLength={100}
              placeholder="e.g. Mutual fund"
              value={investmentName}
              onChange={(event) => setInvestmentName(event.target.value)}
            />
          </label>

          <label>
            Investment type
            <input
              required
              maxLength={100}
              placeholder="e.g. Equity, FD"
              value={investmentType}
              onChange={(event) => setInvestmentType(event.target.value)}
            />
          </label>

          <label>
            Amount (₹)
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              placeholder="Enter amount"
              value={investmentAmount}
              onChange={(event) => setInvestmentAmount(event.target.value)}
            />
          </label>

          <div className="wealth-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingInvestment
                  ? "Update investment"
                  : "＋ Add investment"}
            </button>

            {editingInvestment && (
              <button
                type="button"
                className="wealth-cancel-button"
                onClick={resetInvestmentForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="wealth-record-list">
          {investments.length === 0 ? (
            <div className="wealth-empty wealth-empty-compact">
              <span>◈</span>
              <h3>No investments yet</h3>
              <p>Your added investments will appear here.</p>
            </div>
          ) : (
            investments.map((item) => (
              <article className="wealth-record" key={item._id}>
                <div className="wealth-record-icon investment-record-icon">
                  ◈
                </div>

                <div className="wealth-record-info">
                  <strong>{item.name}</strong>
                  <span>{item.type}</span>
                </div>

                <strong className="wealth-record-amount">
                  {money(item.amount)}
                </strong>

                <div className="wealth-record-actions">
                  <button
                    type="button"
                    onClick={() => startEditingInvestment(item)}
                    aria-label={`Edit ${item.name}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="wealth-delete-button"
                    onClick={() => deleteRecord("investment", item._id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Assets */}
      <section className="wealth-section">
        <div className="wealth-section-heading">
          <div>
            <span className="section-label">WHAT YOU OWN</span>
            <h2>{editingAsset ? "Edit asset" : "Other assets"}</h2>
            <p>
              Record assets that are not already included in your investments
              or cash flow.
            </p>
          </div>

          <span className="wealth-count">{assets.length} records</span>
        </div>

        <form
          className="wealth-form"
          onSubmit={(event) => saveRecord(event, "asset")}
        >
          <label>
            Asset name
            <input
              required
              maxLength={100}
              placeholder="e.g. Gold, property"
              value={assetName}
              onChange={(event) => setAssetName(event.target.value)}
            />
          </label>

          <label>
            Asset type
            <input
              required
              maxLength={100}
              placeholder="e.g. Gold, property"
              value={assetType}
              onChange={(event) => setAssetType(event.target.value)}
            />
          </label>

          <label>
            Amount (₹)
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              placeholder="Enter amount"
              value={assetAmount}
              onChange={(event) => setAssetAmount(event.target.value)}
            />
          </label>

          <div className="wealth-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingAsset
                  ? "Update asset"
                  : "＋ Add asset"}
            </button>

            {editingAsset && (
              <button
                type="button"
                className="wealth-cancel-button"
                onClick={resetAssetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="wealth-record-list">
          {assets.length === 0 ? (
            <div className="wealth-empty wealth-empty-compact">
              <span>◇</span>
              <h3>No other assets yet</h3>
              <p>Your added assets will appear here.</p>
            </div>
          ) : (
            assets.map((item) => (
              <article className="wealth-record" key={item._id}>
                <div className="wealth-record-icon asset-record-icon">
                  ◇
                </div>

                <div className="wealth-record-info">
                  <strong>{item.name}</strong>
                  <span>{item.type}</span>
                </div>

                <strong className="wealth-record-amount">
                  {money(item.amount)}
                </strong>

                <div className="wealth-record-actions">
                  <button
                    type="button"
                    onClick={() => startEditingAsset(item)}
                    aria-label={`Edit ${item.name}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="wealth-delete-button"
                    onClick={() => deleteRecord("asset", item._id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Cash flow details */}
      <section className="wealth-section wealth-cashflow-section">
        <div className="wealth-section-heading">
          <div>
            <span className="section-label">INCOME & SPENDING</span>
            <h2>Cash flow snapshot</h2>
            <p>Totals from the transactions currently recorded in your app.</p>
          </div>
        </div>

        <div className="wealth-cashflow-grid">
          <div>
            <span>Income</span>
            <strong className="wealth-positive">{money(totalIncome)}</strong>
          </div>

          <div>
            <span>Expenses</span>
            <strong className="wealth-negative">{money(totalExpenses)}</strong>
          </div>

          <div>
            <span>Net cash flow</span>
            <strong className={netCashFlow < 0 ? "wealth-negative" : "wealth-positive"}>
              {money(netCashFlow)}
            </strong>
          </div>
        </div>

        <p className="wealth-note">
          Net cash flow is calculated from all recorded transactions, not from
          a selected month or verified bank balance. Historical wealth growth
          is not displayed because historical asset valuations are not stored.
        </p>
      </section>
    </main>
  );
}

export default WealthAnalytics;
