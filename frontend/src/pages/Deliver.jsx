import { useEffect } from "react";
import { Link } from "react-router-dom";

function Deliver() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="form-page">

      <div className="form-container">

        <div className="page-badge">DELIVER</div>

        <h1>Propose Your Project</h1>

        <p className="form-intro">
          Have an idea your team can deliver? Tell people what you can
          build, provide or complete and define the project details.
        </p>

        <form className="requirement-form">

          <div className="form-group">
            <label>Project Title</label>

            <input
              type="text"
              placeholder="e.g. E-commerce Website Development"
            />
          </div>


          <div className="form-group">
            <label>Project Description</label>

            <textarea
              rows="5"
              placeholder="Describe your project, idea or service in detail..."
            ></textarea>
          </div>


          <div className="form-row">

            <div className="form-group">
              <label>Project Cost</label>

              <input
                type="text"
                placeholder="e.g. PKR 100,000"
              />
            </div>


            <div className="form-group">
              <label>Timeline</label>

              <input
                type="text"
                placeholder="e.g. 30 days"
              />
            </div>

          </div>


          <div className="form-group">
            <label>Project Scope</label>

            <textarea
              rows="4"
              placeholder="What will your team deliver?"
            ></textarea>
          </div>


          <div className="form-group">
            <label>Team Members</label>

            <input
              type="text"
              placeholder="e.g. 2 Developers, 1 Designer"
            />
          </div>


          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              placeholder="e.g. Islamabad or Remote"
            />
          </div>


          <div className="form-actions">

            <button type="submit" className="primary-btn">
              Publish Project
            </button>

            <Link to="/" className="secondary-btn">
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </main>
  );
}

export default Deliver;