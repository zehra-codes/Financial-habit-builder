import { useState } from "react";
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
