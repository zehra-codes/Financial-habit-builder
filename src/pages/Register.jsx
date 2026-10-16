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
    <main className="dashboard">
      <section className="card auth-card">
        <div className="section-heading">
          <div>
            <span className="section-label">GET STARTED</span>
            <h1>Create Account</h1>
            <p>Create your account to start managing your finances.</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="form-grid">
          <div>
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
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
              placeholder="Create a password (at least 8 characters)"
            />
          </div>

          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {message && <p role="alert">{message}</p>}
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
