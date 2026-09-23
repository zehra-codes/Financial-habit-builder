import { NavLink } from "react-router-dom";

function Navbar() {
return ( <nav className="navbar"> <div className="navbar-brand"> <span className="brand-icon">₹</span>

    <div>
      <h2>Financial Habit Builder</h2>
      <p>Manage. Save. Grow.</p>
    </div>
  </div>

  <div className="navbar-links">
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive ? "nav-link active" : "nav-link"
      }
    >
      Dashboard
    </NavLink>

    <NavLink
      to="/income-expenses"
      className={({ isActive }) =>
        isActive ? "nav-link active" : "nav-link"
      }
    >
      Money
    </NavLink>

    <NavLink
      to="/savings-goals"
      className={({ isActive }) =>
        isActive ? "nav-link active" : "nav-link"
      }
    >
      Savings Goals
    </NavLink>

    <NavLink
      to="/habits"
      className={({ isActive }) =>
        isActive ? "nav-link active" : "nav-link"
      }
    >
      Habits
    </NavLink>
  </div>
</nav>

);
}

export default Navbar;