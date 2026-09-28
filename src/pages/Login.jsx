import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setMessage("Login successful!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
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
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit">Login</button>

          {message && <p>{message}</p>}
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;