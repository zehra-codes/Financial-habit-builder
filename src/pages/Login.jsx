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
    <main className="dashboard">
      <section className="card auth-card">
        <div className="section-heading">
          <div>
            <span className="section-label">WELCOME BACK</span>
            <h1>Login</h1>
            <p>Sign in to manage your finances and track your progress.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="form-grid">
          <div>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
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

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {message && <p role="alert">{message}</p>}
        </form>

        <p>
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
