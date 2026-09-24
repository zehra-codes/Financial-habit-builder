jsx
import { Link } from "react-router-dom";
import Welcome from "../components/Welcome";
import FinancialSummary from "../components/FinancialSummary";

function Dashboard({
  userName,
  income,
  expenses,
  transactions,
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

    </main>
  );
}

export default Dashboard;

