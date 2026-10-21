import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

        if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
        ) {
      alert("Please fill all fields.");
      return;
    }

    // Temporary frontend-only signup
    localStorage.setItem(
      "hireDeliverUser",
      JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        })
    );

    alert("Account created successfully!");

    navigate("/login");
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-header">
          <span className="auth-badge">HIREDELIVER</span>

          <h1>Create Your Account</h1>

          <p>
            Join HireDeliver and connect requirements with
            delivery capabilities.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

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
            <label>Contact Number</label>

            <input
                type="tel"
                name="phone"
                placeholder="e.g. 0300 1234567"
                value={formData.phone}
                onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-primary-btn">
            Create Account
            <span>→</span>
          </button>

        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">
            Login
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

export default Signup;