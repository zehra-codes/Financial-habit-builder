import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Registration successful!");

    setTimeout(() => {
      navigate("/login");
    }, 700);
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
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <button type="submit">Create Account</button>

          {message && <p>{message}</p>}
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;