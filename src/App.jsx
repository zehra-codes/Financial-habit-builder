import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import IncomeExpenses from "./pages/IncomeExpenses";
import SavingsGoals from "./pages/SavingsGoals";
import Habits from "./pages/Habits";
import WealthAnalytics from "./pages/WealthAnalytics";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function App() {
  const userName = "Qunoot";

  // Main transaction data for the whole application
  const [transactions, setTransactions] = useState([]);

  // Load transactions from MongoDB when the app starts
  useEffect(() => {
    fetch("http://localhost:5000/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions);
        }
      })
      .catch((error) => {
        console.error("Error loading transactions:", error);
      });
  }, []);

  // Calculate totals from MongoDB transactions
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const [incomeInput, setIncomeInput] = useState("");
  const [expensesInput, setExpensesInput] = useState("");

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

        <Route
          path="/wealth-analytics"
          element={<WealthAnalytics />}
        />

        <Route
          path="/admin"
          element={<AdminPanel />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
