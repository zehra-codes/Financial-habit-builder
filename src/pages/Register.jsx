import API_BASE_URL from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register({ onRegister }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setMessage("Password must be 8–72 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onRegister?.();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell auth-register-shell">
        <section className="auth-story">
          <Link to="/login" className="auth-brand">
            <span className="auth-brand-mark">F</span>
            <span>FINANCIAL HABIT BUILDER</span>
          </Link>

          <div className="auth-story-content">
            <span className="auth-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h1>
              Small habits.
              <br />
              <span>Stronger finances.</span>
            </h1>
            <p>
              Create your account and start building a clearer picture of your
              money, savings goals, and financial habits.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature">
                <span className="auth-feature-icon">↗</span>
                <div>
                  <strong>Track your money</strong>
                  <p>Keep income and expenses organised.</p>
                </div>
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">◎</span>
                <div>
                  <strong>Build better habits</strong>
                  <p>Stay focused on your savings goals.</p>
                </div>
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">✦</span>
                <div>
                  <strong>See your progress</strong>
                  <p>Understand how your finances evolve.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="auth-story-footer">Manage. Save. Grow.</p>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-inner">
            <Link to="/login" className="auth-mobile-brand">
              <span className="auth-brand-mark">F</span>
              <span>FINANCIAL HABIT BUILDER</span>
            </Link>

            <div className="auth-form-heading">
              <span className="auth-eyebrow">GET STARTED</span>
              <h2>Create your account</h2>
              <p>Set up your account to begin your financial journey.</p>
            </div>

            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-email">Email address</label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password (8–72 characters)"
                />
                <span className="auth-field-hint">
                  Use at least 8 characters.
                </span>
              </div>

              <div className="auth-field">
                <label htmlFor="confirm-password">Confirm password</label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
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
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="auth-signup">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

            <div className="auth-security-note">
              <span aria-hidden="true">◇</span>
              Your financial journey starts with you.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;