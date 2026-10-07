import { useState } from "react";

const API_URL = "http://localhost:5000/api/transactions";

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
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState("");
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setDescription("");
    setAmount("");
    setType("income");
    setCategory("Other");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  }

  async function addOrUpdateTransaction() {
    const trimmedDescription = description.trim();
    const numericAmount = Number(amount);

    if (!trimmedDescription || numericAmount <= 0 || !date) {
      alert("Please enter a valid description, amount and date.");
      return;
    }

    try {
      const transactionData = {
        type,
        amount: numericAmount,
        description: trimmedDescription,
        category,
        date,
      };

      // UPDATE
      if (editingId !== null) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to update transaction."
          );
        }

        const updatedTransaction = {
          ...data.transaction,
          id: data.transaction._id,
          type: data.transaction.type.toLowerCase(),
          date: data.transaction.date
            ? data.transaction.date.split("T")[0]
            : date,
        };

        setTransactions((previousTransactions) =>
          previousTransactions.map((transaction) =>
            String(transaction._id || transaction.id) ===
            String(editingId)
              ? updatedTransaction
              : transaction
          )
        );
      }

      // ADD
      else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to save transaction."
          );
        }

        const savedTransaction = {
          ...data.transaction,
          id: data.transaction._id,
          type: data.transaction.type.toLowerCase(),
          date: data.transaction.date
            ? data.transaction.date.split("T")[0]
            : date,
        };

        setTransactions((previousTransactions) => [
          ...previousTransactions,
          savedTransaction,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error("Transaction error:", error);
      alert(
        error.message ||
          "Could not save the transaction. Please try again."
      );
    }
  }

  function editTransaction(transaction) {
    setDescription(transaction.description);
    setAmount(String(transaction.amount));

    setType(
      transaction.type.toLowerCase() === "income"
        ? "income"
        : "expense"
    );

    setCategory(transaction.category || "Other");

    setDate(
      transaction.date
        ? transaction.date.split("T")[0]
        : new Date().toISOString().split("T")[0]
    );

    setEditingId(transaction._id || transaction.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteTransaction(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this transaction?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete transaction."
        );
      }

      setTransactions((previousTransactions) =>
        previousTransactions.filter(
          (transaction) =>
            String(transaction._id || transaction.id) !==
            String(id)
        )
      );

      if (String(editingId) === String(id)) {
        resetForm();
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        error.message ||
          "Could not delete the transaction. Please try again."
      );
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const transactionType =
        transaction.type.toLowerCase();

      const matchesType =
        filterType === "all" ||
        transactionType === filterType;

      const matchesCategory =
        filterCategory === "All" ||
        (transaction.category || "Other") === filterCategory;

      const transactionDate = transaction.date
        ? transaction.date.split("T")[0]
        : "";

      const matchesMonth =
        !filterMonth ||
        transactionDate.startsWith(filterMonth);

      return (
        matchesType &&
        matchesCategory &&
        matchesMonth
      );
    }
  );

  const totalIncome = filteredTransactions
    .filter(
      (transaction) =>
        transaction.type.toLowerCase() === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const totalExpenses = filteredTransactions
    .filter(
      (transaction) =>
        transaction.type.toLowerCase() === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const balance = totalIncome - totalExpenses;

  const maxTotal = Math.max(
    totalIncome,
    totalExpenses
  );

  return (
    <section className="tracker card">
      <div className="section-heading">
        <div>
          <span className="section-label">
            MONEY MANAGEMENT
          </span>

          <h2>Income &amp; Expense Tracker</h2>

          <p>
            Track your income, expenses, categories and
            monthly spending.
          </p>
        </div>
      </div>

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
            <option value="income">Income</option>
            <option value="expense">Expense</option>
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
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
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
              <option value="All">
                All Categories
              </option>

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
              setFilterType("all");
              setFilterCategory("All");
              setFilterMonth("");
            }}
          >
            Clear Filters
          </button>
        </div>

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
            {filteredTransactions.map(
              (transaction) => {
                const transactionId =
                  transaction._id || transaction.id;

                const transactionType =
                  transaction.type.toLowerCase();

                const transactionDate =
                  transaction.date
                    ? transaction.date.split("T")[0]
                    : "No date";

                return (
                  <div
                    className={`transaction-item ${
                      transactionType === "income"
                        ? "income-item"
                        : "expense-item"
                    }`}
                    key={transactionId}
                  >
                    <div className="transaction-info">
                      <div className="transaction-icon">
                        {transactionType === "income"
                          ? "↑"
                          : "↓"}
                      </div>

                      <div>
                        <strong>
                          {transaction.description}
                        </strong>

                        <span>
                          {transactionType === "income"
                            ? "Income"
                            : "Expense"}{" "}
                          •{" "}
                          {transaction.category ||
                            "Other"}{" "}
                          • {transactionDate}
                        </span>
                      </div>
                    </div>

                    <div className="transaction-right">
                      <strong>
                        {transactionType === "income"
                          ? "+"
                          : "-"}
                        ₹
                        {Number(
                          transaction.amount || 0
                        ).toLocaleString("en-IN")}
                      </strong>

                      <div>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            editTransaction(
                              transaction
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deleteTransaction(
                              transactionId
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

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
                        ? (totalIncome / maxTotal) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="comparison-item">
              <div className="comparison-label">
                <span>Expenses</span>

                <strong>
                  ₹
                  {totalExpenses.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="comparison-bar-background">
                <div
                  className="comparison-bar expense-bar"
                  style={{
                    width: `${
                      maxTotal > 0
                        ? (totalExpenses /
                            maxTotal) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TransactionTracker;