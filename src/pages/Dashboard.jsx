import { Link } from "react-router-dom";
import Welcome from "../components/Welcome";
import FinancialSummary from "../components/FinancialSummary";
import TransactionTracker from "../components/TransactionTracker";

function Dashboard({
  userName,
  income,
  expenses,
  setIncome,
  setExpenses,
  incomeInput,
  expensesInput,
  setIncomeInput,
  setExpensesInput,
  transactions,
  setTransactions,
}) {
  return (
    <main className="dashboard">

      {/* Welcome Section */}
      <section className="dashboard-welcome">
        <Welcome
          name={userName}
          income={income}
          expenses={expenses}
        />
      </section>

      {/* Financial Overview */}
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              FINANCIAL OVERVIEW
            </span>

            <h2>Your Money at a Glance</h2>

            <p>
              See how your income, expenses, and savings are doing.
            </p>
          </div>
        </div>

        <FinancialSummary
          income={income}
          expenses={expenses}
          transactions={transactions}
        />

      </section>

      {/* Quick Access */}
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              QUICK ACCESS
            </span>

            <h2>Manage Your Finances</h2>

            <p>
              Choose an area to manage your financial progress.
            </p>
          </div>
        </div>

        <div className="quick-access-grid">

          <Link
            to="/income-expenses"
            className="quick-card"
          >
            <div className="quick-card-icon">₹</div>

            <h3>Money</h3>

            <p>
              Track your income, expenses, and transactions.
            </p>

            <span>
              Open Money →
            </span>
          </Link>

          <Link
            to="/savings-goals"
            className="quick-card"
          >
            <div className="quick-card-icon">🎯</div>

            <h3>Savings Goals</h3>

            <p>
              Set savings targets and track your progress.
            </p>

            <span>
              View Goals →
            </span>
          </Link>

          <Link
            to="/habits"
            className="quick-card"
          >
            <div className="quick-card-icon">✓</div>

            <h3>Habits</h3>

            <p>
              Build and maintain better financial habits.
            </p>

            <span>
              View Habits →
            </span>
          </Link>

        </div>

      </section>

      {/* Update Financial Data */}
      <section className="finance-update card">

        <div className="section-heading">
          <div>
            <span className="section-label">
              FINANCIAL INPUT
            </span>

            <h2>Update Your Finances</h2>

            <p>
              Keep your monthly income and expenses up to date.
            </p>
          </div>
        </div>

        <div className="update-form">

          <div className="input-group">
            <label>Income</label>

            <div className="input-wrapper">
              <span>₹</span>

              <input
                type="number"
                value={incomeInput}
                onChange={(event) =>
                  setIncomeInput(event.target.value)
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label>Expenses</label>

            <div className="input-wrapper">
              <span>₹</span>

              <input
                type="number"
                value={expensesInput}
                onChange={(event) =>
                  setExpensesInput(event.target.value)
                }
              />
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setIncome(Number(incomeInput));
              setExpenses(Number(expensesInput));
            }}
          >
            Update Financial Data
          </button>

        </div>

      </section>

      {/* Transactions */}
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              TRANSACTIONS
            </span>

            <h2>Your Transactions</h2>

            <p>
              Add and manage your recent income and expenses.
            </p>
          </div>
        </div>

        <TransactionTracker
          transactions={transactions}
          setTransactions={setTransactions}
        />

      </section>

    </main>
  );
}

export default Dashboard;