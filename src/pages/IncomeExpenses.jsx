import { useEffect } from "react";
import TransactionTracker from "../components/TransactionTracker";

function IncomeExpenses({ transactions, setTransactions }) {
  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/transactions"
        );

        const data = await response.json();

        if (data.success) {
          setTransactions(
            data.transactions.map((transaction) => ({
              ...transaction,
              id: transaction._id,
              type: transaction.type.toLowerCase(),
              date: transaction.date
                ? transaction.date.split("T")[0]
                : "",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    }

    loadTransactions();
  }, [setTransactions]);

  return (
    <main className="dashboard">
      <section className="card">
        <div className="section-heading">
          <div>
            <span className="section-label">
              MONEY MANAGEMENT
            </span>

            <h1>Income & Expenses</h1>

            <p>
              Track your income and expenses and keep an eye on your
              spending.
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