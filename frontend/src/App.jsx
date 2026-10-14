import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Hire from "./pages/Hire";
import Deliver from "./pages/Deliver";

import "./App.css";

function App() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <Link to="/" className="logo">
          Hire<span>Deliver</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/deliver">Deliver</Link>
          <Link to="/hire">Hire</Link>
          <a href="/#about">About</a>
        </div>

        <div className="nav-buttons">
          <button className="login-btn">
            Login
          </button>

          <button className="signup-btn">
            Sign Up
          </button>
        </div>

      </nav>


      {/* Pages */}
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/hire" element={<Hire />} />

        <Route path="/deliver" element={<Deliver />} />

      </Routes>


      {/* Footer */}
      <footer>

        <Link to="/" className="logo">
          Hire<span>Deliver</span>
        </Link>

        <p>
          © 2026 HireDeliver. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;