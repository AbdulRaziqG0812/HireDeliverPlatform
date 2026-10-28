import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    fullLocation: "",
    communicationMethod: "",
    notificationPeriod: "",
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  /* ================= SUBMIT FORM ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const accessToken = localStorage.getItem("hireDeliverAccessToken");

      if (!accessToken) {
        setSubmitError("Your login session has expired. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const data = new FormData();

      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("scope", formData.scope);
      data.append("deliverables", formData.deliverables);
      data.append("budget", formData.budget);
      data.append("processing", formData.processing);
      data.append("standardTimeline", formData.standardTimeline);
      data.append("urgentTimeline", formData.urgentTimeline);
      data.append("humanResources", formData.humanResources);
      data.append("roles", formData.roles);
      data.append("skills", formData.skills);
      data.append("tools", formData.tools);
      data.append("physicalResources", formData.physicalResources);
      data.append("additionalResources", formData.additionalResources);
      data.append("location", formData.location);
      data.append("fullLocation", formData.fullLocation);
      data.append("communicationMethod", formData.communicationMethod);
      data.append("notificationPeriod", formData.notificationPeriod);

      files.forEach((file) => {
        data.append("uploadedFiles", file);
      });

      const response = await fetch("http://127.0.0.1:5000/api/hire/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("hireDeliverAccessToken");
        localStorage.removeItem("hireDeliverLoggedIn");
        localStorage.removeItem("hireDeliverUser");
        setSubmitError("Your login session has expired. Please login again.");
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit requirement.");
      }

      setSubmitMessage(
        "Your hire requirement has been submitted successfully. The form is now ready for a new submission."
      );

      setFormData({
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
        fullLocation: "",
        communicationMethod: "",
        notificationPeriod: "",
      });

      setFiles([]);

      const fileInput = document.getElementById("hireFiles");
      if (fileInput) {
        fileInput.value = "";
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Hire submission:", result);

    } catch (error) {
      console.error("Hire submission error:", error);
      setSubmitError(
        error.message ||
        "Something went wrong while submitting the requirement."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filledFields = Object.values(formData).filter(
    (value) => value.trim() !== ""
  ).length;

  const totalFields = Object.keys(formData).length;

  const completion = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <Navbar />


      {/* ================= HIRE PAGE ================= */}

      <main className="deliver-page">

        {/* ================= HEADER ================= */}

        <section className="deliver-header">

          <div>
            <span className="page-badge">
              HIRE
            </span>

            <h1>
              Post Your <span>Requirement</span>
            </h1>

            <p>
              Tell teams and service providers exactly what you need,
              including your requirements, budget, timeline, resources,
              location and preferred communication method.
            </p>
          </div>

          <div className="header-status">
            <span className="status-dot"></span>
            New Requirement
          </div>

        </section>


        {/* ================= WORKSPACE ================= */}

        <section className="deliver-workspace">


          {/* ================= LEFT GUIDE ================= */}

          <aside className="deliver-guide">

            <div className="side-heading">
              <span>01</span>
              <h3>Requirement Guide</h3>
            </div>

            <p className="side-intro">
              Provide complete information so suitable teams and
              service providers can understand exactly what you need.
            </p>


            <div className="guide-step active">
              <span>01</span>
              <div>
                <strong>Basic Information</strong>
                <small>Title, type and category</small>
              </div>
            </div>


            <div className="guide-step">
              <span>02</span>
              <div>
                <strong>Requirement Details</strong>
                <small>Description, scope and tasks</small>
              </div>
            </div>


            <div className="guide-step">
              <span>03</span>
              <div>
                <strong>Budget & Processing</strong>
                <small>Budget and processing priority</small>
              </div>
            </div>


            <div className="guide-step">
              <span>04</span>
              <div>
                <strong>Timeline</strong>
                <small>Required and urgent timeline</small>
              </div>
            </div>


            <div className="guide-step">
              <span>05</span>
              <div>
                <strong>Human Resources</strong>
                <small>Roles, quantity and skills</small>
              </div>
            </div>


            <div className="guide-step">
              <span>06</span>
              <div>
                <strong>Tools & Resources</strong>
                <small>Software, equipment and resources</small>
              </div>
            </div>


            <div className="guide-step">
              <span>07</span>
              <div>
                <strong>Location & Communication</strong>
                <small>Location and preferred contact</small>
              </div>
            </div>


            <div className="guide-tip">
              <strong>TIP</strong>

              <p>
                The more clearly you describe your requirement,
                the easier it becomes for suitable providers to
                understand and submit relevant proposals.
              </p>
            </div>

          </aside>


          {/* ================= CENTER FORM ================= */}

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

            {submitMessage && (
              <div className="submit-success">
                {submitMessage}
              </div>
            )}

            {submitError && (
              <div className="submit-error">
                {submitError}
              </div>
            )}

            <form
              className="requirement-form"
              onSubmit={handleSubmit}
            >


              {/* ================= 01 BASIC ================= */}

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
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select category
                    </option>

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

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="Research">
                      Research
                    </option>

                    <option value="Consulting">
                      Consulting
                    </option>

                    <option value="Technical Service">
                      Technical Service
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              {/* ================= 02 DETAILS ================= */}

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
                  Clearly explain the product, service, task or project
                  you want a provider to deliver.
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
                  placeholder={`Example:
1. UI/UX Design
2. Frontend Development
3. Backend Development
4. Database Integration
5. Testing
6. Deployment`}
                />

                <small>
                  Specify the main tasks, outputs or deliverables you expect.
                </small>

              </div>


              {/* ================= 03 BUDGET ================= */}

              <div className="form-section-title">
                <span>03</span>
                Budget & Processing
              </div>


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
                  Mention the maximum or expected budget available
                  for the complete requirement.
                </small>

              </div>


              <div className="form-group">

                <label>
                  Processing Type *
                </label>

                <select
                  name="processing"
                  value={formData.processing}
                  onChange={handleChange}
                >

                  <option value="">
                    Select processing type
                  </option>

                  <option value="Normal Processing">
                    Normal Processing
                  </option>

                  <option value="Urgent Processing">
                    Urgent Processing
                  </option>

                </select>

                <small>
                  Urgent processing may require additional cost because
                  the provider may need to allocate extra resources or
                  complete the work in a shorter time.
                </small>

              </div>


              {/* ================= 04 TIMELINE ================= */}

              <div className="form-section-title">
                <span>04</span>
                Timeline
              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>
                    Standard / Required Timeline *
                  </label>

                  <input
                    type="text"
                    name="standardTimeline"
                    value={formData.standardTimeline}
                    onChange={handleChange}
                    placeholder="e.g. 30 days"
                  />

                  <small>
                    Mention when you normally need the requirement completed.
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
                    Mention the fastest preferred completion time if needed.
                  </small>

                </div>

              </div>


              {/* ================= 05 HUMAN RESOURCES ================= */}

              <div className="form-section-title">
                <span>05</span>
                Human Resources
              </div>


              <div className="form-group">

                <label>
                  Required Human Resources
                </label>

                <textarea
                  name="humanResources"
                  value={formData.humanResources}
                  onChange={handleChange}
                  rows="4"
                  placeholder={`Example:
1. 1 Project Manager
2. 2 Frontend Developers
3. 1 Backend Developer
4. 1 UI/UX Designer`}
                />

                <small>
                  Mention the people, quantity and type of resources
                  required for your project or task.
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
                  placeholder="e.g. Project Manager, Frontend Developer, Backend Developer, UI/UX Designer..."
                />

                <small>
                  Mention the specific roles you expect from the provider.
                </small>

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
                  placeholder="e.g. React.js, Python, Flask, MySQL, UI/UX, Project Management..."
                />

                <small>
                  Mention the skills and expertise required from the team.
                </small>

              </div>


              {/* ================= 06 TOOLS ================= */}

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
                  placeholder="e.g. Figma, React, VS Code, MySQL, Adobe Photoshop, AutoCAD..."
                />

                <small>
                  Mention any specific software, platforms or tools
                  that the provider should have or use.
                </small>

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
                  placeholder="Mention any physical equipment, machinery, devices or hardware required..."
                />

                <small>
                  Mention equipment or physical resources needed for the requirement.
                </small>

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
                  placeholder="Mention any additional materials, information, support, resources or special requirements..."
                />

                <small>
                  Mention anything else the service provider must arrange
                  or have available.
                </small>

              </div>


              {/* ================= 07 LOCATION ================= */}

              <div className="form-section-title">
                <span>07</span>
                Location & Communication
              </div>


              <div className="form-group">

                <label>
                  Required City *
                </label>

                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                >

                  <option value="">
                    Select city
                  </option>

                  <option value="Islamabad">
                    Islamabad
                  </option>

                  <option value="Rawalpindi">
                    Rawalpindi
                  </option>

                  <option value="Lahore">
                    Lahore
                  </option>

                  <option value="Karachi">
                    Karachi
                  </option>

                  <option value="Peshawar">
                    Peshawar
                  </option>

                  <option value="Quetta">
                    Quetta
                  </option>

                  <option value="Multan">
                    Multan
                  </option>

                  <option value="Faisalabad">
                    Faisalabad
                  </option>

                  <option value="Gujranwala">
                    Gujranwala
                  </option>

                  <option value="Sialkot">
                    Sialkot
                  </option>

                  <option value="Bahawalpur">
                    Bahawalpur
                  </option>

                  <option value="Sargodha">
                    Sargodha
                  </option>

                  <option value="Hyderabad">
                    Hyderabad
                  </option>

                  <option value="Abbottabad">
                    Abbottabad
                  </option>

                  <option value="Mardan">
                    Mardan
                  </option>

                  <option value="Remote">
                    Remote
                  </option>

                  <option value="Multiple Cities">
                    Multiple Cities
                  </option>

                </select>

                <small>
                  Select where the product, service or project is required.
                </small>

              </div>


              <div className="form-group">

                <label>
                  Full Location / Address
                </label>

                <textarea
                  name="fullLocation"
                  value={formData.fullLocation}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter complete address, area, office, site or other location details..."
                />

                <small>
                  Provide detailed location information if required.
                </small>

              </div>


              <div className="form-group">

                <label>
                  Preferred Communication Method *
                </label>

                <select
                  name="communicationMethod"
                  value={formData.communicationMethod}
                  onChange={handleChange}
                >

                  <option value="">
                    Select communication method
                  </option>

                  <option value="Email">
                    Email
                  </option>

                  <option value="Phone Call">
                    Phone Call
                  </option>

                  <option value="WhatsApp">
                    WhatsApp
                  </option>

                  <option value="SMS">
                    SMS
                  </option>

                  <option value="Video Call">
                    Video Call
                  </option>

                  <option value="Platform Messages">
                    Platform Messages
                  </option>

                  <option value="Multiple Methods">
                    Multiple Methods
                  </option>

                </select>

                <small>
                  Select your preferred method for communicating with providers.
                </small>

              </div>


              {/* ================= 08 DOCUMENTS ================= */}

              <div className="form-section-title">
                <span>08</span>
                Requirement Documents
              </div>


              <div className="form-group">

                <label>
                  Upload Requirement Files
                </label>

                <div className="file-upload-box">

                  <input
                    type="file"
                    id="hireFiles"
                    multiple
                    onChange={handleFileChange}
                  />

                  <label
                    htmlFor="hireFiles"
                    className="file-upload-label"
                  >
                    <span className="upload-icon">
                      ↑
                    </span>

                    <strong>
                      Upload Files
                    </strong>

                    <small>
                      Add PDF, DOC, DOCX, images or other relevant files
                    </small>
                  </label>

                </div>


                {files.length > 0 && (
                  <div className="uploaded-files-list">

                    {files.map((file, index) => (
                      <div
                        className="uploaded-file-item"
                        key={index}
                      >

                        <span>
                          {file.name}
                        </span>

                        <small>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </small>

                      </div>
                    ))}

                  </div>
                )}

                <small>
                  Upload specifications, reference documents,
                  drawings, requirements or other useful files.
                </small>

              </div>


              {/* ================= 09 UPDATES ================= */}

              <div className="form-section-title">
                <span>09</span>
                Updates & Follow-up
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
                  Choose how often you would like to receive requirement
                  or project updates.
                </small>

              </div>


              {/* ================= ACTIONS ================= */}

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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Post Requirement →"}
                </button>

              </div>

            </form>

          </div>


          {/* ================= RIGHT SUMMARY ================= */}

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
                {completion}% complete
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
                  City
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


              <div>
                <span>
                  Communication
                </span>

                <strong>
                  {formData.communicationMethod || "Not specified"}
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
                ✓ Tools and resources defined
              </p>


              <p>
                ✓ Location and communication selected
              </p>

            </div>

          </aside>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <Footer />

    </div>
  );
}

export default Hire;