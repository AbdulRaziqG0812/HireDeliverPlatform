import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PAKISTAN_CITIES = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Gujranwala",
  "Sialkot",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Mardan",
  "Gujrat",
  "Wah Cantt",
  "Taxila",
  "Murree",
  "Jhelum",
  "Attock",
  "Sahiwal",
  "Okara",
  "Kasur",
  "Dera Ghazi Khan",
  "Rahim Yar Khan",
  "Sukkur",
  "Larkana",
  "Nawabshah",
  "Mingora",
  "Chakwal",
  "Khushab",
  "Mianwali",
  "Bannu",
  "Kohat",
  "Swat",
  "Mansehra",
  "Nowshera",
  "Haripur",
  "Dera Ismail Khan",
  "Gwadar",
  "Turbat",
  "Chaman",
  "Zhob",
  "Khuzdar",
  "Skardu",
  "Gilgit",
  "Muzaffarabad",
  "Mirpur",
  "Rawalakot",
  "Other",
];

const CURRENCIES = [
  "PKR",
  "USD",
  "AED",
  "SAR",
  "QAR",
  "OMR",
  "KWD",
  "GBP",
  "EUR",
  "CAD",
  "AUD",
];

const createTeamMember = () => ({
  name: "",
  role: "",
  skills: "",
  experience: "",
  profile: "",
  similarExperience: "",
});

function Deliver() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    country: "Pakistan",

    title: "",
    type: "",
    category: "",

    description: "",
    scope: "",
    deliverables: "",

    currency: "PKR",
    amount: "",
    includedCost: "",
    excludedCost: "",

    processing: "",
    standardTimeline: "",
    urgentTimeline: "",

    teamMembers: [createTeamMember()],

    availableResources: "",
    requiredResources: "",

    tools: "",
    physicalResources: "",
    additionalResources: "",

    city: "",
    fullLocation: "",

    portfolio: "",
    uploadedFiles: [],

    notificationPeriod: "",
    notificationDetails: "",

    communicationMethod: "",
    communicationDetails: "",
  });

  /* ================= GENERAL INPUT ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= FILE UPLOAD ================= */

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files],
    }));

    e.target.value = "";
  };

  const removeUploadedFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(
        (_, fileIndex) => fileIndex !== index
      ),
    }));
  };

  /* ================= TEAM MEMBERS ================= */

  const handleTeamMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedMembers = [...prev.teamMembers];

      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };

      return {
        ...prev,
        teamMembers: updatedMembers,
      };
    });
  };

  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        createTeamMember(),
      ],
    }));
  };

  const removeTeamMember = (index) => {
    if (formData.teamMembers.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(
        (_, memberIndex) => memberIndex !== index
      ),
    }));
  };

  /* ================= COMPLETION ================= */

  const fieldsForCompletion = {
    country: formData.country,
    title: formData.title,
    type: formData.type,
    category: formData.category,
    description: formData.description,
    scope: formData.scope,
    deliverables: formData.deliverables,
    currency: formData.currency,
    amount: formData.amount,
    includedCost: formData.includedCost,
    processing: formData.processing,
    standardTimeline: formData.standardTimeline,
    teamMembers: formData.teamMembers,
    availableResources: formData.availableResources,
    requiredResources: formData.requiredResources,
    city: formData.city,
    fullLocation: formData.fullLocation,
    communicationMethod: formData.communicationMethod,
  };

  const isFilled = (value) => {
    if (Array.isArray(value)) {
      return value.some((item) => {
        if (typeof item === "object" && item !== null) {
          return Object.values(item).some(
            (itemValue) =>
              String(itemValue || "").trim() !== ""
          );
        }

        return String(item || "").trim() !== "";
      });
    }

    return String(value || "").trim() !== "";
  };

  const filledFields = Object.values(fieldsForCompletion).filter(
    isFilled
  ).length;

  const totalFields = Object.keys(fieldsForCompletion).length;

  const completion = Math.round(
    (filledFields / totalFields) * 100
  );

  return (
    <>
      <Navbar />

      <main className="deliver-page">

        {/* ================= HEADER ================= */}

        <section className="deliver-header">

          <div>
            <span className="page-badge">
              DELIVER
            </span>

            <h1>
              Create Your <span>Delivery Profile</span>
            </h1>

            <p>
              Tell potential clients what your team can deliver,
              where you can deliver it, your available resources,
              cost, timeline and team expertise.
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
              Complete the sections below to clearly explain
              what you and your team can deliver.
            </p>

            <div className="guide-step active">
              <span>01</span>
              <div>
                <strong>Basic Information</strong>
                <small>
                  Country, type, title and category
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>02</span>
              <div>
                <strong>Delivery Details</strong>
                <small>
                  Description, scope and deliverables
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>03</span>
              <div>
                <strong>Cost & Processing</strong>
                <small>
                  Cost, currency and timeline
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>04</span>
              <div>
                <strong>Team & Skills</strong>
                <small>
                  Members, roles and expertise
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>05</span>
              <div>
                <strong>Resources</strong>
                <small>
                  Available and required resources
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>06</span>
              <div>
                <strong>Location & Proof</strong>
                <small>
                  Location and supporting documents
                </small>
              </div>
            </div>

            <div className="guide-tip">
              <strong>TIP</strong>

              <p>
                Provide complete delivery information so clients
                can understand your capability before contacting you.
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

                <label>
                  Delivery Country *
                </label>

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="Pakistan">
                    Pakistan
                  </option>

                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>

                  <option value="Saudi Arabia">
                    Saudi Arabia
                  </option>

                  <option value="Qatar">
                    Qatar
                  </option>

                  <option value="United Kingdom">
                    United Kingdom
                  </option>

                  <option value="United States">
                    United States
                  </option>

                  <option value="Canada">
                    Canada
                  </option>

                  <option value="Australia">
                    Australia
                  </option>

                  <option value="Germany">
                    Germany
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                <small>
                  Select the country where your delivery capability
                  is available.
                </small>

              </div>

              <div className="form-group">

                <label>
                  What Can You Deliver? *
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">
                    Select delivery type
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

                <small>
                  Select the product, service, task or project
                  your team can deliver.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Delivery Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete E-commerce Website Development"
                />

              </div>

              <div className="form-group">

                <label>
                  Delivery Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select a category
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

                <label>
                  What Can Your Team Provide? *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Explain the product, service, task or project your team can provide..."
                />

                <small>
                  Clearly explain what you can deliver to the client.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Delivery Scope *
                </label>

                <textarea
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Explain the complete scope of your delivery..."
                />

                <small>
                  Mention what is included in your delivery responsibility.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Deliverables / Task Breakdown *
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

              </div>

              {/* ================= 03 COST & PROCESSING ================= */}

              <div className="form-section-title">
                <span>03</span>
                Cost & Processing
              </div>

              <div className="form-group">

                <label>
                  Delivery Cost *
                </label>

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Currency *
                    </label>

                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      {CURRENCIES.map((currency) => (
                        <option
                          key={currency}
                          value={currency}
                        >
                          {currency}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Amount *
                    </label>

                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 300000"
                    />

                  </div>

                </div>

                <small>
                  Enter the total amount you expect for the complete delivery.
                </small>

              </div>

              <div className="form-group">

                <label>
                  What Is Included in the Cost? *
                </label>

                <textarea
                  name="includedCost"
                  value={formData.includedCost}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Mention the services, deliverables and resources included in this cost..."
                />

              </div>

              <div className="form-group">

                <label>
                  What Is Not Included in the Cost?
                </label>

                <textarea
                  name="excludedCost"
                  value={formData.excludedCost}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Mention any additional services, resources or expenses not included..."
                />

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
                  <strong>Important:</strong> Urgent Processing means
                  the delivery will require faster execution and may
                  involve additional effort, resources or priority
                  handling. The final processing terms can be discussed
                  with the client before confirmation.
                </small>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Standard Delivery Timeline *
                  </label>

                  <input
                    type="text"
                    name="standardTimeline"
                    value={formData.standardTimeline}
                    onChange={handleChange}
                    placeholder="e.g. 30 days"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Urgent / Priority Timeline
                  </label>

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

                <label>
                  Delivery Team Members *
                </label>

                <small>
                  Add every person who will contribute to the delivery.
                </small>

              </div>

              <div className="team-members-wrapper">

                {formData.teamMembers.map((member, index) => (

                  <div
                    className="team-member-card"
                    key={index}
                  >

                    <div className="team-member-header">

                      <div>
                        <span className="team-member-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <strong>
                          Team Member {index + 1}
                        </strong>
                      </div>

                      {formData.teamMembers.length > 1 && (
                        <button
                          type="button"
                          className="remove-team-btn"
                          onClick={() =>
                            removeTeamMember(index)
                          }
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Member Name *
                        </label>

                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Abdul Raziq"
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Role *
                        </label>

                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              index,
                              "role",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Frontend Developer"
                        />

                      </div>

                    </div>

                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Skills / Expertise
                        </label>

                        <input
                          type="text"
                          value={member.skills}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              index,
                              "skills",
                              e.target.value
                            )
                          }
                          placeholder="e.g. React, Python, Flask"
                        />

                      </div>

                      <div className="form-group">

                        <label>
                          Years of Experience
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={member.experience}
                          onChange={(e) =>
                            handleTeamMemberChange(
                              index,
                              "experience",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 3"
                        />

                      </div>

                    </div>

                     {/* ================= FILE UPLOAD ================= */}

              <div className="form-group">

                <label>
                  Upload Supporting Files
                </label>

                <div className="file-upload-box">

                  <input
                    type="file"
                    id="delivery-files"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                    onChange={handleFileUpload}
                  />

                  <label
                    htmlFor="delivery-files"
                    className="file-upload-label"
                  >
                    <span className="upload-icon">
                      ↑
                    </span>

                    <strong>
                      Upload CV, Portfolio or Documents
                    </strong>

                    <small>
                      PDF, Word, Excel, PowerPoint, Images or ZIP
                    </small>
                  </label>

                </div>

                {formData.uploadedFiles.length > 0 && (

                  <div className="uploaded-files-list">

                    {formData.uploadedFiles.map(
                      (file, index) => (

                        <div
                          className="uploaded-file-item"
                          key={`${file.name}-${index}`}
                        >

                          <div>
                            <strong>
                              {file.name}
                            </strong>

                            <small>
                              {(
                                file.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </small>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeUploadedFile(index)
                            }
                          >
                            Remove
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

                <small>
                  You can upload CVs, certificates, previous work,
                  company profiles or other supporting documents.
                </small>

              </div>


                    <div className="form-group">

                      <label>
                        Similar Experience
                      </label>

                      <input
                        type="text"
                        value={member.similarExperience}
                        onChange={(e) =>
                          handleTeamMemberChange(
                            index,
                            "similarExperience",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 5 similar projects"
                      />

                    </div>

                  </div>

                ))}

                <button
                  type="button"
                  className="add-team-btn"
                  onClick={addTeamMember}
                >
                  <span>+</span>
                  Add Another Team Member
                </button>

              </div>

              

              {/* ================= 05 RESOURCES ================= */}

              <div className="form-section-title">
                <span>05</span>
                Resources & Tools
              </div>

              <div className="form-group">

                <label>
                  Available Resources *
                </label>

                <textarea
                  name="availableResources"
                  value={formData.availableResources}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Mention the resources currently available to your team..."
                />

              </div>

              <div className="form-group">

                <label>
                  Required Resources
                </label>

                <textarea
                  name="requiredResources"
                  value={formData.requiredResources}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Mention any additional resources required to complete the delivery..."
                />

              </div>

              <div className="form-group">

                <label>
                  Available Tools & Software
                </label>

                <textarea
                  name="tools"
                  value={formData.tools}
                  onChange={handleChange}
                  rows="4"
                  placeholder="List software, platforms, tools or systems available to your team..."
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
                  placeholder="Mention available equipment, machines, hardware or other physical resources..."
                />

              </div>

              <div className="form-group">

                <label>
                  Additional Resources
                </label>

                <textarea
                  name="additionalResources"
                  value={formData.additionalResources}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Mention any other resources related to your delivery..."
                />

              </div>

              {/* ================= 06 LOCATION & PROOF ================= */}

              <div className="form-section-title">
                <span>06</span>
                Location & Proof
              </div>

              <div className="form-group">

                <label>
                  Delivery City *
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                >

                  <option value="">
                    Select delivery city
                  </option>

                  {PAKISTAN_CITIES.map((city) => (
                    <option
                      key={city}
                      value={city}
                    >
                      {city}
                    </option>
                  ))}

                </select>

                <small>
                  Select the main city where you can provide the delivery.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Full Delivery Location / Address
                </label>

                <textarea
                  name="fullLocation"
                  value={formData.fullLocation}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter complete address, area, office location or other delivery details..."
                />

              </div>

              <div className="form-group">

                <label>
                  Portfolio / Website / Demo Link
                </label>

                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />

                <small>
                  Add a portfolio, website, product demo or relevant work link.
                </small>

              </div>

              {/* ================= FILE UPLOAD ================= */}

              <div className="form-group">

                <label>
                  Upload Supporting Files
                </label>

                <div className="file-upload-box">

                  <input
                    type="file"
                    id="delivery-files"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                    onChange={handleFileUpload}
                  />

                  <label
                    htmlFor="delivery-files"
                    className="file-upload-label"
                  >
                    <span className="upload-icon">
                      ↑
                    </span>

                    <strong>
                      Upload CV, Portfolio or Documents
                    </strong>

                    <small>
                      PDF, Word, Excel, PowerPoint, Images or ZIP
                    </small>
                  </label>

                </div>

                {formData.uploadedFiles.length > 0 && (

                  <div className="uploaded-files-list">

                    {formData.uploadedFiles.map(
                      (file, index) => (

                        <div
                          className="uploaded-file-item"
                          key={`${file.name}-${index}`}
                        >

                          <div>
                            <strong>
                              {file.name}
                            </strong>

                            <small>
                              {(
                                file.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </small>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeUploadedFile(index)
                            }
                          >
                            Remove
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

                <small>
                  You can upload CVs, certificates, previous work,
                  company profiles or other supporting documents.
                </small>

              </div>

              {/* ================= 07 NOTIFICATION ================= */}

              <div className="form-section-title">
                <span>07</span>
                Notification & Communication
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

              </div>

              <div className="form-group">

                <label>
                  Additional Notification Details
                </label>

                <textarea
                  name="notificationDetails"
                  value={formData.notificationDetails}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Add any additional information about progress updates or delivery notifications..."
                />

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

                  <option value="Phone Call">
                    Phone Call
                  </option>

                  <option value="Email">
                    Email
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

                  <option value="Any Method">
                    Any Method
                  </option>

                </select>

                <small>
                  Select how potential clients should contact you
                  regarding your delivery proposal.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Communication Details
                </label>

                <input
                  type="text"
                  name="communicationDetails"
                  value={formData.communicationDetails}
                  onChange={handleChange}
                  placeholder="e.g. +92 300 1234567 or your@email.com"
                />

                <small>
                  Provide the phone number, email address or other
                  contact detail associated with your selected method.
                </small>

              </div>

              {/* ================= ACTIONS ================= */}

              <div className="form-actions">

                <Link
                  to="/home"
                  className="secondary-btn"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="primary-btn"
                >
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

              <span className="live-label">
                LIVE
              </span>

            </div>

            {/* COMPLETION */}

            <div className="completion-card">

              <div className="completion-top">

                <span>
                  Profile Completion
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
                {completion}% completed
              </small>

            </div>

            {/* PREVIEW */}

            <div className="summary-preview">

              <span>
                DELIVERY PREVIEW
              </span>

              <h2>
                {formData.title ||
                  "Your Delivery Title"}
              </h2>

              <strong>
                {formData.type ||
                  "Delivery Type"}
              </strong>

              <p>
                {formData.description ||
                  "Your delivery description will appear here as you complete the form."}
              </p>

            </div>

            {/* DETAILS */}

            <div className="summary-details">

              <div>
                <span>Country</span>

                <strong>
                  {formData.country ||
                    "Pakistan"}
                </strong>
              </div>

              <div>
                <span>Category</span>

                <strong>
                  {formData.category ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Delivery Cost</span>

                <strong>
                  {formData.amount
                    ? `${formData.currency} ${formData.amount}`
                    : "Not specified"}
                </strong>
              </div>

              <div>
                <span>Processing</span>

                <strong>
                  {formData.processing ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Standard Time</span>

                <strong>
                  {formData.standardTimeline ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Team Members</span>

                <strong>
                  {formData.teamMembers.length}
                </strong>
              </div>

              <div>
                <span>City</span>

                <strong>
                  {formData.city ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Communication</span>

                <strong>
                  {formData.communicationMethod ||
                    "Not specified"}
                </strong>
              </div>

            </div>

            {/* CHECKLIST */}

            <div className="summary-checklist">

              <span>
                BEFORE PUBLISHING
              </span>

              <p>
                ✓ Delivery type selected
              </p>

              <p>
                ✓ Clear delivery description
              </p>

              <p>
                ✓ Scope & deliverables defined
              </p>

              <p>
                ✓ Cost & processing defined
              </p>

              <p>
                ✓ Team members added
              </p>

              <p>
                ✓ Resources mentioned
              </p>

              <p>
                ✓ Location provided
              </p>

              <p>
                ✓ Communication method selected
              </p>

            </div>

          </aside>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Deliver;