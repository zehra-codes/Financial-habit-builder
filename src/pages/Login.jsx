
import API_BASE_URL from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin?.();

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-story">
          <Link to="/login" className="auth-brand">
            <span className="auth-brand-mark">F</span>
            <span>Financial Habit Builder</span>
          </Link>

          <div className="auth-story-content">
            <span className="auth-eyebrow">
              YOUR MONEY. YOUR FUTURE.
            </span>

            <h1>
              Build better
              <br />
              habits. <span>Grow</span>
              <br />
              your wealth.
            </h1>

            <p>
              A clearer view of your money starts here.
              Track your finances, build savings habits,
              and keep your goals within reach.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature">
                <span className="auth-feature-icon">↗</span>
                <div>
                  <strong>Understand your money</strong>
                  <small>Track income and expenses in one place.</small>
                </div>
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">◎</span>
                <div>
                  <strong>Make progress every day</strong>
                  <small>Build savings goals and financial habits.</small>
                </div>
              </div>
            </div>
          </div>

          <p className="auth-story-footer">
            Small steps today. Stronger financial habits tomorrow.
          </p>
        </aside>

        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-mobile-brand">
              <span className="auth-brand-mark">F</span>
              <span>Financial Habit Builder</span>
            </div>

            <div className="auth-form-heading">
              <span className="auth-eyebrow">WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>
                Pick up where you left off and keep making progress.
              </p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              {message && (
                <p className="auth-error" role="alert">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in to your account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="auth-signup">
              New to Financial Habit Builder?
              <Link to="/register"> Create an account</Link>
            </p>

            <div className="auth-security-note">
              <span aria-hidden="true">◆</span>
              Sign in to access your personal finance dashboard.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
