import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* =========================================================
   WORLD COUNTRIES
   Searchable through datalist
========================================================= */

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Other",
];

/* =========================================================
   WORLD CURRENCIES
   Searchable through datalist
========================================================= */

const CURRENCIES = [
  "AED - UAE Dirham",
  "AFN - Afghan Afghani",
  "ALL - Albanian Lek",
  "AMD - Armenian Dram",
  "ANG - Netherlands Antillean Guilder",
  "AOA - Angolan Kwanza",
  "ARS - Argentine Peso",
  "AUD - Australian Dollar",
  "AWG - Aruban Florin",
  "AZN - Azerbaijani Manat",
  "BAM - Bosnia and Herzegovina Convertible Mark",
  "BBD - Barbadian Dollar",
  "BDT - Bangladeshi Taka",
  "BGN - Bulgarian Lev",
  "BHD - Bahraini Dinar",
  "BIF - Burundian Franc",
  "BMD - Bermudian Dollar",
  "BND - Brunei Dollar",
  "BOB - Bolivian Boliviano",
  "BRL - Brazilian Real",
  "BSD - Bahamian Dollar",
  "BTN - Bhutanese Ngultrum",
  "BWP - Botswana Pula",
  "BYN - Belarusian Ruble",
  "BZD - Belize Dollar",
  "CAD - Canadian Dollar",
  "CDF - Congolese Franc",
  "CHF - Swiss Franc",
  "CLP - Chilean Peso",
  "CNY - Chinese Yuan",
  "COP - Colombian Peso",
  "CRC - Costa Rican Colón",
  "CUP - Cuban Peso",
  "CVE - Cape Verdean Escudo",
  "CZK - Czech Koruna",
  "DJF - Djiboutian Franc",
  "DKK - Danish Krone",
  "DOP - Dominican Peso",
  "DZD - Algerian Dinar",
  "EGP - Egyptian Pound",
  "ERN - Eritrean Nakfa",
  "ETB - Ethiopian Birr",
  "EUR - Euro",
  "FJD - Fijian Dollar",
  "FKP - Falkland Islands Pound",
  "GBP - British Pound",
  "GEL - Georgian Lari",
  "GHS - Ghanaian Cedi",
  "GIP - Gibraltar Pound",
  "GMD - Gambian Dalasi",
  "GNF - Guinean Franc",
  "GTQ - Guatemalan Quetzal",
  "GYD - Guyanese Dollar",
  "HKD - Hong Kong Dollar",
  "HNL - Honduran Lempira",
  "HRK - Croatian Kuna",
  "HTG - Haitian Gourde",
  "HUF - Hungarian Forint",
  "IDR - Indonesian Rupiah",
  "ILS - Israeli New Shekel",
  "INR - Indian Rupee",
  "IQD - Iraqi Dinar",
  "IRR - Iranian Rial",
  "ISK - Icelandic Króna",
  "JMD - Jamaican Dollar",
  "JOD - Jordanian Dinar",
  "JPY - Japanese Yen",
  "KES - Kenyan Shilling",
  "KGS - Kyrgyzstani Som",
  "KHR - Cambodian Riel",
  "KMF - Comorian Franc",
  "KRW - South Korean Won",
  "KWD - Kuwaiti Dinar",
  "KYD - Cayman Islands Dollar",
  "KZT - Kazakhstani Tenge",
  "LAK - Lao Kip",
  "LBP - Lebanese Pound",
  "LKR - Sri Lankan Rupee",
  "LRD - Liberian Dollar",
  "LSL - Lesotho Loti",
  "LYD - Libyan Dinar",
  "MAD - Moroccan Dirham",
  "MDL - Moldovan Leu",
  "MGA - Malagasy Ariary",
  "MKD - Macedonian Denar",
  "MMK - Myanmar Kyat",
  "MNT - Mongolian Tögrög",
  "MOP - Macanese Pataca",
  "MRU - Mauritanian Ouguiya",
  "MUR - Mauritian Rupee",
  "MVR - Maldivian Rufiyaa",
  "MWK - Malawian Kwacha",
  "MXN - Mexican Peso",
  "MYR - Malaysian Ringgit",
  "MZN - Mozambican Metical",
  "NAD - Namibian Dollar",
  "NGN - Nigerian Naira",
  "NIO - Nicaraguan Córdoba",
  "NOK - Norwegian Krone",
  "NPR - Nepalese Rupee",
  "NZD - New Zealand Dollar",
  "OMR - Omani Rial",
  "PAB - Panamanian Balboa",
  "PEN - Peruvian Sol",
  "PGK - Papua New Guinean Kina",
  "PHP - Philippine Peso",
  "PKR - Pakistani Rupee",
  "PLN - Polish Złoty",
  "PYG - Paraguayan Guaraní",
  "QAR - Qatari Riyal",
  "RON - Romanian Leu",
  "RSD - Serbian Dinar",
  "RUB - Russian Ruble",
  "RWF - Rwandan Franc",
  "SAR - Saudi Riyal",
  "SBD - Solomon Islands Dollar",
  "SCR - Seychellois Rupee",
  "SDG - Sudanese Pound",
  "SEK - Swedish Krona",
  "SGD - Singapore Dollar",
  "SHP - Saint Helena Pound",
  "SLE - Sierra Leonean Leone",
  "SOS - Somali Shilling",
  "SRD - Surinamese Dollar",
  "SSP - South Sudanese Pound",
  "STN - São Tomé and Príncipe Dobra",
  "SYP - Syrian Pound",
  "SZL - Eswatini Lilangeni",
  "THB - Thai Baht",
  "TJS - Tajikistani Somoni",
  "TMT - Turkmenistan Manat",
  "TND - Tunisian Dinar",
  "TOP - Tongan Paʻanga",
  "TRY - Turkish Lira",
  "TTD - Trinidad and Tobago Dollar",
  "TWD - New Taiwan Dollar",
  "TZS - Tanzanian Shilling",
  "UAH - Ukrainian Hryvnia",
  "UGX - Ugandan Shilling",
  "USD - US Dollar",
  "UYU - Uruguayan Peso",
  "UZS - Uzbekistani Som",
  "VES - Venezuelan Bolívar",
  "VND - Vietnamese Dong",
  "VUV - Vanuatu Vatu",
  "WST - Samoan Tala",
  "XAF - Central African CFA Franc",
  "XCD - East Caribbean Dollar",
  "XOF - West African CFA Franc",
  "XPF - CFP Franc",
  "YER - Yemeni Rial",
  "ZAR - South African Rand",
  "ZMW - Zambian Kwacha",
  "ZWL - Zimbabwean Dollar",
];

/* =========================================================
   TEAM MEMBER
========================================================= */

const createTeamMember = () => ({
  name: "",
  role: "",
  skills: "",
  experience: "",
  profile: "",
  profileFiles: [],
  similarExperience: "",
});

function Deliver() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cityError, setCityError] = useState("");

  const [formData, setFormData] = useState({
    country: "Pakistan",

    title: "",
    type: "",
    category: "",

    description: "",
    scope: "",
    deliverables: "",

    currency: "PKR - Pakistani Rupee",
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
    socialMediaLink: "",

    uploadedFiles: [],

    notificationPeriod: "",
    notificationDetails: "",

    communicationMethod: "",
    communicationDetails: "",
  });

  /* =========================================================
     LOAD CITIES BASED ON COUNTRY
  ========================================================= */

  useEffect(() => {
    const loadCities = async () => {
      if (!formData.country || formData.country === "Other") {
        setCities([]);
        setCityError("");
        return;
      }

      setIsLoadingCities(true);
      setCityError("");
      setCities([]);

      try {
        const response = await fetch(
          `https://countriesnow.space/api/v0.1/countries/cities/q?country=${encodeURIComponent(
            formData.country
          )}`
        );

        const result = await response.json();

        if (
          response.ok &&
          result &&
          Array.isArray(result.data)
        ) {
          setCities(
            [...new Set(result.data)]
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b))
          );
        } else {
          setCities([]);
          setCityError(
            "Cities could not be loaded for this country. You can type the city name manually."
          );
        }
      } catch (error) {
        console.error("City loading error:", error);

        setCities([]);
        setCityError(
          "Unable to load cities right now. You can type the city name manually."
        );
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [formData.country]);

  /* =========================================================
     GENERAL INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country"
        ? {
            city: "",
          }
        : {}),
    }));
  };

  /* =========================================================
     SUBMIT FORM
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const accessToken = localStorage.getItem(
        "hireDeliverAccessToken"
      );

      if (!accessToken) {
        setSubmitError(
          "Your login session has expired. Please login again."
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setIsSubmitting(false);
        return;
      }

      const data = new FormData();

      /* ================= BASIC INFORMATION ================= */

      data.append("country", formData.country);
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("category", formData.category);

      /* ================= DELIVERY DETAILS ================= */

      data.append("description", formData.description);
      data.append("scope", formData.scope);
      data.append("deliverables", formData.deliverables);

      /* ================= COST ================= */

      data.append("currency", formData.currency);
      data.append("amount", formData.amount);
      data.append("includedCost", formData.includedCost);
      data.append("excludedCost", formData.excludedCost);

      /* ================= PROCESSING ================= */

      data.append("processing", formData.processing);
      data.append(
        "standardTimeline",
        formData.standardTimeline
      );
      data.append(
        "urgentTimeline",
        formData.urgentTimeline
      );

      /* ================= TEAM MEMBERS ================= */

      const teamMembersForSubmit = formData.teamMembers.map(
        (member) => ({
          name: member.name,
          role: member.role,
          skills: member.skills,
          experience: member.experience,

          profile:
            member.profile ||
            (member.profileFiles || [])
              .map((file) => file.name)
              .join(", "),

          similarExperience: member.similarExperience,
        })
      );

      data.append(
        "teamMembers",
        JSON.stringify(teamMembersForSubmit)
      );

      /* ================= RESOURCES ================= */

      data.append(
        "availableResources",
        formData.availableResources
      );

      data.append(
        "requiredResources",
        formData.requiredResources
      );

      data.append("tools", formData.tools);

      data.append(
        "physicalResources",
        formData.physicalResources
      );

      data.append(
        "additionalResources",
        formData.additionalResources
      );

      /* ================= LOCATION ================= */

      data.append("city", formData.city);

      data.append(
        "fullLocation",
        formData.fullLocation
      );

      /* ================= PORTFOLIO ================= */

      data.append("portfolio", formData.portfolio);

      /* ================= SOCIAL MEDIA ================= */

      data.append(
        "socialMediaLink",
        formData.socialMediaLink
      );

      /* ================= NOTIFICATION ================= */

      data.append(
        "notificationPeriod",
        formData.notificationPeriod
      );

      data.append(
        "notificationDetails",
        formData.notificationDetails
      );

      /* ================= COMMUNICATION ================= */

      data.append(
        "communicationMethod",
        formData.communicationMethod
      );

      data.append(
        "communicationDetails",
        formData.communicationDetails
      );

      /* ================= SUPPORTING FILES ================= */

      formData.uploadedFiles.forEach((file) => {
        data.append("uploadedFiles", file);
      });

      /* ================= TEAM PROFILE FILES ================= */

      formData.teamMembers.forEach((member) => {
        (member.profileFiles || []).forEach((file) => {
          data.append("uploadedFiles", file);
        });
      });

      /* ================= SEND REQUEST ================= */

      const response = await fetch(
        "http://127.0.0.1:5000/api/deliver/submit",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      /* ================= AUTH ERROR ================= */

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

        setSubmitError(
          "Your login session has expired. Please login again."
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setIsSubmitting(false);
        return;
      }

      /* ================= SERVER ERROR ================= */

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to submit delivery."
        );
      }

      /* ================= SUCCESS ================= */

      setSubmitMessage(
        "Your delivery proposal has been submitted successfully. The form is now ready for a new submission."
      );

      /* ================= RESET ================= */

      setFormData({
        country: "Pakistan",

        title: "",
        type: "",
        category: "",

        description: "",
        scope: "",
        deliverables: "",

        currency: "PKR - Pakistani Rupee",

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
        socialMediaLink: "",

        uploadedFiles: [],

        notificationPeriod: "",
        notificationDetails: "",

        communicationMethod: "",
        communicationDetails: "",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      console.log("Deliver submission:", result);
    } catch (error) {
      console.error(
        "Deliver submission error:",
        error
      );

      setSubmitError(
        error.message ||
          "Something went wrong while submitting."
      );

      // Always bring the user back to the message at the top
      // when any submission error occurs.
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     FILE UPLOAD
  ========================================================= */

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,

      uploadedFiles: [
        ...prev.uploadedFiles,
        ...files,
      ],
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

  /* =========================================================
     TEAM MEMBER FILE UPLOAD
  ========================================================= */

  const handleTeamMemberFileUpload = (
    memberIndex,
    e
  ) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => {
      const updatedMembers = [
        ...prev.teamMembers,
      ];

      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],

        profileFiles: [
          ...(updatedMembers[memberIndex]
            .profileFiles || []),
          ...files,
        ],
      };

      return {
        ...prev,
        teamMembers: updatedMembers,
      };
    });

    e.target.value = "";
  };

  const removeTeamMemberFile = (
    memberIndex,
    fileIndex
  ) => {
    setFormData((prev) => {
      const updatedMembers = [
        ...prev.teamMembers,
      ];

      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],

        profileFiles: (
          updatedMembers[memberIndex]
            .profileFiles || []
        ).filter(
          (_, index) => index !== fileIndex
        ),
      };

      return {
        ...prev,
        teamMembers: updatedMembers,
      };
    });
  };

  /* =========================================================
     TEAM MEMBERS
  ========================================================= */

  const handleTeamMemberChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updatedMembers = [
        ...prev.teamMembers,
      ];

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
    if (formData.teamMembers.length === 1) {
      return;
    }

    setFormData((prev) => ({
      ...prev,

      teamMembers: prev.teamMembers.filter(
        (_, memberIndex) =>
          memberIndex !== index
      ),
    }));
  };

  /* =========================================================
     COMPLETION
  ========================================================= */

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
    standardTimeline:
      formData.standardTimeline,

    teamMembers: formData.teamMembers,

    availableResources:
      formData.availableResources,

    requiredResources:
      formData.requiredResources,

    city: formData.city,
    fullLocation: formData.fullLocation,

    portfolio: formData.portfolio,
    socialMediaLink:
      formData.socialMediaLink,

    communicationMethod:
      formData.communicationMethod,
  };

  const isFilled = (value) => {
    if (Array.isArray(value)) {
      return value.some((item) => {
        if (
          typeof item === "object" &&
          item !== null
        ) {
          return Object.values(item).some(
            (itemValue) =>
              String(
                itemValue || ""
              ).trim() !== ""
          );
        }

        return String(
          item || ""
        ).trim() !== "";
      });
    }

    return String(
      value || ""
    ).trim() !== "";
  };

  const filledFields = Object.values(
    fieldsForCompletion
  ).filter(isFilled).length;

  const totalFields = Object.keys(
    fieldsForCompletion
  ).length;

  const completion = Math.round(
    (filledFields / totalFields) * 100
  );

  return (
    <>
      <Navbar />

      <main className="deliver-page">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="deliver-header">

          <div className="deliver-header-content">

            <div className="deliver-title-area">

              <span className="page-badge">
                DELIVER
              </span>

              <h1>
                Create Your{" "}
                <span>
                  Delivery Profile
                </span>
              </h1>

              <p>
                Tell potential clients what
                product, service, project,
                task, expertise or solution
                you can provide, including
                your cost, timeline, team,
                resources and delivery
                location.
              </p>

            </div>

          </div>

          <div className="header-status">

            <Link
              to="/dashboard"
              className="form-dashboard-btn"
            >
              <span>←</span>
              Dashboard
            </Link>

            <span className="status-dot"></span>

            Delivery Proposal

          </div>

        </section>

        {/* =====================================================
            MESSAGES
        ===================================================== */}

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

        {/* =====================================================
            WORKSPACE
        ===================================================== */}

        <section className="deliver-workspace">

          {/* ===================================================
              LEFT GUIDE
          =================================================== */}

          <aside className="deliver-guide">

            <div className="side-heading">

              <span>01</span>

              <h3>
                Delivery Guide
              </h3>

            </div>

            <p className="side-intro">
              Complete each section to
              clearly explain what you,
              your team or your organization
              can provide to potential
              clients.
            </p>

            <div className="guide-step active">

              <span>01</span>

              <div>
                <strong>
                  Basic Information
                </strong>

                <small>
                  Country, title, type and
                  category
                </small>
              </div>

            </div>

            <div className="guide-step">

              <span>02</span>

              <div>
                <strong>
                  Delivery Details
                </strong>

                <small>
                  What you provide, scope and
                  final outputs
                </small>
              </div>

            </div>

            <div className="guide-step">

              <span>03</span>

              <div>
                <strong>
                  Cost & Processing
                </strong>

                <small>
                  Price, currency and
                  delivery timeline
                </small>
              </div>

            </div>

            <div className="guide-step">

              <span>04</span>

              <div>
                <strong>
                  Team & Skills
                </strong>

                <small>
                  People, roles, skills and
                  experience
                </small>
              </div>

            </div>

            <div className="guide-step">

              <span>05</span>

              <div>
                <strong>
                  Resources
                </strong>

                <small>
                  Resources, equipment and
                  tools
                </small>
              </div>

            </div>

            <div className="guide-step">

              <span>06</span>

              <div>
                <strong>
                  Location & Proof
                </strong>

                <small>
                  Location, portfolio and
                  supporting evidence
                </small>
              </div>

            </div>

            <div className="guide-step">

              <span>07</span>

              <div>
                <strong>
                  Communication
                </strong>

                <small>
                  Updates and contact
                  preferences
                </small>
              </div>

            </div>

            <div className="guide-tip">

              <strong>
                TIP
              </strong>

              <p>
                Think of this form as your
                delivery profile. Write enough
                information that a client can
                understand what you can
                provide, what it costs, how
                long it takes and what they
                will receive.
              </p>

            </div>

          </aside>

          {/* ===================================================
              CENTER FORM
          =================================================== */}

          <div className="deliver-form-card">

            <div className="form-card-header">

              <div>

                <span>
                  DELIVERY PROPOSAL
                </span>

                <h2>
                  Delivery Information
                </h2>

              </div>

              <small>
                * Required
              </small>

            </div>

            <form
              className="requirement-form"
              onSubmit={handleSubmit}
            >

              {/* =================================================
                  01 BASIC INFORMATION
              ================================================= */}

              <div className="form-section-title">
                <span>01</span>
                Basic Information
              </div>

              <div className="form-group">

                <label>
                  Delivery Country *
                </label>

                <input
                  type="text"
                  name="country"
                  list="deliver-country-list"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Search and select country..."
                  autoComplete="off"
                  required
                />

                <datalist id="deliver-country-list">
                  {COUNTRIES.map(
                    (country) => (
                      <option
                        key={country}
                        value={country}
                      />
                    )
                  )}
                </datalist>

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  This tells clients where
                  you are able or willing to
                  provide the product, service,
                  project or other delivery.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Search and select the
                  country where the delivery
                  will be available.
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
                  required
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
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Identifies the main nature
                  of what you are offering.
                  <br />
                  <strong>
                    Select:
                  </strong>{" "}
                  <strong>Product</strong> for
                  a physical or digital item,
                  <strong> Service</strong> for
                  professional or operational
                  work, <strong>Task</strong> for
                  a specific assignment,
                  <strong> Project</strong> for
                  complete work with multiple
                  stages, or
                  <strong> Human Resource</strong>
                  {" "}when you are providing a
                  person or professional
                  resource.
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
                  placeholder="e.g. Event Management Service"
                  required
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Gives your delivery a clear
                  name that clients can quickly
                  understand.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Write a short and specific
                  title describing what you
                  are offering.
                  <br />
                  <strong>
                    Example:
                  </strong>{" "}
                  "Corporate Catering Service",
                  "Custom Furniture Production",
                  "Business Consulting Service",
                  or "Photography Package".
                </small>

              </div>

              <div className="form-group">

                <label>
                  Delivery Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
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

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Helps clients find and
                  understand the general area
                  of your delivery.
                  <br />
                  <strong>
                    Select:
                  </strong>{" "}
                  Choose the category that is
                  closest to your actual
                  offering. Select
                  <strong> Other</strong> if none
                  of the available categories
                  properly describes it.
                </small>

              </div>

              {/* =================================================
                  02 DELIVERY DETAILS
              ================================================= */}

              <div className="form-section-title">
                <span>02</span>
                Delivery Details
              </div>

              <div className="form-group">

                <label>
                  What Can You Provide? *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Explain clearly what product, service, project, task, solution or expertise you can provide..."
                  required
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  This is the main explanation
                  of your offering.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Explain what you provide,
                  who it is suitable for, its
                  main features or benefits,
                  and what makes your offering
                  useful.
                  <br />
                  <strong>
                    Example:
                  </strong>{" "}
                  If you provide catering,
                  explain the type of food,
                  expected capacity and service.
                  If you provide consulting,
                  explain the area of expertise
                  and type of guidance.
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
                  placeholder="Explain what work, responsibilities or activities are included from beginning to completion..."
                  required
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Defines exactly how much work
                  is covered by your delivery.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Explain what you will handle,
                  what activities are included,
                  the boundaries of your
                  responsibility and where your
                  responsibility ends.
                  <br />
                  This prevents confusion between
                  you and the client later.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Deliverables / Final Outputs *
                </label>

                <textarea
                  name="deliverables"
                  value={formData.deliverables}
                  onChange={handleChange}
                  rows="6"
                  placeholder={`Example:
1. Initial consultation
2. Planning / preparation
3. Main work or production
4. Quality checking
5. Final output
6. Handover / completion
7. After-delivery support`}
                  required
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Defines what the client will
                  actually receive at the end
                  of the work.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  List the final products,
                  services, reports, documents,
                  milestones, results, items or
                  other outputs you will provide.
                  <br />
                  You can write them as a
                  numbered list.
                </small>

              </div>

              {/* =================================================
                  03 COST & PROCESSING
              ================================================= */}

              <div className="form-section-title">
                <span>03</span>
                Cost & Processing
              </div>

              <div className="form-group">

                <label>
                  Delivery Cost *
                </label>

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Tells the client how much the
                  complete delivery is expected
                  to cost.
                  <br />
                  Enter the currency first and
                  then enter the numerical amount
                  for the delivery.
                </small>

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Currency *
                    </label>

                    <input
                      type="text"
                      name="currency"
                      list="deliver-currency-list"
                      value={formData.currency}
                      onChange={handleChange}
                      placeholder="Search currency..."
                      autoComplete="off"
                      required
                    />

                    <datalist id="deliver-currency-list">
                      {CURRENCIES.map(
                        (currency) => (
                          <option
                            key={currency}
                            value={currency}
                          />
                        )
                      )}
                    </datalist>

                    <small>
                      <strong>
                        Enter:
                      </strong>{" "}
                      Search and select the
                      currency in which your
                      delivery cost is quoted.
                      <br />
                      <strong>
                        Example:
                      </strong>{" "}
                      PKR, USD, EUR, GBP, AED,
                      SAR or another applicable
                      currency.
                    </small>

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
                      required
                    />

                    <small>
                      <strong>
                        Enter:
                      </strong>{" "}
                      Enter only the numerical
                      amount of the delivery cost.
                      <br />
                      <strong>
                        Example:
                      </strong>{" "}
                      If the total cost is
                      PKR 300,000, enter
                      <strong> 300000</strong>.
                      The currency is selected
                      separately above.
                    </small>

                  </div>

                </div>

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
                  placeholder="Explain everything covered by the quoted amount..."
                  required
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Makes the price transparent
                  to the client.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Mention all work, materials,
                  services, transportation,
                  preparation, support,
                  equipment, resources or
                  other items already included
                  in your quoted price.
                  <br />
                  <strong>
                    Example:
                  </strong>{" "}
                  "Planning, materials, delivery,
                  installation and one follow-up
                  visit are included."
                </small>

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
                  placeholder="Mention any work, materials, charges or services that are outside the quoted price..."
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Clearly identifies possible
                  extra charges.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Mention anything that the
                  client may need to pay
                  separately.
                  <br />
                  <strong>
                    Example:
                  </strong>{" "}
                  "Government fees, special
                  materials, additional travel
                  or extra work requested after
                  approval are not included."
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
                  required
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
                  <strong>
                    Normal Processing:
                  </strong>{" "}
                  The delivery will be completed
                  according to your normal
                  working schedule.
                  <br />
                  <strong>
                    Urgent Processing:
                  </strong>{" "}
                  The delivery can be given
                  priority and completed faster
                  if the required resources and
                  conditions are available.
                  <br />
                  Select the option that you
                  can realistically provide.
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
                    value={
                      formData.standardTimeline
                    }
                    onChange={handleChange}
                    placeholder="e.g. 15 days, 2 weeks, 3 months"
                    required
                  />

                  <small>
                    <strong>
                      Purpose:
                    </strong>{" "}
                    Tells the client the normal
                    amount of time required.
                    <br />
                    <strong>
                      Enter:
                    </strong>{" "}
                    Write a realistic duration
                    such as "7 days", "3 weeks",
                    "2 months" or "6 months".
                  </small>

                </div>

                <div className="form-group">

                  <label>
                    Urgent / Priority Timeline
                  </label>

                  <input
                    type="text"
                    name="urgentTimeline"
                    value={
                      formData.urgentTimeline
                    }
                    onChange={handleChange}
                    placeholder="e.g. 5 days, 1 week"
                  />

                  <small>
                    <strong>
                      Purpose:
                    </strong>{" "}
                    Shows the fastest realistic
                    timeline if priority delivery
                    is possible.
                    <br />
                    Leave empty if urgent
                    delivery is not available.
                  </small>

                </div>

              </div>

              {/* =================================================
                  04 TEAM & SKILLS
              ================================================= */}

              <div className="form-section-title">
                <span>04</span>
                Team & Skills
              </div>

              <div className="form-group">

                <label>
                  Delivery Team Members *
                </label>

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Shows the people responsible
                  for completing the delivery.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Add every important person
                  who will contribute to the
                  delivery. Include their name,
                  responsibility, skills and
                  relevant experience.
                  <br />
                  If the delivery is completed
                  by one person, keep one team
                  member and enter that person's
                  information.
                </small>

              </div>

              <div className="team-members-wrapper">

                {formData.teamMembers.map(
                  (member, index) => (

                    <div
                      className="team-member-card"
                      key={index}
                    >

                      <div className="team-member-header">

                        <div>

                          <span className="team-member-number">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                          <strong>
                            Team Member{" "}
                            {index + 1}
                          </strong>

                        </div>

                        {formData.teamMembers
                          .length > 1 && (
                          <button
                            type="button"
                            className="remove-team-btn"
                            onClick={() =>
                              removeTeamMember(
                                index
                              )
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
                            placeholder="e.g. Full Name"
                            required
                          />

                          <small>
                            <strong>
                              Enter:
                            </strong>{" "}
                            Full name of the person
                            who will participate in
                            delivering the product,
                            service, project or task.
                          </small>

                        </div>

                        <div className="form-group">

                          <label>
                            Role / Responsibility *
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
                            placeholder="e.g. Project Manager, Trainer, Technician"
                            required
                          />

                          <small>
                            <strong>
                              Enter:
                            </strong>{" "}
                            Explain what this person
                            will actually do.
                            <br />
                            Examples include
                            project manager, trainer,
                            consultant, technician,
                            designer, supervisor,
                            operator, researcher,
                            salesperson or specialist.
                          </small>

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
                            placeholder="e.g. Customer Service, Accounting, Carpentry"
                          />

                          <small>
                            <strong>
                              Enter:
                            </strong>{" "}
                            List the important skills,
                            qualifications, techniques,
                            professional abilities or
                            areas of expertise relevant
                            to this delivery.
                          </small>

                        </div>

                        <div className="form-group">

                          <label>
                            Years of Experience
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={
                              member.experience
                            }
                            onChange={(e) =>
                              handleTeamMemberChange(
                                index,
                                "experience",
                                e.target.value
                              )
                            }
                            placeholder="e.g. 5"
                          />

                          <small>
                            <strong>
                              Enter:
                            </strong>{" "}
                            Approximate number of
                            years of relevant
                            professional or practical
                            experience.
                          </small>

                        </div>

                      </div>

                      <div className="form-group">

                        <label>
                          Team Member CV / Profile Documents
                        </label>

                        <small>
                          <strong>
                            Purpose:
                          </strong>{" "}
                          Provides evidence about this
                          person's qualifications,
                          skills and professional
                          background.
                          <br />
                          <strong>
                            Upload:
                          </strong>{" "}
                          This member's CV/resume,
                          professional profile,
                          qualification certificate,
                          training certificate,
                          license, experience
                          document or relevant work
                          evidence.
                          <br />
                          <strong>
                            Important:
                          </strong>{" "}
                          Upload documents belonging
                          to this specific team member,
                          not general company documents.
                        </small>

                        <div className="file-upload-box">

                          <input
                            type="file"
                            id={`team-member-files-${index}`}
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                            onChange={(e) =>
                              handleTeamMemberFileUpload(
                                index,
                                e
                              )
                            }
                          />

                          <label
                            htmlFor={`team-member-files-${index}`}
                            className="file-upload-label"
                          >

                            <span className="upload-icon">
                              ↑
                            </span>

                            <strong>
                              Upload Member Documents
                            </strong>

                            <small>
                              CV, certificates,
                              qualifications,
                              licenses or relevant
                              evidence
                            </small>

                          </label>

                        </div>

                        {(
                          member.profileFiles || []
                        ).length > 0 && (

                          <div className="uploaded-files-list">

                            {member.profileFiles.map(
                              (file, fileIndex) => (

                                <div
                                  className="uploaded-file-item"
                                  key={`${file.name}-${fileIndex}`}
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
                                      removeTeamMemberFile(
                                        index,
                                        fileIndex
                                      )
                                    }
                                  >
                                    Remove
                                  </button>

                                </div>

                              )
                            )}

                          </div>

                        )}

                      </div>

                      <div className="form-group">

                        <label>
                          Similar Experience
                        </label>

                        <input
                          type="text"
                          value={
                            member.similarExperience
                          }
                          onChange={(e) =>
                            handleTeamMemberChange(
                              index,
                              "similarExperience",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Completed similar assignments for 5 clients"
                        />

                        <small>
                          <strong>
                            Enter:
                          </strong>{" "}
                          Mention previous work
                          similar to this delivery.
                          You can mention the type
                          of work, number of previous
                          assignments, industries,
                          clients or relevant
                          experience.
                          <br />
                          Do not share confidential
                          client information.
                        </small>

                      </div>

                    </div>

                  )
                )}

                <button
                  type="button"
                  className="add-team-btn"
                  onClick={addTeamMember}
                >
                  <span>+</span>
                  Add Another Team Member
                </button>

              </div>

              {/* =================================================
                  05 RESOURCES
              ================================================= */}

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
                  value={
                    formData.availableResources
                  }
                  onChange={handleChange}
                  rows="4"
                  placeholder="List the people, materials, facilities, equipment or other resources you already have available..."
                  required
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Shows what you already have
                  available to complete the
                  delivery.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Mention available staff,
                  materials, facilities,
                  equipment, transportation,
                  workspace, machinery, expertise
                  or other useful resources.
                  <br />
                  <strong>
                    Example:
                  </strong>{" "}
                  "Two trained staff, required
                  equipment, workspace and
                  transportation facility."
                </small>

              </div>

              <div className="form-group">

                <label>
                  Required Resources
                </label>

                <textarea
                  name="requiredResources"
                  value={
                    formData.requiredResources
                  }
                  onChange={handleChange}
                  rows="4"
                  placeholder="List anything you need from the client or another source before or during delivery..."
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Tells the client what is needed
                  from their side or from an
                  external source.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Mention information,
                  materials, access, permissions,
                  special equipment, approvals,
                  facilities, staff support or
                  other requirements.
                  <br />
                  If nothing is required, write
                  <strong> "Not Required"</strong>.
                </small>

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
                  placeholder="List the tools, software, platforms, machinery or systems used to provide your delivery..."
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Shows which tools or systems
                  support your delivery.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Add relevant software,
                  platforms, applications,
                  machinery, equipment systems,
                  instruments or other tools.
                  <br />
                  This field is not limited to
                  technology. Add any tool that
                  is relevant to your work.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Physical Resources / Equipment
                </label>

                <textarea
                  name="physicalResources"
                  value={
                    formData.physicalResources
                  }
                  onChange={handleChange}
                  rows="4"
                  placeholder="List physical equipment, machinery, vehicles, instruments, facilities or devices available for the delivery..."
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Identifies physical resources
                  that support your ability to
                  complete the delivery.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Mention machines, vehicles,
                  instruments, production
                  equipment, testing equipment,
                  office facilities, workshop
                  facilities or other physical
                  resources.
                  <br />
                  If none are needed, write
                  <strong> "Not Required"</strong>.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Additional Resources
                </label>

                <textarea
                  name="additionalResources"
                  value={
                    formData.additionalResources
                  }
                  onChange={handleChange}
                  rows="4"
                  placeholder="Mention any other resource, partnership, facility, supplier, network or support that strengthens your delivery capability..."
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Captures useful resources that
                  do not fit into the previous
                  fields.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  You can mention partners,
                  suppliers, external specialists,
                  business networks, special
                  facilities, logistics support,
                  distribution channels or other
                  relevant support.
                </small>

              </div>

              {/* =================================================
                  06 LOCATION & PROOF
              ================================================= */}

              <div className="form-section-title">
                <span>06</span>
                Location & Proof
              </div>

              <div className="form-group">

                <label>
                  Delivery City *
                </label>

                <input
                  type="text"
                  name="city"
                  list="deliver-city-list"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={
                    isLoadingCities
                      ? "Loading cities..."
                      : "Search or type city..."
                  }
                  autoComplete="off"
                  disabled={!formData.country}
                  required
                />

                <datalist id="deliver-city-list">
                  {cities.map((city) => (
                    <option
                      key={city}
                      value={city}
                    />
                  ))}
                </datalist>

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Identifies the city where you
                  can provide or manage the
                  delivery.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Search the city from the
                  suggestions or type it
                  manually if it is not listed.
                </small>

                {isLoadingCities && (
                  <small>
                    Loading cities for{" "}
                    {formData.country}...
                  </small>
                )}

                {cityError && (
                  <small>
                    {cityError}
                  </small>
                )}

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
                  placeholder="Enter business address, service area, facility location or other relevant delivery location..."
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Provides additional location
                  details when the city alone is
                  not enough.
                  <br />
                  <strong>
                    Enter:
                  </strong>{" "}
                  Add office address, shop
                  address, workshop, facility,
                  service area, delivery zone or
                  other relevant location.
                  <br />
                  Do not share unnecessary
                  personal or private information.
                </small>

              </div>

              {/* =================================================
                  PORTFOLIO
              ================================================= */}

              <div className="form-group">

                <label>
                  Portfolio / Website / Demo Link
                </label>

                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com or https://drive.google.com/..."
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Gives clients evidence of
                  your previous work and
                  capability.
                  <br />
                  <strong>
                    Add:
                  </strong>{" "}
                  Your portfolio website,
                  business website, previous
                  work page, product demo,
                  project page, GitHub,
                  Behance, design portfolio or
                  Google Drive folder/file.
                </small>

                <small>
                  <strong>
                    Google Drive link banane ka
                    tareeqa:
                  </strong>{" "}
                  Apni portfolio file ya folder
                  Google Drive mein upload karein
                  → <strong>Share</strong> par
                  click karein → General Access
                  mein{" "}
                  <strong>
                    Anyone with the link
                  </strong>{" "}
                  select karein → Viewer access
                  rakhein →{" "}
                  <strong>
                    Copy link
                  </strong>{" "}
                  karein → phir yahan paste
                  karein.
                  <br />
                  <strong>
                    Important:
                  </strong>{" "}
                  Link submit karne se pehle
                  khud test karein ke doosra
                  person us link ko open kar
                  sakta hai.
                </small>

              </div>

              {/* =================================================
                  SOCIAL MEDIA
              ================================================= */}

              <div className="form-group">

                <label>
                  Professional / Social Media Profile Link
                </label>

                <input
                  type="url"
                  name="socialMediaLink"
                  value={
                    formData.socialMediaLink
                  }
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Gives clients another way to
                  verify your professional
                  presence and experience.
                  <br />
                  <strong>
                    Add:
                  </strong>{" "}
                  LinkedIn, GitHub, Behance,
                  Dribbble, Instagram, Facebook,
                  YouTube, professional profile,
                  business page or another
                  relevant public profile.
                  <br />
                  Use a profile that is related
                  to the delivery you are
                  offering.
                </small>

              </div>

              {/* =================================================
                  SUPPORTING DOCUMENTS
              ================================================= */}

              <div className="form-group">

                <label>
                  Delivery Supporting Documents
                </label>

                <small>
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Upload documents that provide
                  evidence, details or additional
                  information about your delivery
                  proposal.
                  <br />
                  <strong>
                    Upload here:
                  </strong>
                  <br />
                  • Previous work samples
                  <br />
                  • Product brochures
                  <br />
                  • Service profile
                  <br />
                  • Company profile
                  <br />
                  • Case studies
                  <br />
                  • Certificates
                  <br />
                  • Licenses or registrations
                  <br />
                  • Technical documents
                  <br />
                  • Product specifications
                  <br />
                  • Price/catalog documents
                  <br />
                  • Presentations
                  <br />
                  • Images or screenshots
                  <br />
                  • Previous work evidence
                  <br />
                  • Other relevant supporting
                  documents
                  <br />
                  <strong>
                    Do not upload:
                  </strong>{" "}
                  Passwords, confidential
                  information, private documents
                  or files that you do not have
                  permission to share.
                </small>

                <div className="file-upload-box">

                  <input
                    type="file"
                    id="delivery-supporting-files"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                    onChange={handleFileUpload}
                  />

                  <label
                    htmlFor="delivery-supporting-files"
                    className="file-upload-label"
                  >

                    <span className="upload-icon">
                      ↑
                    </span>

                    <strong>
                      Upload Delivery Supporting Documents
                    </strong>

                    <small>
                      Upload relevant proof,
                      samples, certificates,
                      brochures, reports,
                      presentations or images
                    </small>

                  </label>

                </div>

                {formData.uploadedFiles.length >
                  0 && (

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
                              removeUploadedFile(
                                index
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

              {/* =================================================
                  07 NOTIFICATION & COMMUNICATION
              ================================================= */}

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
                  value={
                    formData.notificationPeriod
                  }
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
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Defines how frequently progress
                  or delivery updates should be
                  communicated.
                  <br />
                  <strong>
                    Select:
                  </strong>{" "}
                  Choose the frequency that you
                  can realistically maintain.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Additional Notification Details
                </label>

                <textarea
                  name="notificationDetails"
                  value={
                    formData.notificationDetails
                  }
                  onChange={handleChange}
                  rows="4"
                  placeholder="Mention any special requirement for progress updates, reports, milestones or delivery notifications..."
                />

                <small>
                  <strong>
                    Enter:
                  </strong>{" "}
                  Mention any special update
                  requirements, milestone reports,
                  progress summaries, completion
                  notices or other notification
                  preferences.
                  <br />
                  If there are no special
                  requirements, you can leave
                  this field empty.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Preferred Communication Method *
                </label>

                <select
                  name="communicationMethod"
                  value={
                    formData.communicationMethod
                  }
                  onChange={handleChange}
                  required
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
                  <strong>
                    Purpose:
                  </strong>{" "}
                  Tells potential clients how
                  they should contact you about
                  this delivery.
                  <br />
                  Select the method through which
                  you are comfortable receiving
                  delivery-related communication.
                </small>

              </div>

              <div className="form-group">

                <label>
                  Communication Details
                </label>

                <input
                  type="text"
                  name="communicationDetails"
                  value={
                    formData.communicationDetails
                  }
                  onChange={handleChange}
                  placeholder="e.g. email address, phone number or WhatsApp contact"
                />

                <small>
                  <strong>
                    Enter:
                  </strong>{" "}
                  Provide the contact detail
                  associated with your selected
                  communication method.
                  <br />
                  <strong>
                    Example:
                  </strong>{" "}
                  Email address, phone number,
                  WhatsApp number or another
                  appropriate contact detail.
                  <br />
                  Make sure the information is
                  correct before publishing.
                </small>

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

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
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Publishing..."
                    : "Publish Delivery →"}
                </button>

              </div>

            </form>

          </div>

          {/* ===================================================
              RIGHT SUMMARY
          =================================================== */}

          <aside className="project-summary">

            <div className="summary-header">

              <div>

                <span>02</span>

                <h3>
                  Delivery Summary
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
                  Profile Completion
                </span>

                <strong>
                  {filledFields}/
                  {totalFields}
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

                <span>
                  Country
                </span>

                <strong>
                  {formData.country ||
                    "Pakistan"}
                </strong>

              </div>

              <div>

                <span>
                  Category
                </span>

                <strong>
                  {formData.category ||
                    "Not specified"}
                </strong>

              </div>

              <div>

                <span>
                  Delivery Cost
                </span>

                <strong>
                  {formData.amount
                    ? `${formData.currency} ${formData.amount}`
                    : "Not specified"}
                </strong>

              </div>

              <div>

                <span>
                  Processing
                </span>

                <strong>
                  {formData.processing ||
                    "Not specified"}
                </strong>

              </div>

              <div>

                <span>
                  Standard Time
                </span>

                <strong>
                  {formData.standardTimeline ||
                    "Not specified"}
                </strong>

              </div>

              <div>

                <span>
                  Team Members
                </span>

                <strong>
                  {formData.teamMembers.length}
                </strong>

              </div>

              <div>

                <span>
                  City
                </span>

                <strong>
                  {formData.city ||
                    "Not specified"}
                </strong>

              </div>

              <div>

                <span>
                  Portfolio
                </span>

                <strong>
                  {formData.portfolio
                    ? "Provided"
                    : "Not provided"}
                </strong>

              </div>

              <div>

                <span>
                  Social Profile
                </span>

                <strong>
                  {formData.socialMediaLink
                    ? "Provided"
                    : "Not provided"}
                </strong>

              </div>

              <div>

                <span>
                  Communication
                </span>

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
                ✓ Portfolio / proof added
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