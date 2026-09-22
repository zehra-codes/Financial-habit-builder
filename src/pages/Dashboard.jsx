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

      {/* Update Financial Data */}
      <section className="finance-update card">
        <div className="section-heading">
          <div>
            <span className="section-label">FINANCIAL INPUT</span>
            <h2>Update Your Finances</h2>
            <p>Keep your monthly income and expenses up to date.</p>
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

      {/* Welcome */}
      <Welcome
        name={userName}
        income={income}
        expenses={expenses}
      />

      {/* Financial Summary */}
      <FinancialSummary
        income={income}
        expenses={expenses}
        transactions={transactions}
      />

      {/* Transaction Tracker */}
      <TransactionTracker
        transactions={transactions}
        setTransactions={setTransactions}
      />

    </main>
  );
}

export default Dashboard;