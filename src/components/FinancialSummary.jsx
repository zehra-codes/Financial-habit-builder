function FinancialSummary({ income, expenses, transactions }) {
  const transactionIncome = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const transactionExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  // Use transaction totals when transactions exist.
  // Otherwise use the manually entered financial data.
  const hasTransactions = transactions.length > 0;

  const totalIncome = hasTransactions
    ? transactionIncome
    : income;

  const totalExpenses = hasTransactions
    ? transactionExpenses
    : expenses;

  const savings = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? (savings / totalIncome) * 100
      : 0;

  return (
    <section className="financial-summary card">

      <div className="section-heading">
        <div>
          <span className="section-label">
            OVERVIEW
          </span>

          <h2>Financial Summary</h2>

          <p>
            Your current financial position at a glance.
          </p>
        </div>
      </div>

      <div className="summary-grid">

        {/* Income */}
        <div className="summary-card income-summary">

          <div className="summary-card-top">
            <span className="summary-label">
              INCOME
            </span>

            <span className="summary-icon">
              ↑
            </span>
          </div>

          <h3>
            ₹{totalIncome.toLocaleString("en-IN")}
          </h3>

          <p>
            Total income
          </p>

        </div>

        {/* Expenses */}
        <div className="summary-card expense-summary">

          <div className="summary-card-top">
            <span className="summary-label">
              EXPENSES
            </span>

            <span className="summary-icon">
              ↓
            </span>
          </div>

          <h3>
            ₹{totalExpenses.toLocaleString("en-IN")}
          </h3>

          <p>
            Total spending
          </p>

        </div>

        {/* Savings */}
        <div className="summary-card savings-summary">

          <div className="summary-card-top">
            <span className="summary-label">
              SAVINGS
            </span>

            <span className="summary-icon">
              ₹
            </span>
          </div>

          <h3>
            ₹{savings.toLocaleString("en-IN")}
          </h3>

          <p>
            Income minus expenses
          </p>

        </div>

        {/* Savings Rate */}
        <div className="summary-card rate-summary">

          <div className="summary-card-top">
            <span className="summary-label">
              SAVINGS RATE
            </span>

            <span className="summary-icon">
              %
            </span>
          </div>

          <h3>
            {savingsRate.toFixed(1)}%
          </h3>

          <p>
            Percentage of income saved
          </p>

        </div>

      </div>

    </section>
  );
}

export default FinancialSummary;