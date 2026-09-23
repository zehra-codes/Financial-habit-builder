import { useState } from "react";

function TransactionTracker({ transactions, setTransactions }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");

  function addTransaction() {
    const trimmedDescription = description.trim();
    const numericAmount = Number(amount);

    if (!trimmedDescription || numericAmount <= 0) {
      alert("Please enter a valid description and amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description: trimmedDescription,
      amount: numericAmount,
      type: type,
    };

    setTransactions([...transactions, newTransaction]);

    setDescription("");
    setAmount("");
  }

  function deleteTransaction(id) {
    setTransactions(
      transactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  }

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const balance = totalIncome - totalExpenses;

  return (
    <section className="tracker card">

      {/* Header */}
      <div className="section-heading">
        <div>
          <span className="section-label">
            MONEY MANAGEMENT
          </span>

          <h2>Income & Expense Tracker</h2>

          <p>
            Add your transactions and keep an eye on your spending.
          </p>
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
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label>Amount</label>

          <div className="input-wrapper">
            <span>₹</span>

            <input
              type="number"
              min="1"
              value={amount}
              placeholder="5000"
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </div>
        </div>

        <div className="input-group">
          <label>Type</label>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={addTransaction}
        >
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

            <p>
              Add your first income or expense above.
            </p>
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
                    {transaction.type === "Income"
                      ? "↑"
                      : "↓"}
                  </div>

                  <div>
                    <strong>
                      {transaction.description}
                    </strong>

                    <span>
                      {transaction.type}
                    </span>
                  </div>

                </div>

                <div className="transaction-right">

                  <strong>
                    {transaction.type === "Income"
                      ? "+"
                      : "-"}
                    ₹
                    {transaction.amount.toLocaleString("en-IN")}
                  </strong>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      deleteTransaction(transaction.id)
                    }
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

          <strong>
            ₹{totalIncome.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="total-box expense-box">
          <span>Total Expenses</span>

          <strong>
            ₹{totalExpenses.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="total-box balance-box">
          <span>Balance</span>

          <strong>
            ₹{balance.toLocaleString("en-IN")}
          </strong>
        </div>

      </div>

      {/* Income vs Expense Chart */}
      <div className="chart-section">

        <div className="sub-heading">

          <div>
            <h3>Income vs Expenses</h3>

            <p>
              Compare your total income and spending.
            </p>
          </div>

        </div>

        {transactions.length === 0 ? (

          <div className="chart-empty">
            Add transactions to see your income and expenses.
          </div>

        ) : (

          <div className="comparison-chart">

            <div className="comparison-item">

              <div className="comparison-label">
                <span>Income</span>

                <strong>
                  ₹{totalIncome.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="comparison-bar-background">

                <div
                  className="comparison-bar income-bar"
                  style={{
                    width: `${
                      Math.max(
                        totalIncome,
                        totalExpenses
                      ) > 0
                        ? (totalIncome /
                            Math.max(
                              totalIncome,
                              totalExpenses
                            )) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>

              </div>

            </div>

            <div className="comparison-item">

              <div className="comparison-label">
                <span>Expenses</span>

                <strong>
                  ₹{totalExpenses.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="comparison-bar-background">

                <div
                  className="comparison-bar expense-bar"
                  style={{
                    width: `${
                      Math.max(
                        totalIncome,
                        totalExpenses
                      ) > 0
                        ? (totalExpenses /
                            Math.max(
                              totalIncome,
                              totalExpenses
                            )) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        )}

      </div>

    </section>
  );
}

export default TransactionTracker;