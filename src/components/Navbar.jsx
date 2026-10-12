import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const name = user?.name || "User";
  const email = user?.email || "";
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    setProfileOpen(false);
    onLogout?.();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate("/dashboard")}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") navigate("/dashboard");
        }}
      >
        <span className="brand-icon">₹</span>

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

        <NavLink
          to="/wealth-analytics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Wealth Analytics
        </NavLink>
      </div>

      <div className="profile-container">
        <button
          type="button"
          className="profile-button"
          onClick={() => setProfileOpen((open) => !open)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
        >
          {initial}
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-details">
              <strong>{name}</strong>
              {email && <span>{email}</span>}
            </div>

            <div className="profile-divider" />

            <button
              type="button"
              className="profile-menu-item"
              onClick={() => {
                setProfileOpen(false);
                navigate("/dashboard");
              }}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="profile-menu-item logout-button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;