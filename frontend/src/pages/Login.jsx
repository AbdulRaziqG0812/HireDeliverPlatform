import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid email or password."
        );
        return;
      }

      // =====================================================
      // SAVE JWT ACCESS TOKEN
      // =====================================================

      if (!data.access_token) {
        setError(
          "Login successful, but authentication token was not received."
        );
        return;
      }

      localStorage.setItem(
        "hireDeliverAccessToken",
        data.access_token
      );

      // =====================================================
      // SAVE LOGIN INFORMATION
      // =====================================================

      localStorage.setItem(
        "hireDeliverLoggedIn",
        "true"
      );

      localStorage.setItem(
        "hireDeliverUser",
        JSON.stringify({
          id: data.user.id || null,
          fullName: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
          role: data.user.role,
          accountType: data.account_type,
        })
      );

      // =====================================================
      // ADMIN LOGIN
      // =====================================================

      if (
        data.account_type === "admin" ||
        data.user.role === "admin"
      ) {
        navigate("/admin-dashboard");
        return;
      }

      // =====================================================
      // NORMAL USER LOGIN
      // =====================================================

      navigate("/home");

    } catch (error) {
      console.error("Login Error:", error);

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
          <span className="auth-badge">
            HIREDELIVER
          </span>

          <h1>Welcome Back</h1>

          <p>
            Login to continue to your HireDeliver account.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="auth-error">
              <span className="error-icon">
                !
              </span>

              <span>
                {error}
              </span>
            </div>
          )}

          <div className="form-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}

            {!loading && (
              <span>→</span>
            )}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

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