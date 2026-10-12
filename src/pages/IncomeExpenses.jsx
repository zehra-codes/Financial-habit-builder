import { useEffect } from "react";
import TransactionTracker from "../components/TransactionTracker";

function IncomeExpenses({ transactions, setTransactions }) {
  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/transactions"
        );

        if (!response.ok) {
          throw new Error("Unable to load transactions");
        }

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

  const income = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "income")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  const expenses = transactions
    .filter((transaction) => transaction.type?.toLowerCase() === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  const balance = income - expenses;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="dashboard money-page">
      <section className="money-hero">
        <div className="money-hero-copy">
          <span className="section-label">MONEY MANAGEMENT</span>
          <h1>Income &amp; Expenses</h1>
          <p>
            Every rupee has a purpose. Track your earnings, manage spending,
            and understand where your money goes.
          </p>
        </div>

        <div className="money-hero-decoration" aria-hidden="true">
          <span>₹</span>
        </div>
      </section>

      <section className="money-overview" aria-label="Money overview">
        <article className="money-stat-card">
          <span className="money-stat-icon">↗</span>
          <p>Total income</p>
          <h2>{formatCurrency(income)}</h2>
          <span className="money-stat-note">Money received</span>
        </article>

        <article className="money-stat-card">
          <span className="money-stat-icon">↘</span>
          <p>Total expenses</p>
          <h2>{formatCurrency(expenses)}</h2>
          <span className="money-stat-note">Money spent</span>
        </article>

        <article className="money-stat-card money-balance-card">
          <span className="money-stat-icon">₹</span>
          <p>Net balance</p>
          <h2>{formatCurrency(balance)}</h2>
          <span className="money-stat-note">Income minus expenses</span>
        </article>
      </section>

      <section className="money-transactions-section">
        <div className="money-section-heading">
          <div>
            <span className="section-label">YOUR ACTIVITY</span>
            <h2>Transaction manager</h2>
            <p>Add and manage your income and expenses in one place.</p>
          </div>
          <span className="money-transaction-count">
            {transactions.length} {transactions.length === 1 ? "record" : "records"}
          </span>
        </div>

        <TransactionTracker
          transactions={transactions}
          setTransactions={setTransactions}
        />
      </section>
    </main>
  );
}

export default IncomeExpenses;