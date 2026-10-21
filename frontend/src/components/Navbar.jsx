import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("hireDeliverUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("hireDeliverLoggedIn");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link to="/home" className="logo">
        Hire<span>Deliver</span>
      </Link>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/deliver">Deliver</Link>
        <Link to="/hire">Hire</Link>
        <a href="/home#about">About</a>
      </div>

      <div className="nav-buttons">

        {user?.fullName && (
          <span className="nav-user">
            Hi, {user.fullName}
          </span>
        )}

        <button
          className="login-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;