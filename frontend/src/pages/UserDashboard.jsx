import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const [hires, setHires] = useState([]);
  const [delivers, setDelivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  /* =====================================================
     LOAD DASHBOARD
     ===================================================== */

  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem(
      "hireDeliverAccessToken"
    );

    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard(token);
  }, [navigate]);

  const loadDashboard = async (token) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:5000/api/dashboard/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "hireDeliverAccessToken"
        );

        localStorage.removeItem(
          "hireDeliverLoggedIn"
        );

        localStorage.removeItem(
          "hireDeliverUser"
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load dashboard data."
        );
      }

      setHires(
        Array.isArray(data.hires)
          ? data.hires
          : []
      );

      setDelivers(
        Array.isArray(data.delivers)
          ? data.delivers
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while loading dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     HELPERS
     ===================================================== */

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLabel = (key) => {
    return String(key)
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getTitle = (item) => {
    return (
      item.title ||
      item.project_title ||
      item.projectTitle ||
      item.name ||
      item.service_title ||
      item.serviceTitle ||
      "Untitled Submission"
    );
  };

  const getDescription = (item) => {
    return (
      item.description ||
      item.project_description ||
      item.projectDescription ||
      item.details ||
      "No description provided."
    );
  };

  const getBudget = (item) => {
    return (
      item.budget ||
      item.cost ||
      item.estimated_cost ||
      item.estimatedCost ||
      item.price ||
      "Not specified"
    );
  };

  const getCreatedDate = (item) => {
    return (
      item.created_at ||
      item.createdAt ||
      item.submitted_at ||
      item.submittedAt
    );
  };

  /* =====================================================
     SAFE VALUE HELPERS
     ===================================================== */

  const parsePossibleJSON = (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      return value;
    }

    if (
      (trimmed.startsWith("{") &&
        trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") &&
        trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return value;
      }
    }

    return value;
  };

  const isFileObject = (value) => {
    if (!value || typeof value !== "object") {
      return false;
    }

    return Boolean(
      value.original_name ||
        value.originalName ||
        value.file_name ||
        value.fileName ||
        value.filename ||
        value.file_type ||
        value.fileType ||
        value.file_size ||
        value.fileSize ||
        value.stored_name ||
        value.storedName ||
        value.file_path ||
        value.filePath
    );
  };

  const isTeamMemberObject = (value) => {
    if (!value || typeof value !== "object") {
      return false;
    }

    return Boolean(
      value.name ||
        value.fullName ||
        value.full_name ||
        value.member_name ||
        value.memberName ||
        value.designation ||
        value.role ||
        value.skills ||
        value.email ||
        value.phone ||
        value.contact ||
        value.communication_method
    );
  };

  const formatFileSize = (size) => {
    if (
      size === null ||
      size === undefined ||
      size === ""
    ) {
      return "Size not available";
    }

    const numericSize = Number(size);

    if (Number.isNaN(numericSize)) {
      return String(size);
    }

    if (numericSize < 1024) {
      return `${numericSize} Bytes`;
    }

    if (numericSize < 1024 * 1024) {
      return `${(
        numericSize / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      numericSize /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  const getFileName = (file, index) => {
    return (
      file?.original_name ||
      file?.originalName ||
      file?.file_name ||
      file?.fileName ||
      file?.filename ||
      file?.name ||
      `Uploaded File ${index + 1}`
    );
  };

  const getFileType = (file) => {
    return (
      file?.file_type ||
      file?.fileType ||
      file?.mime_type ||
      file?.mimeType ||
      "Uploaded file"
    );
  };

  const getFileSize = (file) => {
    return formatFileSize(
      file?.file_size ??
        file?.fileSize ??
        file?.size
    );
  };

  const getTeamMembers = (record) => {
    const possibleValues = [
      record?.team_members,
      record?.teamMembers,
      record?.members,
      record?.team,
      record?.team_member,
      record?.teamMember,
    ];

    for (const value of possibleValues) {
      const parsed = parsePossibleJSON(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return [parsed];
      }
    }

    return [];
  };

  const getFiles = (record) => {
    const possibleValues = [
      record?.files,
      record?.uploaded_files,
      record?.uploadedFiles,
      record?.documents,
      record?.attachments,
      record?.uploaded_documents,
    ];

    for (const value of possibleValues) {
      const parsed = parsePossibleJSON(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return [parsed];
      }
    }

    return [];
  };

  /* =====================================================
     SEARCH
     ===================================================== */

  const searchRecords = (records) => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return records;
    }

    return records.filter((record) => {
      const searchableText =
        JSON.stringify(record);

      return searchableText
        .toLowerCase()
        .includes(search);
    });
  };

  const filteredHires = useMemo(
    () => searchRecords(hires),
    [hires, searchTerm]
  );

  const filteredDelivers = useMemo(
    () => searchRecords(delivers),
    [delivers, searchTerm]
  );

  /* =====================================================
     ALL RECORDS
     ===================================================== */

  const allRecords = useMemo(() => {
    return [
      ...hires.map((item) => ({
        ...item,
        recordType: "Hire",
      })),

      ...delivers.map((item) => ({
        ...item,
        recordType: "Deliver",
      })),
    ];
  }, [hires, delivers]);

  /* =====================================================
     CHART DATA
     ===================================================== */

  const monthlyData = useMemo(() => {
    const months = {};

    allRecords.forEach((item) => {
      const dateValue = getCreatedDate(item);

      if (!dateValue) {
        return;
      }

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const key =
        `${date.getFullYear()}-${date.getMonth()}`;

      if (!months[key]) {
        months[key] = {
          month: date.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          ),

          year: date.getFullYear(),

          submissions: 0,
        };
      }

      months[key].submissions += 1;
    });

    return Object.values(months)
      .sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }

        return a.month.localeCompare(
          b.month
        );
      })
      .map((item) => ({
        label: `${item.month} ${item.year}`,
        submissions: item.submissions,
      }));
  }, [allRecords]);

  const categoryData = useMemo(() => {
    const categories = {};

    allRecords.forEach((item) => {
      const category =
        item.category ||
        item.type ||
        item.project_type ||
        item.projectType ||
        "Other";

      const cleanCategory =
        String(category).trim() || "Other";

      categories[cleanCategory] =
        (categories[cleanCategory] || 0) + 1;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        submissions: value,
      }))
      .sort(
        (a, b) =>
          b.submissions - a.submissions
      )
      .slice(0, 5);
  }, [allRecords]);

  const submissionTypeData = [
    {
      name: "Hire",
      value: hires.length,
    },
    {
      name: "Deliver",
      value: delivers.length,
    },
  ];

  const totalSubmissions =
    hires.length + delivers.length;

  /* =====================================================
     OPEN RECORD DETAILS
     ===================================================== */

  const openDetails = (record, type) => {
    setSelectedRecord({
      ...record,
      recordType: type,
    });

    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRecord(null);
  };

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const goToSection = (section) => {
    setActiveSection(section);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     LOGOUT
     ===================================================== */

  const logout = () => {
    localStorage.removeItem(
      "hireDeliverAccessToken"
    );

    localStorage.removeItem(
      "hireDeliverLoggedIn"
    );

    localStorage.removeItem(
      "hireDeliverUser"
    );

    navigate("/login");
  };

  /* =====================================================
     RENDER NORMAL FIELD VALUE
     ===================================================== */

  const renderSimpleValue = (value) => {
    const parsed = parsePossibleJSON(value);

    if (
      parsed === null ||
      parsed === undefined ||
      parsed === ""
    ) {
      return "Not provided";
    }

    if (
      typeof parsed === "string" ||
      typeof parsed === "number" ||
      typeof parsed === "boolean"
    ) {
      return String(parsed);
    }

    if (Array.isArray(parsed)) {
      return (
        <div className="nested-value-list">
          {parsed.map((item, index) => (
            <div
              className="nested-value-item"
              key={index}
            >
              {typeof item === "object" &&
              item !== null ? (
                <div className="nested-object-card">
                  {Object.entries(item).map(
                    ([key, nestedValue]) => (
                      <div
                        className="nested-object-row"
                        key={key}
                      >
                        <span>
                          {formatLabel(key)}
                        </span>

                        <strong>
                          {renderSimpleValue(
                            nestedValue
                          )}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <span>
                  {String(item)}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof parsed === "object") {
      return (
        <div className="nested-object-card">
          {Object.entries(parsed).map(
            ([key, nestedValue]) => (
              <div
                className="nested-object-row"
                key={key}
              >
                <span>
                  {formatLabel(key)}
                </span>

                <strong>
                  {renderSimpleValue(
                    nestedValue
                  )}
                </strong>
              </div>
            )
          )}
        </div>
      );
    }

    return String(parsed);
  };

  /* =====================================================
     TEAM MEMBER DETAIL CARD
     ===================================================== */

  const TeamMemberCard = ({
    member,
    index,
  }) => {
    const parsedMember =
      parsePossibleJSON(member);

    if (
      !parsedMember ||
      typeof parsedMember !== "object"
    ) {
      return (
        <div className="team-member-card">
          <div className="member-avatar">
            {String(
              parsedMember || "M"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="member-content">
            <strong>
              {String(
                parsedMember ||
                  `Member ${index + 1}`
              )}
            </strong>
          </div>
        </div>
      );
    }

    const memberName =
      parsedMember.name ||
      parsedMember.fullName ||
      parsedMember.full_name ||
      parsedMember.member_name ||
      parsedMember.memberName ||
      `Team Member ${index + 1}`;

    const memberRole =
      parsedMember.role ||
      parsedMember.designation ||
      parsedMember.position ||
      parsedMember.job_title ||
      parsedMember.jobTitle ||
      "Team Member";

    const memberFields = Object.entries(
      parsedMember
    ).filter(([key, value]) => {
      const hidden = [
        "id",
        "user_id",
        "hire_id",
        "deliver_id",
        "proposal_id",
        "team_member_id",
        "created_at",
        "updated_at",
        "createdAt",
        "updatedAt",
        "stored_name",
        "storedName",
        "file_path",
        "filePath",
      ];

      return (
        !hidden.includes(key) &&
        value !== null &&
        value !== undefined &&
        value !== ""
      );
    });

    return (
      <div className="team-member-card detailed-member-card">
        <div className="member-top">
          <div className="member-avatar">
            {String(memberName)
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="member-heading">
            <strong>{memberName}</strong>

            <span>{memberRole}</span>
          </div>
        </div>

        <div className="member-details-grid">
          {memberFields.map(
            ([key, value]) => {
              const parsedValue =
                parsePossibleJSON(value);

              return (
                <div
                  className="member-detail-field"
                  key={key}
                >
                  <label>
                    {formatLabel(key)}
                  </label>

                  <div>
                    {renderSimpleValue(
                      parsedValue
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  };

/* =====================================================
   FILE CARD
   ===================================================== */

const FileCard = ({
  file,
  index,
}) => {
  const parsedFile =
    parsePossibleJSON(file);

  /* Agar file sirf string hai */
  if (
    !parsedFile ||
    typeof parsedFile !== "object"
  ) {
    return (
      <div className="file-item detailed-file-item">
        <div className="file-icon">
          📎
        </div>

        <div className="file-info">
          <strong className="file-name">
            {String(
              parsedFile ||
                `Uploaded File ${index + 1}`
            )}
          </strong>
        </div>
      </div>
    );
  }

  /* Sirf actual uploaded file name */
  const fileName =
    getFileName(parsedFile, index);

  return (
    <div className="file-item detailed-file-item">
      <div className="file-icon">
        📎
      </div>

      <div className="file-info">
        <strong className="file-name">
          {fileName}
        </strong>
      </div>
    </div>
  );
};
  /* =====================================================
     RECORD CARD
     ===================================================== */

  const RecordCard = ({
    item,
    type,
  }) => {
    return (
      <div
        className={`dashboard-record-card ${
          type === "Hire"
            ? "hire-record"
            : "deliver-record"
        }`}
      >
        <div className="record-card-top">
          <div className="record-type">
            <div className="record-icon">
              {type === "Hire"
                ? "💼"
                : "🚀"}
            </div>

            <div>
              <span>
                {type} Submission
              </span>

              <small>
                ID #{item.id || "N/A"}
              </small>
            </div>
          </div>

          <span className="record-date">
            {formatDate(
              getCreatedDate(item)
            )}
          </span>
        </div>

        <div className="record-main">
          <div className="record-title-area">
            <h3>
              {getTitle(item)}
            </h3>

            <p>
              {getDescription(item)}
            </p>
          </div>

          <div className="record-value">
            <span>
              {type === "Hire"
                ? "Budget"
                : "Cost"}
            </span>

            <strong>
              {getBudget(item)}
            </strong>
          </div>
        </div>

        <div className="record-mini-details">
          <div>
            <span>Type</span>

            <strong>
              {item.type ||
                item.project_type ||
                item.projectType ||
                "Not specified"}
            </strong>
          </div>

          <div>
            <span>Category</span>

            <strong>
              {item.category ||
                "Not specified"}
            </strong>
          </div>

          <div>
            <span>Location</span>

            <strong>
              {item.full_location ||
                item.fullLocation ||
                item.location ||
                "Not specified"}
            </strong>
          </div>

          <div>
            <span>Timeline</span>

            <strong>
              {item.standard_timeline ||
                item.standardTimeline ||
                item.timeline ||
                "Not specified"}
            </strong>
          </div>
        </div>

        <div className="record-card-bottom">
          <span>
            Created{" "}
            {formatDate(
              getCreatedDate(item)
            )}
          </span>

          <button
            className="view-record-btn"
            onClick={() =>
              openDetails(item, type)
            }
          >
            View Complete Details
            <span>→</span>
          </button>
        </div>
      </div>
    );
  };

  /* =====================================================
     COMPLETE DETAILS MODAL
     ===================================================== */

  const DetailsModal = () => {
    if (
      !showDetails ||
      !selectedRecord
    ) {
      return null;
    }

    const record = selectedRecord;

    const files = getFiles(record);
    const teamMembers =
      getTeamMembers(record);

    const ignoredFields = [
      "recordType",
      "password",
      "password_hash",

      "files",
      "uploaded_files",
      "uploadedFiles",
      "documents",
      "attachments",
      "uploaded_documents",

      "team_members",
      "teamMembers",
      "members",
      "team",
      "team_member",
      "teamMember",

      "user_id",

      "id",
      "created_at",
      "createdAt",
      "updated_at",
      "updatedAt",

      "stored_name",
      "storedName",
      "file_path",
      "filePath",
    ];

    return (
      <div
        className="details-overlay"
        onClick={closeDetails}
      >
        <div
          className="details-modal"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* HEADER */}

          <div className="details-modal-header">
            <div>
              <span
                className={
                  record.recordType === "Hire"
                    ? "modal-badge hire-badge"
                    : "modal-badge deliver-badge"
                }
              >
                {record.recordType} Submission
              </span>

              <h2>
                {getTitle(record)}
              </h2>

              <p>
                Complete submission information
              </p>
            </div>

            <button
              className="close-modal-btn"
              onClick={closeDetails}
            >
              ×
            </button>
          </div>

          <div className="details-modal-body">

            {/* =================================================
                BASIC INFORMATION
                ================================================= */}

            <div className="details-section">
              <div className="details-section-heading">
                <span>01</span>

                <div>
                  <h3>
                    Basic Information
                  </h3>

                  <p>
                    Main submission information
                  </p>
                </div>
              </div>

              <div className="full-details-grid">
                <div className="full-detail">
                  <label>
                    Submission ID
                  </label>

                  <div>
                    #{record.id || "N/A"}
                  </div>
                </div>

                <div className="full-detail">
                  <label>
                    Submission Type
                  </label>

                  <div>
                    {record.recordType}
                  </div>
                </div>

                <div className="full-detail">
                  <label>
                    Created At
                  </label>

                  <div>
                    {formatDateTime(
                      getCreatedDate(record)
                    )}
                  </div>
                </div>

                <div className="full-detail">
                  <label>
                    Updated At
                  </label>

                  <div>
                    {formatDateTime(
                      record.updated_at ||
                        record.updatedAt
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                COMPLETE FORM DETAILS
                ================================================= */}

            <div className="details-section">
              <div className="details-section-heading">
                <span>02</span>

                <div>
                  <h3>
                    Complete Form Details
                  </h3>

                  <p>
                    All information submitted
                    through this form
                  </p>
                </div>
              </div>

              <div className="complete-fields-grid">
                {Object.entries(record)
                  .filter(
                    ([key]) =>
                      !ignoredFields.includes(key)
                  )
                  .map(
                    ([key, value]) => {
                      const parsedValue =
                        parsePossibleJSON(
                          value
                        );

                      if (
                        parsedValue === null ||
                        parsedValue === undefined ||
                        parsedValue === ""
                      ) {
                        return null;
                      }

                      if (
                        typeof parsedValue ===
                          "object" &&
                        (
                          isFileObject(
                            parsedValue
                          ) ||
                          isTeamMemberObject(
                            parsedValue
                          )
                        )
                      ) {
                        return null;
                      }

                      return (
                        <div
                          className={`complete-field ${
                            typeof parsedValue ===
                              "object"
                              ? "complete-field-wide"
                              : ""
                          }`}
                          key={key}
                        >
                          <label>
                            {formatLabel(key)}
                          </label>

                          <div>
                            {renderSimpleValue(
                              parsedValue
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
                ================================================= */}

            <div className="details-section">
              <div className="details-section-heading">
                <span>03</span>

                <div>
                  <h3>
                    Description
                  </h3>

                  <p>
                    Detailed project information
                  </p>
                </div>
              </div>

              <div className="long-detail-box">
                <label>
                  Project / Submission Description
                </label>

                <p>
                  {getDescription(record)}
                </p>
              </div>
            </div>

            {/* =================================================
                FILES
                ================================================= */}

            {files.length > 0 && (
              <div className="details-section">
                <div className="details-section-heading">
                  <span>04</span>

                  <div>
                    <h3>
                      Uploaded Files
                    </h3>

                    <p>
                      Files attached to this
                      submission
                    </p>
                  </div>
                </div>

                <div className="files-list">
                  {files.map(
                    (file, index) => (
                      <FileCard
                        key={
                          file?.id ||
                          file?.file_id ||
                          index
                        }
                        file={file}
                        index={index}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                TEAM MEMBERS
                ================================================= */}

            {teamMembers.length > 0 && (
              <div className="details-section">
                <div className="details-section-heading">
                  <span>05</span>

                  <div>
                    <h3>
                      Team Members
                    </h3>

                    <p>
                      Complete information about
                      people included in this
                      submission
                    </p>
                  </div>
                </div>

                <div className="team-list">
                  {teamMembers.map(
                    (member, index) => (
                      <TeamMemberCard
                        key={
                          member?.id ||
                          member?.team_member_id ||
                          index
                        }
                        member={member}
                        index={index}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                NO FILES / TEAM MESSAGE
                ================================================= */}

            {files.length === 0 &&
              teamMembers.length === 0 && (
                <div className="details-section">
                  <div className="details-section-heading">
                    <span>04</span>

                    <div>
                      <h3>
                        Attachments & Team
                      </h3>

                      <p>
                        Additional submission
                        information
                      </p>
                    </div>
                  </div>

                  <div className="details-empty-info">
                    <span>
                      ✓
                    </span>

                    <div>
                      <strong>
                        No files or team
                        members were attached
                      </strong>

                      <p>
                        This submission was
                        completed without
                        additional attachments
                        or team member details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

          </div>

          {/* FOOTER */}

          <div className="details-modal-footer">
            <span>
              {record.recordType} Submission
              #{record.id || "N/A"}
            </span>

            <button
              onClick={closeDetails}
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>

        <h3>
          Loading your dashboard...
        </h3>

        <p>
          Preparing your submissions and
          analytics.
        </p>
      </div>
    );
  }

  /* =====================================================
     MAIN
     ===================================================== */

  return (
    <div className="professional-dashboard">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <div className="brand-mark">
            HD
          </div>

          <div>
            <strong>
              HireDeliver
            </strong>

            <span>
              User Dashboard
            </span>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        <nav className="dashboard-navigation">

          <button
            className={
              activeSection === "overview"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() =>
              goToSection("overview")
            }
          >
            <span className="sidebar-link-icon">
              ◈
            </span>

            <span>
              Overview
            </span>
          </button>

          <button
            className={
              activeSection === "hire"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() =>
              goToSection("hire")
            }
          >
            <span className="sidebar-link-icon">
              💼
            </span>

            <span>
              My Hire Requirements
            </span>

            <b>
              {hires.length}
            </b>
          </button>

          <button
            className={
              activeSection === "deliver"
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={() =>
              goToSection("deliver")
            }
          >
            <span className="sidebar-link-icon">
              🚀
            </span>

            <span>
              My Deliver Proposals
            </span>

            <b>
              {delivers.length}
            </b>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="sidebar-new-btn"
            onClick={() =>
              navigate("/hire")
            }
          >
            <span>+</span>
            New Requirement
          </button>

          <button
            className="sidebar-new-btn deliver-new"
            onClick={() =>
              navigate("/deliver")
            }
          >
            <span>+</span>
            New Proposal
          </button>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>
      </aside>

      {/* =================================================
          MAIN AREA
          ================================================= */}

      <main className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div>
            <span className="topbar-label">
              PERSONAL WORKSPACE
            </span>

            <h1>
              Dashboard
            </h1>
          </div>

          <div className="topbar-right">

            <div className="topbar-search">
              <span>
                🔎
              </span>

              <input
                type="text"
                placeholder="Search your records..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              {searchTerm && (
                <button
                  onClick={() =>
                    setSearchTerm("")
                  }
                >
                  ×
                </button>
              )}
            </div>

            <button
              className="topbar-new-btn"
              onClick={() =>
                navigate("/hire")
              }
            >
              + New
            </button>

          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            <strong>
              Dashboard Error
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        {/* =================================================
            OVERVIEW
            ================================================= */}

        {activeSection === "overview" && (
          <section className="dashboard-content">

            <div className="welcome-panel">

              <div>
                <span>
                  OVERVIEW
                </span>

                <h2>
                  Your activity at a glance
                </h2>

                <p>
                  Track your Hire requirements,
                  Deliver proposals and recent
                  platform activity.
                </p>
              </div>

              <div className="welcome-total">
                <strong>
                  {totalSubmissions}
                </strong>

                <span>
                  Total Submissions
                </span>
              </div>

            </div>

            {/* CARDS */}

            <div className="dashboard-stat-grid">

              <div className="stat-card stat-total">
                <div className="stat-icon">
                  ◈
                </div>

                <div>
                  <span>
                    Total Submissions
                  </span>

                  <strong>
                    {totalSubmissions}
                  </strong>

                  <small>
                    Hire + Deliver
                  </small>
                </div>
              </div>

              <div className="stat-card stat-hire">
                <div className="stat-icon">
                  💼
                </div>

                <div>
                  <span>
                    Hire Requirements
                  </span>

                  <strong>
                    {hires.length}
                  </strong>

                  <small>
                    Requirements posted
                  </small>
                </div>
              </div>

              <div className="stat-card stat-deliver">
                <div className="stat-icon">
                  🚀
                </div>

                <div>
                  <span>
                    Deliver Proposals
                  </span>

                  <strong>
                    {delivers.length}
                  </strong>

                  <small>
                    Proposals submitted
                  </small>
                </div>
              </div>

              <div className="stat-card stat-results">
                <div className="stat-icon">
                  ⚡
                </div>

                <div>
                  <span>
                    Search Results
                  </span>

                  <strong>
                    {filteredHires.length +
                      filteredDelivers.length}
                  </strong>

                  <small>
                    Current matching records
                  </small>
                </div>
              </div>

            </div>

            {/* CHARTS */}

            <div className="analytics-heading">

              <div>
                <span>
                  ANALYTICS
                </span>

                <h2>
                  Activity Insights
                </h2>
              </div>

              <p>
                Hover over charts for details
              </p>

            </div>

            <div className="dashboard-charts">

              {/* LINE CHART */}

              <div className="dashboard-chart chart-wide">

                <div className="chart-title">

                  <div>
                    <span>
                      ACTIVITY TREND
                    </span>

                    <h3>
                      Submission Activity
                    </h3>
                  </div>

                  <div className="live-indicator">
                    <i></i>
                    LIVE
                  </div>

                </div>

                <div className="short-chart">

                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 8,
                          right: 12,
                          left: -20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="#edf0f6"
                        />

                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 10,
                          }}
                        />

                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 10,
                          }}
                        />

                        <Tooltip
                          cursor={{
                            stroke: "#6366f1",
                            strokeWidth: 1,
                            strokeDasharray: "5 5",
                          }}
                          contentStyle={{
                            border: "none",
                            borderRadius: "12px",
                            boxShadow:
                              "0 15px 35px rgba(15,23,42,.14)",
                          }}
                          formatter={(value) => [
                            `${value} submissions`,
                            "Activity",
                          ]}
                        />

                        <Line
                          type="monotone"
                          dataKey="submissions"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: "#ffffff",
                            stroke: "#6366f1",
                            strokeWidth: 2,
                          }}
                          activeDot={{
                            r: 7,
                            fill: "#ffffff",
                            stroke: "#6366f1",
                            strokeWidth: 3,
                          }}
                          animationDuration={1200}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">
                      <span>📈</span>

                      <strong>
                        No activity data yet
                      </strong>

                      <p>
                        Your activity will appear
                        here after submissions.
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* DONUT */}

              <div className="dashboard-chart chart-small">

                <div className="chart-title">

                  <div>
                    <span>
                      SUBMISSION MIX
                    </span>

                    <h3>
                      Hire vs Deliver
                    </h3>
                  </div>

                </div>

                <div className="small-donut">

                  {totalSubmissions > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={submissionTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={72}
                          paddingAngle={5}
                          dataKey="value"
                          animationDuration={1000}
                        >
                          <Cell fill="#6366f1" />
                          <Cell fill="#06b6d4" />
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            border: "none",
                            borderRadius: "12px",
                            boxShadow:
                              "0 15px 35px rgba(15,23,42,.14)",
                          }}
                          formatter={(
                            value,
                            name
                          ) => [
                            `${value} submissions`,
                            name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">
                      <span>🥧</span>

                      <strong>
                        No data
                      </strong>
                    </div>
                  )}

                  <div className="donut-center-small">
                    <strong>
                      {totalSubmissions}
                    </strong>

                    <span>
                      Total
                    </span>
                  </div>

                </div>

                <div className="chart-legend">

                  <div>
                    <i className="legend-hire"></i>
                    Hire
                    <strong>
                      {hires.length}
                    </strong>
                  </div>

                  <div>
                    <i className="legend-deliver"></i>
                    Deliver
                    <strong>
                      {delivers.length}
                    </strong>
                  </div>

                </div>

              </div>

              {/* CATEGORY */}

              <div className="dashboard-chart chart-category">

                <div className="chart-title">

                  <div>
                    <span>
                      CATEGORIES
                    </span>

                    <h3>
                      Submission Categories
                    </h3>
                  </div>

                </div>

                <div className="category-short-chart">

                  {categoryData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={categoryData}
                        margin={{
                          top: 5,
                          right: 15,
                          left: -20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="#edf0f6"
                        />

                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 10,
                          }}
                        />

                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#94a3b8",
                            fontSize: 10,
                          }}
                        />

                        <Tooltip
                          cursor={{
                            fill:
                              "rgba(99,102,241,.05)",
                          }}
                          contentStyle={{
                            border: "none",
                            borderRadius: "12px",
                            boxShadow:
                              "0 15px 35px rgba(15,23,42,.14)",
                          }}
                          formatter={(value) => [
                            `${value} submissions`,
                            "Records",
                          ]}
                        />

                        <Bar
                          dataKey="submissions"
                          fill="#8b5cf6"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                          animationDuration={1000}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-chart">
                      <span>📊</span>

                      <strong>
                        No category data
                      </strong>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* RECENT */}

            <div className="recent-heading">

              <div>
                <span>
                  RECENT
                </span>

                <h2>
                  Recent Submissions
                </h2>
              </div>

              <button
                onClick={() =>
                  goToSection("hire")
                }
              >
                View Hire & Deliver →
              </button>

            </div>

            <div className="recent-records">

              {allRecords
                .slice()
                .sort(
                  (a, b) =>
                    new Date(
                      getCreatedDate(b) || 0
                    ) -
                    new Date(
                      getCreatedDate(a) || 0
                    )
                )
                .slice(0, 3)
                .map((item, index) => (
                  <RecordCard
                    key={`${item.recordType}-${item.id || index}`}
                    item={item}
                    type={item.recordType}
                  />
                ))}

              {allRecords.length === 0 && (
                <div className="empty-records">
                  <span>📁</span>

                  <h3>
                    No submissions yet
                  </h3>

                  <p>
                    Start by creating your first
                    Hire requirement or Deliver
                    proposal.
                  </p>
                </div>
              )}

            </div>

          </section>
        )}

        {/* =================================================
            HIRE
            ================================================= */}

        {activeSection === "hire" && (
          <section className="dashboard-content">

            <div className="records-page-header">

              <div>
                <span>
                  MY WORK
                </span>

                <h2>
                  Hire Requirements
                </h2>

                <p>
                  All the Hire requirements you
                  have submitted.
                </p>
              </div>

              <button
                className="page-new-btn hire-new"
                onClick={() =>
                  navigate("/hire")
                }
              >
                + New Requirement
              </button>

            </div>

            <div className="records-summary-bar">
              <span>
                Showing{" "}
                <strong>
                  {filteredHires.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {hires.length}
                </strong>{" "}
                Hire requirements
              </span>
            </div>

            <div className="records-list">

              {filteredHires.map(
                (item, index) => (
                  <RecordCard
                    key={
                      item.id ||
                      `hire-${index}`
                    }
                    item={item}
                    type="Hire"
                  />
                )
              )}

              {filteredHires.length === 0 && (
                <div className="empty-records">
                  <span>💼</span>

                  <h3>
                    No Hire requirements found
                  </h3>

                  <p>
                    Create a new Hire requirement
                    to get started.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/hire")
                    }
                  >
                    + Create Requirement
                  </button>
                </div>
              )}

            </div>

          </section>
        )}

        {/* =================================================
            DELIVER
            ================================================= */}

        {activeSection === "deliver" && (
          <section className="dashboard-content">

            <div className="records-page-header">

              <div>
                <span>
                  MY WORK
                </span>

                <h2>
                  Deliver Proposals
                </h2>

                <p>
                  All the Deliver proposals you
                  have submitted.
                </p>
              </div>

              <button
                className="page-new-btn deliver-new-page"
                onClick={() =>
                  navigate("/deliver")
                }
              >
                + New Proposal
              </button>

            </div>

            <div className="records-summary-bar">
              <span>
                Showing{" "}
                <strong>
                  {filteredDelivers.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {delivers.length}
                </strong>{" "}
                Deliver proposals
              </span>
            </div>

            <div className="records-list">

              {filteredDelivers.map(
                (item, index) => (
                  <RecordCard
                    key={
                      item.id ||
                      `deliver-${index}`
                    }
                    item={item}
                    type="Deliver"
                  />
                )
              )}

              {filteredDelivers.length === 0 && (
                <div className="empty-records">
                  <span>🚀</span>

                  <h3>
                    No Deliver proposals found
                  </h3>

                  <p>
                    Create a new Deliver proposal
                    to get started.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/deliver")
                    }
                  >
                    + Create Proposal
                  </button>
                </div>
              )}

            </div>

          </section>
        )}

      </main>

      {/* COMPLETE DETAILS */}

      <DetailsModal />

    </div>
  );
}

export default UserDashboard;