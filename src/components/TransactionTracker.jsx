import { useState } from "react";

function TransactionTracker() {
  const [transactions, setTransactions] = useState([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");

  const addTransaction = () => {
    if (description.trim() === "" || amount === "" || Number(amount) <= 0) {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: Number(amount),
      type: type,
    };

    setTransactions([...transactions, newTransaction]);

    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  const highestAmount =
    transactions.length > 0
      ? Math.max(...transactions.map((transaction) => transaction.amount))
      : 0;

  return (
    <section className="tracker card">
      {/* Header */}
      <div className="section-heading">
        <div>
          <span className="section-label">MONEY MANAGEMENT</span>
          <h2>Income & Expense Tracker</h2>
          <p>Add your transactions and keep an eye on your spending.</p>
        </div>
      </div>

      {/* Transaction Form */}
      <div className="transaction-form">
        <div className="input-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            placeholder="e.g. Salary, Grocery, Rent"
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Amount</label>

          <div className="input-wrapper">
            <span>₹</span>

            <input
              type="number"
              value={amount}
              placeholder="5000"
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Type</label>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <button className="primary-button" onClick={addTransaction}>
          + Add Transaction
        </button>
      </div>

      {/* Transactions */}
      <div className="transactions-section">
        <div className="sub-heading">
          <div>
            <h3>Transactions</h3>
            <p>Your recent financial activity.</p>
          </div>

          <span className="transaction-count">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">₹</div>
            <h4>No transactions yet</h4>
            <p>Add your first income or expense above.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div
                className={`transaction-item ${
                  transaction.type === "Income"
                    ? "income-item"
                    : "expense-item"
                }`}
                key={transaction.id}
              >
                <div className="transaction-info">
                  <div className="transaction-icon">
                    {transaction.type === "Income" ? "↑" : "↓"}
                  </div>

                  <div>
                    <strong>{transaction.description}</strong>
                    <span>{transaction.type}</span>
                  </div>
                </div>

                <div className="transaction-right">
                  <strong>
                    {transaction.type === "Income" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="delete-button"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Totals */}
      <div className="totals-section">
        <div className="total-box income-box">
          <span>Total Income</span>
          <strong>₹{totalIncome.toLocaleString("en-IN")}</strong>
        </div>

        <div className="total-box expense-box">
          <span>Total Expenses</span>
          <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
        </div>

        <div className="total-box balance-box">
          <span>Balance</span>
          <strong>₹{balance.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      {/* Bar Graph */}
      <div className="chart-section">
        <div className="sub-heading">
          <div>
            <h3>Transaction Trend</h3>
            <p>
              See how large your income and expenses are compared with each
              other.
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="chart-empty">
            Add transactions to see your financial trend.
          </div>
        ) : (
          <div className="chart">
            {transactions.map((transaction) => {
              const barHeight =
                highestAmount > 0
                  ? Math.max((transaction.amount / highestAmount) * 100, 8)
                  : 8;

              return (
                <div className="bar-column" key={transaction.id}>
                  <div className="bar-value">
                    ₹{transaction.amount.toLocaleString("en-IN")}
                  </div>

                  <div className="bar-area">
                    <div
                      className={`bar ${
                        transaction.type === "Income"
                          ? "income-bar"
                          : "expense-bar"
                      }`}
                      style={{ height: `${barHeight}%` }}
                    ></div>
                  </div>

                  <span className="bar-label">
                    {transaction.description}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default TransactionTracker;