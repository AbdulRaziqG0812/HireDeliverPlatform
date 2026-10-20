import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Deliver() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    description: "",
    scope: "",
    deliverables: "",
    cost: "",
    processing: "",
    standardTimeline: "",
    urgentTimeline: "",
    team: "",
    roles: "",
    skills: "",
    tools: "",
    physicalResources: "",
    additionalResources: "",
    location: "",
    portfolio: "",
    notificationPeriod: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filledFields = Object.values(formData).filter(
    (value) => value.trim() !== ""
  ).length;

  const totalFields = Object.keys(formData).length;
  const completion = Math.round((filledFields / totalFields) * 100);

  return (
    <main className="deliver-page">

      {/* ================= HEADER ================= */}

      <section className="deliver-header">
        <div>
          <span className="page-badge">DELIVER</span>

          <h1>
            Create Your <span>Delivery Profile</span>
          </h1>

          <p>
            Tell potential clients what you can deliver, the resources you
            have, your team, cost, timeline and other important details.
          </p>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Delivery Proposal
        </div>
      </section>

      {/* ================= WORKSPACE ================= */}

      <section className="deliver-workspace">

        {/* ================= LEFT GUIDE ================= */}

        <aside className="deliver-guide">

          <div className="side-heading">
            <span>01</span>
            <h3>Delivery Guide</h3>
          </div>

          <p className="side-intro">
            Complete the sections below to clearly explain what you can
            deliver and what resources you have available.
          </p>

          <div className="guide-step active">
            <span>01</span>
            <div>
              <strong>Basic Information</strong>
              <small>Type, title and category</small>
            </div>
          </div>

          <div className="guide-step">
            <span>02</span>
            <div>
              <strong>Delivery Details</strong>
              <small>Description and scope</small>
            </div>
          </div>

          <div className="guide-step">
            <span>03</span>
            <div>
              <strong>Cost & Processing</strong>
              <small>Cost and delivery timeline</small>
            </div>
          </div>

          <div className="guide-step">
            <span>04</span>
            <div>
              <strong>Team & Skills</strong>
              <small>People and expertise</small>
            </div>
          </div>

          <div className="guide-step">
            <span>05</span>
            <div>
              <strong>Tools & Resources</strong>
              <small>Available resources</small>
            </div>
          </div>

          <div className="guide-step">
            <span>06</span>
            <div>
              <strong>Location & Proof</strong>
              <small>Locations and portfolio</small>
            </div>
          </div>

          <div className="guide-tip">
            <strong>TIP</strong>

            <p>
              Provide clear and complete information so clients can easily
              understand your delivery capability.
            </p>
          </div>

        </aside>

        {/* ================= CENTER FORM ================= */}

        <div className="deliver-form-card">

          <div className="form-card-header">
            <div>
              <span>DELIVERY PROPOSAL</span>
              <h2>Delivery Information</h2>
            </div>

            <small>* Required</small>
          </div>

          <form
            className="requirement-form"
            onSubmit={(e) => e.preventDefault()}
          >

            {/* ================= 01 BASIC INFORMATION ================= */}

            <div className="form-section-title">
              <span>01</span>
              Basic Information
            </div>

            <div className="form-group">

              <label>What Can You Deliver? *</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select delivery type</option>
                <option value="Product">Product</option>
                <option value="Service">Service</option>
                <option value="Task">Task</option>
                <option value="Project">Project</option>
                <option value="Human Resource">Human Resource</option>
                <option value="Other">Other</option>
              </select>

              <small>
                Select the main type of product, service, task or project you
                can provide.
              </small>

            </div>

            <div className="form-group">

              <label>Delivery Title *</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Complete E-commerce Website Development"
              />

              <small>
                Give your delivery offer a clear and meaningful title.
              </small>

            </div>

            <div className="form-group">

              <label>Category *</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>

                <option value="Software Development">
                  Software Development
                </option>

                <option value="Web Development">
                  Web Development
                </option>

                <option value="Mobile App Development">
                  Mobile App Development
                </option>

                <option value="Design">
                  Design
                </option>

                <option value="Consulting">
                  Consulting
                </option>

                <option value="Marketing">
                  Marketing
                </option>

                <option value="Research">
                  Research
                </option>

                <option value="Technical Service">
                  Technical Service
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>

            {/* ================= 02 DELIVERY DETAILS ================= */}

            <div className="form-section-title">
              <span>02</span>
              Delivery Details
            </div>

            <div className="form-group">

              <label>What Can You Provide? *</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Explain the product, service, task or project you can provide..."
              />

              <small>
                Clearly explain what you can provide to a client.
              </small>

            </div>

            <div className="form-group">

              <label>Scope of Delivery *</label>

              <textarea
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                rows="5"
                placeholder="Explain the complete scope of your work..."
              />

              <small>
                Mention what is included and what your team will be
                responsible for.
              </small>

            </div>

            <div className="form-group">

              <label>Deliverables / Task Breakdown *</label>

              <textarea
                name="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                rows="5"
                placeholder={`Example:
1. UI/UX Design
2. Frontend Development
3. Backend Development
4. Database Integration
5. Testing
6. Deployment`}
              />

              <small>
                Break your delivery into clear tasks or deliverables.
              </small>

            </div>

            {/* ================= 03 COST & PROCESSING ================= */}

            <div className="form-section-title">
              <span>03</span>
              Cost & Processing
            </div>

            <div className="form-group">

              <label>Total Delivery Cost *</label>

              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g. PKR 300,000"
              />

              <small>
                This cost represents the complete delivery/team requirement.
              </small>

            </div>

            <div className="form-group">

              <label>Processing Type *</label>

              <select
                name="processing"
                value={formData.processing}
                onChange={handleChange}
              >
                <option value="">Select processing type</option>
                <option value="Normal Processing">
                  Normal Processing
                </option>
                <option value="Urgent Processing">
                  Urgent Processing
                </option>
              </select>

              <small>
                Select whether the delivery will follow normal or urgent
                processing.
              </small>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Standard Timeline *</label>

                <input
                  type="text"
                  name="standardTimeline"
                  value={formData.standardTimeline}
                  onChange={handleChange}
                  placeholder="e.g. 30 days"
                />

              </div>

              <div className="form-group">

                <label>Urgent / Optimal Timeline</label>

                <input
                  type="text"
                  name="urgentTimeline"
                  value={formData.urgentTimeline}
                  onChange={handleChange}
                  placeholder="e.g. 15 days"
                />

              </div>

            </div>

            {/* ================= 04 TEAM & SKILLS ================= */}

            <div className="form-section-title">
              <span>04</span>
              Team & Skills
            </div>

            <div className="form-group">

              <label>Team Members *</label>

              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="e.g. 2 Developers, 1 Designer, 1 QA"
              />

              <small>
                Mention the number and type of people available for delivery.
              </small>

            </div>

            <div className="form-group">

              <label>Team Roles</label>

              <textarea
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                rows="3"
                placeholder="e.g. Frontend Developer, Backend Developer, UI/UX Designer..."
              />

            </div>

            <div className="form-group">

              <label>Skills & Expertise</label>

              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows="3"
                placeholder="e.g. React, Python, Flask, MySQL, UI/UX, Project Management..."
              />

            </div>

            {/* ================= 05 TOOLS & RESOURCES ================= */}

            <div className="form-section-title">
              <span>05</span>
              Tools & Resources
            </div>

            <div className="form-group">

              <label>Available Tools & Software</label>

              <textarea
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                rows="4"
                placeholder="List the software, platforms, tools or systems available to your team..."
              />

            </div>

            <div className="form-group">

              <label>Physical Resources / Equipment</label>

              <textarea
                name="physicalResources"
                value={formData.physicalResources}
                onChange={handleChange}
                rows="4"
                placeholder="Mention available equipment, machines, hardware or other physical resources..."
              />

            </div>

            <div className="form-group">

              <label>Additional Resources Required</label>

              <textarea
                name="additionalResources"
                value={formData.additionalResources}
                onChange={handleChange}
                rows="4"
                placeholder="Mention any additional tools, equipment or resources you may need..."
              />

            </div>

            {/* ================= 06 LOCATION & PROOF ================= */}

            <div className="form-section-title">
              <span>06</span>
              Location & Proof
            </div>

            <div className="form-group">

              <label>Available Location(s)</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Islamabad, Rawalpindi, Lahore / Remote"
              />

              <small>
                You can mention multiple cities or remote availability.
              </small>

            </div>

            <div className="form-group">

              <label>Portfolio / Website / Demo Link</label>

              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />

              <small>
                Add a website, portfolio, product demo or relevant work link.
              </small>

            </div>

            <div className="form-group">

              <label>Notification / Update Period</label>

              <select
                name="notificationPeriod"
                value={formData.notificationPeriod}
                onChange={handleChange}
              >
                <option value="">Select update period</option>
                <option value="Every 24 Hours">
                  Every 24 Hours
                </option>
                <option value="Every 48 Hours">
                  Every 48 Hours
                </option>
                <option value="Weekly">
                  Weekly
                </option>
                <option value="On Status Change">
                  On Status Change
                </option>
              </select>

              <small>
                Select how frequently you can provide progress updates.
              </small>

            </div>

            {/* ================= ACTIONS ================= */}

            <div className="form-actions">

              <Link to="/" className="secondary-btn">
                Cancel
              </Link>

              <button type="submit" className="primary-btn">
                Publish Delivery →
              </button>

            </div>

          </form>

        </div>

        {/* ================= RIGHT SUMMARY ================= */}

        <aside className="project-summary">

          <div className="summary-header">

            <div>
              <span>02</span>
              <h3>Delivery Summary</h3>
            </div>

            <span className="live-label">LIVE</span>

          </div>

          {/* COMPLETION */}

          <div className="completion-card">

            <div className="completion-top">

              <span>Profile Completion</span>

              <strong>
                {filledFields}/{totalFields}
              </strong>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: `${completion}%`,
                }}
              ></div>

            </div>

            <small>
              {completion}% completed
            </small>

          </div>

          {/* PREVIEW */}

          <div className="summary-preview">

            <span>DELIVERY PREVIEW</span>

            <h2>
              {formData.title || "Your Delivery Title"}
            </h2>

            <strong>
              {formData.type || "Delivery Type"}
            </strong>

            <p>
              {formData.description ||
                "Your delivery description will appear here as you complete the form."}
            </p>

          </div>

          {/* DETAILS */}

          <div className="summary-details">

            <div>
              <span>Category</span>
              <strong>
                {formData.category || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Cost</span>
              <strong>
                {formData.cost || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Processing</span>
              <strong>
                {formData.processing || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Standard Time</span>
              <strong>
                {formData.standardTimeline || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Urgent Time</span>
              <strong>
                {formData.urgentTimeline || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Team</span>
              <strong>
                {formData.team || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Location</span>
              <strong>
                {formData.location || "Not specified"}
              </strong>
            </div>

          </div>

          {/* CHECKLIST */}

          <div className="summary-checklist">

            <span>BEFORE PUBLISHING</span>

            <p>✓ Delivery type selected</p>
            <p>✓ Clear delivery description</p>
            <p>✓ Scope & deliverables defined</p>
            <p>✓ Cost & processing defined</p>
            <p>✓ Team/resources mentioned</p>
            <p>✓ Location/proof provided</p>

          </div>

        </aside>

      </section>

    </main>
  );
}

export default Deliver;