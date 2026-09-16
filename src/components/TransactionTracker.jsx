import { useState } from "react";

function TransactionTracker() {
  const [transactions, setTransactions] = useState([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");

  const addTransaction = () => {
    if (description === "" || amount === "") {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: Number(amount),
      type: type,
    };

    setTransactions([...transactions, newTransaction]);

    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <section>
      <h2>Income & Expense Tracker</h2>

      <div>
        <label>Description: </label>
        <input
          type="text"
          value={description}
          placeholder="e.g. Salary"
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div>
        <label>Amount: </label>
        <input
          type="number"
          value={amount}
          placeholder="e.g. 5000"
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>

      <div>
        <label>Type: </label>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <button onClick={addTransaction}>Add Transaction</button>

      <h3>Transactions</h3>

      {transactions.length === 0 ? (
        <p>No transactions added yet.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.description} - ₹{transaction.amount} -{" "}
              {transaction.type}

              <button onClick={() => deleteTransaction(transaction.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Financial Totals</h3>

      <p>Total Income: ₹{totalIncome}</p>
      <p>Total Expenses: ₹{totalExpenses}</p>
      <p>Balance: ₹{balance}</p>
    </section>
  );
}

export default TransactionTracker;