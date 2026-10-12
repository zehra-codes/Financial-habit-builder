
import { Link } from "react-router-dom";

function Welcome({ name, income, expenses }) {
  const savings = Number(income || 0) - Number(expenses || 0);

  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <span className="welcome-eyebrow">
          YOUR FINANCIAL SPACE
        </span>

        <h1>
          Welcome back, {name || "User"}!
        </h1>

        <p>
          Small steps today. Stronger finances tomorrow.
          Keep building better money habits.
        </p>

        <Link to="/income-expenses" className="welcome-button">
          Manage Your Money <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="welcome-balance">
        <span>YOUR CURRENT BALANCE</span>
        <strong>
          ₹{savings.toLocaleString("en-IN")}
        </strong>
        <p>
          {savings >= 0
            ? "Keep moving towards your goals."
            : "Your expenses are currently above your income."}
        </p>
      </div>
    </div>
  );
}

export default Welcome;
