import { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-content">

          <div className="hero-badge">
            One Platform. Endless Possibilities.
          </div>

          <h1>
            Turn Ideas Into
            <span> Real Opportunities.</span>
          </h1>

          <p>
            Hire skilled teams for your requirements or deliver your own
            project ideas to people who need them.
          </p>

          <div className="hero-buttons">
            <Link to="/hire" className="primary-btn">
              I Want to Hire
            </Link>

            <Link to="/deliver" className="secondary-btn">
              I Want to Deliver
            </Link>
          </div>

        </div>
      </section>

      <section className="choices">

        <div className="section-heading">
          <p>HOW IT WORKS</p>

          <h2>What do you want to do?</h2>

          <span>
            Choose how you want to use the HireDeliver platform.
          </span>
        </div>

        <div className="choice-container">

          <div className="choice-card deliver-card">

            <div className="card-icon">🚀</div>

            <h3>DELIVER</h3>

            <h4>Have an idea? Deliver it.</h4>

            <p>
              Propose any project or task that your team can complete.
              Define your scope, timeline, cost and team members.
            </p>

            <ul>
              <li>Propose your own project</li>
              <li>Define project scope</li>
              <li>Set timeline and cost</li>
              <li>Add your team members</li>
            </ul>

            <Link to="/deliver" className="card-btn deliver-btn">
              Start Delivering →
            </Link>

          </div>

          <div className="choice-card hire-card">

            <div className="card-icon">💼</div>

            <h3>HIRE</h3>

            <h4>Need something? Hire someone.</h4>

            <p>
              Post any requirement, whether it is a product or service.
              Add your budget, location, timeline and other details.
            </p>

            <ul>
              <li>Post any requirement</li>
              <li>Request a product or service</li>
              <li>Set budget and location</li>
              <li>Define your timeline</li>
            </ul>

            <Link to="/hire" className="card-btn hire-btn">
              Start Hiring →
            </Link>

          </div>

        </div>
      </section>

      <section className="about" id="about">

        <p>ABOUT HIREDELIVER</p>

        <h2>
          One platform for both sides of opportunity.
        </h2>

        <span>
          HireDeliver connects people who need something with teams
          who can build, provide or deliver it.
        </span>

      </section>
    </>
  );
}

export default Home;