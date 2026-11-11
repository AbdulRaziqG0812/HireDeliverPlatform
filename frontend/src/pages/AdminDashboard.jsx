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

import "./AdminDashboard.css";

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
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [importFile, setImportFile] = useState(null);
  const [importType, setImportType] = useState("hire");
  const [importing, setImporting] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("Approved");
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [statusImportFile, setStatusImportFile] = useState(null);
  const [statusImporting, setStatusImporting] = useState(false);
  const [statusImportResult, setStatusImportResult] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("hireDeliverLoggedIn");
    localStorage.removeItem("hireDeliverUser");
    localStorage.removeItem("hireDeliverAccessToken");
    navigate("/");
  };

  const loadRecords = async (
    page = pagination.page,
    type = recordType,
    currentSearch = search,
    perPage = pagination.per_page,
    currentStatus = statusFilter
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

      if (currentStatus && STATUS_OPTIONS.includes(currentStatus)) {
        params.append("status", currentStatus);
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to load admin records.");
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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadRecords(1, "all", "", pagination.per_page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    const refresh = () => {
      if (
        document.visibilityState === "visible" &&
        !loading &&
        !bulkUpdating
      ) {
        loadRecords(
          pagination.page,
          recordType,
          search,
          pagination.per_page,
          statusFilter
        );
      }
    };

    const interval = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    pagination.page,
    pagination.per_page,
    recordType,
    search,
    statusFilter,
  ]);

  useEffect(() => {
    if (!error) return undefined;

    const timer = window.setTimeout(() => {
      setError("");
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = searchInput.trim();
    setSearch(value);
    setSelectedKeys([]);
    loadRecords(1, recordType, value, pagination.per_page, statusFilter);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setSelectedKeys([]);
    loadRecords(1, recordType, "", pagination.per_page, statusFilter);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setSelectedKeys([]);
    loadRecords(1, recordType, search, pagination.per_page, value);
  };

  const handleTypeChange = (type) => {
    setRecordType(type);
    setSelectedKeys([]);

    const nextSection =
      type === "hire"
        ? "hire"
        : type === "deliver"
        ? "deliver"
        : "overview";

    setActiveSection(nextSection);
    loadRecords(1, type, search, pagination.per_page, statusFilter);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileSidebar(false);

    if (section === "overview") {
      setRecordType("all");
      setSelectedKeys([]);
      loadRecords(1, "all", search, pagination.per_page, statusFilter);
    }

    if (section === "hire") {
      setRecordType("hire");
      setSelectedKeys([]);
      loadRecords(1, "hire", search, pagination.per_page, statusFilter);
    }

    if (section === "deliver") {
      setRecordType("deliver");
      setSelectedKeys([]);
      loadRecords(1, "deliver", search, pagination.per_page, statusFilter);
    }
  };

  const changePage = (page) => {
    if (
      page < 1 ||
      page > pagination.total_pages ||
      loading
    ) {
      return;
    }

    setSelectedKeys([]);
    loadRecords(
      page,
      recordType,
      search,
      pagination.per_page,
      statusFilter
    );
  };

  const changePageSize = (e) => {
    const newSize = Number(e.target.value);
    setSelectedKeys([]);
    loadRecords(1, recordType, search, newSize, statusFilter);
  };

  const updateSingleStatus = async (record, newStatus) => {
    if (!record || !newStatus) return false;

    const key = `${record.record_type}-${record.id}`;
    setUpdatingStatus(key);

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/records/${record.record_type}/${record.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update record status."
        );
      }

      return true;
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusChange = async (record, newStatus) => {
    if (!record || !newStatus) return;

    setError("");

    try {
      const success = await updateSingleStatus(record, newStatus);
      if (!success) return;

      setRecords((previous) =>
        previous.map((item) =>
          item.id === record.id &&
          item.record_type === record.record_type
            ? { ...item, status: newStatus }
            : item
        )
      );

      if (
        selectedRecord?.id === record.id &&
        selectedRecord?.record_type === record.record_type
      ) {
        setSelectedRecord((current) =>
          current ? { ...current, status: newStatus } : current
        );
      }
    } catch (err) {
      setError(err.message || "Unable to update status.");
    }
  };

  const getRecordKey = (record) =>
    `${record?.record_type}-${record?.id}`;

  const toggleRecordSelection = (record) => {
    const key = getRecordKey(record);

    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const togglePageSelection = () => {
    const pageKeys = records.map(getRecordKey);
    const allSelected =
      pageKeys.length > 0 &&
      pageKeys.every((key) => selectedKeys.includes(key));

    setSelectedKeys((current) => {
      if (allSelected) {
        return current.filter((key) => !pageKeys.includes(key));
      }

      return Array.from(new Set([...current, ...pageKeys]));
    });
  };

  const selectPendingOnPage = () => {
    const pendingKeys = records
      .filter((record) => (record.status || "Pending") === "Pending")
      .map(getRecordKey);

    setSelectedKeys((current) =>
      Array.from(new Set([...current, ...pendingKeys]))
    );
  };

  const handleBulkSelectedStatus = async () => {
    if (!selectedKeys.length) {
      setError("Please select at least one record first.");
      return;
    }

    const targets = records.filter((record) =>
      selectedKeys.includes(getRecordKey(record))
    );

    if (!targets.length) {
      setError(
        "The selected records are no longer available. Please refresh the list."
      );
      return;
    }

    setBulkUpdating(true);
    setError("");

    try {
      const results = await Promise.allSettled(
        targets.map((record) =>
          updateSingleStatus(record, bulkStatus)
        )
      );

      const failed = results.filter(
        (result) => result.status === "rejected"
      );

      const succeededKeys = targets
        .filter((_, index) => results[index].status === "fulfilled")
        .map(getRecordKey);

      setRecords((previous) =>
        previous.map((record) =>
          succeededKeys.includes(getRecordKey(record))
            ? { ...record, status: bulkStatus }
            : record
        )
      );

      setSelectedKeys([]);

      if (failed.length) {
        setError(
          `${failed.length} record(s) could not be updated. The successful changes were saved.`
        );
      }

      await loadRecords(
        pagination.page,
        recordType,
        search,
        pagination.per_page,
        statusFilter
      );
    } catch (err) {
      setError(err.message || "Bulk status update failed.");
    } finally {
      setBulkUpdating(false);
    }
  };

  const fetchAllPendingRecords = async (type) => {
    let page = 1;
    let totalPages = 1;
    const all = [];

    do {
      const params = new URLSearchParams({
        page: String(page),
        per_page: "100",
        type,
        status: "Pending",
      });

      if (search.trim()) {
        params.append("search", search.trim());
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load Pending records."
        );
      }

      all.push(...(data.records || []));
      totalPages = data.pagination?.total_pages || 1;
      page += 1;
    } while (page <= totalPages);

    return all;
  };

  const handleApproveAllPending = async () => {
    const type =
      recordType === "hire" || recordType === "deliver"
        ? recordType
        : "all";

    setBulkUpdating(true);
    setError("");

    try {
      const pendingRecords = await fetchAllPendingRecords(type);

      if (!pendingRecords.length) {
        setError(
          `There are no Pending ${
            type === "all"
              ? "Hire/Deliver"
              : type === "hire"
              ? "Hire"
              : "Deliver"
          } records to approve.`
        );
        return;
      }

      const results = await Promise.allSettled(
        pendingRecords.map((record) =>
          updateSingleStatus(record, "Approved")
        )
      );

      const failed = results.filter(
        (result) => result.status === "rejected"
      );
      const approvedCount = results.length - failed.length;

      if (failed.length) {
        setError(
          `${approvedCount} Pending record(s) approved, but ${failed.length} record(s) could not be updated.`
        );
      }

      setSelectedKeys([]);

      await loadRecords(
        pagination.page,
        recordType,
        search,
        pagination.per_page,
        statusFilter
      );
    } catch (err) {
      setError(err.message || "Bulk approval failed.");
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleStatusImportFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setStatusImportFile(file);
    setStatusImportResult(null);
    setError("");
  };

  const handleStatusImport = async () => {
    if (!statusImportFile) {
      setError(
        "Please select the exported Excel file with updated statuses."
      );
      return;
    }

    setStatusImporting(true);
    setError("");
    setStatusImportResult(null);

    try {
      const formData = new FormData();
      formData.append(
        "type",
        recordType === "all" ? "all" : recordType
      );
      formData.append("file", statusImportFile);

      const response = await fetch(
        `${API_BASE}/api/admin/records/status-import`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to import status changes."
        );
      }

      setStatusImportResult(data);
      setStatusImportFile(null);

      await loadRecords(
        pagination.page,
        recordType,
        search,
        pagination.per_page,
        statusFilter
      );
    } catch (err) {
      setError(err.message || "Unable to import status changes.");
    } finally {
      setStatusImporting(false);
    }
  };

  const openFile = async (file, fileRecordType) => {
    if (!file?.id) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/files/${fileRecordType}/${file.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Unable to open file.");
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);

      window.open(fileUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (err) {
      setError(err.message || "Unable to open uploaded file.");
    }
  };

  const handleExport = async (exportType = recordType) => {
    if (!["hire", "deliver"].includes(exportType)) {
      setError("Please select Hire or Deliver records to export.");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("type", exportType);

      if (search.trim()) {
        params.append("search", search.trim());
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
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Excel export failed.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

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
      setError(err.message || "Excel export failed.");
    }
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImportFile(null);
      return;
    }

    const lowerName = file.name.toLowerCase();
    const allowed =
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xlsm") ||
      lowerName.endsWith(".csv");

    if (!allowed) {
      setImportFile(null);
      setImportResult(null);
      setError(
        "Invalid file. Please select an Excel (.xlsx/.xlsm) or CSV file."
      );
      return;
    }

    setImportFile(file);
    setImportResult(null);
    setError("");
  };

  const handleImportRecords = async () => {
    if (!importFile) {
      setError("Please select an Excel or CSV file first.");
      return;
    }

    setImporting(true);
    setError("");
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("type", importType);
      formData.append("file", importFile);

      const response = await fetch(
        `${API_BASE}/api/admin/records/import`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to import records."
        );
      }

      setImportResult(data);
      setImportFile(null);

      await loadRecords(
        1,
        recordType,
        search,
        pagination.per_page,
        statusFilter
      );
    } catch (err) {
      setError(err.message || "Unable to import records.");
    } finally {
      setImporting(false);
    }
  };

  const downloadImportTemplate = async () => {
    setTemplateLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/records/import/template?type=${importType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.message || "Unable to download import template."
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download =
        importType === "hire"
          ? "Hire_Import_Template.xlsx"
          : "Deliver_Import_Template.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.message || "Unable to download import template."
      );
    } finally {
      setTemplateLoading(false);
    }
  };

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

  const pieData = STATUS_OPTIONS.map((status) => ({
    name: status,
    value: statusSummary[status],
  })).filter((item) => item.value > 0);

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

  const paginationPages = [];
  const totalPages = pagination.total_pages || 1;
  const currentPage = pagination.page || 1;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + 4);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
  }

  for (let page = startPage; page <= endPage; page++) {
    paginationPages.push(page);
  }

  const DetailField = ({ label, value, full = false }) => (
    <div
      className={`detail-field ${
        full ? "detail-field-full" : ""
      }`}
    >
      <span>{label}</span>
      <strong>{formatValue(value)}</strong>
    </div>
  );

  const FileCard = ({ file, recordType: fileType }) => {
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
        onClick={() => openFile(file, fileType)}
      >
        <div className="admin-file-icon">📎</div>

        <div className="admin-file-info">
          <span className="admin-file-name">{fileName}</span>
          <small>Click to open document</small>
        </div>

        <div className="admin-file-arrow">↗</div>
      </button>
    );
  };

  const TeamMemberCard = ({ member, index }) => {
    if (!member) return null;

    const profileFiles =
      member.profileFiles ||
      member.profile_files ||
      member.profile ||
      member.profile_file ||
      member.profile_file_name;

    return (
      <div className="team-member-card">
        <div className="team-member-number">{index + 1}</div>

        <div className="team-member-content">
          <div className="team-member-heading">
            <div className="team-avatar">
              {(member.name || "M")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h4>{formatValue(member.name)}</h4>
              <span>{formatValue(member.role)}</span>
            </div>
          </div>

          <div className="team-member-grid">
            <DetailField label="Member Name" value={member.name} />
            <DetailField label="Role" value={member.role} />
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
              value={
                member.similar_experience ||
                member.similarExperience
              }
              full
            />
          </div>
        </div>
      </div>
    );
  };

  const renderRecordDetails = (record) => {
    if (!record) return null;

    const isHire = record.record_type === "hire";
    const files = record.files || record.uploaded_files || [];
    const teamMembers =
      record.team_members ||
      record.teamMembers ||
      [];

    return (
      <div
        className="details-modal-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setShowDetails(false);
            setSelectedRecord(null);
          }
        }}
      >
        <div className="details-modal">
          <div className="details-modal-header">
            <div>
              <div className="details-type-badge">
                {isHire
                  ? "HIRE REQUIREMENT"
                  : "DELIVER PROPOSAL"}
              </div>

              <h2 className="details-record-title">
                {formatValue(record.title)}
              </h2>

              <p className="details-record-number">
                Record #{record.id}
                {record.user_name || record.user?.name
                  ? ` • ${formatValue(
                      record.user_name ||
                        record.user?.name
                    )}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              className="modal-close"
              onClick={() => {
                setShowDetails(false);
                setSelectedRecord(null);
              }}
              aria-label="Close details"
            >
              ×
            </button>
          </div>

          <div className="details-modal-body">
            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">🛡️</div>
                <div>
                  <h3>Record Administration</h3>
                  <p>Submission and administrative information</p>
                </div>
              </div>

              <div className="detail-grid">
                <DetailField label="Record ID" value={record.id} />
                <DetailField
                  label="Record Type"
                  value={isHire ? "Hire" : "Deliver"}
                />
                <DetailField
                  label="Record Key"
                  value={record.record_key}
                />
                <DetailField
                  label="User Name"
                  value={record.user_name || record.user?.name}
                />
                <DetailField
                  label="User Email"
                  value={record.user_email || record.user?.email}
                />
                <DetailField
                  label="User Phone"
                  value={record.user_phone || record.user?.phone}
                />
                <DetailField
                  label="Current Status"
                  value={record.status || "Pending"}
                />
                <DetailField
                  label="Created At"
                  value={formatDate(record.created_at)}
                />
                <DetailField
                  label="Updated At"
                  value={formatDate(record.updated_at)}
                />
              </div>

              <div className="status-control">
                <label htmlFor="details-status">Change Status</label>

                <select
                  id="details-status"
                  value={record.status || "Pending"}
                  disabled={
                    updatingStatus ===
                    `${record.record_type}-${record.id}`
                  }
                  onChange={(e) =>
                    handleStatusChange(record, e.target.value)
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">📋</div>
                <div>
                  <h3>
                    {isHire
                      ? "Hire Requirement"
                      : "Deliver Proposal"}
                  </h3>
                  <p>Information entered in the form</p>
                </div>
              </div>

              <div className="detail-grid">
                <DetailField label="Country" value={record.country} />

                {isHire && (
                  <DetailField
                    label="Currency"
                    value={record.currency}
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

                <DetailField label="Category" value={record.category} />

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

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">📝</div>
                <div>
                  <h3>
                    {isHire
                      ? "Requirement Details"
                      : "Delivery Details"}
                  </h3>
                  <p>Details entered in the submission form</p>
                </div>
              </div>

              <div className="long-detail">
                <span>
                  {isHire
                    ? "What Do You Need?"
                    : "What Can Your Team Provide?"}
                </span>
                <p>{formatValue(record.description)}</p>
              </div>

              <div className="long-detail">
                <span>
                  {isHire
                    ? "Requirement Scope"
                    : "Delivery Scope"}
                </span>
                <p>{formatValue(record.scope)}</p>
              </div>

              <div className="long-detail">
                <span>
                  {isHire
                    ? "Tasks / Deliverables"
                    : "Deliverables / Task Breakdown"}
                </span>
                <p>{formatValue(record.deliverables)}</p>
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">💰</div>
                <div>
                  <h3>Cost & Processing</h3>
                  <p>Cost and processing information</p>
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
                  value={record.standard_timeline}
                />

                <DetailField
                  label={
                    isHire
                      ? "Urgent / Optimal Timeline"
                      : "Urgent / Priority Timeline"
                  }
                  value={record.urgent_timeline}
                />
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">🧰</div>
                <div>
                  <h3>Resources & Tools</h3>
                  <p>Resource information from the form</p>
                </div>
              </div>

              <div className="detail-grid">
                {isHire ? (
                  <>
                    <DetailField
                      label="Required Human Resources"
                      value={record.human_resources}
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
                      value={record.physical_resources}
                      full
                    />
                    <DetailField
                      label="Additional Resources Required"
                      value={record.additional_resources}
                      full
                    />
                  </>
                ) : (
                  <>
                    <DetailField
                      label="Available Resources"
                      value={record.available_resources}
                      full
                    />
                    <DetailField
                      label="Required Resources"
                      value={record.required_resources}
                      full
                    />
                    <DetailField
                      label="Available Tools & Software"
                      value={record.tools}
                      full
                    />
                    <DetailField
                      label="Physical Resources / Equipment"
                      value={record.physical_resources}
                      full
                    />
                    <DetailField
                      label="Additional Resources"
                      value={record.additional_resources}
                      full
                    />
                  </>
                )}
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">📍</div>
                <div>
                  <h3>Location & Address</h3>
                  <p>Location information from the form</p>
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
                      value={record.full_location}
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
                      value={record.full_location}
                      full
                    />
                  </>
                )}
              </div>
            </section>

            {!isHire && teamMembers.length > 0 && (
              <section className="detail-section">
                <div className="detail-section-heading">
                  <div className="section-icon">👥</div>
                  <div>
                    <h3>Team Members</h3>
                    <p>
                      Team member information entered in the Deliver form
                    </p>
                  </div>
                </div>

                <div className="team-members-list">
                  {teamMembers.map((member, index) => (
                    <TeamMemberCard
                      key={member.id || index}
                      member={member}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            )}

            {!isHire && (
              <section className="detail-section">
                <div className="detail-section-heading">
                  <div className="section-icon">🔗</div>
                  <div>
                    <h3>Portfolio & Proof</h3>
                    <p>
                      Proof and portfolio information from the Deliver form
                    </p>
                  </div>
                </div>

                <div className="detail-grid">
                  <DetailField
                    label="Portfolio / Website / Demo Link"
                    value={record.portfolio}
                    full
                  />
                  <DetailField
                    label="Social Media Link"
                    value={record.social_media_link}
                    full
                  />
                </div>
              </section>
            )}

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">💬</div>
                <div>
                  <h3>Notification & Communication</h3>
                  <p>
                    Communication preferences entered in the form
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                <DetailField
                  label="Notification / Update Period"
                  value={record.notification_period}
                />

                {!isHire && (
                  <DetailField
                    label="Additional Notification Details"
                    value={record.notification_details}
                    full
                  />
                )}

                <DetailField
                  label="Preferred Communication Method"
                  value={record.communication_method}
                />

                {!isHire && (
                  <DetailField
                    label="Communication Details"
                    value={record.communication_details}
                    full
                  />
                )}
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-section-heading">
                <div className="section-icon">📁</div>
                <div>
                  <h3>
                    {isHire
                      ? "Uploaded Requirement Files"
                      : "Delivery Supporting Documents"}
                  </h3>
                  <p>Uploaded files from the form</p>
                </div>
              </div>

              {files.length > 0 ? (
                <div className="admin-files-list">
                  {files.map((file, index) => (
                    <FileCard
                      key={file.id || index}
                      file={file}
                      recordType={record.record_type}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-files-message">
                  No files uploaded.
                </div>
              )}
            </section>

            <div className="details-footer-actions">
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRecord(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecords = () => (
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
            Review records and manage approval/status workflow. User
            edit/delete changes are reflected automatically.
          </p>
        </div>

        <div className="records-toolbar-actions">
          <select
            className="records-status-filter"
            value={statusFilter}
            onChange={(event) =>
              handleStatusFilterChange(event.target.value)
            }
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="export-button"
            onClick={() => handleExport(recordType)}
          >
            <span>⇩</span>
            Export Excel
          </button>
        </div>
      </div>

      <div className="bulk-status-toolbar">
        <div className="bulk-status-summary">
          <strong>{selectedKeys.length}</strong> selected
          <span>
            Use bulk actions only when you intentionally want to change
            multiple statuses.
          </span>
        </div>

        <div className="bulk-status-actions">
          <button
            type="button"
            className="bulk-secondary-button"
            onClick={selectPendingOnPage}
            disabled={bulkUpdating || !records.length}
          >
            Select Pending on Page
          </button>

          <select
            value={bulkStatus}
            onChange={(event) => setBulkStatus(event.target.value)}
            disabled={bulkUpdating}
          >
            {STATUS_OPTIONS.filter(
              (status) => status !== "Pending"
            ).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="bulk-primary-button"
            onClick={handleBulkSelectedStatus}
            disabled={bulkUpdating || !selectedKeys.length}
          >
            {bulkUpdating ? "Updating..." : "Apply to Selected"}
          </button>

          <button
            type="button"
            className="bulk-approve-button"
            onClick={handleApproveAllPending}
            disabled={bulkUpdating}
          >
            {bulkUpdating
              ? "Approving..."
              : "✓ Approve All Pending"}
          </button>
        </div>
      </div>

      <div className="record-table-card">
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner" />
            <p>Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="empty-records">
            <div className="empty-icon">📂</div>
            <h3>No records found</h3>
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
                    <th className="selection-column">
                      <input
                        type="checkbox"
                        checked={
                          records.length > 0 &&
                          records.every((item) =>
                            selectedKeys.includes(getRecordKey(item))
                          )
                        }
                        onChange={togglePageSelection}
                        aria-label="Select all records on this page"
                      />
                    </th>
                    <th>ID</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Budget / Amount</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr
                      key={`${record.record_type}-${record.id}`}
                    >
                      <td className="selection-column">
                        <input
                          type="checkbox"
                          checked={selectedKeys.includes(
                            getRecordKey(record)
                          )}
                          onChange={() =>
                            toggleRecordSelection(record)
                          }
                          aria-label={`Select ${
                            record.title || "record"
                          }`}
                        />
                      </td>

                      <td>
                        <span className="record-id">
                          #{record.id}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`record-type ${
                            record.record_type === "hire"
                              ? "type-hire"
                              : "type-deliver"
                          }`}
                        >
                          {record.record_type === "hire"
                            ? "Hire"
                            : "Deliver"}
                        </span>
                      </td>

                      <td>
                        <div className="user-table-cell">
                          <div className="small-avatar">
                            {(
                              record.user_name || "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <strong>
                              {formatValue(record.user_name)}
                            </strong>
                            <span>
                              {formatValue(record.user_email)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="title-cell">
                          {formatValue(record.title)}
                        </div>
                      </td>

                      <td>{formatValue(record.category)}</td>

                      <td>
                        {formatValue(
                          record.budget ||
                            record.cost ||
                            record.amount
                        )}
                      </td>

                      <td>
                        {formatValue(
                          record.location || record.city
                        )}
                      </td>

                      <td>
                        <span className="date-cell">
                          {formatDate(record.created_at)}
                        </span>
                      </td>

                      <td>
                        <select
                          className={`status-select ${getStatusClass(
                            record.status
                          )}`}
                          value={record.status || "Pending"}
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
                          {STATUS_OPTIONS.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="view-button"
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowDetails(true);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-bar">
              <div className="pagination-info">
                Showing <strong>{records.length}</strong> of{" "}
                <strong>{pagination.total_records}</strong> records
              </div>

              <div className="pagination-controls">
                <select
                  value={pagination.per_page}
                  onChange={changePageSize}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!pagination.has_previous}
                  onClick={() =>
                    changePage(currentPage - 1)
                  }
                >
                  ←
                </button>

                {paginationPages.map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      page === currentPage
                        ? "active-page"
                        : ""
                    }
                    onClick={() => changePage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={!pagination.has_next}
                  onClick={() =>
                    changePage(currentPage + 1)
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

  const renderOverview = () => (
    <div className="overview-content">
      <div className="welcome-heading">
        <div>
          <span className="eyebrow">ADMIN CONTROL CENTER</span>
          <h1>Dashboard Overview</h1>
          <p>
            Manage HireDeliver records, users, submissions and platform
            activity.
          </p>
        </div>

        <div className="overview-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => handleSectionChange("hire")}
          >
            + View Hire Records
          </button>

          <button
            type="button"
            className="primary-action"
            onClick={() => handleSectionChange("deliver")}
          >
            + View Deliver Records
          </button>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card total-card">
          <div className="stat-card-top">
            <span>Total Records</span>
            <div className="stat-icon">◈</div>
          </div>
          <strong>{summary.total_records || 0}</strong>
          <small>All submissions</small>
        </div>

        <div className="admin-stat-card hire-card">
          <div className="stat-card-top">
            <span>Hire Records</span>
            <div className="stat-icon">H</div>
          </div>
          <strong>{summary.total_hires || 0}</strong>
          <small>Client requirements</small>
        </div>

        <div className="admin-stat-card deliver-card">
          <div className="stat-card-top">
            <span>Deliver Records</span>
            <div className="stat-icon">D</div>
          </div>
          <strong>{summary.total_delivers || 0}</strong>
          <small>Delivery proposals</small>
        </div>

        <div className="admin-stat-card pending-card">
          <div className="stat-card-top">
            <span>Pending</span>
            <div className="stat-icon">!</div>
          </div>
          <strong>{statusSummary.Pending || 0}</strong>
          <small>Awaiting review</small>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3>Record Distribution</h3>
              <p>Hire vs Deliver</p>
            </div>
          </div>

          <div className="chart-container">
            {summary.total_records > 0 ? (
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                      />
                    ))}
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
              <span style={{ background: COLORS[0] }} />
              Hire
              <strong>{summary.total_hires}</strong>
            </div>
            <div>
              <span style={{ background: COLORS[1] }} />
              Deliver
              <strong>{summary.total_delivers}</strong>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3>Status Overview</h3>
              <p>Current record statuses</p>
            </div>
          </div>

          <div className="chart-container">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={pieData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    radius={[7, 7, 0, 0]}
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

      <div className="status-overview-grid">
        {STATUS_OPTIONS.map((status) => (
          <div
            key={status}
            className="mini-status-card"
          >
            <span className={getStatusClass(status)}>
              {status}
            </span>
            <strong>{statusSummary[status] || 0}</strong>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="section-top">
          <div>
            <h2>Recent Records</h2>
            <p>Latest submissions in the platform</p>
          </div>

          <button
            type="button"
            className="text-action"
            onClick={() => handleSectionChange("hire")}
          >
            View records →
          </button>
        </div>

        <div className="recent-records-grid">
          {records.slice(0, 5).map((record) => (
            <div
              key={`${record.record_type}-${record.id}`}
              className="recent-record-card"
            >
              <div className="recent-record-top">
                <span
                  className={`record-type ${
                    record.record_type === "hire"
                      ? "type-hire"
                      : "type-deliver"
                  }`}
                >
                  {record.record_type === "hire"
                    ? "Hire"
                    : "Deliver"}
                </span>

                <span className={getStatusClass(record.status)}>
                  {record.status || "Pending"}
                </span>
              </div>

              <h3>{formatValue(record.title)}</h3>
              <p>{formatValue(record.user_name)}</p>

              <button
                type="button"
                onClick={() => {
                  setSelectedRecord(record);
                  setShowDetails(true);
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

  const renderBulkStatusSection = () => (
    <div className="bulk-status-page">
      <div className="section-page-heading">
        <span className="eyebrow">APPROVAL CONTROL CENTER</span>
        <h1>Bulk Status Management</h1>
        <p>
          Approve all currently Pending Hire or Deliver records in one
          action, or select specific records and apply another status.
          Records that are already Approved, In Progress, Completed, or
          Rejected are not touched by the bulk approval action.
        </p>
      </div>

      <div className="bulk-control-grid">
        <div className="bulk-control-card">
          <span className="bulk-card-eyebrow">CURRENT SCOPE</span>
          <strong>
            {recordType === "hire"
              ? "Hire Records"
              : recordType === "deliver"
              ? "Deliver Records"
              : "All Hire + Deliver Records"}
          </strong>
          <small>
            Search and status filters from the Records screen are
            respected when loading the list.
          </small>

          <button
            type="button"
            className="bulk-primary-button wide"
            onClick={handleApproveAllPending}
            disabled={bulkUpdating}
          >
            {bulkUpdating
              ? "Processing Pending Records..."
              : "✓ Approve All Pending"}
          </button>
        </div>

        <div className="bulk-control-card">
          <span className="bulk-card-eyebrow">
            EXCEL STATUS WORKFLOW
          </span>
          <strong>Export → Edit Status → Import</strong>
          <small>
            Export Hire or Deliver records, change only the Status
            column, save the workbook, then import it below. The
            backend validates Record ID / Record Key before updating.
          </small>

          <div className="bulk-excel-actions">
            <button
              type="button"
              className="bulk-secondary-button"
              onClick={() =>
                handleExport(
                  recordType === "all" ? "hire" : recordType
                )
              }
            >
              ⇩ Export{" "}
              {recordType === "deliver" ? "Deliver" : "Hire"}
            </button>

            <button
              type="button"
              className="bulk-secondary-button"
              onClick={() => handleSectionChange("export")}
            >
              Open Export Center
            </button>
          </div>
        </div>
      </div>

      <div className="status-import-card">
        <div>
          <span className="bulk-card-eyebrow">
            STATUS IMPORT
          </span>
          <h2>Import Updated Status Excel</h2>
          <p>
            Only status changes are applied. Record identity must come
            from the exported Record ID / Record Key; titles are never
            used as the identity key.
          </p>
        </div>

        <label className="status-import-picker">
          <span>
            {statusImportFile
              ? statusImportFile.name
              : "Choose updated .xlsx / .xlsm / .csv file"}
          </span>
          <input
            type="file"
            accept=".xlsx,.xlsm,.csv"
            onChange={handleStatusImportFileChange}
          />
        </label>

        <div className="status-import-actions">
          <button
            type="button"
            className="bulk-secondary-button"
            onClick={() => {
              setStatusImportFile(null);
              setStatusImportResult(null);
            }}
            disabled={!statusImportFile || statusImporting}
          >
            Clear
          </button>

          <button
            type="button"
            className="bulk-primary-button"
            onClick={handleStatusImport}
            disabled={!statusImportFile || statusImporting}
          >
            {statusImporting
              ? "Importing Statuses..."
              : "Import Status Changes"}
          </button>
        </div>

        {statusImportResult && (
          <div className="status-import-result">
            {statusImportResult.message ||
              "Status import completed successfully."}
          </div>
        )}
      </div>
    </div>
  );

  const renderUsersSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">👥</div>
      <h1>Users Management</h1>
      <p>
        User management section is reserved for complete user
        administration.
      </p>

      <div className="coming-card">
        <strong>Admin User Management</strong>
        <span>
          View users, account status, roles and activity from one place.
        </span>
      </div>
    </div>
  );

  const renderDatabaseSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">🗄️</div>
      <h1>Database</h1>
      <p>
        Database management and schema reference area.
      </p>

      <div className="coming-card">
        <strong>Database Administration</strong>
        <span>
          Structured database information and relational data overview.
        </span>
      </div>
    </div>
  );

  const renderFilesSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">📁</div>
      <h1>Files</h1>
      <p>
        Files are securely accessible from their associated Hire or
        Deliver record.
      </p>

      <div className="coming-card">
        <strong>Secure File Access</strong>
        <span>
          Open uploaded PDF and document files directly from record
          details.
        </span>
      </div>
    </div>
  );

  const renderImportSection = () => (
    <div className="import-page">
      <div className="section-page-heading">
        <div>
          <span className="eyebrow">BULK DATA MANAGEMENT</span>
          <h1>Import Records</h1>
          <p>
            Import Hire or Deliver records from Excel or CSV. Ownership
            is matched using the registered user's email.
          </p>
        </div>
      </div>

      <div className="import-layout">
        <div className="import-main-card">
          <div className="import-card-heading">
            <div className="import-heading-icon">⇧</div>
            <div>
              <h2>Upload Record Data</h2>
              <p>
                Imported records are created as Pending and follow the
                same Admin Approval workflow as normal submissions.
              </p>
            </div>
          </div>

          <div className="import-type-row">
            <div className="import-type-option">
              <label htmlFor="import-record-type">
                Record Type
              </label>

              <select
                id="import-record-type"
                value={importType}
                onChange={(e) => {
                  setImportType(e.target.value);
                  setImportFile(null);
                  setImportResult(null);
                  setError("");
                }}
              >
                <option value="hire">Hire Records</option>
                <option value="deliver">Deliver Records</option>
              </select>
            </div>

            <button
              type="button"
              className="template-button"
              onClick={downloadImportTemplate}
              disabled={templateLoading}
            >
              {templateLoading
                ? "Preparing..."
                : "⇩ Download Template"}
            </button>
          </div>

          <label className="modern-import-upload">
            <input
              type="file"
              accept=".xlsx,.xlsm,.csv"
              onChange={handleImportFileChange}
            />

            <span className="modern-upload-icon">⇧</span>

            <strong>
              {importFile
                ? "Choose a different file"
                : "Choose Excel or CSV file"}
            </strong>

            <small>Supported: .xlsx, .xlsm, .csv</small>
          </label>

          {importFile && (
            <div className="import-selected-file">
              <div className="selected-file-icon">📄</div>

              <div className="selected-file-info">
                <strong>{importFile.name}</strong>
                <span>
                  {(importFile.size / 1024).toFixed(1)} KB
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setImportFile(null);
                  setImportResult(null);
                }}
                aria-label="Remove selected file"
              >
                ×
              </button>
            </div>
          )}

          <button
            type="button"
            className="import-submit-button"
            onClick={handleImportRecords}
            disabled={!importFile || importing}
          >
            {importing
              ? "Importing Records..."
              : `⇧ Import ${
                  importType === "hire" ? "Hire" : "Deliver"
                } Records`}
          </button>
        </div>

        <div className="import-side-card">
          <div className="import-side-icon">✓</div>
          <h3>How User Assignment Works</h3>
          <p>
            Every imported record must contain the email address of an
            existing registered user.
          </p>

          <div className="import-rule">
            <span>1</span>
            <div>
              <strong>User Email</strong>
              <small>
                This is the authoritative ownership key.
              </small>
            </div>
          </div>

          <div className="import-rule">
            <span>2</span>
            <div>
              <strong>User Name</strong>
              <small>
                Informational only. It does not assign ownership.
              </small>
            </div>
          </div>

          <div className="import-rule">
            <span>3</span>
            <div>
              <strong>Approval</strong>
              <small>
                Imported records start as Pending and become visible as
                full records after Admin approval.
              </small>
            </div>
          </div>

          {importType === "deliver" && (
            <div className="import-deliver-note">
              <strong>Deliver Team Members</strong>
              <span>
                For Excel imports, use the separate “Deliver Team
                Members” sheet from the template and keep the same
                Import Key.
              </span>
            </div>
          )}

          <div className="import-format-note">
            <strong>Important</strong>
            <span>
              Use the provided template so column names match the
              backend import structure correctly.
            </span>
          </div>
        </div>
      </div>

      {importResult && (
        <div className="import-result-card">
          <div className="import-result-top">
            <div>
              <span className="import-result-badge">
                IMPORT COMPLETED
              </span>
              <h3>
                {importResult.message ||
                  "Import completed successfully."}
              </h3>
            </div>
            <div className="import-result-check">✓</div>
          </div>

          <div className="import-result-stats">
            <div>
              <span>Records Imported</span>
              <strong>
                {importResult.imported_records || 0}
              </strong>
            </div>

            {importType === "deliver" && (
              <div>
                <span>Team Members Imported</span>
                <strong>
                  {importResult.imported_team_members || 0}
                </strong>
              </div>
            )}

            <div>
              <span>Skipped Rows</span>
              <strong>
                {importResult.skipped_records || 0}
              </strong>
            </div>
          </div>

          {Array.isArray(importResult.errors) &&
            importResult.errors.length > 0 && (
              <div className="import-errors">
                <strong>Rows requiring attention</strong>
                <ul>
                  {importResult.errors.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  );

  const renderExportSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">⇩</div>
      <h1>Export Data</h1>
      <p>
        Export Hire and Deliver records separately using only their
        respective form fields.
      </p>

      <div className="export-panel">
        <div>
          <strong>Hire Records Export</strong>
          <span>
            Download only Hire form records and Hire form fields.
          </span>
        </div>

        <button
          type="button"
          className="export-button large-export"
          onClick={() => handleExport("hire")}
        >
          ⇩ Export Hire
        </button>
      </div>

      <div className="export-panel">
        <div>
          <strong>Deliver Records Export</strong>
          <span>
            Download only Deliver form records and Deliver form fields.
          </span>
        </div>

        <button
          type="button"
          className="export-button large-export"
          onClick={() => handleExport("deliver")}
        >
          ⇩ Export Deliver
        </button>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="placeholder-section">
      <div className="placeholder-icon">⚙</div>
      <h1>Settings</h1>
      <p>Admin platform settings.</p>

      <div className="settings-card">
        <div>
          <span>Account</span>
          <strong>
            {user?.fullName || "Administrator"}
          </strong>
        </div>

        <div>
          <span>Email</span>
          <strong>{user?.email || "N/A"}</strong>
        </div>

        <div>
          <span>Role</span>
          <strong>Administrator</strong>
        </div>

        <button
          type="button"
          className="danger-action"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );

  const sectionTitles = {
    overview: "Dashboard Overview",
    hire: "Hire Records",
    deliver: "Deliver Records",
    users: "Users Management",
    database: "Database",
    files: "Files",
    bulkStatus: "Approval Center",
    import: "Import Records",
    "import-hire": "Import Hire",
    "import-deliver": "Import Deliver",
    export: "Export Data",
    settings: "Settings",
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "hire":
        return renderRecords();
      case "deliver":
        return renderRecords();
      case "users":
        return renderUsersSection();
      case "database":
        return renderDatabaseSection();
      case "files":
        return renderFilesSection();
      case "bulkStatus":
        return renderBulkStatusSection();
      case "import":
        return renderImportSection();
      case "import-hire":
        if (importType !== "hire") {
          setImportType("hire");
        }
        return renderImportSection();
      case "import-deliver":
        if (importType !== "deliver") {
          setImportType("deliver");
        }
        return renderImportSection();
      case "export":
        return renderExportSection();
      case "settings":
        return renderSettingsSection();
      case "overview":
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-dashboard">
      <aside
        className={`admin-sidebar ${
          mobileSidebar ? "sidebar-open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="brand-mark">HD</div>
          <div>
            <strong>HireDeliver</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("overview")}
          >
            <span>⌂</span>
            Overview
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "hire" ? "active" : ""
            }`}
            onClick={() => handleTypeChange("hire")}
          >
            <span>H</span>
            Hire Records
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "deliver" ? "active" : ""
            }`}
            onClick={() => handleTypeChange("deliver")}
          >
            <span>D</span>
            Deliver Records
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "users" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("users")}
          >
            <span>♙</span>
            Users
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "database" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("database")}
          >
            <span>▣</span>
            Database
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "files" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("files")}
          >
            <span>□</span>
            Files
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "bulkStatus" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("bulkStatus")}
          >
            <span>✓</span>
            Approval Center
          </button>

          <div className="sidebar-divider" />

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "import-hire" ? "active" : ""
            }`}
            onClick={() => {
              setImportType("hire");
              handleSectionChange("import-hire");
            }}
          >
            <span>⇧</span>
            Import Hire
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "import-deliver" ? "active" : ""
            }`}
            onClick={() => {
              setImportType("deliver");
              handleSectionChange("import-deliver");
            }}
          >
            <span>⇧</span>
            Import Deliver
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "export" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("export")}
          >
            <span>⇩</span>
            Export Data
          </button>

          <button
            type="button"
            className={`sidebar-button ${
              activeSection === "settings" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("settings")}
          >
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="admin-profile">
          <div className="profile-avatar">
            {(user?.fullName || "A")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-info">
            <strong>
              {user?.fullName || "Administrator"}
            </strong>
            <span>{user?.email || "Admin account"}</span>
          </div>

          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            ↪
          </button>
        </div>
      </aside>

      {mobileSidebar && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setMobileSidebar((current) => !current)
              }
              aria-label="Toggle menu"
            >
              ☰
            </button>

            <div>
              <span className="topbar-eyebrow">
                ADMINISTRATION
              </span>
              <h2>
                {sectionTitles[activeSection] ||
                  "Admin Dashboard"}
              </h2>
            </div>
          </div>

          <form
            className="global-search"
            onSubmit={handleSearch}
          >
            <span>⌕</span>
            <input
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              placeholder="Search records..."
              aria-label="Search records"
            />

            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </form>

          <div className="topbar-profile">
            <div className="topbar-avatar">
              {(user?.fullName || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <strong>
                {user?.fullName || "Administrator"}
              </strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="admin-content">
          {error && (
            <div className="admin-error-toast" role="alert">
              <span>!</span>
              <div>{error}</div>
            </div>
          )}

          {renderActiveSection()}
        </section>
      </main>

      {showDetails &&
        selectedRecord &&
        renderRecordDetails(selectedRecord)}
    </div>
  );
}

export default AdminDashboard;
