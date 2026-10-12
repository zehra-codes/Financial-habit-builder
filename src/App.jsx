
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const [authVersion, setAuthVersion] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [incomeInput, setIncomeInput] = useState("");
  const [expensesInput, setExpensesInput] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userName = user?.name || "User";

  useEffect(() => {
    if (!token) {
      setTransactions([]);
      return;
    }

    fetch("http://localhost:5000/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load transactions");
        return response.json();
      })
      .then((data) => {
        if (data.success) setTransactions(data.transactions);
      })
      .catch((error) => console.error("Error loading transactions:", error));
  }, [token, authVersion]);

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const refreshAuth = () => setAuthVersion((version) => version + 1);

  return (
    <>
      {token && !isAuthPage && (
        <Navbar user={user} onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTransactions([]);
          window.location.replace("/login");
        }} />
      )}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />

        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={refreshAuth} />
            )
          }
        />

        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onRegister={refreshAuth} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          }
        />

        <Route
          path="/income-expenses"
          element={
            <ProtectedRoute>
              <IncomeExpenses
                transactions={transactions}
                setTransactions={setTransactions}
              />
            </ProtectedRoute>
          }
        />

        <Route path="/savings-goals" element={<ProtectedRoute><SavingsGoals /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/wealth-analytics" element={<ProtectedRoute><WealthAnalytics /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
