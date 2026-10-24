
import { Link } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  // Password requirements
  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(formData.password),
  };

  const isPasswordStrong =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Please create a strong password using all the requirements below.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      // Stay on Signup page
      setSuccess(
        "Account created successfully. You can now login to your account."
      );

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
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

    {/* Success Message */}
    {success && (
      <div className="auth-success">
        <span className="success-icon">✓</span>
        <span>{success}</span>
      </div>
    )}

    <form className="auth-form" onSubmit={handleSubmit}>

      {/* Error Message */}
      {error && (
        <div className="auth-error">
          <span className="error-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Baqi tumhara form yahan se continue hoga */}
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

    
          {/* =========================
              PASSWORD
          ========================= */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create strong password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>


          {/* =========================
              CONFIRM PASSWORD
          ========================= */}
          <div className="form-group">
            <label>Confirm Password</label>

            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Password Match Message */}
            {formData.confirmPassword && (
              <div
                className={
                  formData.password === formData.confirmPassword
                    ? "confirm-password valid"
                    : "confirm-password invalid"
                }
              >
                {formData.password === formData.confirmPassword
                  ? "✓ Passwords match"
                  : "✕ Passwords do not match"}
              </div>
            )}
          </div>


          {/* =========================
              PASSWORD REQUIREMENTS
          ========================= */}
          <div className="password-rules">

            <div className="password-rules-heading">
              Password requirements
            </div>

            <div
              className={`password-rule ${
                passwordRules.length ? "completed" : ""
              }`}
            >
              <span className="rule-icon">
                {passwordRules.length ? "✓" : "○"}
              </span>

              <span>8 or more characters</span>
            </div>

            <div
              className={`password-rule ${
                passwordRules.uppercase ? "completed" : ""
              }`}
            >
              <span className="rule-icon">
                {passwordRules.uppercase ? "✓" : "○"}
              </span>

              <span>One uppercase letter (A-Z)</span>
            </div>

            <div
              className={`password-rule ${
                passwordRules.lowercase ? "completed" : ""
              }`}
            >
              <span className="rule-icon">
                {passwordRules.lowercase ? "✓" : "○"}
              </span>

              <span>One lowercase letter (a-z)</span>
            </div>

            <div
              className={`password-rule ${
                passwordRules.number ? "completed" : ""
              }`}
            >
              <span className="rule-icon">
                {passwordRules.number ? "✓" : "○"}
              </span>

              <span>One number (0-9)</span>
            </div>

            <div
              className={`password-rule ${
                passwordRules.special ? "completed" : ""
              }`}
            >
              <span className="rule-icon">
                {passwordRules.special ? "✓" : "○"}
              </span>

              <span>One special character (@, #, $, etc.)</span>
            </div>

          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <span>→</span>}
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