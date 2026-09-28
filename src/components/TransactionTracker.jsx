import { useState } from "react";

const categories = [
  "Salary",
  "Food",
  "Rent",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Investment",
  "Other",
];

function TransactionTracker({ transactions, setTransactions }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState("");

  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setDescription("");
    setAmount("");
    setType("Income");
    setCategory("Other");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  }

  function addOrUpdateTransaction() {
    const trimmedDescription = description.trim();
    const numericAmount = Number(amount);

    if (!trimmedDescription || numericAmount <= 0 || !date) {
      alert("Please enter a valid description, amount and date.");
      return;
    }

    if (editingId !== null) {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                description: trimmedDescription,
                amount: numericAmount,
                type,
                category,
                date,
              }
            : transaction
        )
      );
    } else {
      const newTransaction = {
        id: Date.now(),
        description: trimmedDescription,
        amount: numericAmount,
        type,
        category,
        date,
      };

      setTransactions([...transactions, newTransaction]);
    }

    resetForm();
  }

  function editTransaction(transaction) {
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category || "Other");
    setDate(
      transaction.date ||
        new Date().toISOString().split("T")[0]
    );
    setEditingId(transaction.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteTransaction(id) {
    setTransactions(
      transactions.filter(
        (transaction) => transaction.id !== id
      )
    );

    if (editingId === id) {
      resetForm();
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const matchesType =
        filterType === "All" ||
        transaction.type === filterType;

      const matchesCategory =
        filterCategory === "All" ||
        (transaction.category || "Other") === filterCategory;

      const matchesMonth =
        !filterMonth ||
        (transaction.date || "").startsWith(filterMonth);

      return (
        matchesType &&
        matchesCategory &&
        matchesMonth
      );
    }
  );

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === "Income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const balance = totalIncome - totalExpenses;

  const maxTotal = Math.max(
    totalIncome,
    totalExpenses
  );

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
            Track your income, expenses, categories and
            monthly spending.
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

        <div className="input-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={addOrUpdateTransaction}
        >
          {editingId !== null
            ? "Update Transaction"
            : "+ Add Transaction"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="delete-button"
            onClick={resetForm}
          >
            Cancel Edit
          </button>
        )}

      </div>

      {/* Filters */}
      <div className="transactions-section">

        <div className="sub-heading">
          <div>
            <h3>Transaction Filters</h3>
            <p>
              Filter your financial activity by type,
              category or month.
            </p>
          </div>
        </div>

        <div className="transaction-form">

          <div className="input-group">
            <label>Type</label>

            <select
              value={filterType}
              onChange={(event) =>
                setFilterType(event.target.value)
              }
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div className="input-group">
            <label>Category</label>

            <select
              value={filterCategory}
              onChange={(event) =>
                setFilterCategory(event.target.value)
              }
            >
              <option value="All">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Month</label>

            <input
              type="month"
              value={filterMonth}
              onChange={(event) =>
                setFilterMonth(event.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="delete-button"
            onClick={() => {
              setFilterType("All");
              setFilterCategory("All");
              setFilterMonth("");
            }}
          >
            Clear Filters
          </button>

        </div>

        {/* Transaction List */}
        <div className="sub-heading">

          <div>
            <h3>Transactions</h3>
            <p>Your financial activity.</p>
          </div>

          <span className="transaction-count">
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        {filteredTransactions.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">₹</div>

            <h4>No transactions found</h4>

            <p>
              Add a transaction or change your filters.
            </p>
          </div>

        ) : (

          <div className="transaction-list">

            {filteredTransactions.map((transaction) => (

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
                      {transaction.type} •{" "}
                      {transaction.category || "Other"} •{" "}
                      {transaction.date || "No date"}
                    </span>
                  </div>

                </div>

                <div className="transaction-right">

                  <strong>
                    {transaction.type === "Income"
                      ? "+"
                      : "-"}
                    ₹
                    {transaction.amount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <div>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        editTransaction(transaction)
                      }
                    >
                      Edit
                    </button>

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

        {filteredTransactions.length === 0 ? (

          <div className="chart-empty">
            Add transactions to see your income and
            expenses.
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
                      maxTotal > 0
                        ? (totalIncome / maxTotal) * 100
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
                      maxTotal > 0
                        ? (totalExpenses / maxTotal) * 100
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