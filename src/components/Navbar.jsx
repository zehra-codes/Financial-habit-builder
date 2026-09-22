import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>Financial Habit Builder</h2>

      <div>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/income-expenses">Income & Expenses</NavLink>
        <NavLink to="/habits">Habits</NavLink>
        <NavLink to="/savings-goals">Savings Goals</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;