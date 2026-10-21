import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    // Temporary frontend-only login
    const savedUser = localStorage.getItem("hireDeliverUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      if (
        formData.email !== user.email
      ) {
        alert("No account found with this email.");
        return;
      }
    }

    localStorage.setItem("hireDeliverLoggedIn", "true");

    navigate("/home");
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-header">
          <span className="auth-badge">HIREDELIVER</span>

          <h1>Welcome Back</h1>

          <p>
            Login to continue to your HireDeliver account.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="forgot-password">
            <a href="#forgot">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="auth-primary-btn">
            Login
            <span>→</span>
          </button>

        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <Link to="/signup">
            Create Account
          </Link>
        </div>

        <div className="auth-back">
          <Link to="/">
            ← Back to Welcome
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Login;