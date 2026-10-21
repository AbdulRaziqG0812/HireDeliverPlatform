import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-top">

        <Link to="/home" className="logo">
          Hire<span>Deliver</span>
        </Link>

        <p>
          Connecting requirements with delivery capabilities.
        </p>

        <div className="footer-links">
          <Link to="/home">Home</Link>
          <Link to="/hire">Hire</Link>
          <Link to="/deliver">Deliver</Link>
          <a href="/home#about">About</a>
        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 HireDeliver. All rights reserved.
        </p>

        <span>
          HIRE • CONNECT • DELIVER
        </span>

      </div>

    </footer>
  );
}

export default Footer;