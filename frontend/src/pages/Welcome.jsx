import { Link } from "react-router-dom";

function Welcome() {
  return (
    <main className="welcome-page">
      <section className="welcome-container">

        <div className="welcome-badge">
          HIREDELIVER PLATFORM
        </div>

        <h1>
          Turn Requirements Into
          <span> Real Solutions</span>
        </h1>

        <p className="welcome-description">
          HireDeliver connects people who need products, services, or
          projects with teams and professionals who can deliver them.
        </p>

        <div className="welcome-options">

          <div className="welcome-card">
            <div className="welcome-number">01</div>

            <h2>HIRE</h2>

            <p>
              Post any product, service, task, or project requirement.
              Add your budget, timeline, location, scope, and other
              important details.
            </p>

            <div className="welcome-card-label">
              POST YOUR REQUIREMENT
            </div>
          </div>

          <div className="welcome-card">
            <div className="welcome-number">02</div>

            <h2>DELIVER</h2>

            <p>
              Present what your team can deliver. Share your skills,
              resources, estimated cost, timeline, and project
              capabilities.
            </p>

            <div className="welcome-card-label">
              SHOW YOUR CAPABILITIES
            </div>
          </div>

        </div>

        <div className="welcome-actions">

          <Link to="/signup" className="welcome-primary-btn">
            Get Started
            <span>→</span>
          </Link>

          <Link to="/login" className="welcome-secondary-btn">
            Already have an account? Login
          </Link>

        </div>

        <div className="welcome-footer-text">
          <span>HIRE</span>
          <span>•</span>
          <span>CONNECT</span>
          <span>•</span>
          <span>DELIVER</span>
        </div>

      </section>
    </main>
  );
}

export default Welcome;