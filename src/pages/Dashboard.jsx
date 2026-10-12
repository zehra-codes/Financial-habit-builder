
import { Link } from "react-router-dom";
import Welcome from "../components/Welcome";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getDateKey = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toISOString().slice(0, 10);
};

function Dashboard({
  userName,
  income,
  expenses,
  transactions = [],
}) {
  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  const incomeAmount = Math.max(0, Number(income) || 0);
  const expenseAmount = Math.max(0, Number(expenses) || 0);
  const netBalance = incomeAmount - expenseAmount;
  const totalMoneyFlow = incomeAmount + expenseAmount;

  const overviewCircumference = 2 * Math.PI * 48;

  const incomeArc =
    totalMoneyFlow > 0
      ? (incomeAmount / totalMoneyFlow) * overviewCircumference
      : 0;

  const expenseArc =
    totalMoneyFlow > 0
      ? (expenseAmount / totalMoneyFlow) * overviewCircumference
      : 0;

  const normalizedTransactions = safeTransactions.map(
    (transaction) => ({
      ...transaction,
      normalizedType: String(transaction.type || "").toLowerCase(),
      numericAmount: Number(transaction.amount) || 0,
      dateKey: getDateKey(transaction.date),
    })
  );

  // Expense category totals
  const expenseTransactions = normalizedTransactions.filter(
    (transaction) => transaction.normalizedType === "expense"
  );

  const categoryTotals = Object.values(
    expenseTransactions.reduce((totals, transaction) => {
      const category = transaction.category || "Other";

      if (!totals[category]) {
        totals[category] = {
          name: category,
          amount: 0,
        };
      }

      totals[category].amount += transaction.numericAmount;

      return totals;
    }, {})
  ).sort((a, b) => b.amount - a.amount);

  const categoryColors = [
    "#D9A6A0",
    "#9F233A",
    "#A997C7",
    "#C28C65",
    "#77717F",
  ];

  const totalCategoryExpenses = categoryTotals.reduce(
    (total, category) => total + category.amount,
    0
  );

  const chartCategories = categoryTotals.slice(0, 5);

  const otherCategoryTotal = categoryTotals
    .slice(5)
    .reduce((total, category) => total + category.amount, 0);

  if (otherCategoryTotal > 0) {
    chartCategories.push({
      name: "Other categories",
      amount: otherCategoryTotal,
    });
  }

  const chartSegments = chartCategories.map((category, index) => ({
    ...category,
    color: categoryColors[index % categoryColors.length],
  }));

  const circumference = 2 * Math.PI * 43;
  let donutOffset = 0;

  const donutSegments = chartSegments.map((category) => {
    const length =
      totalCategoryExpenses > 0
        ? (category.amount / totalCategoryExpenses) * circumference
        : 0;

    const segment = {
      ...category,
      length,
      offset: donutOffset,
    };

    donutOffset += length;

    return segment;
  });

  // Recent transactions
  const recentTransactions = [...normalizedTransactions]
    .sort((a, b) => (b.dateKey || "").localeCompare(a.dateKey || ""))
    .slice(0, 5);

  return (
    <main className="dashboard trend-dashboard">
      {/* Welcome */}
      <section className="dashboard-welcome trend-welcome">
        <Welcome
          name={userName}
          income={income}
          expenses={expenses}
        />
      </section>

      {/* Circular financial overview */}
      <section className="trend-overview trend-circular-overview">
        <div className="trend-heading">
          <div>
            <span className="section-label">
              YOUR FINANCIAL STORY
            </span>

            <h1>
              Money in motion<span>.</span>
            </h1>

            <p>
              A clearer view of the money coming in and going out.
            </p>
          </div>

          <div className="trend-balance">
            <span>NET BALANCE</span>

            <strong className={netBalance < 0 ? "negative-balance" : ""}>
              {formatCurrency(netBalance)}
            </strong>

            <small>
              {netBalance >= 0
                ? "You're currently in positive balance"
                : "Your recorded expenses exceed your income"}
            </small>
          </div>
        </div>

        <div className="trend-circular-panel">
          <div className="trend-big-donut">
            <svg
              viewBox="0 0 140 140"
              role="img"
              aria-label="Income and expense overview"
            >
              <circle
                cx="70"
                cy="70"
                r="48"
                fill="none"
                stroke="#383039"
                strokeWidth="13"
              />

              {totalMoneyFlow > 0 && (
                <>
                  <circle
                    cx="70"
                    cy="70"
                    r="48"
                    fill="none"
                    stroke="#D9A6A0"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray={`${incomeArc} ${overviewCircumference - incomeArc}`}
                    transform="rotate(-90 70 70)"
                  />

                  {expenseAmount > 0 && incomeAmount > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r="48"
                      fill="none"
                      stroke="#9F233A"
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeDasharray={`${expenseArc} ${overviewCircumference - expenseArc}`}
                      strokeDashoffset={-incomeArc}
                      transform="rotate(-90 70 70)"
                    />
                  )}

                  {incomeAmount === 0 && expenseAmount > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r="48"
                      fill="none"
                      stroke="#9F233A"
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeDasharray={`${overviewCircumference} 0`}
                      transform="rotate(-90 70 70)"
                    />
                  )}
                </>
              )}

              <text
                x="70"
                y="63"
                textAnchor="middle"
                fill="#B8ADB8"
                fontSize="10"
              >
                TOTAL FLOW
              </text>

              <text
                x="70"
                y="80"
                textAnchor="middle"
                fill="#E9E4E6"
                fontSize={totalMoneyFlow >= 1000000 ? "11" : "13"}
                fontWeight="bold"
              >
                {formatCurrency(totalMoneyFlow)}
              </text>
            </svg>
          </div>

          <div className="trend-circular-stats">
            <div className="trend-circular-stat">
              <span className="trend-circle-legend income" />

              <div>
                <span>Income received</span>
                <small>Money coming in</small>
              </div>

              <strong className="trend-amount-income">
                {formatCurrency(incomeAmount)}
              </strong>
            </div>

            <div className="trend-circular-stat">
              <span className="trend-circle-legend expense" />

              <div>
                <span>Expenses recorded</span>
                <small>Money going out</small>
              </div>

              <strong className="trend-amount-expense">
                {formatCurrency(expenseAmount)}
              </strong>
            </div>

            <div className="trend-circular-stat">
              <span className="trend-circle-legend balance" />

              <div>
                <span>Net balance</span>
                <small>Income minus expenses</small>
              </div>

              <strong className={netBalance < 0 ? "negative-balance" : ""}>
                {formatCurrency(netBalance)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Spending insights */}
      <section className="trend-insights-grid">
        <article className="trend-insight-panel">
          <div className="trend-panel-heading">
            <div>
              <span className="section-label">
                SPENDING INSIGHTS
              </span>

              <h2>Where it goes</h2>

              <p>Breakdown of your recorded expenses</p>
            </div>
          </div>

          {totalCategoryExpenses === 0 ? (
            <div className="trend-compact-empty">
              <span>◌</span>
              <p>
                Your expense categories will appear here after you
                record expenses.
              </p>
            </div>
          ) : (
            <div className="trend-donut-layout">
              <div className="trend-donut">
                <svg
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="Expense category breakdown"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="43"
                    fill="none"
                    stroke="#383039"
                    strokeWidth="13"
                  />

                  {donutSegments.map((segment) => (
                    <circle
                      key={segment.name}
                      cx="60"
                      cy="60"
                      r="43"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="13"
                      strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                      strokeDashoffset={-segment.offset}
                      transform="rotate(-90 60 60)"
                    />
                  ))}

                  <text
                    x="60"
                    y="56"
                    textAnchor="middle"
                    fill="#E9E4E6"
                    fontSize="10"
                  >
                    Total spent
                  </text>

                  <text
                    x="60"
                    y="70"
                    textAnchor="middle"
                    fill="#E9E4E6"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {formatCurrency(totalCategoryExpenses)}
                  </text>
                </svg>
              </div>

              <div className="trend-category-list">
                {chartSegments.map((category) => (
                  <div
                    className="trend-category-row"
                    key={category.name}
                  >
                    <span
                      className="trend-category-dot"
                      style={{ background: category.color }}
                    />

                    <span className="trend-category-name">
                      {category.name}
                    </span>

                    <strong>
                      {formatCurrency(category.amount)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Recent activity */}
        <article className="trend-insight-panel trend-activity-panel">
          <div className="trend-panel-heading">
            <div>
              <span className="section-label">
                LATEST ACTIVITY
              </span>

              <h2>Recent transactions</h2>

              <p>Your latest recorded money movements</p>
            </div>

            <Link className="trend-view-all" to="/income-expenses">
              View all →
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="trend-compact-empty">
              <span>↗</span>
              <p>
                No transactions yet. Your latest activity will show
                up here.
              </p>
            </div>
          ) : (
            <div className="trend-activity-list">
              {recentTransactions.map((transaction, index) => {
                const isIncome =
                  transaction.normalizedType === "income";

                return (
                  <div
                    className="trend-activity-row"
                    key={
                      transaction.id ||
                      transaction._id ||
                      `${transaction.dateKey}-${index}`
                    }
                  >
                    <div
                      className={`trend-activity-icon ${
                        isIncome ? "is-income" : "is-expense"
                      }`}
                    >
                      {isIncome ? "↙" : "↗"}
                    </div>

                    <div className="trend-activity-details">
                      <strong>
                        {transaction.title ||
                          transaction.description ||
                          transaction.category ||
                          "Transaction"}
                      </strong>

                      <span>
                        {transaction.category ||
                          (isIncome ? "Income" : "Expense")}

                        {transaction.dateKey
                          ? ` · ${new Date(
                              `${transaction.dateKey}T12:00:00`
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}`
                          : ""}
                      </span>
                    </div>

                    <strong
                      className={
                        isIncome
                          ? "trend-amount-income"
                          : "trend-amount-expense"
                      }
                    >
                      {isIncome ? "+" : "−"}
                      {formatCurrency(transaction.numericAmount)}
                    </strong>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>

      {/* Quick access */}
      <section className="trend-quick-access">
        <div className="trend-quick-heading">
          <span className="section-label">
            YOUR FINANCIAL TOOLKIT
          </span>

          <h2>Where to next?</h2>
        </div>

        <div className="trend-quick-links">
          <Link to="/income-expenses">
            <span>₹</span>

            <div>
              <strong>Money</strong>
              <small>Manage transactions</small>
            </div>

            <b>↗</b>
          </Link>

          <Link to="/savings-goals">
            <span>◎</span>

            <div>
              <strong>Savings Goals</strong>
              <small>Track your targets</small>
            </div>

            <b>↗</b>
          </Link>

          <Link to="/habits">
            <span>✓</span>

            <div>
              <strong>Habits</strong>
              <small>Build better routines</small>
            </div>

            <b>↗</b>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
