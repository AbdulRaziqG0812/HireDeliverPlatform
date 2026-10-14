import { useEffect } from "react";
import { Link } from "react-router-dom";

function Hire() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="form-page">
      <div className="form-container">

        <div className="page-badge">HIRE</div>

        <h1>Post Your Requirement</h1>

        <p className="form-intro">
          Tell us what you need. It can be a product or a service.
          Add your budget, location and timeline to find the right team.
        </p>

        <form className="requirement-form">

          <div className="form-group">
            <label>Requirement Title</label>
            <input
              type="text"
              placeholder="e.g. I need a website for my business"
            />
          </div>

          <div className="form-group">
            <label>Requirement Type</label>

            <select>
              <option value="">Select type</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Describe what you need in detail..."
            ></textarea>
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Budget</label>

              <input
                type="text"
                placeholder="e.g. PKR 50,000"
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                placeholder="e.g. Islamabad"
              />
            </div>

          </div>

          <div className="form-group">
            <label>Timeline</label>

            <input
              type="text"
              placeholder="e.g. 30 days"
            />
          </div>

          <div className="form-actions">

            <button type="submit" className="primary-btn">
              Post Requirement
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

export default Hire;