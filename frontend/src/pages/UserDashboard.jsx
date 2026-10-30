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

const API_URL = "http://127.0.0.1:5000";

const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    className: "status-pending",
    description: "Your submission is waiting for review.",
    icon: "◷",
  },
  Approved: {
    label: "Approved",
    className: "status-approved",
    description: "Your submission has been approved.",
    icon: "✓",
  },
  "In Progress": {
    label: "In Progress",
    className: "status-progress",
    description: "Your submission is currently in progress.",
    icon: "↗",
  },
  Completed: {
    label: "Completed",
    className: "status-completed",
    description: "Your submission has been completed.",
    icon: "✓",
  },
  Rejected: {
    label: "Rejected",
    className: "status-rejected",
    description: "Your submission was rejected.",
    icon: "!",
  },
};

/*
=========================================================
FIELD LABELS
=========================================================
*/

const FIELD_LABELS = {
  country: "Country",

  title: "Requirement / Delivery Title",
  type: "Requirement / Delivery Type",
  category: "Category",

  description: "Description / What Do You Need?",
  scope: "Requirement / Delivery Scope",
  deliverables: "Tasks / Deliverables",

  budget: "Total Budget",

  currency: "Currency",
  amount: "Amount / Delivery Cost",
  includedCost: "Included Cost",
  included_cost: "Included Cost",
  excludedCost: "Excluded Cost",
  excluded_cost: "Excluded Cost",

  processing: "Processing Type",

  standardTimeline: "Standard / Required Timeline",
  standard_timeline: "Standard / Required Timeline",

  urgentTimeline: "Urgent / Priority Timeline",
  urgent_timeline: "Urgent / Priority Timeline",

  humanResources: "Required Human Resources",
  human_resources: "Required Human Resources",

  roles: "Required Roles",

  skills: "Required Skills & Expertise",

  tools: "Required / Available Tools & Software",

  physicalResources: "Physical Resources / Equipment",
  physical_resources: "Physical Resources / Equipment",

  additionalResources: "Additional Resources",
  additional_resources: "Additional Resources",

  availableResources: "Available Resources",
  available_resources: "Available Resources",

  requiredResources: "Required Resources",
  required_resources: "Required Resources",

  location: "Required City",
  city: "Delivery City",

  fullLocation: "Full Location / Address",
  full_location: "Full Location / Address",

  communicationMethod: "Preferred Communication Method",
  communication_method: "Preferred Communication Method",

  communicationDetails: "Communication Details",
  communication_details: "Communication Details",

  notificationPeriod: "Notification / Update Period",
  notification_period: "Notification / Update Period",

  notificationDetails: "Additional Notification Details",
  notification_details: "Additional Notification Details",

  portfolio: "Portfolio / Website / Demo Link",

  similarExperience: "Similar Experience",
  similar_experience: "Similar Experience",

  experience: "Years of Experience",

  profile: "Profile / CV",
  profile_file: "Profile / CV",

  profileFiles: "CV / Profile Documents",
  profile_files: "CV / Profile Documents",
};

/*
=========================================================
EXACT FORM SECTIONS
=========================================================
*/

const SECTION_FIELDS = {
  hire: {
    "Basic Information": [
      "title",
      "type",
      "category",
    ],

    "Requirement Details": [
      "description",
      "scope",
      "deliverables",
    ],

    "Budget & Processing": [
      "budget",
      "processing",
      "standardTimeline",
      "standard_timeline",
      "urgentTimeline",
      "urgent_timeline",
    ],

    "Human Resources": [
      "humanResources",
      "human_resources",
      "roles",
      "skills",
    ],

    "Resources & Tools": [
      "tools",
      "physicalResources",
      "physical_resources",
      "additionalResources",
      "additional_resources",
    ],

    "Location": [
      "location",
      "fullLocation",
      "full_location",
    ],

    "Communication & Notifications": [
      "communicationMethod",
      "communication_method",
      "notificationPeriod",
      "notification_period",
    ],
  },

  deliver: {
    "Basic Information": [
      "country",
      "title",
      "type",
      "category",
    ],

    "Delivery Details": [
      "description",
      "scope",
      "deliverables",
    ],

    "Cost & Processing": [
      "currency",
      "amount",
      "includedCost",
      "included_cost",
      "excludedCost",
      "excluded_cost",
      "processing",
      "standardTimeline",
      "standard_timeline",
      "urgentTimeline",
      "urgent_timeline",
    ],

    "Resources & Tools": [
      "availableResources",
      "available_resources",
      "requiredResources",
      "required_resources",
      "tools",
      "physicalResources",
      "physical_resources",
      "additionalResources",
      "additional_resources",
    ],

    "Location & Proof": [
      "city",
      "fullLocation",
      "full_location",
      "portfolio",
    ],

    "Notification & Communication": [
      "notificationPeriod",
      "notification_period",
      "notificationDetails",
      "notification_details",
      "communicationMethod",
      "communication_method",
      "communicationDetails",
      "communication_details",
    ],
  },
};

/*
=========================================================
MAIN DASHBOARD
=========================================================
*/

function UserDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("overview");

  const [hires, setHires] = useState([]);
  const [delivers, setDelivers] = useState([]);

  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
  ========================================================
  LOAD DASHBOARD
  ========================================================
  */

  const loadDashboard = async (silent = false) => {
    const token = localStorage.getItem(
      "hireDeliverAccessToken"
    );

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/api/dashboard/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

        navigate("/login", {
          replace: true,
        });

        return;
      }

      const data =
        await response.json();

      if (
        !response.ok ||
        data.status === "error"
      ) {
        throw new Error(
          data.message ||
            "Unable to load dashboard data."
        );
      }

      setUser(data.user || null);

      /*
      IMPORTANT:
      Only real backend records are used.
      No demo/fake records are created.
      */

      setHires(
        Array.isArray(data.hires)
          ? data.hires
          : []
      );

      setDelivers(
        Array.isArray(
          data.delivers
        )
          ? data.delivers
          : []
      );

      if (data.user) {
        localStorage.setItem(
          "hireDeliverUser",
          JSON.stringify({
            id: data.user.id,
            fullName:
              data.user.name ||
              data.user.fullName ||
              "",
            email:
              data.user.email || "",
            phone:
              data.user.phone || "",
            role:
              data.user.role ||
              "user",
            accountType:
              data.user.account_type ||
              "user",
          })
        );
      }
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while loading your dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  ========================================================
  LOGOUT
  ========================================================
  */

  const handleLogout = () => {
    localStorage.removeItem(
      "hireDeliverAccessToken"
    );

    localStorage.removeItem(
      "hireDeliverLoggedIn"
    );

    localStorage.removeItem(
      "hireDeliverUser"
    );

    navigate("/login", {
      replace: true,
    });
  };

  /*
  ========================================================
  STATUS
  ========================================================
  */

  const getRecordStatus = (
    record
  ) => {
    const status =
      record?.status;

    if (
      status &&
      STATUS_CONFIG[status]
    ) {
      return status;
    }

    return "Pending";
  };

  const getStatusConfig = (
    record
  ) => {
    const status =
      getRecordStatus(record);

    return (
      STATUS_CONFIG[status] ||
      STATUS_CONFIG.Pending
    );
  };

  /*
  ========================================================
  DATE HELPERS
  ========================================================
  */

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "Not available";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }

    return date.toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (
    value
  ) => {
    if (!value) {
      return "Not available";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }

    return date.toLocaleString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /*
  ========================================================
  LABEL HELPER
  ========================================================
  */

  const formatLabel = (
    key
  ) => {
    if (
      FIELD_LABELS[key]
    ) {
      return FIELD_LABELS[key];
    }

    return String(key)
      .replace(/_/g, " ")
      .replace(
        /([a-z])([A-Z])/g,
        "$1 $2"
      )
      .replace(
        /\s+/g,
        " "
      )
      .replace(
        /^./,
        (char) =>
          char.toUpperCase()
      );
  };

  /*
  ========================================================
  JSON HELPER
  ========================================================
  */

  const parsePossibleJSON = (
    value
  ) => {
    if (
      typeof value !==
      "string"
    ) {
      return value;
    }

    const trimmed =
      value.trim();

    if (!trimmed) {
      return value;
    }

    if (
      !trimmed.startsWith(
        "{"
      ) &&
      !trimmed.startsWith(
        "["
      )
    ) {
      return value;
    }

    try {
      return JSON.parse(
        trimmed
      );
    } catch {
      return value;
    }
  };

  /*
  ========================================================
  EMPTY VALUE
  ========================================================
  */

  const isEmptyValue = (
    value
  ) => {
    if (
      value === null ||
      value === undefined
    ) {
      return true;
    }

    if (
      typeof value ===
        "string" &&
      !value.trim()
    ) {
      return true;
    }

    if (
      Array.isArray(value) &&
      value.length === 0
    ) {
      return true;
    }

    if (
      typeof value ===
        "object" &&
      !Array.isArray(value) &&
      Object.keys(value)
        .length === 0
    ) {
      return true;
    }

    return false;
  };

  /*
  ========================================================
  RENDER VALUES
  ========================================================
  */

  const renderSimpleValue = (
    value,
    nested = false
  ) => {
    const parsed =
      parsePossibleJSON(value);

    if (
      isEmptyValue(parsed)
    ) {
      return (
        <span className="empty-value">
          Not provided
        </span>
      );
    }

    if (
      typeof parsed ===
      "boolean"
    ) {
      return parsed
        ? "Yes"
        : "No";
    }

    if (
      typeof parsed ===
      "number"
    ) {
      return String(parsed);
    }

    if (
      Array.isArray(parsed)
    ) {
      return (
        <div className="nested-value-list">
          {parsed.map(
            (
              item,
              index
            ) => (
              <div
                className="nested-value-item"
                key={index}
              >
                {renderSimpleValue(
                  item,
                  true
                )}
              </div>
            )
          )}
        </div>
      );
    }

    if (
      typeof parsed ===
      "object"
    ) {
      return (
        <div className="nested-object-card">
          {Object.entries(
            parsed
          ).map(
            ([
              key,
              item,
            ]) => (
              <div
                className="nested-object-row"
                key={key}
              >
                <span>
                  {formatLabel(
                    key
                  )}
                </span>

                <span>
                  {renderSimpleValue(
                    item,
                    true
                  )}
                </span>
              </div>
            )
          )}
        </div>
      );
    }

    return (
      <span
        className={
          nested
            ? "nested-text-value"
            : ""
        }
      >
        {String(parsed)}
      </span>
    );
  };

  /*
  ========================================================
  FILES
  ========================================================
  */

  const getFiles = (
    record
  ) => {
    const possibleKeys = [
      "uploadedFiles",
      "uploaded_files",
      "files",
      "hire_files",
      "deliver_files",
    ];

    for (
      const key of possibleKeys
    ) {
      if (
        Array.isArray(
          record?.[key]
        )
      ) {
        return record[key];
      }
    }

    return [];
  };

  /*
  ========================================================
  TEAM MEMBERS
  ========================================================
  */

  const getTeamMembers = (
    record
  ) => {
    const possibleKeys = [
      "team_members",
      "teamMembers",
      "members",
    ];

    for (
      const key of possibleKeys
    ) {
      if (
        Array.isArray(
          record?.[key]
        )
      ) {
        return record[key];
      }
    }

    return [];
  };

  /*
  ========================================================
  RECORD HELPERS
  ========================================================
  */

  const getRecordTitle = (
    record
  ) => {
    return (
      record?.title ||
      record?.name ||
      "Untitled Submission"
    );
  };

  const getRecordDescription = (
    record
  ) => {
    return (
      record?.description ||
      record?.scope ||
      "No description provided."
    );
  };

  const getRecordType = (
    record,
    kind
  ) => {
    return (
      record?.type ||
      (kind === "hire"
        ? "Hire Requirement"
        : "Deliver Proposal")
    );
  };

  const getRecordCategory = (
    record
  ) => {
    return (
      record?.category ||
      "Not specified"
    );
  };

  const getRecordLocation = (
    record
  ) => {
    return (
      record?.fullLocation ||
      record?.full_location ||
      record?.location ||
      record?.city ||
      "Not specified"
    );
  };

  const getRecordTimeline = (
    record
  ) => {
    return (
      record?.standardTimeline ||
      record?.standard_timeline ||
      record?.urgentTimeline ||
      record?.urgent_timeline ||
      "Not specified"
    );
  };

  const getRecordValue = (
    record,
    kind
  ) => {
    if (
      kind === "hire"
    ) {
      if (
        record?.budget !==
          undefined &&
        record?.budget !==
          null &&
        record?.budget !==
          ""
      ) {
        return `PKR ${record.budget}`;
      }

      return "Budget not specified";
    }

    const currency =
      record?.currency ||
      "PKR";

    if (
      record?.amount !==
        undefined &&
      record?.amount !==
        null &&
      record?.amount !==
        ""
    ) {
      return `${currency} ${record.amount}`;
    }

    return "Cost not specified";
  };

  /*
  ========================================================
  SEARCH
  ========================================================
  */

  const matchesSearch = (
    record
  ) => {
    if (
      !searchTerm.trim()
    ) {
      return true;
    }

    const search =
      searchTerm
        .toLowerCase()
        .trim();

    const values = [
      record?.title,
      record?.type,
      record?.category,
      record?.description,
      record?.scope,
      record?.deliverables,

      record?.budget,

      record?.currency,
      record?.amount,
      record?.includedCost,
      record?.included_cost,
      record?.excludedCost,
      record?.excluded_cost,

      record?.humanResources,
      record?.human_resources,
      record?.roles,
      record?.skills,

      record?.tools,
      record?.physicalResources,
      record?.physical_resources,
      record?.additionalResources,
      record?.additional_resources,

      record?.availableResources,
      record?.available_resources,
      record?.requiredResources,
      record?.required_resources,

      record?.location,
      record?.city,
      record?.fullLocation,
      record?.full_location,

      record?.portfolio,

      record?.notificationPeriod,
      record?.notification_period,
      record?.notificationDetails,
      record?.notification_details,

      record?.communicationMethod,
      record?.communication_method,
      record?.communicationDetails,
      record?.communication_details,

      record?.status,
      record?.processing,

      record?.standardTimeline,
      record?.standard_timeline,
      record?.urgentTimeline,
      record?.urgent_timeline,
    ];

    return values.some(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value)
          .toLowerCase()
          .includes(search)
    );
  };

  const filteredHires =
    useMemo(
      () =>
        hires.filter(
          matchesSearch
        ),
      [hires, searchTerm]
    );

  const filteredDelivers =
    useMemo(
      () =>
        delivers.filter(
          matchesSearch
        ),
      [delivers, searchTerm]
    );

  const allRecords =
    useMemo(
      () => [
        ...hires.map(
          (record) => ({
            ...record,
            recordKind:
              "hire",
          })
        ),

        ...delivers.map(
          (record) => ({
            ...record,
            recordKind:
              "deliver",
          })
        ),
      ],
      [hires, delivers]
    );

  const totalRecords =
    hires.length +
    delivers.length;

  const statusCounts =
    useMemo(() => {
      const counts = {
        Pending: 0,
        Approved: 0,
        "In Progress": 0,
        Completed: 0,
        Rejected: 0,
      };

      allRecords.forEach(
        (record) => {
          const status =
            getRecordStatus(
              record
            );

          if (
            counts[status] !==
            undefined
          ) {
            counts[status] +=
              1;
          }
        }
      );

      return counts;
    }, [allRecords]);

  /*
  ========================================================
  CHART DATA
  ========================================================
  */

  const monthlyData =
    useMemo(() => {
      const months = [];

      for (
        let i = 5;
        i >= 0;
        i--
      ) {
        const date =
          new Date();

        date.setMonth(
          date.getMonth() -
            i
        );

        const key =
          `${date.getFullYear()}-${String(
            date.getMonth() +
              1
          ).padStart(
            2,
            "0"
          )}`;

        months.push({
          key,
          month:
            date.toLocaleString(
              "en-US",
              {
                month:
                  "short",
              }
            ),
          hire: 0,
          deliver: 0,
        });
      }

      allRecords.forEach(
        (record) => {
          if (
            !record?.created_at
          ) {
            return;
          }

          const date =
            new Date(
              record.created_at
            );

          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return;
          }

          const key =
            `${date.getFullYear()}-${String(
              date.getMonth() +
                1
            ).padStart(
              2,
              "0"
            )}`;

          const target =
            months.find(
              (item) =>
                item.key ===
                key
            );

          if (!target) {
            return;
          }

          if (
            record.recordKind ===
            "hire"
          ) {
            target.hire += 1;
          } else {
            target.deliver +=
              1;
          }
        }
      );

      return months;
    }, [allRecords]);

  const typeData =
    useMemo(
      () => [
        {
          name: "Hire",
          value: hires.length,
        },
        {
          name: "Deliver",
          value:
            delivers.length,
        },
      ],
      [
        hires.length,
        delivers.length,
      ]
    );

  const statusChartData =
    useMemo(
      () =>
        Object.entries(
          statusCounts
        )
          .filter(
            ([, value]) =>
              value > 0
          )
          .map(
            ([
              name,
              value,
            ]) => ({
              name,
              value,
            })
          ),
      [statusCounts]
    );

  const categoryData =
    useMemo(() => {
      const map = {};

      allRecords.forEach(
        (record) => {
          const category =
            record?.category ||
            "Other";

          map[category] =
            (map[category] ||
              0) + 1;
        }
      );

      return Object.entries(
        map
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .slice(0, 6)
        .map(
          ([
            name,
            value,
          ]) => ({
            name:
              name.length >
              18
                ? `${name.slice(
                    0,
                    18
                  )}…`
                : name,
            value,
          })
        );
    }, [allRecords]);

  const recentRecords =
    useMemo(
      () =>
        [...allRecords]
          .sort(
            (a, b) =>
              new Date(
                b.created_at ||
                  0
              ) -
              new Date(
                a.created_at ||
                  0
              )
          )
          .slice(0, 6),
      [allRecords]
    );

  /*
  ========================================================
  DETAILS
  ========================================================
  */

  const openDetails = (
    record,
    kind
  ) => {
    setSelectedRecord({
      ...record,
      recordKind: kind,
    });

    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRecord(null);
  };

  const navigateToCreate = (
    type
  ) => {
    if (
      type === "hire"
    ) {
      navigate("/hire");
      return;
    }

    navigate("/deliver");
  };

  const displayUserName =
    user?.name ||
    user?.fullName ||
    JSON.parse(
      localStorage.getItem(
        "hireDeliverUser"
      ) || "{}"
    )?.fullName ||
    "User";

  /*
  ========================================================
  LOADING
  ========================================================
  */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />

        <h3>
          Loading your dashboard
        </h3>

        <p>
          Please wait while we
          load your submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="professional-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">
            HD
          </div>

          <div>
            <strong>
              HireDeliver
            </strong>

            <span>
              User Workspace
            </span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <nav className="dashboard-navigation">

          <button
            type="button"
            className={`sidebar-link ${
              activeSection ===
              "overview"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection(
                "overview"
              )
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
            type="button"
            className={`sidebar-link ${
              activeSection ===
              "hire"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection(
                "hire"
              )
            }
          >
            <span className="sidebar-link-icon">
              H
            </span>

            <span>
              My Hire Requirements
            </span>

            <b>
              {hires.length}
            </b>
          </button>

          <button
            type="button"
            className={`sidebar-link ${
              activeSection ===
              "deliver"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection(
                "deliver"
              )
            }
          >
            <span className="sidebar-link-icon">
              D
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
            type="button"
            className="sidebar-new-btn"
            onClick={() =>
              navigateToCreate(
                "hire"
              )
            }
          >
            <span>+</span>
            New Requirement
          </button>

          <button
            type="button"
            className="sidebar-new-btn sidebar-new-btn-secondary"
            onClick={() =>
              navigateToCreate(
                "deliver"
              )
            }
          >
            <span>+</span>
            New Proposal
          </button>

          <button
            type="button"
            className="sidebar-logout"
            onClick={
              handleLogout
            }
          >
            <span>↪</span>

            <span>
              Logout
            </span>
          </button>

        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dashboard-main">

        <header className="dashboard-topbar">

          <div className="topbar-heading">

            <span className="topbar-eyebrow">
              PERSONAL WORKSPACE
            </span>

            <h1>
              {activeSection ===
              "overview"
                ? "Dashboard"
                : activeSection ===
                  "hire"
                ? "My Hire Requirements"
                : "My Deliver Proposals"}
            </h1>

          </div>

          <div className="topbar-right">

            <div className="topbar-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search your submissions..."
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target
                      .value
                  )
                }
              />

              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() =>
                    setSearchTerm(
                      ""
                    )
                  }
                >
                  ×
                </button>
              )}

            </div>

            <button
              type="button"
              className="topbar-refresh-btn"
              onClick={() =>
                loadDashboard(
                  true
                )
              }
              disabled={
                refreshing
              }
              title="Refresh dashboard"
            >
              {refreshing
                ? "..."
                : "↻"}
            </button>

            <button
              type="button"
              className="topbar-new-btn"
              onClick={() =>
                navigateToCreate(
                  activeSection ===
                    "deliver"
                    ? "deliver"
                    : "hire"
                )
              }
            >
              <span>+</span>
              New
            </button>

          </div>
        </header>

        {error && (
          <div className="dashboard-error">

            <div>
              <strong>
                Unable to load dashboard
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadDashboard()
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        {activeSection ===
          "overview" && (
          <>

            <section className="welcome-panel">

              <div className="welcome-content">

                <span className="welcome-label">
                  WELCOME BACK
                </span>

                <h2>
                  Hi, {displayUserName}
                </h2>

                <p>
                  Track your Hire
                  Requirements and
                  Deliver Proposals
                  from one place.
                </p>

                <div className="welcome-status-note">
                  <span className="status-dot" />

                  Your submission
                  statuses are
                  updated automatically
                  by the system.
                </div>

              </div>

              <div className="welcome-total">

                <span>
                  TOTAL SUBMISSIONS
                </span>

                <strong>
                  {totalRecords}
                </strong>

                <small>
                  {hires.length} Hire
                  {" · "}
                  {delivers.length} Deliver
                </small>

              </div>

            </section>

            <section className="dashboard-stat-grid">

              <div className="dashboard-stat-card stat-total">

                <div className="stat-icon">
                  ◈
                </div>

                <div>
                  <span>
                    Total Submissions
                  </span>

                  <strong>
                    {totalRecords}
                  </strong>

                  <small>
                    All your submissions
                  </small>
                </div>

              </div>

              <div className="dashboard-stat-card stat-hire">

                <div className="stat-icon">
                  H
                </div>

                <div>
                  <span>
                    Hire Requirements
                  </span>

                  <strong>
                    {hires.length}
                  </strong>

                  <small>
                    Requirements submitted
                  </small>
                </div>

              </div>

              <div className="dashboard-stat-card stat-deliver">

                <div className="stat-icon">
                  D
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

              <div className="dashboard-stat-card stat-approved">

                <div className="stat-icon">
                  ✓
                </div>

                <div>
                  <span>
                    Approved
                  </span>

                  <strong>
                    {
                      statusCounts.Approved
                    }
                  </strong>

                  <small>
                    Approved by admin
                  </small>
                </div>

              </div>

            </section>

            <section className="status-summary-card">

              <div className="status-summary-heading">

                <div>
                  <span>
                    SUBMISSION STATUS
                  </span>

                  <h3>
                    Track your progress
                  </h3>
                </div>

                <span className="status-summary-note">
                  Read-only status
                </span>

              </div>

              <div className="status-summary-grid">

                {Object.entries(
                  STATUS_CONFIG
                ).map(
                  ([
                    status,
                    config,
                  ]) => (
                    <div
                      className="status-summary-item"
                      key={status}
                    >

                      <div
                        className={`status-summary-icon ${config.className}`}
                      >
                        {
                          config.icon
                        }
                      </div>

                      <div>

                        <strong>
                          {
                            statusCounts[
                              status
                            ]
                          }
                        </strong>

                        <span>
                          {status}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

            <section className="analytics-heading">

              <div>

                <span>
                  ANALYTICS
                </span>

                <h2>
                  Submission Overview
                </h2>

              </div>

              <p>
                Your recent activity
                and current status.
              </p>

            </section>

            <section className="dashboard-charts">

              <div className="chart-card chart-wide">

                <div className="chart-card-header">

                  <div>
                    <h3>
                      Submission Activity
                    </h3>

                    <span>
                      Last 6 months
                    </span>
                  </div>

                  <div className="live-indicator">
                    <i />
                    Live
                  </div>

                </div>

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={
                        monthlyData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={
                          false
                        }
                        tick={{
                          fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{
                          stroke:
                            "#cbd5e1",
                          strokeDasharray:
                            "4 4",
                        }}
                        contentStyle={{
                          borderRadius: 10,
                          border:
                            "1px solid #e2e8f0",
                          fontSize: 11,
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="hire"
                        name="Hire"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{
                          r: 3,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="deliver"
                        name="Deliver"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={{
                          r: 3,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />

                    </LineChart>
                  </ResponsiveContainer>

                </div>

              </div>

              <div className="chart-card chart-small">

                <div className="chart-card-header">

                  <div>
                    <h3>
                      Submission Type
                    </h3>

                    <span>
                      Hire vs Deliver
                    </span>
                  </div>

                </div>

                <div className="donut-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>

                      <Pie
                        data={
                          typeData
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={78}
                        paddingAngle={4}
                      >
                        <Cell
                          fill="#6366f1"
                        />

                        <Cell
                          fill="#06b6d4"
                        />
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          borderRadius: 10,
                          border:
                            "1px solid #e2e8f0",
                          fontSize: 11,
                        }}
                      />

                    </PieChart>
                  </ResponsiveContainer>

                  <div className="donut-center">

                    <strong>
                      {totalRecords}
                    </strong>

                    <span>
                      Total
                    </span>

                  </div>

                </div>

                <div className="chart-legend">

                  <div>
                    <i className="legend-hire" />

                    <span>
                      Hire
                    </span>

                    <strong>
                      {hires.length}
                    </strong>
                  </div>

                  <div>
                    <i className="legend-deliver" />

                    <span>
                      Deliver
                    </span>

                    <strong>
                      {
                        delivers.length
                      }
                    </strong>
                  </div>

                </div>

              </div>

              <div className="chart-card chart-status">

                <div className="chart-card-header">

                  <div>
                    <h3>
                      Current Status
                    </h3>

                    <span>
                      Submission progress
                    </span>
                  </div>

                </div>

                <div className="status-chart-container">

                  {statusChartData.length >
                  0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={
                          statusChartData
                        }
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 15,
                          left: 5,
                          bottom: 5,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                        />

                        <XAxis
                          type="number"
                          allowDecimals={
                            false
                          }
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 9,
                          }}
                        />

                        <YAxis
                          dataKey="name"
                          type="category"
                          width={85}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 9,
                          }}
                        />

                        <Tooltip
                          cursor={{
                            fill: "rgba(99,102,241,0.05)",
                          }}
                          contentStyle={{
                            borderRadius: 10,
                            border:
                              "1px solid #e2e8f0",
                            fontSize: 11,
                          }}
                        />

                        <Bar
                          dataKey="value"
                          name="Submissions"
                          fill="#6366f1"
                          radius={[
                            0,
                            5,
                            5,
                            0,
                          ]}
                          barSize={18}
                        />

                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-empty">
                      No status data
                    </div>
                  )}

                </div>

              </div>

              <div className="chart-card chart-category">

                <div className="chart-card-header">

                  <div>
                    <h3>
                      Categories
                    </h3>

                    <span>
                      Most used categories
                    </span>
                  </div>

                </div>

                <div className="category-chart-container">

                  {categoryData.length >
                  0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={
                          categoryData
                        }
                        margin={{
                          top: 5,
                          right: 10,
                          left: 0,
                          bottom: 5,
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 9,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          allowDecimals={
                            false
                          }
                          tick={{
                            fontSize: 9,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          cursor={{
                            fill: "rgba(6,182,212,0.06)",
                          }}
                          contentStyle={{
                            borderRadius: 10,
                            border:
                              "1px solid #e2e8f0",
                            fontSize: 11,
                          }}
                        />

                        <Bar
                          dataKey="value"
                          name="Records"
                          fill="#06b6d4"
                          radius={[
                            5,
                            5,
                            0,
                            0,
                          ]}
                          barSize={24}
                        />

                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-empty">
                      No category data
                    </div>
                  )}

                </div>

              </div>

            </section>

            <section className="recent-heading">

              <div>

                <span>
                  RECENT SUBMISSIONS
                </span>

                <h2>
                  Latest Activity
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveSection(
                    "overview"
                  )
                }
              >
                {
                  recentRecords.length
                }{" "}
                records
              </button>

            </section>

            {recentRecords.length >
            0 ? (
              <div className="record-grid">

                {recentRecords.map(
                  (record) => (
                    <RecordCard
                      key={`${record.recordKind}-${record.id}`}
                      record={
                        record
                      }
                      kind={
                        record.recordKind
                      }
                      onView={
                        openDetails
                      }
                      getStatusConfig={
                        getStatusConfig
                      }
                      formatDate={
                        formatDate
                      }
                      getRecordTitle={
                        getRecordTitle
                      }
                      getRecordDescription={
                        getRecordDescription
                      }
                      getRecordType={
                        getRecordType
                      }
                      getRecordCategory={
                        getRecordCategory
                      }
                      getRecordLocation={
                        getRecordLocation
                      }
                      getRecordTimeline={
                        getRecordTimeline
                      }
                      getRecordValue={
                        getRecordValue
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <EmptyState
                title="No submissions yet"
                description="Create your first Hire Requirement or Deliver Proposal to get started."
                buttonText="Create Requirement"
                onClick={() =>
                  navigateToCreate(
                    "hire"
                  )
                }
              />
            )}

          </>
        )}

        {/* =====================================================
            HIRE
        ===================================================== */}

        {activeSection ===
          "hire" && (
          <RecordsPage
            title="My Hire Requirements"
            subtitle="Requirements submitted by you."
            type="hire"
            records={
              filteredHires
            }
            total={
              hires.length
            }
            searchTerm={
              searchTerm
            }
            onNew={() =>
              navigateToCreate(
                "hire"
              )
            }
            onView={
              openDetails
            }
            getStatusConfig={
              getStatusConfig
            }
            formatDate={
              formatDate
            }
            getRecordTitle={
              getRecordTitle
            }
            getRecordDescription={
              getRecordDescription
            }
            getRecordType={
              getRecordType
            }
            getRecordCategory={
              getRecordCategory
            }
            getRecordLocation={
              getRecordLocation
            }
            getRecordTimeline={
              getRecordTimeline
            }
            getRecordValue={
              getRecordValue
            }
          />
        )}

        {/* =====================================================
            DELIVER
        ===================================================== */}

        {activeSection ===
          "deliver" && (
          <RecordsPage
            title="My Deliver Proposals"
            subtitle="Delivery proposals submitted by you."
            type="deliver"
            records={
              filteredDelivers
            }
            total={
              delivers.length
            }
            searchTerm={
              searchTerm
            }
            onNew={() =>
              navigateToCreate(
                "deliver"
              )
            }
            onView={
              openDetails
            }
            getStatusConfig={
              getStatusConfig
            }
            formatDate={
              formatDate
            }
            getRecordTitle={
              getRecordTitle
            }
            getRecordDescription={
              getRecordDescription
            }
            getRecordType={
              getRecordType
            }
            getRecordCategory={
              getRecordCategory
            }
            getRecordLocation={
              getRecordLocation
            }
            getRecordTimeline={
              getRecordTimeline
            }
            getRecordValue={
              getRecordValue
            }
          />
        )}

      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {showDetails &&
        selectedRecord && (
          <DetailsModal
            record={
              selectedRecord
            }
            kind={
              selectedRecord.recordKind
            }
            onClose={
              closeDetails
            }
            getStatusConfig={
              getStatusConfig
            }
            formatDateTime={
              formatDateTime
            }
            formatLabel={
              formatLabel
            }
            renderSimpleValue={
              renderSimpleValue
            }
            getFiles={
              getFiles
            }
            getTeamMembers={
              getTeamMembers
            }
          />
        )}

    </div>
  );
}

/*
=========================================================
RECORD CARD
=========================================================
*/

function RecordCard({
  record,
  kind,
  onView,
  getStatusConfig,
  formatDate,
  getRecordTitle,
  getRecordDescription,
  getRecordType,
  getRecordCategory,
  getRecordLocation,
  getRecordTimeline,
  getRecordValue,
}) {
  const statusConfig =
    getStatusConfig(record);

  return (
    <article
      className={`record-card ${
        kind === "hire"
          ? "record-card-hire"
          : "record-card-deliver"
      }`}
    >

      <div className="record-card-top">

        <div className="record-card-type-group">

          <span
            className={`record-type ${
              kind === "hire"
                ? "record-type-hire"
                : "record-type-deliver"
            }`}
          >
            {kind === "hire"
              ? "Hire"
              : "Deliver"}
          </span>

          <span className="record-id">
            #{record?.id ?? "—"}
          </span>

        </div>

        <span className="record-card-date">
          {formatDate(
            record?.created_at
          )}
        </span>

      </div>

      <div className="record-main">

        <div className="record-content">

          <div className="record-title-row">

            <h3>
              {getRecordTitle(
                record
              )}
            </h3>

            <StatusBadge
              config={
                statusConfig
              }
              compact
            />

          </div>

          <p className="record-description">
            {getRecordDescription(
              record
            )}
          </p>

        </div>

        <div className="record-value">

          <span>
            {kind === "hire"
              ? "BUDGET"
              : "DELIVERY COST"}
          </span>

          <strong>
            {getRecordValue(
              record,
              kind
            )}
          </strong>

        </div>

      </div>

      <div className="record-mini-details">

        <div>
          <span>
            {kind === "hire"
              ? "Requirement Type"
              : "Delivery Type"}
          </span>

          <strong>
            {getRecordType(
              record,
              kind
            )}
          </strong>
        </div>

        <div>
          <span>
            Category
          </span>

          <strong>
            {getRecordCategory(
              record
            )}
          </strong>
        </div>

        <div>
          <span>
            Location
          </span>

          <strong>
            {getRecordLocation(
              record
            )}
          </strong>
        </div>

        <div>
          <span>
            Timeline
          </span>

          <strong>
            {getRecordTimeline(
              record
            )}
          </strong>
        </div>

      </div>

      <div className="record-status-strip">

        <div className="record-status-info">

          <span>
            CURRENT STATUS
          </span>

          <StatusBadge
            config={
              statusConfig
            }
          />

        </div>

        <p>
          {statusConfig.description}
        </p>

      </div>

      <div className="record-card-bottom">

        <span>
          Submitted on{" "}
          {formatDate(
            record?.created_at
          )}
        </span>

        <button
          type="button"
          className="view-record-btn"
          onClick={() =>
            onView(
              record,
              kind
            )
          }
        >
          View Complete Details
          <span>→</span>
        </button>

      </div>

    </article>
  );
}

/*
=========================================================
STATUS BADGE
=========================================================
*/

function StatusBadge({
  config,
  compact = false,
}) {
  return (
    <span
      className={`status-badge ${
        config.className
      } ${
        compact
          ? "status-badge-compact"
          : ""
      }`}
    >
      <i>
        {config.icon}
      </i>

      {config.label}
    </span>
  );
}

/*
=========================================================
RECORDS PAGE
=========================================================
*/

function RecordsPage({
  title,
  subtitle,
  type,
  records,
  total,
  searchTerm,
  onNew,
  onView,
  getStatusConfig,
  formatDate,
  getRecordTitle,
  getRecordDescription,
  getRecordType,
  getRecordCategory,
  getRecordLocation,
  getRecordTimeline,
  getRecordValue,
}) {
  return (
    <>

      <section className="records-page-header">

        <div>

          <span className="page-eyebrow">
            {type === "hire"
              ? "HIRE WORKSPACE"
              : "DELIVER WORKSPACE"}
          </span>

          <h2>
            {title}
          </h2>

          <p>
            {subtitle}
          </p>

        </div>

        <button
          type="button"
          className="page-new-btn"
          onClick={onNew}
        >
          <span>+</span>

          {type === "hire"
            ? "New Requirement"
            : "New Proposal"}
        </button>

      </section>

      <section className="records-summary-bar">

        <div>
          <span>
            TOTAL
          </span>

          <strong>
            {total}
          </strong>
        </div>

        <div>
          <span>
            SHOWING
          </span>

          <strong>
            {records.length}
          </strong>
        </div>

        <div className="summary-search-state">

          <span>
            SEARCH
          </span>

          <strong>
            {searchTerm
              ? `"${searchTerm}"`
              : "All records"}
          </strong>

        </div>

      </section>

      {records.length >
      0 ? (
        <div className="record-grid">

          {records.map(
            (record) => (
              <RecordCard
                key={`${type}-${record.id}`}
                record={record}
                kind={type}
                onView={onView}
                getStatusConfig={
                  getStatusConfig
                }
                formatDate={
                  formatDate
                }
                getRecordTitle={
                  getRecordTitle
                }
                getRecordDescription={
                  getRecordDescription
                }
                getRecordType={
                  getRecordType
                }
                getRecordCategory={
                  getRecordCategory
                }
                getRecordLocation={
                  getRecordLocation
                }
                getRecordTimeline={
                  getRecordTimeline
                }
                getRecordValue={
                  getRecordValue
                }
              />
            )
          )}

        </div>
      ) : (
        <EmptyState
          title={
            searchTerm
              ? "No matching records"
              : type === "hire"
              ? "No Hire Requirements Yet"
              : "No Deliver Proposals Yet"
          }
          description={
            searchTerm
              ? "Try another search term."
              : type === "hire"
              ? "You have not submitted any Hire Requirement yet."
              : "You have not submitted any Deliver Proposal yet."
          }
          buttonText={
            searchTerm
              ? "Clear Search"
              : type === "hire"
              ? "Create Requirement"
              : "Create Proposal"
          }
          onClick={
            searchTerm
              ? undefined
              : onNew
          }
          clearSearch={
            searchTerm
              ? () => {}
              : undefined
          }
        />
      )}

    </>
  );
}

/*
=========================================================
EMPTY STATE
=========================================================
*/

function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="dashboard-empty">

      <div className="dashboard-empty-icon">
        ◌
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      {onClick && (
        <button
          type="button"
          className="dashboard-new-btn"
          onClick={onClick}
        >
          {buttonText}
        </button>
      )}

    </div>
  );
}

/*
=========================================================
DETAILS MODAL
=========================================================
*/

function DetailsModal({
  record,
  kind,
  onClose,
  getStatusConfig,
  formatDateTime,
  formatLabel,
  renderSimpleValue,
  getFiles,
  getTeamMembers,
}) {
  const statusConfig =
    getStatusConfig(record);

  const files =
    getFiles(record);

  const teamMembers =
    getTeamMembers(record);

  const sections =
    SECTION_FIELDS[
      kind
    ] || {};

  return (
    <div
      className="details-overlay"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="details-modal">

        {/* HEADER */}

        <header className="details-modal-header">

          <div className="details-modal-title">

            <div className="modal-type-line">

              <span
                className={`record-type ${
                  kind === "hire"
                    ? "record-type-hire"
                    : "record-type-deliver"
                }`}
              >
                {kind === "hire"
                  ? "Hire Requirement"
                  : "Deliver Proposal"}
              </span>

              <span>
                #{record?.id ?? "—"}
              </span>

            </div>

            <h2>
              {record?.title ||
                "Submission Details"}
            </h2>

            <p>
              Submitted{" "}
              {formatDateTime(
                record?.created_at
              )}
            </p>

          </div>

          <div className="modal-header-actions">

            <StatusBadge
              config={
                statusConfig
              }
            />

            <button
              type="button"
              className="details-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>

          </div>

        </header>

        {/* STATUS */}

        <div
          className={`details-status-banner ${statusConfig.className}`}
        >

          <div className="details-status-icon">
            {statusConfig.icon}
          </div>

          <div>

            <span>
              CURRENT SUBMISSION STATUS
            </span>

            <strong>
              {statusConfig.label}
            </strong>

            <p>
              {statusConfig.description}
            </p>

          </div>

          <div className="status-read-only">
            Read-only
          </div>

        </div>

        {/* BODY */}

        <div className="details-modal-body">

          {/* ACTUAL FORM FIELDS */}

          {Object.entries(
            sections
          ).map(
            ([
              sectionName,
              fields,
            ]) => {

              /*
              Remove duplicate aliases.
              Example:
              standardTimeline + standard_timeline
              are treated as one logical field.
              */

              const logicalFields =
                removeDuplicateAliases(
                  record,
                  fields
                );

              if (
                logicalFields.length ===
                0
              ) {
                return null;
              }

              return (
                <section
                  className="details-section"
                  key={
                    sectionName
                  }
                >

                  <div className="details-section-heading">

                    <div>

                      <span>
                        DETAILS
                      </span>

                      <h3>
                        {
                          sectionName
                        }
                      </h3>

                    </div>

                  </div>

                  <div className="complete-fields-grid">

                    {logicalFields.map(
                      (key) => (
                        <div
                          className={`complete-field ${
                            isLongField(
                              key
                            )
                              ? "complete-field-wide"
                              : ""
                          }`}
                          key={key}
                        >

                          <label>
                            {formatLabel(
                              key
                            )}
                          </label>

                          <div className="complete-field-value">
                            {renderSimpleValue(
                              record?.[
                                key
                              ]
                            )}
                          </div>

                        </div>
                      )
                    )}

                  </div>

                </section>
              );
            }
          )}

          {/* STATUS */}

          <section className="details-section">

            <div className="details-section-heading">

              <div>

                <span>
                  SYSTEM
                </span>

                <h3>
                  Submission Status
                </h3>

              </div>

            </div>

            <div className="status-detail-card">

              <div>

                <span>
                  Current Status
                </span>

                <StatusBadge
                  config={
                    statusConfig
                  }
                />

              </div>

              <p>
                {statusConfig.description}
              </p>

            </div>

          </section>

          {/* TEAM MEMBERS */}

          {kind ===
            "deliver" && (
            <section className="details-section">

              <div className="details-section-heading">

                <div>

                  <span>
                    DELIVER
                  </span>

                  <h3>
                    Team Members
                  </h3>

                </div>

                <small>
                  {
                    teamMembers.length
                  }{" "}
                  member
                  {teamMembers.length ===
                  1
                    ? ""
                    : "s"}
                </small>

              </div>

              {teamMembers.length >
              0 ? (
                <div className="team-list">

                  {teamMembers.map(
                    (
                      member,
                      index
                    ) => (
                      <TeamMemberCard
                        key={
                          member?.id ||
                          member?.member_id ||
                          index
                        }
                        member={
                          member
                        }
                        index={
                          index
                        }
                        formatLabel={
                          formatLabel
                        }
                        renderSimpleValue={
                          renderSimpleValue
                        }
                      />
                    )
                  )}

                </div>
              ) : (
                <div className="details-empty-info">
                  No team member
                  details were
                  submitted.
                </div>
              )}

            </section>
          )}

          {/* FILES */}

          <section className="details-section">

            <div className="details-section-heading">

              <div>

                <span>
                  DOCUMENTS
                </span>

                <h3>
                  Uploaded Files
                </h3>

              </div>

              <small>
                {files.length} file
                {files.length ===
                1
                  ? ""
                  : "s"}
              </small>

            </div>

            {files.length >
            0 ? (
              <div className="files-list">

                {files.map(
                  (
                    file,
                    index
                  ) => (
                    <FileCard
                      key={
                        file?.id ||
                        file?.file_id ||
                        index
                      }
                      file={
                        file
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <div className="details-empty-info">
                No files were
                uploaded with this
                submission.
              </div>
            )}

          </section>

          {/* RECORD INFORMATION */}

          <section className="details-section">

            <div className="details-section-heading">

              <div>

                <span>
                  SYSTEM
                </span>

                <h3>
                  Record Information
                </h3>

              </div>

            </div>

            <div className="complete-fields-grid">

              <div className="complete-field">

                <label>
                  Record ID
                </label>

                <div className="complete-field-value">
                  #{record?.id ??
                    "—"}
                </div>

              </div>

              <div className="complete-field">

                <label>
                  Created At
                </label>

                <div className="complete-field-value">
                  {formatDateTime(
                    record?.created_at
                  )}
                </div>

              </div>

              <div className="complete-field">

                <label>
                  Last Updated
                </label>

                <div className="complete-field-value">
                  {formatDateTime(
                    record?.updated_at
                  )}
                </div>

              </div>

              <div className="complete-field">

                <label>
                  Record Type
                </label>

                <div className="complete-field-value">
                  {kind ===
                  "hire"
                    ? "Hire Requirement"
                    : "Deliver Proposal"}
                </div>

              </div>

            </div>

          </section>

        </div>

        {/* FOOTER */}

        <footer className="details-modal-footer">

          <div>
            <span>
              Status is managed by
              the HireDeliver
              administration team.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            Close Details
          </button>

        </footer>

      </div>

    </div>
  );
}

/*
=========================================================
TEAM MEMBER CARD
=========================================================
*/

function TeamMemberCard({
  member,
  index,
  formatLabel,
  renderSimpleValue,
}) {
  const name =
    member?.name ||
    member?.full_name ||
    `Team Member ${
      index + 1
    }`;

  const role =
    member?.role ||
    "Team Member";

  const skills =
    member?.skills ||
    member?.expertise ||
    "Not provided";

  const experience =
    member?.experience ??
    member?.years_of_experience ??
    "Not provided";

  /*
  Support both:
  profile
  profile_file
  profileFiles
  profile_files
  */

  const profile =
    member?.profile ||
    member?.profile_file ||
    member?.profileFiles ||
    member?.profile_files ||
    "";

  const similarExperience =
    member?.similarExperience ||
    member?.similar_experience ||
    "Not provided";

  const profileFiles =
    getMemberProfileFiles(
      member
    );

  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(
        (part) =>
          part
            .charAt(0)
            .toUpperCase()
      )
      .join("") ||
    "TM";

  return (
    <article className="detailed-member-card">

      <div className="member-top">

        <div className="member-avatar">
          {initials}
        </div>

        <div className="member-heading">

          <strong>
            {name}
          </strong>

          <span>
            {role}
          </span>

          <em className="member-status">
            Submitted
          </em>

        </div>

      </div>

      <div className="member-details-grid">

        <div className="member-detail-field">

          <span>
            Skills / Expertise
          </span>

          <strong>
            {renderSimpleValue(
              skills
            )}
          </strong>

        </div>

        <div className="member-detail-field">

          <span>
            Years of Experience
          </span>

          <strong>
            {renderSimpleValue(
              experience
            )}
          </strong>

        </div>

        <div className="member-detail-field">

          <span>
            CV / Profile Documents
          </span>

          <strong>

            {profileFiles.length >
            0 ? (
              <div className="member-file-list">

                {profileFiles.map(
                  (
                    file,
                    fileIndex
                  ) => (
                    <span
                      className="member-file-name"
                      key={
                        fileIndex
                      }
                    >
                      {getFileDisplayName(
                        file
                      )}
                    </span>
                  )
                )}

              </div>
            ) : profile ? (
              getFileDisplayName(
                profile
              )
            ) : (
              "Not provided"
            )}

          </strong>

        </div>

        <div className="member-detail-field">

          <span>
            Similar Experience
          </span>

          <strong>
            {renderSimpleValue(
              similarExperience
            )}
          </strong>

        </div>

      </div>

    </article>
  );
}

/*
=========================================================
FILE CARD
=========================================================
*/

function FileCard({
  file,
}) {
  const filename =
    getFileDisplayName(
      file
    );

  return (
    <div className="detailed-file-item">

      <div className="file-icon">
        📎
      </div>

      <div className="file-info">

        <span className="file-name">
          {filename ||
            "Uploaded file"}
        </span>

      </div>

    </div>
  );
}

/*
=========================================================
HELPERS
=========================================================
*/

/*
Return the actual filename only.

Backend may return:
original_name
original_filename
originalName
filename
file_name
name
*/

function getFileDisplayName(
  file
) {
  if (!file) {
    return "";
  }

  if (
    typeof file ===
    "string"
  ) {
    const trimmed =
      file.trim();

    /*
    If backend stored the file
    as JSON string, parse it.
    */

    if (
      trimmed.startsWith(
        "{"
      ) ||
      trimmed.startsWith(
        "["
      )
    ) {
      try {
        const parsed =
          JSON.parse(
            trimmed
          );

        if (
          Array.isArray(
            parsed
          )
        ) {
          return (
            parsed
              .map(
                getFileDisplayName
              )
              .filter(Boolean)
              .join(", ")
          );
        }

        if (
          parsed &&
          typeof parsed ===
            "object"
        ) {
          return (
            parsed.original_name ||
            parsed.original_filename ||
            parsed.originalName ||
            parsed.filename ||
            parsed.file_name ||
            parsed.name ||
            ""
          );
        }
      } catch {
        return file;
      }
    }

    /*
    Plain string is already
    the filename.
    */

    return file;
  }

  return (
    file.original_name ||
    file.original_filename ||
    file.originalName ||
    file.filename ||
    file.file_name ||
    file.name ||
    ""
  );
}

/*
=========================================================
TEAM MEMBER PROFILE FILES
=========================================================
*/

function getMemberProfileFiles(
  member
) {
  const possibleKeys = [
    "profileFiles",
    "profile_files",
    "profile_files_data",
    "profileDocuments",
    "profile_documents",
  ];

  for (
    const key of possibleKeys
  ) {
    if (
      Array.isArray(
        member?.[key]
      )
    ) {
      return member[key];
    }
  }

  return [];
}

/*
=========================================================
DUPLICATE FIELD ALIASES
=========================================================
*/

function removeDuplicateAliases(
  record,
  fields
) {
  const result = [];

  const groups = [
    [
      "standardTimeline",
      "standard_timeline",
    ],
    [
      "urgentTimeline",
      "urgent_timeline",
    ],
    [
      "humanResources",
      "human_resources",
    ],
    [
      "physicalResources",
      "physical_resources",
    ],
    [
      "additionalResources",
      "additional_resources",
    ],
    [
      "availableResources",
      "available_resources",
    ],
    [
      "requiredResources",
      "required_resources",
    ],
    [
      "fullLocation",
      "full_location",
    ],
    [
      "communicationMethod",
      "communication_method",
    ],
    [
      "communicationDetails",
      "communication_details",
    ],
    [
      "notificationPeriod",
      "notification_period",
    ],
    [
      "notificationDetails",
      "notification_details",
    ],
    [
      "includedCost",
      "included_cost",
    ],
    [
      "excludedCost",
      "excluded_cost",
    ],
  ];

  const used = new Set();

  fields.forEach(
    (field) => {
      if (
        used.has(field)
      ) {
        return;
      }

      const group =
        groups.find(
          (items) =>
            items.includes(
              field
            )
        );

      if (!group) {
        if (
          !isMissingRecordValue(
            record?.[field]
          )
        ) {
          result.push(
            field
          );
        }

        used.add(field);
        return;
      }

      const actualKey =
        group.find(
          (key) =>
            !isMissingRecordValue(
              record?.[key]
            )
        );

      if (actualKey) {
        result.push(
          actualKey
        );
      }

      group.forEach(
        (key) =>
          used.add(key)
      );
    }
  );

  return result;
}

/*
=========================================================
MISSING VALUE
=========================================================
*/

function isMissingRecordValue(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return true;
  }

  if (
    typeof value ===
      "string" &&
    !value.trim()
  ) {
    return true;
  }

  if (
    Array.isArray(value) &&
    value.length === 0
  ) {
    return true;
  }

  if (
    typeof value ===
      "object" &&
    !Array.isArray(value) &&
    Object.keys(value)
      .length === 0
  ) {
    return true;
  }

  return false;
}

/*
=========================================================
LONG FIELDS
=========================================================
*/

function isLongField(
  key
) {
  const longFields = [
    "description",
    "scope",
    "deliverables",

    "skills",

    "tools",

    "physicalResources",
    "physical_resources",

    "additionalResources",
    "additional_resources",

    "availableResources",
    "available_resources",

    "requiredResources",
    "required_resources",

    "fullLocation",
    "full_location",

    "notificationDetails",
    "notification_details",

    "communicationDetails",
    "communication_details",

    "portfolio",

    "roles",

    "humanResources",
    "human_resources",
  ];

  return longFields.includes(
    key
  );
}

export default UserDashboard;