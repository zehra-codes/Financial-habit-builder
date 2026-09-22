import TransactionTracker from "../components/TransactionTracker";

function IncomeExpenses({ transactions, setTransactions }) {
  return (
    <main className="dashboard">

      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">MONEY MANAGEMENT</span>
            <h1>Income & Expenses</h1>
            <p>
              Track your income and expenses and keep an eye on your spending.
            </p>
          </div>
        </div>
      </section>

      <TransactionTracker
        transactions={transactions}
        setTransactions={setTransactions}
      />

    </main>
  );
}

export default IncomeExpenses;