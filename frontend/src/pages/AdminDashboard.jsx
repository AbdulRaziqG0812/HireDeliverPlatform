import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API_BASE = "http://127.0.0.1:5000";

const STATUS_OPTIONS = [
  "Pending",
  "Approved",
  "In Progress",
  "Completed",
  "Rejected",
];

const PAGE_SIZE_OPTIONS = [10, 20, 25, 50];

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#ef4444",
];

function AdminDashboard() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("hireDeliverUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const token = localStorage.getItem("hireDeliverAccessToken");

  const [activeSection, setActiveSection] = useState("overview");

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    total_hires: 0,
    total_delivers: 0,
    total_records: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [recordType, setRecordType] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [deleteRecord, setDeleteRecord] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(null);

  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [importFile, setImportFile] = useState(null);

  /*
  ============================================================
  LOGOUT
  ============================================================
  */

  const handleLogout = () => {
    localStorage.removeItem("hireDeliverLoggedIn");
    localStorage.removeItem("hireDeliverUser");
    localStorage.removeItem("hireDeliverAccessToken");

    navigate("/");
  };

  /*
  ============================================================
  LOAD RECORDS
  ============================================================
  */

  const loadRecords = async (
    page = pagination.page,
    type = recordType,
    currentSearch = search,
    perPage = pagination.per_page
  ) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("per_page", perPage);
      params.append("type", type);

      if (currentSearch.trim()) {
        params.append("search", currentSearch.trim());
      }

      const response = await fetch(
        `${API_BASE}/api/admin/records?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        setError("Admin authorization expired. Please login again.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load admin records."
        );
      }

      setRecords(data.records || []);

      setSummary(
        data.summary || {
          total_hires: 0,
          total_delivers: 0,
          total_records: 0,
        }
      );

      setPagination(
        data.pagination || {
          page,
          per_page: perPage,
          total_records: 0,
          total_pages: 1,
          has_next: false,
          has_previous: false,
        }
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  INITIAL LOAD
  ============================================================
  */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadRecords(1, "all", "", pagination.per_page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  ============================================================
  SEARCH
  ============================================================
  */

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchInput.trim();

    setSearch(value);

    loadRecords(
      1,
      recordType,
      value,
      pagination.per_page
    );
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");

    loadRecords(
      1,
      recordType,
      "",
      pagination.per_page
    );
  };

  /*
  ============================================================
  TYPE FILTER
  ============================================================
  */

  const handleTypeChange = (type) => {
    setRecordType(type);

    const nextSection =
      type === "hire"
        ? "hire"
        : type === "deliver"
        ? "deliver"
        : "overview";

    setActiveSection(nextSection);

    loadRecords(
      1,
      type,
      search,
      pagination.per_page
    );
  };

  /*
  ============================================================
  SIDEBAR NAVIGATION
  ============================================================
  */

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileSidebar(false);

    if (section === "overview") {
      setRecordType("all");

      loadRecords(
        1,
        "all",
        search,
        pagination.per_page
      );
    }

    if (section === "hire") {
      setRecordType("hire");

      loadRecords(
        1,
        "hire",
        search,
        pagination.per_page
      );
    }

    if (section === "deliver") {
      setRecordType("deliver");

      loadRecords(
        1,
        "deliver",
        search,
        pagination.per_page
      );
    }
  };

  /*
  ============================================================
  PAGINATION
  ============================================================
  */

  const changePage = (page) => {
    if (
      page < 1 ||
      page > pagination.total_pages ||
      loading
    ) {
      return;
    }

    loadRecords(
      page,
      recordType,
      search,
      pagination.per_page
    );
  };

  const changePageSize = (e) => {
    const newSize = Number(e.target.value);

    loadRecords(
      1,
      recordType,
      search,
      newSize
    );
  };

  /*
  ============================================================
  STATUS UPDATE
  ============================================================
  */

  const handleStatusChange = async (
    record,
    newStatus
  ) => {
    if (!record || !newStatus) return;

    const key = `${record.record_type}-${record.id}`;

    setUpdatingStatus(key);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/records/${record.record_type}/${record.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update record status."
        );
      }

      setRecords((previous) =>
        previous.map((item) =>
          item.id === record.id &&
          item.record_type === record.record_type
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      if (
        selectedRecord &&
        selectedRecord.id === record.id &&
        selectedRecord.record_type ===
          record.record_type
      ) {
        setSelectedRecord({
          ...selectedRecord,
          status: newStatus,
        });
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to update status."
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  /*
  ============================================================
  DELETE RECORD
  ============================================================
  */

  const confirmDelete = async () => {
    if (!deleteRecord) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/records/${deleteRecord.record_type}/${deleteRecord.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete record."
        );
      }

      setDeleteRecord(null);
      setShowDetails(false);
      setSelectedRecord(null);

      loadRecords(
        pagination.page,
        recordType,
        search,
        pagination.per_page
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete record."
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
  ============================================================
  OPEN FILE
  ============================================================
  */

  const openFile = async (
    file,
    recordType
  ) => {
    if (!file?.id) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/files/${recordType}/${file.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(
          () => null
        );

        throw new Error(
          data?.message ||
            "Unable to open file."
        );
      }

      const blob = await response.blob();

      const fileUrl = window.URL.createObjectURL(
        blob
      );

      window.open(
        fileUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to open uploaded file."
      );
    }
  };

  /*
  ============================================================
  EXPORT
  ============================================================
  */

  const handleExport = async (exportType = recordType) => {
    if (!["hire", "deliver"].includes(exportType)) {
      setError("Please select Hire or Deliver records to export.");
      return;
    }

    try {
      const params = new URLSearchParams();

      params.append("type", exportType);

      if (search.trim()) {
        params.append(
          "search",
          search.trim()
        );
      }

      const response = await fetch(
        `${API_BASE}/api/admin/records/export?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(
          () => null
        );

        throw new Error(
          data?.message ||
            "Excel export failed."
        );
      }

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        exportType === "hire"
          ? "Hire_Records.xlsx"
          : "Deliver_Records.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.message ||
          "Excel export failed."
      );
    }
  };

  /*
  ============================================================
  CSV IMPORT
  ============================================================
  */

  const handleCSVImport = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImportFile(file);

    setError(
      "CSV import interface is ready. Backend bulk-import endpoint can be connected when CSV import processing is enabled."
    );
  };

  /*
  ============================================================
  HELPERS
  ============================================================
  */

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString();
  };

  const formatValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not provided";
    }

    return String(value);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";

      case "In Progress":
        return "status-progress";

      case "Completed":
        return "status-completed";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  /*
  ============================================================
  SUMMARY CALCULATIONS
  ============================================================
  */

  const statusSummary = useMemo(() => {
    const result = {
      Pending: 0,
      Approved: 0,
      "In Progress": 0,
      Completed: 0,
      Rejected: 0,
    };

    records.forEach((record) => {
      if (result[record.status] !== undefined) {
        result[record.status]++;
      }
    });

    return result;
  }, [records]);

  const pieData = STATUS_OPTIONS.map(
    (status) => ({
      name: status,
      value: statusSummary[status],
    })
  ).filter((item) => item.value > 0);

  const typeChartData = [
    {
      name: "Hire",
      value: summary.total_hires || 0,
    },
    {
      name: "Deliver",
      value: summary.total_delivers || 0,
    },
  ];

  /*
  ============================================================
  PAGINATION BUTTONS
  ============================================================
  */

  const paginationPages = [];

  const totalPages =
    pagination.total_pages || 1;

  const currentPage =
    pagination.page || 1;

  let startPage = Math.max(
    1,
    currentPage - 2
  );

  let endPage = Math.min(
    totalPages,
    currentPage + 2
  );

  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(
        totalPages,
        startPage + 4
      );
    } else if (endPage === totalPages) {
      startPage = Math.max(
        1,
        endPage - 4
      );
    }
  }

  for (
    let page = startPage;
    page <= endPage;
    page++
  ) {
    paginationPages.push(page);
  }

  /*
  ============================================================
  FIELD RENDERING
  ============================================================
  */

  const DetailField = ({
    label,
    value,
    full = false,
  }) => (
    <div
      className={`detail-field ${
        full ? "detail-field-full" : ""
      }`}
    >
      <span>{label}</span>
      <strong>
        {formatValue(value)}
      </strong>
    </div>
  );

  /*
  ============================================================
  FILE CARD
  ============================================================
  */

  const FileCard = ({
    file,
    recordType,
  }) => {
    if (!file) return null;

    const fileName =
      file.original_name ||
      file.name ||
      file.filename ||
      "Uploaded File";

    return (
      <button
        type="button"
        className="admin-file-card"
        onClick={() =>
          openFile(file, recordType)
        }
      >
        <div className="admin-file-icon">
          📎
        </div>

        <div className="admin-file-info">
          <span className="admin-file-name">
            {fileName}
          </span>

          <small>
            Click to open document
          </small>
        </div>

        <div className="admin-file-arrow">
          ↗
        </div>
      </button>
    );
  };

  /*
  ============================================================
  TEAM MEMBER CARD
  ============================================================
  */

  const TeamMemberCard = ({
    member,
    index,
  }) => {
    if (!member) return null;

    const profileFiles =
      member.profileFiles ||
      member.profile_files ||
      member.profile ||
      member.profile_file ||
      member.profile_file_name;

    return (
      <div className="team-member-card">
        <div className="team-member-number">
          {index + 1}
        </div>

        <div className="team-member-content">
          <div className="team-member-heading">
            <div className="team-avatar">
              {(
                member.name ||
                "M"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h4>
                {formatValue(member.name)}
              </h4>

              <span>
                {formatValue(member.role)}
              </span>
            </div>
          </div>

          <div className="team-member-grid">
            <DetailField
              label="Member Name"
              value={member.name}
            />

            <DetailField
              label="Role"
              value={member.role}
            />

            <DetailField
              label="Skills / Expertise"
              value={member.skills}
              full
            />

            <DetailField
              label="Years of Experience"
              value={member.experience}
            />

            <DetailField
              label="CV / Profile Documents"
              value={profileFiles}
              full
            />

            <DetailField
              label="Similar Experience"
              value={member.similar_experience}
              full
            />
          </div>
        </div>
      </div>
    );
  };

  /*
  ============================================================
  RECORD DETAILS
  ============================================================
  */

  const renderRecordDetails = (
    record
  ) => {
    if (!record) return null;

    const isHire =
      record.record_type === "hire";

    const files =
      record.files ||
      record.uploaded_files ||
      [];

    const teamMembers =
      record.team_members ||
      record.teamMembers ||
      [];

    return (
      <div className="details-modal-overlay">
        <div className="details-modal">
          <div className="details-modal-header">
            <div>
              <div className="details-type-badge">
                {isHire
                  ? "HIRE REQUIREMENT"
                  : "DELIVER PROPOSAL"}
              </div>

              <h2>
                {formatValue(record.title)}
              </h2>

              <p>
                Record #{record.id}
              </p>
            </div>

            <button
              className="modal-close"
              onClick={() => {
                setShowDetails(false);
                setSelectedRecord(null);
              }}
            >
              ×
            </button>
          </div>

          <div className="details-modal-body">

            {/* ADMIN / SYSTEM INFORMATION */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  🛡️
                </div>

                <div>
                  <h3>
                    Record Administration
                  </h3>

                  <p>
                    Submission and administrative information
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                <DetailField
                  label="Record ID"
                  value={record.id}
                />

                <DetailField
                  label="Record Type"
                  value={
                    isHire
                      ? "Hire"
                      : "Deliver"
                  }
                />

                <DetailField
                  label="User Name"
                  value={
                    record.user_name ||
                    record.user?.name
                  }
                />

                <DetailField
                  label="User Email"
                  value={
                    record.user_email ||
                    record.user?.email
                  }
                />

                <DetailField
                  label="User Phone"
                  value={
                    record.user_phone ||
                    record.user?.phone
                  }
                />

                <DetailField
                  label="Current Status"
                  value={
                    record.status ||
                    "Pending"
                  }
                />

                <DetailField
                  label="Created At"
                  value={formatDate(
                    record.created_at
                  )}
                />

                <DetailField
                  label="Updated At"
                  value={formatDate(
                    record.updated_at
                  )}
                />
              </div>

              <div className="status-control">
                <label>
                  Change Status
                </label>

                <select
                  value={
                    record.status ||
                    "Pending"
                  }
                  disabled={
                    updatingStatus ===
                    `${record.record_type}-${record.id}`
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      record,
                      e.target.value
                    )
                  }
                >
                  {STATUS_OPTIONS.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>
            </section>

            {/* BASIC INFORMATION */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  📋
                </div>

                <div>
                  <h3>
                    {isHire
                      ? "Hire Requirement"
                      : "Deliver Proposal"}
                  </h3>

                  <p>
                    Information entered in the form
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                {!isHire && (
                  <DetailField
                    label="Country"
                    value={record.country}
                  />
                )}

                <DetailField
                  label={
                    isHire
                      ? "Requirement Title"
                      : "Delivery Title"
                  }
                  value={record.title}
                />

                <DetailField
                  label={
                    isHire
                      ? "Requirement Type"
                      : "Delivery Type"
                  }
                  value={record.type}
                />

                <DetailField
                  label="Category"
                  value={record.category}
                />

                {isHire ? (
                  <DetailField
                    label="Total Budget"
                    value={record.budget}
                  />
                ) : (
                  <>
                    <DetailField
                      label="Currency"
                      value={record.currency}
                    />

                    <DetailField
                      label="Amount / Delivery Cost"
                      value={record.amount}
                    />
                  </>
                )}
              </div>
            </section>

            {/* DESCRIPTION / DELIVERY DETAILS */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  📝
                </div>

                <div>
                  <h3>
                    {isHire
                      ? "Requirement Details"
                      : "Delivery Details"}
                  </h3>

                  <p>
                    Details entered in the submission form
                  </p>
                </div>
              </div>

              <div className="long-detail">
                <span>
                  {isHire
                    ? "What Do You Need?"
                    : "What Can Your Team Provide?"}
                </span>

                <p>
                  {formatValue(
                    record.description
                  )}
                </p>
              </div>

              <div className="long-detail">
                <span>
                  {isHire
                    ? "Requirement Scope"
                    : "Delivery Scope"}
                </span>

                <p>
                  {formatValue(
                    record.scope
                  )}
                </p>
              </div>

              <div className="long-detail">
                <span>
                  {isHire
                    ? "Tasks / Deliverables"
                    : "Deliverables / Task Breakdown"}
                </span>

                <p>
                  {formatValue(
                    record.deliverables
                  )}
                </p>
              </div>
            </section>

            {/* COST & PROCESSING */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  💰
                </div>

                <div>
                  <h3>
                    Cost & Processing
                  </h3>

                  <p>
                    Cost and processing information
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                {isHire ? (
                  <DetailField
                    label="Total Budget"
                    value={record.budget}
                  />
                ) : (
                  <>
                    <DetailField
                      label="Currency"
                      value={record.currency}
                    />

                    <DetailField
                      label="Amount / Delivery Cost"
                      value={record.amount}
                    />

                    <DetailField
                      label="Included Cost"
                      value={record.included_cost}
                      full
                    />

                    <DetailField
                      label="Excluded Cost"
                      value={record.excluded_cost}
                      full
                    />
                  </>
                )}

                <DetailField
                  label="Processing Type"
                  value={record.processing}
                />

                <DetailField
                  label={
                    isHire
                      ? "Standard / Required Timeline"
                      : "Standard Delivery Timeline"
                  }
                  value={
                    record.standard_timeline
                  }
                />

                <DetailField
                  label={
                    isHire
                      ? "Urgent / Optimal Timeline"
                      : "Urgent / Priority Timeline"
                  }
                  value={
                    record.urgent_timeline
                  }
                />
              </div>
            </section>

            {/* RESOURCES */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  🧰
                </div>

                <div>
                  <h3>
                    Resources & Tools
                  </h3>

                  <p>
                    Resource information from the form
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                {isHire ? (
                  <>
                    <DetailField
                      label="Required Human Resources"
                      value={
                        record.human_resources
                      }
                      full
                    />

                    <DetailField
                      label="Required Roles"
                      value={record.roles}
                      full
                    />

                    <DetailField
                      label="Required Skills & Expertise"
                      value={record.skills}
                      full
                    />

                    <DetailField
                      label="Required Tools / Software"
                      value={record.tools}
                      full
                    />

                    <DetailField
                      label="Physical Resources / Equipment"
                      value={
                        record.physical_resources
                      }
                      full
                    />

                    <DetailField
                      label="Additional Resources Required"
                      value={
                        record.additional_resources
                      }
                      full
                    />
                  </>
                ) : (
                  <>
                    <DetailField
                      label="Available Resources"
                      value={
                        record.available_resources
                      }
                      full
                    />

                    <DetailField
                      label="Required Resources"
                      value={
                        record.required_resources
                      }
                      full
                    />

                    <DetailField
                      label="Available Tools & Software"
                      value={record.tools}
                      full
                    />

                    <DetailField
                      label="Physical Resources / Equipment"
                      value={
                        record.physical_resources
                      }
                      full
                    />

                    <DetailField
                      label="Additional Resources"
                      value={
                        record.additional_resources
                      }
                      full
                    />
                  </>
                )}
              </div>
            </section>

            {/* LOCATION */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  📍
                </div>

                <div>
                  <h3>
                    Location & Address
                  </h3>

                  <p>
                    Location information from the form
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                {isHire ? (
                  <>
                    <DetailField
                      label="Required City"
                      value={record.location}
                    />

                    <DetailField
                      label="Full Location / Address"
                      value={
                        record.full_location
                      }
                      full
                    />
                  </>
                ) : (
                  <>
                    <DetailField
                      label="Delivery City"
                      value={record.city}
                    />

                    <DetailField
                      label="Full Delivery Location / Address"
                      value={
                        record.full_location
                      }
                      full
                    />
                  </>
                )}
              </div>
            </section>

            {/* TEAM MEMBERS - DELIVER ONLY */}

            {!isHire &&
              teamMembers.length > 0 && (
                <section className="detail-section">
                  <div className="detail-section-heading">
                    <div className="section-icon">
                      👥
                    </div>

                    <div>
                      <h3>
                        Team Members
                      </h3>

                      <p>
                        Team member information entered in the Deliver form
                      </p>
                    </div>
                  </div>

                  <div className="team-members-list">
                    {teamMembers.map(
                      (
                        member,
                        index
                      ) => (
                        <TeamMemberCard
                          key={
                            member.id ||
                            index
                          }
                          member={
                            member
                          }
                          index={
                            index
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              )}

            {/* LOCATION & PROOF - DELIVER ONLY */}

            {!isHire && (
              <section className="detail-section">
                <div className="detail-section-heading">
                  <div className="section-icon">
                    🔗
                  </div>

                  <div>
                    <h3>
                      Portfolio & Proof
                    </h3>

                    <p>
                      Proof and portfolio information from the Deliver form
                    </p>
                  </div>
                </div>

                <div className="detail-grid">
                  <DetailField
                    label="Portfolio / Website / Demo Link"
                    value={
                      record.portfolio
                    }
                    full
                  />
                </div>
              </section>
            )}

            {/* NOTIFICATION & COMMUNICATION */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  💬
                </div>

                <div>
                  <h3>
                    Notification & Communication
                  </h3>

                  <p>
                    Communication preferences entered in the form
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                <DetailField
                  label="Notification / Update Period"
                  value={
                    record.notification_period
                  }
                />

                {!isHire && (
                  <DetailField
                    label="Additional Notification Details"
                    value={
                      record.notification_details
                    }
                    full
                  />
                )}

                <DetailField
                  label="Preferred Communication Method"
                  value={
                    record.communication_method
                  }
                />

                {!isHire && (
                  <DetailField
                    label="Communication Details"
                    value={
                      record.communication_details
                    }
                    full
                  />
                )}
              </div>
            </section>

            {/* FILES */}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">
                  📁
                </div>

                <div>
                  <h3>
                    {isHire
                      ? "Uploaded Requirement Files"
                      : "Delivery Supporting Documents"}
                  </h3>

                  <p>
                    Uploaded files from the form
                  </p>
                </div>
              </div>

              {files.length > 0 ? (
                <div className="admin-files-list">
                  {files.map(
                    (file, index) => (
                      <FileCard
                        key={
                          file.id ||
                          index
                        }
                        file={file}
                        recordType={
                          record.record_type
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="empty-files-message">
                  No files uploaded.
                </div>
              )}
            </section>

            {/* ACTIONS */}

            <div className="details-footer-actions">
              <button
                className="secondary-action"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRecord(null);
                }}
              >
                Close
              </button>

              <button
                className="danger-action"
                onClick={() =>
                  setDeleteRecord(
                    record
                  )
                }
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /*
  ============================================================
  RECORD TABLE
  ============================================================
  */

  const renderRecords = () => {
    return (
      <div className="records-section">
        <div className="records-toolbar">
          <div>
            <h2>
              {recordType === "hire"
                ? "Hire Records"
                : recordType === "deliver"
                ? "Deliver Records"
                : "All Records"}
            </h2>

            <p>
              Manage and review submitted records
            </p>
          </div>

          <div className="records-toolbar-actions">
            <button
              className="export-button"
              onClick={handleExport}
            >
              <span>⇩</span>
              Export Excel
            </button>
          </div>
        </div>

        <div className="record-table-card">
          {loading ? (
            <div className="table-loading">
              <div className="loading-spinner" />
              <p>
                Loading records...
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="empty-records">
              <div className="empty-icon">
                📂
              </div>

              <h3>
                No records found
              </h3>

              <p>
                There are no records matching the current filters.
              </p>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>User</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>
                        Budget / Amount
                      </th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map(
                      (record) => (
                        <tr
                          key={`${record.record_type}-${record.id}`}
                        >
                          <td>
                            <span className="record-id">
                              #
                              {record.id}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`record-type ${
                                record.record_type ===
                                "hire"
                                  ? "type-hire"
                                  : "type-deliver"
                              }`}
                            >
                              {record.record_type ===
                              "hire"
                                ? "Hire"
                                : "Deliver"}
                            </span>
                          </td>

                          <td>
                            <div className="user-table-cell">
                              <div className="small-avatar">
                                {(
                                  record.user_name ||
                                  "U"
                                )
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {formatValue(
                                    record.user_name
                                  )}
                                </strong>

                                <span>
                                  {formatValue(
                                    record.user_email
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="title-cell">
                              {formatValue(
                                record.title
                              )}
                            </div>
                          </td>

                          <td>
                            {formatValue(
                              record.category
                            )}
                          </td>

                          <td>
                            {formatValue(
                              record.budget ||
                                record.cost ||
                                record.amount
                            )}
                          </td>

                          <td>
                            {formatValue(
                              record.location
                            )}
                          </td>

                          <td>
                            <span className="date-cell">
                              {formatDate(
                                record.created_at
                              )}
                            </span>
                          </td>

                          <td>
                            <select
                              className={`status-select ${getStatusClass(
                                record.status
                              )}`}
                              value={
                                record.status ||
                                "Pending"
                              }
                              disabled={
                                updatingStatus ===
                                `${record.record_type}-${record.id}`
                              }
                              onChange={(
                                e
                              ) =>
                                handleStatusChange(
                                  record,
                                  e.target.value
                                )
                              }
                            >
                              {STATUS_OPTIONS.map(
                                (
                                  status
                                ) => (
                                  <option
                                    key={
                                      status
                                    }
                                    value={
                                      status
                                    }
                                  >
                                    {
                                      status
                                    }
                                  </option>
                                )
                              )}
                            </select>
                          </td>

                          <td>
                            <div className="table-actions">
                              <button
                                className="view-button"
                                onClick={() => {
                                  setSelectedRecord(
                                    record
                                  );
                                  setShowDetails(
                                    true
                                  );
                                }}
                              >
                                View
                              </button>

                              <button
                                className="delete-icon-button"
                                onClick={() =>
                                  setDeleteRecord(
                                    record
                                  )
                                }
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}

              <div className="pagination-bar">
                <div className="pagination-info">
                  Showing{" "}
                  <strong>
                    {records.length}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {
                      pagination.total_records
                    }
                  </strong>{" "}
                  records
                </div>

                <div className="pagination-controls">
                  <select
                    value={
                      pagination.per_page
                    }
                    onChange={
                      changePageSize
                    }
                  >
                    {PAGE_SIZE_OPTIONS.map(
                      (size) => (
                        <option
                          key={size}
                          value={size}
                        >
                          {size} / page
                        </option>
                      )
                    )}
                  </select>

                  <button
                    disabled={
                      !pagination.has_previous
                    }
                    onClick={() =>
                      changePage(
                        currentPage - 1
                      )
                    }
                  >
                    ←
                  </button>

                  {paginationPages.map(
                    (page) => (
                      <button
                        key={page}
                        className={
                          page ===
                          currentPage
                            ? "active-page"
                            : ""
                        }
                        onClick={() =>
                          changePage(
                            page
                          )
                        }
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    disabled={
                      !pagination.has_next
                    }
                    onClick={() =>
                      changePage(
                        currentPage + 1
                      )
                    }
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  /*
  ============================================================
  OVERVIEW
  ============================================================
  */

  const renderOverview = () => {
    return (
      <div className="overview-content">
        <div className="welcome-heading">
          <div>
            <span className="eyebrow">
              ADMIN CONTROL CENTER
            </span>

            <h1>
              Dashboard Overview
            </h1>

            <p>
              Manage HireDeliver records, users,
              submissions and platform activity.
            </p>
          </div>

          <div className="overview-actions">
            <button
              className="primary-action"
              onClick={() =>
                handleSectionChange("hire")
              }
            >
              + View Hire Records
            </button>

            <button
              className="primary-action"
              onClick={() =>
                handleSectionChange("deliver")
              }
            >
              + View Deliver Records
            </button>
          </div>
        </div>

        {/* STAT CARDS */}

        <div className="admin-stat-grid">
          <div className="admin-stat-card total-card">
            <div className="stat-card-top">
              <span>
                Total Records
              </span>

              <div className="stat-icon">
                ◈
              </div>
            </div>

            <strong>
              {summary.total_records ||
                0}
            </strong>

            <small>
              All submissions
            </small>
          </div>

          <div className="admin-stat-card hire-card">
            <div className="stat-card-top">
              <span>
                Hire Records
              </span>

              <div className="stat-icon">
                H
              </div>
            </div>

            <strong>
              {summary.total_hires ||
                0}
            </strong>

            <small>
              Client requirements
            </small>
          </div>

          <div className="admin-stat-card deliver-card">
            <div className="stat-card-top">
              <span>
                Deliver Records
              </span>

              <div className="stat-icon">
                D
              </div>
            </div>

            <strong>
              {summary.total_delivers ||
                0}
            </strong>

            <small>
              Delivery proposals
            </small>
          </div>

          <div className="admin-stat-card pending-card">
            <div className="stat-card-top">
              <span>
                Pending
              </span>

              <div className="stat-icon">
                !
              </div>
            </div>

            <strong>
              {statusSummary.Pending ||
                0}
            </strong>

            <small>
              Awaiting review
            </small>
          </div>
        </div>

        {/* CHARTS */}

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <h3>
                  Record Distribution
                </h3>

                <p>
                  Hire vs Deliver
                </p>
              </div>
            </div>

            <div className="chart-container">
              {summary.total_records >
              0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={270}
                >
                  <PieChart>
                    <Pie
                      data={
                        typeChartData
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeChartData.map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">
                  No data available
                </div>
              )}
            </div>

            <div className="chart-legend">
              <div>
                <span
                  style={{
                    background:
                      COLORS[0],
                  }}
                />

                Hire

                <strong>
                  {
                    summary.total_hires
                  }
                </strong>
              </div>

              <div>
                <span
                  style={{
                    background:
                      COLORS[1],
                  }}
                />

                Deliver

                <strong>
                  {
                    summary.total_delivers
                  }
                </strong>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <h3>
                  Status Overview
                </h3>

                <p>
                  Current record statuses
                </p>
              </div>
            </div>

            <div className="chart-container">
              {pieData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={270}
                >
                  <BarChart
                    data={pieData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      radius={[
                        7,
                        7,
                        0,
                        0,
                      ]}
                      fill="#6366f1"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">
                  No status data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATUS CARDS */}

        <div className="status-overview-grid">
          {STATUS_OPTIONS.map(
            (status) => (
              <div
                key={status}
                className="mini-status-card"
              >
                <span
                  className={getStatusClass(
                    status
                  )}
                >
                  {status}
                </span>

                <strong>
                  {statusSummary[
                    status
                  ] || 0}
                </strong>
              </div>
            )
          )}
        </div>

        {/* RECENT RECORDS */}

        <div className="recent-section">
          <div className="section-top">
            <div>
              <h2>
                Recent Records
              </h2>

              <p>
                Latest submissions in the platform
              </p>
            </div>

            <button
              className="text-action"
              onClick={() =>
                handleSectionChange(
                  "hire"
                )
              }
            >
              View records →
            </button>
          </div>

          <div className="recent-records-grid">
            {records
              .slice(0, 5)
              .map((record) => (
                <div
                  key={`${record.record_type}-${record.id}`}
                  className="recent-record-card"
                >
                  <div className="recent-record-top">
                    <span
                      className={`record-type ${
                        record.record_type ===
                        "hire"
                          ? "type-hire"
                          : "type-deliver"
                      }`}
                    >
                      {record.record_type ===
                      "hire"
                        ? "Hire"
                        : "Deliver"}
                    </span>

                    <span
                      className={getStatusClass(
                        record.status
                      )}
                    >
                      {record.status ||
                        "Pending"}
                    </span>
                  </div>

                  <h3>
                    {formatValue(
                      record.title
                    )}
                  </h3>

                  <p>
                    {formatValue(
                      record.user_name
                    )}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedRecord(
                        record
                      );
                      setShowDetails(
                        true
                      );
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}

            {records.length === 0 && (
              <div className="empty-recent">
                No recent records available.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /*
  ============================================================
  PLACEHOLDER SECTIONS
  ============================================================
  */

  const renderUsersSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">
        👥
      </div>

      <h1>
        Users Management
      </h1>

      <p>
        User management section is reserved for
        complete user administration.
      </p>

      <div className="coming-card">
        <strong>
          Admin User Management
        </strong>

        <span>
          View users, account status, roles and
          activity from one place.
        </span>
      </div>
    </div>
  );

  const renderDatabaseSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">
        🗄️
      </div>

      <h1>
        Database
      </h1>

      <p>
        Database management and schema reference
        area.
      </p>

      <div className="coming-card">
        <strong>
          Database Administration
        </strong>

        <span>
          Structured database information and
          relational data overview.
        </span>
      </div>
    </div>
  );

  const renderFilesSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">
        📁
      </div>

      <h1>
        Files
      </h1>

      <p>
        Files are securely accessible from their
        associated Hire or Deliver record.
      </p>

      <div className="coming-card">
        <strong>
          Secure File Access
        </strong>

        <span>
          Open uploaded PDF and document files
          directly from record details.
        </span>
      </div>
    </div>
  );

  const renderImportSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">
        ⇧
      </div>

      <h1>
        Import CSV
      </h1>

      <p>
        Select a CSV file for bulk record
        processing.
      </p>

      <div className="import-card">
        <label className="csv-upload">
          <input
            type="file"
            accept=".csv"
            onChange={
              handleCSVImport
            }
          />

          <span className="upload-icon">
            ⇧
          </span>

          <strong>
            Choose CSV File
          </strong>

          <small>
            CSV files only
          </small>
        </label>

        {importFile && (
          <div className="selected-import-file">
            <span>
              📄
            </span>

            <strong>
              {importFile.name}
            </strong>
          </div>
        )}

        <div className="import-note">
          CSV import interface is prepared for
          bulk-entry integration.
        </div>
      </div>
    </div>
  );

  const renderExportSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">
        ⇩
      </div>

      <h1>
        Export Data
      </h1>

      <p>
        Export Hire and Deliver records separately using only their respective form fields.
      </p>

      <div className="export-panel">
        <div>
          <strong>
            Hire Records Export
          </strong>

          <span>
            Download only Hire form records and Hire form fields.
          </span>
        </div>

        <button
          className="export-button large-export"
          onClick={() =>
            handleExport("hire")
          }
        >
          ⇩ Export Hire
        </button>
      </div>

      <div className="export-panel">
        <div>
          <strong>
            Deliver Records Export
          </strong>

          <span>
            Download only Deliver form records and Deliver form fields.
          </span>
        </div>

        <button
          className="export-button large-export"
          onClick={() =>
            handleExport("deliver")
          }
        >
          ⇩ Export Deliver
        </button>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">
        ⚙
      </div>

      <h1>
        Settings
      </h1>

      <p>
        Admin platform settings.
      </p>

      <div className="settings-card">
        <div>
          <span>
            Account
          </span>

          <strong>
            {user?.fullName ||
              "Administrator"}
          </strong>
        </div>

        <div>
          <span>
            Email
          </span>

          <strong>
            {user?.email ||
              "N/A"}
          </strong>
        </div>

        <div>
          <span>
            Role
          </span>

          <strong>
            Administrator
          </strong>
        </div>

        <button
          className="danger-action"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );

  /*
  ============================================================
  MAIN RENDER
  ============================================================
  */

  return (
    <div className="admin-dashboard">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-dashboard {
          min-height: 100vh;
          background: #f4f7fb;
          color: #172033;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          display: flex;
        }

        /* =========================
           SIDEBAR
        ========================= */

        .admin-sidebar {
          width: 260px;
          min-width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          background:
            linear-gradient(
              180deg,
              #111827 0%,
              #172554 52%,
              #111827 100%
            );
          color: white;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          box-shadow:
            10px 0 30px rgba(15, 23, 42, 0.12);
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 10px 28px;
          border-bottom:
            1px solid
            rgba(255,255,255,0.08);
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #06b6d4
            );
          font-size: 19px;
          font-weight: 800;
          box-shadow:
            0 8px 25px
            rgba(99,102,241,0.35);
        }

        .brand-text strong {
          display: block;
          font-size: 17px;
          letter-spacing: -0.3px;
        }

        .brand-text span {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sidebar-label {
          padding: 25px 12px 10px;
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sidebar-button {
          width: 100%;
          border: none;
          background: transparent;
          color: #aebbd0;
          padding: 12px 13px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition:
            0.2s ease;
        }

        .sidebar-button:hover {
          color: white;
          background:
            rgba(255,255,255,0.07);
        }

        .sidebar-button.active {
          color: white;
          background:
            linear-gradient(
              135deg,
              rgba(99,102,241,0.95),
              rgba(6,182,212,0.82)
            );
          box-shadow:
            0 8px 22px
            rgba(6,182,212,0.14);
        }

        .sidebar-icon {
          width: 27px;
          height: 27px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background:
            rgba(255,255,255,0.06);
          font-size: 13px;
        }

        .sidebar-button.active
        .sidebar-icon {
          background:
            rgba(255,255,255,0.16);
        }

        .sidebar-spacer {
          flex: 1;
        }

        .admin-profile {
          border-top:
            1px solid
            rgba(255,255,255,0.08);
          padding: 16px 8px 2px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #06b6d4
            );
          font-weight: 800;
          font-size: 13px;
        }

        .admin-profile-info {
          min-width: 0;
          flex: 1;
        }

        .admin-profile-info strong {
          display: block;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-profile-info span {
          display: block;
          color: #7f8da5;
          font-size: 10px;
          margin-top: 2px;
        }

        .logout-small {
          border: none;
          background:
            rgba(239,68,68,0.1);
          color: #fca5a5;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
        }

        /* =========================
           MAIN
        ========================= */

        .admin-main {
          margin-left: 260px;
          width: calc(100% - 260px);
          min-height: 100vh;
        }

        .admin-topbar {
          height: 76px;
          background: rgba(255,255,255,0.94);
          border-bottom:
            1px solid #e6ebf2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 30px;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(15px);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .mobile-menu {
          display: none;
          border: none;
          background: #eef2ff;
          color: #4338ca;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
        }

        .topbar-title h2 {
          margin: 0;
          font-size: 17px;
          letter-spacing: -0.3px;
        }

        .topbar-title span {
          display: block;
          margin-top: 2px;
          color: #8a96a8;
          font-size: 11px;
        }

        .global-search {
          flex: 1;
          max-width: 440px;
          position: relative;
        }

        .global-search form {
          width: 100%;
          display: flex;
        }

        .global-search input {
          width: 100%;
          height: 42px;
          border: 1px solid #e0e6ef;
          background: #f8fafc;
          border-radius: 11px;
          outline: none;
          padding:
            0 95px 0 40px;
          color: #172033;
          font-size: 13px;
          transition: 0.2s;
        }

        .global-search input:focus {
          border-color: #818cf8;
          background: white;
          box-shadow:
            0 0 0 4px
            rgba(99,102,241,0.08);
        }

        .search-symbol {
          position: absolute;
          left: 14px;
          top: 50%;
          transform:
            translateY(-50%);
          color: #8a96a8;
        }

        .search-submit {
          position: absolute;
          right: 5px;
          top: 5px;
          height: 32px;
          border: none;
          border-radius: 8px;
          padding: 0 12px;
          background: #172033;
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .clear-search {
          position: absolute;
          right: 76px;
          top: 50%;
          transform:
            translateY(-50%);
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          font-size: 14px;
        }

        .topbar-admin {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topbar-admin-avatar {
          width: 37px;
          height: 37px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background:
            #e0e7ff;
          color: #4338ca;
          font-size: 13px;
          font-weight: 800;
        }

        .topbar-admin-text strong {
          display: block;
          font-size: 12px;
        }

        .topbar-admin-text span {
          color: #8a96a8;
          font-size: 10px;
        }

        /* =========================
           CONTENT
        ========================= */

        .admin-content {
          padding: 30px;
          max-width: 1700px;
          margin: 0 auto;
        }

        .welcome-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .eyebrow {
          color: #6366f1;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .welcome-heading h1 {
          margin:
            6px 0 5px;
          font-size: 27px;
          letter-spacing: -0.8px;
        }

        .welcome-heading p {
          margin: 0;
          color: #718096;
          font-size: 13px;
        }

/* =====================================================
   OVERVIEW ACTION BUTTONS
   ===================================================== */

.overview-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  width: auto;
  margin-left: auto;
}


/* =====================================================
   PRIMARY ACTION BUTTON
   ===================================================== */

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: none;

  background: linear-gradient(
    135deg,
    #6366f1,
    #06b6d4
  );

  color: #ffffff;

  border-radius: 10px;

  padding: 12px 17px;

  cursor: pointer;

  font-size: 12px;
  font-weight: 700;

  line-height: 1.2;

  white-space: nowrap;

  box-shadow:
    0 8px 20px
    rgba(99, 102, 241, 0.18);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}


/* =====================================================
   PRIMARY ACTION HOVER
   ===================================================== */

.primary-action:hover {
  transform: translateY(-2px);

  box-shadow:
    0 12px 25px
    rgba(99, 102, 241, 0.25);
}


/* =====================================================
   PRIMARY ACTION ACTIVE
   ===================================================== */

.primary-action:active {
  transform: translateY(0);

  box-shadow:
    0 6px 14px
    rgba(99, 102, 241, 0.18);
}


/* =====================================================
   PRIMARY ACTION FOCUS
   ===================================================== */

.primary-action:focus-visible {
  outline: 3px solid
    rgba(99, 102, 241, 0.22);

  outline-offset: 3px;
}


/* =====================================================
   OVERVIEW HEADER
   ===================================================== */

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  width: 100%;
}


/* =====================================================
   OVERVIEW HEADER CONTENT
   ===================================================== */

.overview-header-content {
  flex: 1;
  min-width: 0;
}


/* =====================================================
   RESPONSIVE
   ===================================================== */

@media (max-width: 900px) {

  .overview-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .overview-actions {
    width: 100%;
    margin-left: 0;

    justify-content: flex-start;

    gap: 10px;
  }
}


@media (max-width: 600px) {

  .overview-actions {
    width: 100%;

    display: flex;
    flex-direction: column;

    align-items: stretch;

    gap: 10px;
  }

  .primary-action {
    width: 100%;

    padding: 12px 16px;

    font-size: 12px;
  }
}

        /* =========================
           STAT CARDS
        ========================= */

        .admin-stat-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .admin-stat-card {
          min-height: 145px;
          padding: 20px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          color: white;
          box-shadow:
            0 12px 30px
            rgba(15,23,42,0.07);
        }

        .admin-stat-card::after {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          right: -35px;
          bottom: -45px;
          background:
            rgba(255,255,255,0.1);
        }

        .total-card {
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #6366f1
            );
        }

        .hire-card {
          background:
            linear-gradient(
              135deg,
              #0891b2,
              #06b6d4
            );
        }

        .deliver-card {
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #8b5cf6
            );
        }

        .pending-card {
          background:
            linear-gradient(
              135deg,
              #d97706,
              #f59e0b
            );
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: rgba(255,255,255,0.82);
          font-size: 11px;
          font-weight: 700;
        }

        .stat-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background:
            rgba(255,255,255,0.15);
          font-size: 14px;
          font-weight: 800;
        }

        .admin-stat-card > strong {
          display: block;
          margin-top: 16px;
          font-size: 31px;
          line-height: 1;
        }

        .admin-stat-card > small {
          display: block;
          margin-top: 8px;
          color: rgba(255,255,255,0.75);
          font-size: 10px;
        }

        /* =========================
           CHARTS
        ========================= */

        .charts-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 18px;
        }

        .chart-card {
          background: white;
          border:
            1px solid #e7ecf3;
          border-radius: 16px;
          padding: 20px;
          box-shadow:
            0 7px 25px
            rgba(15,23,42,0.04);
        }

        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .chart-card-header h3 {
          margin: 0;
          font-size: 15px;
        }

        .chart-card-header p {
          margin:
            4px 0 0;
          color: #8a96a8;
          font-size: 11px;
        }

        .chart-container {
          margin-top: 10px;
          width: 100%;
        }

        .chart-empty {
          min-height: 270px;
          display: grid;
          place-items: center;
          color: #9aa5b5;
          font-size: 12px;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 28px;
          font-size: 11px;
          color: #667085;
        }

        .chart-legend div {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .chart-legend span {
          width: 9px;
          height: 9px;
          border-radius: 3px;
        }

        .chart-legend strong {
          color: #172033;
          margin-left: 2px;
        }

        /* =========================
           STATUS CARDS
        ========================= */

        .status-overview-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .mini-status-card {
          background: white;
          border:
            1px solid #e7ecf3;
          border-radius: 13px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mini-status-card > strong {
          font-size: 21px;
          color: #172033;
        }

        .status-approved,
        .status-progress,
        .status-completed,
        .status-rejected,
        .status-pending {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          border-radius: 7px;
          padding: 5px 8px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status-approved {
          background: #dcfce7;
          color: #15803d;
        }

        .status-progress {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-completed {
          background: #ccfbf1;
          color: #0f766e;
        }

        .status-rejected {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status-pending {
          background: #fef3c7;
          color: #b45309;
        }

        /* =========================
           RECENT
        ========================= */

        .recent-section {
          margin-top: 25px;
        }

        .section-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 13px;
        }

        .section-top h2 {
          margin: 0;
          font-size: 17px;
        }

        .section-top p {
          margin:
            4px 0 0;
          color: #8a96a8;
          font-size: 11px;
        }

        .text-action {
          border: none;
          background: transparent;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .recent-records-grid {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 13px;
        }

        .recent-record-card {
          background: white;
          border:
            1px solid #e7ecf3;
          border-radius: 14px;
          padding: 15px;
          transition: 0.2s ease;
        }

        .recent-record-card:hover {
          transform:
            translateY(-2px);
          box-shadow:
            0 10px 25px
            rgba(15,23,42,0.07);
        }

        .recent-record-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .record-type {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 800;
        }

        .type-hire {
          background: #eef2ff;
          color: #4f46e5;
        }

        .type-deliver {
          background: #ecfeff;
          color: #0891b2;
        }

        .recent-record-card h3 {
          margin:
            15px 0 6px;
          font-size: 13px;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .recent-record-card p {
          margin: 0;
          color: #8a96a8;
          font-size: 10px;
        }

        .recent-record-card button {
          margin-top: 13px;
          width: 100%;
          border:
            1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
        }

        .empty-recent {
          grid-column: 1 / -1;
          background: white;
          padding: 35px;
          text-align: center;
          color: #8a96a8;
          border-radius: 14px;
        }

        /* =========================
           RECORDS
        ========================= */

        .records-section {
          width: 100%;
        }

        .records-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 17px;
        }

        .records-toolbar h2 {
          margin: 0;
          font-size: 23px;
        }

        .records-toolbar p {
          margin:
            5px 0 0;
          color: #8a96a8;
          font-size: 12px;
        }

        .records-toolbar-actions {
          display: flex;
          gap: 9px;
        }

        .export-button {
          border: none;
          background:
            #172033;
          color: white;
          padding: 10px 14px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .record-table-card {
          background: white;
          border:
            1px solid #e7ecf3;
          border-radius: 15px;
          overflow: hidden;
          box-shadow:
            0 7px 25px
            rgba(15,23,42,0.04);
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          min-width: 1250px;
          border-collapse: collapse;
        }

        .admin-table th {
          padding: 13px 14px;
          background: #f8fafc;
          border-bottom:
            1px solid #e8edf4;
          text-align: left;
          color: #718096;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          white-space: nowrap;
        }

        .admin-table td {
          padding: 14px;
          border-bottom:
            1px solid #edf1f6;
          color: #475569;
          font-size: 11px;
          vertical-align: middle;
        }

        .admin-table tbody tr:hover {
          background: #fbfcfe;
        }

        .admin-table tbody tr:last-child td {
          border-bottom: none;
        }

        .record-id {
          font-weight: 800;
          color: #6366f1;
        }

        .user-table-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 155px;
        }

        .small-avatar {
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 10px;
          font-weight: 800;
        }

        .user-table-cell strong {
          display: block;
          color: #172033;
          font-size: 11px;
        }

        .user-table-cell span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 9px;
        }

        .title-cell {
          min-width: 160px;
          max-width: 220px;
          color: #172033;
          font-weight: 700;
          line-height: 1.4;
        }

        .date-cell {
          color: #7b8798;
          white-space: nowrap;
          font-size: 10px;
        }

        .status-select {
          border: none;
          outline: none;
          cursor: pointer;
          appearance: auto;
        }

        .table-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .view-button {
          border: none;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 7px;
          padding: 7px 9px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
        }

        .delete-icon-button {
          border: none;
          background: #fff1f2;
          color: #e11d48;
          width: 29px;
          height: 29px;
          border-radius: 7px;
          cursor: pointer;
        }

        .pagination-bar {
          border-top:
            1px solid #edf1f6;
          padding: 13px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .pagination-info {
          color: #8a96a8;
          font-size: 10px;
        }

        .pagination-info strong {
          color: #475569;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .pagination-controls select,
        .pagination-controls button {
          height: 31px;
          border:
            1px solid #e1e7ef;
          background: white;
          border-radius: 7px;
          color: #475569;
          font-size: 10px;
          cursor: pointer;
        }

        .pagination-controls select {
          padding: 0 7px;
          margin-right: 5px;
        }

        .pagination-controls button {
          width: 31px;
        }

        .pagination-controls button:hover:not(:disabled) {
          background: #eef2ff;
          color: #4f46e5;
        }

        .pagination-controls button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination-controls
        .active-page {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }

        .table-loading {
          min-height: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #8a96a8;
          font-size: 12px;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border:
            3px solid #e5e7eb;
          border-top-color: #6366f1;
          animation:
            spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        .empty-records {
          min-height: 330px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 30px;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: #f1f5f9;
          font-size: 25px;
        }

        .empty-records h3 {
          margin:
            14px 0 5px;
          font-size: 16px;
        }

        .empty-records p {
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
        }

        /* =========================
           PLACEHOLDER SECTIONS
        ========================= */

        .placeholder-section {
          max-width: 850px;
          margin: 30px auto;
        }

        .placeholder-icon {
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #ecfeff
            );
          font-size: 26px;
          margin-bottom: 17px;
        }

        .placeholder-section h1 {
          margin: 0;
          font-size: 27px;
        }

        .placeholder-section > p {
          color: #7b8798;
          font-size: 13px;
          margin:
            7px 0 20px;
        }

        .coming-card,
        .settings-card,
        .import-card,
        .export-panel {
          background: white;
          border:
            1px solid #e7ecf3;
          border-radius: 16px;
          padding: 22px;
          box-shadow:
            0 8px 25px
            rgba(15,23,42,0.04);
        }

        .coming-card strong,
        .coming-card span {
          display: block;
        }

        .coming-card strong {
          font-size: 14px;
        }

        .coming-card span {
          margin-top: 7px;
          color: #8a96a8;
          font-size: 11px;
        }

        .csv-upload {
          min-height: 190px;
          border:
            2px dashed #cbd5e1;
          border-radius: 13px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .csv-upload:hover {
          border-color: #6366f1;
          background: #fafaff;
        }

        .csv-upload input {
          display: none;
        }

        .upload-icon {
          font-size: 28px;
          color: #6366f1;
        }

        .csv-upload strong {
          margin-top: 10px;
          font-size: 13px;
        }

        .csv-upload small {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 10px;
        }

        .selected-import-file {
          margin-top: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 9px;
          display: flex;
          gap: 9px;
          align-items: center;
          font-size: 11px;
        }

        .import-note {
          margin-top: 15px;
          color: #8a96a8;
          font-size: 10px;
          line-height: 1.6;
        }

        .export-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .export-panel strong,
        .export-panel span {
          display: block;
        }

        .export-panel strong {
          font-size: 14px;
        }

        .export-panel span {
          color: #8a96a8;
          font-size: 11px;
          margin-top: 4px;
        }

        .large-export {
          padding:
            12px 20px;
        }

        .settings-card {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .settings-card > div {
          padding:
            14px 0;
          border-bottom:
            1px solid #edf1f6;
        }

        .settings-card > div span,
        .settings-card > div strong {
          display: block;
        }

        .settings-card > div span {
          color: #94a3b8;
          font-size: 10px;
        }

        .settings-card > div strong {
          margin-top: 4px;
          font-size: 13px;
        }

        .settings-card
        .danger-action {
          margin-top: 18px;
          align-self: flex-start;
        }

        /* =========================
           DETAILS MODAL
        ========================= */

        .details-modal-overlay {
          position: fixed;
          inset: 0;
          background:
            rgba(15,23,42,0.62);
          backdrop-filter:
            blur(5px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 25px;
        }

        .details-modal {
          width: min(
            1120px,
            100%
          );
          max-height: 92vh;
          background: #f8fafc;
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 30px 80px
            rgba(0,0,0,0.22);
          display: flex;
          flex-direction: column;
        }

        .details-modal-header {
          padding: 23px 26px;
          background:
            linear-gradient(
              135deg,
              #111827,
              #1e3a8a
            );
          color: white;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .details-type-badge {
          display: inline-flex;
          background:
            rgba(255,255,255,0.1);
          border:
            1px solid
            rgba(255,255,255,0.12);
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .details-modal-header h2 {
          margin: 20px 0 4px;
          font-size: 21px;
          max-width: 800px;
          line-height: 1.3;
        }

        .details-modal-header p {
          margin: 0;
          color: #aebbd0;
          font-size: 10px;
        }

        .modal-close {
          width: 37px;
          height: 37px;
          border: none;
          border-radius: 10px;
          background:
            rgba(255,255,255,0.09);
          color: white;
          font-size: 23px;
          cursor: pointer;
        }

        .details-modal-body {
          overflow-y: auto;
          padding: 22px;
        }

        .record-status-banner {
          background: white;
          border:
            1px solid #e5eaf1;
          border-radius: 13px;
          padding: 15px 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 17px;
        }

        .record-status-banner > div:first-child
        span {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .record-status-banner > div:first-child
        strong {
          margin-top: 6px;
        }

        .status-control {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .status-control label {
          color: #7b8798;
          font-size: 10px;
          font-weight: 700;
        }

        .status-control select {
          border:
            1px solid #dce3ec;
          background: white;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 10px;
          outline: none;
          cursor: pointer;
        }

        .detail-section {
          background: white;
          border:
            1px solid #e6ebf2;
          border-radius: 14px;
          padding: 19px;
          margin-bottom: 14px;
        }

        .detail-section-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 17px;
        }

        .section-icon {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: #eef2ff;
          font-size: 15px;
        }

        .detail-section-heading h3 {
          margin: 0;
          font-size: 13px;
        }

        .detail-section-heading p {
          margin:
            3px 0 0;
          color: #94a3b8;
          font-size: 9px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .detail-field {
          padding: 12px;
          border:
            1px solid #edf1f6;
          background: #fafbfc;
          border-radius: 9px;
          min-width: 0;
        }

        .detail-field-full {
          grid-column: 1 / -1;
        }

        .detail-field span {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 700;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .detail-field strong {
          display: block;
          color: #334155;
          font-size: 11px;
          line-height: 1.55;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .long-detail {
          padding: 13px;
          background: #fafbfc;
          border:
            1px solid #edf1f6;
          border-radius: 9px;
          margin-bottom: 9px;
        }

        .long-detail:last-child {
          margin-bottom: 0;
        }

        .long-detail > span {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 7px;
        }

        .long-detail p {
          margin: 0;
          color: #334155;
          font-size: 11px;
          line-height: 1.65;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* =========================
           TEAM MEMBERS
        ========================= */

        .team-members-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .team-member-card {
          display: flex;
          gap: 13px;
          padding: 15px;
          border:
            1px solid #e8edf4;
          background:
            linear-gradient(
              135deg,
              #fbfdff,
              #f7f9fc
            );
          border-radius: 12px;
        }

        .team-member-number {
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 10px;
          font-weight: 800;
        }

        .team-member-content {
          flex: 1;
          min-width: 0;
        }

        .team-member-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 13px;
        }

        .team-avatar {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #06b6d4
            );
          color: white;
          font-size: 13px;
          font-weight: 800;
        }

        .team-member-heading h4 {
          margin: 0;
          font-size: 12px;
        }

        .team-member-heading span {
          display: block;
          margin-top: 3px;
          color: #8a96a8;
          font-size: 9px;
        }

        .team-member-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        /* =========================
           FILES
        ========================= */

        .admin-files-list {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .admin-file-card {
          border:
            1px solid #e3e8f0;
          background: #fafbfc;
          border-radius: 11px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-align: left;
          transition: 0.2s;
        }

        .admin-file-card:hover {
          border-color: #818cf8;
          background: #f8f8ff;
          transform:
            translateY(-1px);
        }

        .admin-file-icon {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: #eef2ff;
          font-size: 16px;
        }

        .admin-file-info {
          min-width: 0;
          flex: 1;
        }

        .admin-file-name {
          display: block;
          color: #334155;
          font-size: 10px;
          font-weight: 800;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-file-info small {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 8px;
        }

        .admin-file-arrow {
          color: #6366f1;
          font-weight: 800;
        }

        .details-footer-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          padding-top: 5px;
        }

        .secondary-action,
        .danger-action {
          border: none;
          border-radius: 9px;
          padding: 10px 15px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
        }

        .secondary-action {
          background: #e2e8f0;
          color: #475569;
        }

        .danger-action {
          background: #fee2e2;
          color: #b91c1c;
        }

        /* =========================
           DELETE MODAL
        ========================= */

        .delete-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          display: grid;
          place-items: center;
          background:
            rgba(15,23,42,0.62);
          backdrop-filter: blur(4px);
          padding: 20px;
        }

        .delete-modal {
          width: min(
            430px,
            100%
          );
          background: white;
          border-radius: 17px;
          padding: 25px;
          text-align: center;
          box-shadow:
            0 25px 70px
            rgba(0,0,0,0.2);
        }

        .delete-modal-icon {
          width: 55px;
          height: 55px;
          margin: 0 auto 13px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: #fff1f2;
          color: #e11d48;
          font-size: 22px;
        }

        .delete-modal h3 {
          margin: 0;
          font-size: 17px;
        }

        .delete-modal p {
          color: #7b8798;
          font-size: 11px;
          line-height: 1.6;
          margin:
            8px 0 18px;
        }

        .delete-modal-actions {
          display: flex;
          justify-content: center;
          gap: 9px;
        }

        .delete-modal-actions button {
          min-width: 100px;
          border: none;
          border-radius: 9px;
          padding: 10px 14px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
        }

        .cancel-delete {
          background: #e2e8f0;
          color: #475569;
        }

        .confirm-delete {
          background: #dc2626;
          color: white;
        }

        /* =========================
           ERROR
        ========================= */

        .admin-error {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 6000;
          max-width: 400px;
          padding: 13px 15px;
          background: #7f1d1d;
          color: white;
          border-radius: 10px;
          box-shadow:
            0 15px 40px
            rgba(0,0,0,0.2);
          font-size: 11px;
          line-height: 1.5;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1250px) {
          .admin-stat-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .recent-records-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .status-overview-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }
        }

        @media (max-width: 950px) {
          .admin-sidebar {
            transform:
              translateX(-100%);
            transition:
              transform 0.25s ease;
          }

          .admin-sidebar.mobile-open {
            transform:
              translateX(0);
          }

          .admin-main {
            margin-left: 0;
            width: 100%;
          }

          .mobile-menu {
            display: grid;
            place-items: center;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .recent-records-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .admin-topbar {
            padding: 0 18px;
          }

          .admin-content {
            padding: 22px 18px;
          }
        }

        @media (max-width: 700px) {
          .topbar-title {
            display: none;
          }

          .global-search {
            max-width: none;
          }

          .topbar-admin-text {
            display: none;
          }

          .welcome-heading {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-stat-grid {
            grid-template-columns: 1fr;
          }

          .status-overview-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .recent-records-grid {
            grid-template-columns: 1fr;
          }

          .records-toolbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 13px;
          }

          .pagination-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .pagination-controls {
            flex-wrap: wrap;
          }

          .details-modal-overlay {
            padding: 8px;
          }

          .details-modal {
            max-height: 96vh;
            border-radius: 15px;
          }

          .details-modal-header {
            padding: 17px;
          }

          .details-modal-body {
            padding: 12px;
          }

          .detail-grid,
          .team-member-grid,
          .admin-files-list {
            grid-template-columns: 1fr;
          }

          .detail-field-full {
            grid-column: auto;
          }

          .record-status-banner {
            flex-direction: column;
            align-items: flex-start;
          }

          .status-control {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }

          .status-control select {
            width: 100%;
          }

          .export-panel {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .admin-content {
            padding: 17px 12px;
          }

          .admin-topbar {
            gap: 8px;
            padding: 0 12px;
          }

          .global-search input {
            padding-left: 34px;
            padding-right: 70px;
          }

          .search-submit {
            font-size: 0;
            width: 34px;
          }

          .search-submit::after {
            content: "⌕";
            font-size: 14px;
          }

          .clear-search {
            right: 43px;
          }

          .status-overview-grid {
            grid-template-columns: 1fr;
          }

          .welcome-heading h1 {
            font-size: 23px;
          }
        }

        .empty-files-message {
          padding: 18px;
          border: 1px dashed #d7dee9;
          border-radius: 12px;
          background: #f8fafc;
          color: #64748b;
          text-align: center;
          font-size: 14px;
        }

        .team-member-card .detail-field strong {
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .admin-file-name {
          display: block;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      `}</style>

      {/* ====================================================
          SIDEBAR
      ==================================================== */}

      <aside
        className={`admin-sidebar ${
          mobileSidebar
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="admin-brand">
          <div className="brand-logo">
            HD
          </div>

          <div className="brand-text">
            <strong>
              HireDeliver
            </strong>

            <span>
              Admin Panel
            </span>
          </div>
        </div>

        <div className="sidebar-label">
          Main
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-button ${
              activeSection ===
              "overview"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSectionChange(
                "overview"
              )
            }
          >
            <span className="sidebar-icon">
              ◈
            </span>

            Overview
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "hire"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSectionChange(
                "hire"
              )
            }
          >
            <span className="sidebar-icon">
              H
            </span>

            Hire Records
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "deliver"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSectionChange(
                "deliver"
              )
            }
          >
            <span className="sidebar-icon">
              D
            </span>

            Deliver Records
          </button>
        </nav>

        <div className="sidebar-label">
          Administration
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-button ${
              activeSection ===
              "users"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveSection("users");
              setMobileSidebar(false);
            }}
          >
            <span className="sidebar-icon">
              👥
            </span>

            Users
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "database"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveSection(
                "database"
              );
              setMobileSidebar(false);
            }}
          >
            <span className="sidebar-icon">
              🗄
            </span>

            Database
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "files"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveSection("files");
              setMobileSidebar(false);
            }}
          >
            <span className="sidebar-icon">
              📁
            </span>

            Files
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "import"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveSection(
                "import"
              );
              setMobileSidebar(false);
            }}
          >
            <span className="sidebar-icon">
              ⇧
            </span>

            Import CSV
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "export"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveSection(
                "export"
              );
              setMobileSidebar(false);
            }}
          >
            <span className="sidebar-icon">
              ⇩
            </span>

            Export Data
          </button>

          <button
            className={`sidebar-button ${
              activeSection ===
              "settings"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveSection(
                "settings"
              );
              setMobileSidebar(false);
            }}
          >
            <span className="sidebar-icon">
              ⚙
            </span>

            Settings
          </button>
        </nav>

        <div className="sidebar-spacer" />

        <div className="admin-profile">
          <div className="admin-avatar">
            {(user?.fullName ||
              "A")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="admin-profile-info">
            <strong>
              {user?.fullName ||
                "Administrator"}
            </strong>

            <span>
              Administrator
            </span>
          </div>

          <button
            className="logout-small"
            onClick={handleLogout}
            title="Logout"
          >
            ↪
          </button>
        </div>
      </aside>

      {/* ====================================================
          MAIN
      ==================================================== */}

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() =>
                setMobileSidebar(
                  !mobileSidebar
                )
              }
            >
              ☰
            </button>

            <div className="topbar-title">
              <h2>
                {activeSection ===
                "overview"
                  ? "Overview"
                  : activeSection ===
                    "hire"
                  ? "Hire Records"
                  : activeSection ===
                    "deliver"
                  ? "Deliver Records"
                  : activeSection ===
                    "users"
                  ? "Users"
                  : activeSection ===
                    "database"
                  ? "Database"
                  : activeSection ===
                    "files"
                  ? "Files"
                  : activeSection ===
                    "import"
                  ? "Import CSV"
                  : activeSection ===
                    "export"
                  ? "Export Data"
                  : "Settings"}
              </h2>

              <span>
                HireDeliver Administration
              </span>
            </div>
          </div>

          <div className="global-search">
            <form
              onSubmit={
                handleSearch
              }
            >
              <span className="search-symbol">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search records, users, title, category..."
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(
                    e.target.value
                  )
                }
              />

              {searchInput && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={
                    clearSearch
                  }
                >
                  ×
                </button>
              )}

              <button
                type="submit"
                className="search-submit"
              >
                Search
              </button>
            </form>
          </div>

          <div className="topbar-admin">
            <div className="topbar-admin-avatar">
              {(user?.fullName ||
                "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="topbar-admin-text">
              <strong>
                {user?.fullName ||
                  "Administrator"}
              </strong>

              <span>
                Admin
              </span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {activeSection ===
            "overview" &&
            renderOverview()}

          {(activeSection ===
            "hire" ||
            activeSection ===
              "deliver") &&
            renderRecords()}

          {activeSection ===
            "users" &&
            renderUsersSection()}

          {activeSection ===
            "database" &&
            renderDatabaseSection()}

          {activeSection ===
            "files" &&
            renderFilesSection()}

          {activeSection ===
            "import" &&
            renderImportSection()}

          {activeSection ===
            "export" &&
            renderExportSection()}

          {activeSection ===
            "settings" &&
            renderSettingsSection()}
        </main>
      </div>

      {/* ====================================================
          DETAILS MODAL
      ==================================================== */}

      {showDetails &&
        selectedRecord &&
        renderRecordDetails(
          selectedRecord
        )}

      {/* ====================================================
          DELETE CONFIRMATION
      ==================================================== */}

      {deleteRecord && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              🗑
            </div>

            <h3>
              Delete this record?
            </h3>

            <p>
              You are about to permanently
              delete{" "}
              <strong>
                {deleteRecord.title ||
                  "this record"}
              </strong>
              . Related files and team member
              information will also be removed.
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                className="cancel-delete"
                onClick={() =>
                  setDeleteRecord(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={
                  confirmDelete
                }
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;