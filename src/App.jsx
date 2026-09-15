import { useState } from "react";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import FinancialSummary from "./components/FinancialSummary";

function App() {
  const userName = "Qunoot";
  const [income, setIncome] = useState(25000);
  const [expenses, setExpenses] = useState(15000);
  const [incomeInput, setIncomeInput] = useState(25000);
  const [expensesInput, setExpensesInput] = useState(15000);
  return (
    <>
      <Navbar />

      <main>
        <section>
  <h2>Update Your Finances</h2>

  <div>
    <label>Income: </label>
    <input
      type="number"
      value={incomeInput}
      onChange={(event) => setIncomeInput(event.target.value)}
    />
  </div>

  <div>
    <label>Expenses: </label>
    <input
      type="number"
      value={expensesInput}
      onChange={(event) => setExpensesInput(event.target.value)}
    />
  </div>

  <button
    onClick={() => {
      setIncome(Number(incomeInput));
      setExpenses(Number(expensesInput));
    }}
  >
    Update Financial Data
  </button>
</section>
        <Welcome
          name={userName}
          income={income}
          expenses={expenses}
        />
        <FinancialSummary
            income={income}
            expenses={expenses}
/>
      </main>
    </>
  );
}

export default App;