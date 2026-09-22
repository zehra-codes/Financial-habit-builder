import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import IncomeExpenses from "./pages/IncomeExpenses";
import SavingsGoals from "./pages/SavingsGoals";
import Habits from "./pages/Habits";

import "./App.css";

function App() {
  const userName = "Qunoot";

  const [income, setIncome] = useState(25000);
  const [expenses, setExpenses] = useState(15000);

  const [incomeInput, setIncomeInput] = useState(25000);
  const [expensesInput, setExpensesInput] = useState(15000);

  // Main transaction data for the whole dashboard
  const [transactions, setTransactions] = useState([]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              userName={userName}
              income={income}
              expenses={expenses}
              setIncome={setIncome}
              setExpenses={setExpenses}
              incomeInput={incomeInput}
              expensesInput={expensesInput}
              setIncomeInput={setIncomeInput}
              setExpensesInput={setExpensesInput}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              userName={userName}
              income={income}
              expenses={expenses}
              setIncome={setIncome}
              setExpenses={setExpenses}
              incomeInput={incomeInput}
              expensesInput={expensesInput}
              setIncomeInput={setIncomeInput}
              setExpensesInput={setExpensesInput}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />

        <Route
          path="/income-expenses"
          element={
            <IncomeExpenses
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />

        <Route
          path="/savings-goals"
          element={<SavingsGoals />}
        />

        <Route
          path="/habits"
          element={<Habits />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;