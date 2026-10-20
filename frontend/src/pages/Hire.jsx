import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Hire() {
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
    budget: "",
    processing: "",
    standardTimeline: "",
    urgentTimeline: "",
    humanResources: "",
    roles: "",
    skills: "",
    tools: "",
    physicalResources: "",
    additionalResources: "",
    location: "",
    notificationPeriod: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const filledFields = Object.values(formData).filter(
    (value) => value.trim() !== ""
  ).length;

  const totalFields = Object.keys(formData).length;

  const completion = Math.round((filledFields / totalFields) * 100);

  return (
    <main className="deliver-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <section className="deliver-header">

        <div>

          <span className="page-badge">
            HIRE
          </span>

          <h1>
            Post Your <span>Requirement</span>
          </h1>

          <p>
            Clearly describe what you need, define the scope, resources,
            budget and timeline so suitable teams can understand and
            respond to your requirement.
          </p>

        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          New Requirement
        </div>

      </section>


      {/* =========================================
          THREE COLUMN WORKSPACE
      ========================================= */}

      <section className="deliver-workspace">


        {/* =====================================
            LEFT — REQUIREMENT GUIDE
        ===================================== */}

        <aside className="deliver-guide">

          <div className="side-heading">

            <span>01</span>

            <h3>Requirement Guide</h3>

          </div>


          <p className="side-intro">

            Provide complete information so suitable
            teams can understand exactly what you need.

          </p>


          <div className="guide-step active">

            <span>01</span>

            <div>

              <strong>Basic Information</strong>

              <small>
                Title, type and category
              </small>

            </div>

          </div>


          <div className="guide-step">

            <span>02</span>

            <div>

              <strong>Requirement Details</strong>

              <small>
                Description, scope and tasks
              </small>

            </div>

          </div>


          <div className="guide-step">

            <span>03</span>

            <div>

              <strong>Budget & Processing</strong>

              <small>
                Budget and processing priority
              </small>

            </div>

          </div>


          <div className="guide-step">

            <span>04</span>

            <div>

              <strong>Timeline</strong>

              <small>
                Standard and urgent timeline
              </small>

            </div>

          </div>


          <div className="guide-step">

            <span>05</span>

            <div>

              <strong>Human Resources</strong>

              <small>
                Roles, quantity and skills
              </small>

            </div>

          </div>


          <div className="guide-step">

            <span>06</span>

            <div>

              <strong>Tools & Resources</strong>

              <small>
                Software, equipment and resources
              </small>

            </div>

          </div>


          <div className="guide-step">

            <span>07</span>

            <div>

              <strong>Location & Updates</strong>

              <small>
                Locations and notification period
              </small>

            </div>

          </div>


          <div className="guide-tip">

            <strong>TIP</strong>

            <p>
              The more clearly you describe your requirement,
              the easier it becomes for suitable teams to
              understand and submit relevant proposals.
            </p>

          </div>

        </aside>



        {/* =====================================
            CENTER — REQUIREMENT FORM
        ===================================== */}

        <div className="deliver-form-card">

          <div className="form-card-header">

            <div>

              <span>
                HIRE REQUIREMENT
              </span>

              <h2>
                Requirement Information
              </h2>

            </div>

            <small>
              * Required
            </small>

          </div>


          <form
            className="requirement-form"
            onSubmit={(e) => e.preventDefault()}
          >


            {/* =================================
                01 BASIC INFORMATION
            ================================= */}

            <div className="form-section-title">

              <span>01</span>

              Basic Information

            </div>


            <div className="form-group">

              <label>
                Requirement Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. E-commerce Website Development"
              />

              <small>
                Give your requirement a short and clear title.
              </small>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Requirement Type *
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >

                  <option value="">
                    Select type
                  </option>

                  <option value="Product">
                    Product
                  </option>

                  <option value="Service">
                    Service
                  </option>

                  <option value="Task">
                    Task
                  </option>

                  <option value="Project">
                    Project
                  </option>

                  <option value="Human Resource">
                    Human Resource
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Software Development"
                />

              </div>

            </div>



            {/* =================================
                02 REQUIREMENT DETAILS
            ================================= */}

            <div className="form-section-title">

              <span>02</span>

              Requirement Details

            </div>


            <div className="form-group">

              <label>
                What Do You Need? *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Describe exactly what you need, your expectations, required features, quantity or other important details..."
              />

              <small>
                Explain your requirement clearly so teams can
                understand what needs to be provided.
              </small>

            </div>


            <div className="form-group">

              <label>
                Requirement Scope
              </label>

              <textarea
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                rows="5"
                placeholder="Define what should be included in the requirement and what should be covered..."
              />

              <small>
                Mention the boundaries, coverage and expected scope.
              </small>

            </div>


            <div className="form-group">

              <label>
                Tasks / Deliverables
              </label>

              <textarea
                name="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                rows="5"
                placeholder="List the main tasks, outputs or deliverables you expect..."
              />

              <small>
                You can list multiple tasks or expected outputs.
              </small>

            </div>



            {/* =================================
                03 BUDGET & PROCESSING
            ================================= */}

            <div className="form-section-title">

              <span>03</span>

              Budget & Processing

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Total Budget *
                </label>

                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. PKR 100,000"
                />

                <small>
                  Mention the total budget available for the complete requirement.
                </small>

              </div>


              <div className="form-group">

                <label>
                  Processing Type
                </label>

                <select
                  name="processing"
                  value={formData.processing}
                  onChange={handleChange}
                >

                  <option value="">
                    Select processing
                  </option>

                  <option value="Normal Processing">
                    Normal Processing
                  </option>

                  <option value="Urgent Processing">
                    Urgent Processing
                  </option>

                </select>

              </div>

            </div>



            {/* =================================
                04 TIMELINE
            ================================= */}

            <div className="form-section-title">

              <span>04</span>

              Timeline

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Standard / Required Timeline
                </label>

                <input
                  type="text"
                  name="standardTimeline"
                  value={formData.standardTimeline}
                  onChange={handleChange}
                  placeholder="e.g. 30 days"
                />

                <small>
                  Mention the normal time in which the requirement is needed.
                </small>

              </div>


              <div className="form-group">

                <label>
                  Urgent / Optimal Timeline
                </label>

                <input
                  type="text"
                  name="urgentTimeline"
                  value={formData.urgentTimeline}
                  onChange={handleChange}
                  placeholder="e.g. 15 days"
                />

                <small>
                  If urgent processing is selected, mention the preferred faster timeline.
                </small>

              </div>

            </div>



            {/* =================================
                05 HUMAN RESOURCES
            ================================= */}

            <div className="form-section-title">

              <span>05</span>

              Human Resources

            </div>


            <div className="form-group">

              <label>
                Required Human Resources
              </label>

              <input
                type="text"
                name="humanResources"
                value={formData.humanResources}
                onChange={handleChange}
                placeholder="e.g. 1 Project Manager, 2 Developers, 1 Designer"
              />

              <small>
                Mention the number of people or resources required.
              </small>

            </div>


            <div className="form-group">

              <label>
                Required Roles
              </label>

              <textarea
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                rows="4"
                placeholder="e.g. Project Manager, Frontend Developer, Backend Developer..."
              />

            </div>


            <div className="form-group">

              <label>
                Required Skills & Expertise
              </label>

              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows="4"
                placeholder="e.g. React, Python, Flask, UI/UX, Database Management..."
              />

              <small>
                Mention the skills or expertise you expect from the team.
              </small>

            </div>



            {/* =================================
                06 TOOLS & RESOURCES
            ================================= */}

            <div className="form-section-title">

              <span>06</span>

              Tools & Resources

            </div>


            <div className="form-group">

              <label>
                Required Tools / Software
              </label>

              <textarea
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                rows="4"
                placeholder="e.g. Figma, React, VS Code, MySQL, Adobe Photoshop..."
              />

            </div>


            <div className="form-group">

              <label>
                Physical Resources / Equipment
              </label>

              <textarea
                name="physicalResources"
                value={formData.physicalResources}
                onChange={handleChange}
                rows="4"
                placeholder="Mention any physical equipment, machinery, devices or other resources required..."
              />

            </div>


            <div className="form-group">

              <label>
                Additional Resources Required
              </label>

              <textarea
                name="additionalResources"
                value={formData.additionalResources}
                onChange={handleChange}
                rows="4"
                placeholder="Mention any additional resources, materials, information or support required..."
              />

            </div>



            {/* =================================
                07 LOCATION & UPDATES
            ================================= */}

            <div className="form-section-title">

              <span>07</span>

              Location & Updates

            </div>


            <div className="form-group">

              <label>
                Required Location(s)
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Islamabad, Rawalpindi, Lahore / Remote"
              />

              <small>
                Multiple locations can be mentioned if the requirement
                is needed in more than one place.
              </small>

            </div>


            <div className="form-group">

              <label>
                Notification / Update Period
              </label>

              <select
                name="notificationPeriod"
                value={formData.notificationPeriod}
                onChange={handleChange}
              >

                <option value="">
                  Select update period
                </option>

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
                Choose how often you would like requirement updates.
              </small>

            </div>



            {/* =================================
                ACTIONS
            ================================= */}

            <div className="form-actions">

              <Link
                to="/"
                className="secondary-btn"
              >
                Cancel
              </Link>


              <button
                type="submit"
                className="primary-btn"
              >
                Post Requirement →
              </button>

            </div>


          </form>

        </div>



        {/* =====================================
            RIGHT — LIVE SUMMARY
        ===================================== */}

        <aside className="project-summary">


          <div className="summary-header">

            <div>

              <span>02</span>

              <h3>
                Requirement Summary
              </h3>

            </div>

            <span className="live-label">
              LIVE
            </span>

          </div>



          {/* COMPLETION */}

          <div className="completion-card">

            <div className="completion-top">

              <span>
                Requirement Completion
              </span>

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
              {completion}% complete — add clear details
              to create a stronger requirement.
            </small>

          </div>



          {/* PREVIEW */}

          <div className="summary-preview">

            <span>
              REQUIREMENT PREVIEW
            </span>


            <h2>
              {formData.title || "Your Requirement"}
            </h2>


            <strong>
              {formData.type || "Product / Service / Project"}
            </strong>


            <p>
              {formData.description ||
                "Your requirement description will appear here as you fill in the form."}
            </p>

          </div>



          {/* DETAILS */}

          <div className="summary-details">


            <div>

              <span>
                Type
              </span>

              <strong>
                {formData.type || "Not specified"}
              </strong>

            </div>


            <div>

              <span>
                Category
              </span>

              <strong>
                {formData.category || "Not specified"}
              </strong>

            </div>


            <div>

              <span>
                Budget
              </span>

              <strong>
                {formData.budget || "Not specified"}
              </strong>

            </div>


            <div>

              <span>
                Processing
              </span>

              <strong>
                {formData.processing || "Not specified"}
              </strong>

            </div>


            <div>

              <span>
                Timeline
              </span>

              <strong>
                {formData.standardTimeline || "Not specified"}
              </strong>

            </div>


            <div>

              <span>
                Location
              </span>

              <strong>
                {formData.location || "Not specified"}
              </strong>

            </div>


            <div>

              <span>
                Human Resources
              </span>

              <strong>
                {formData.humanResources || "Not specified"}
              </strong>

            </div>


          </div>



          {/* CHECKLIST */}

          <div className="summary-checklist">

            <span>
              BEFORE POSTING
            </span>


            <p>
              ✓ Clear requirement title
            </p>


            <p>
              ✓ Requirement type selected
            </p>


            <p>
              ✓ Detailed requirement description
            </p>


            <p>
              ✓ Scope and deliverables defined
            </p>


            <p>
              ✓ Budget and processing defined
            </p>


            <p>
              ✓ Timeline mentioned
            </p>


            <p>
              ✓ Human resources and skills mentioned
            </p>


            <p>
              ✓ Location and update period selected
            </p>

          </div>


        </aside>


      </section>

    </main>
  );
}

export default Hire;