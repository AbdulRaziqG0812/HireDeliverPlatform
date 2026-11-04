
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* =========================================================
   WORLD COUNTRIES
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
];

/* =========================================================
   WORLD CURRENCIES
========================================================= */

const CURRENCIES = [
  "AED - United Arab Emirates Dirham",
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
  "CRC - Costa Rican Colon",
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
  "GBP - British Pound Sterling",
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
  "ISK - Icelandic Krona",
  "JMD - Jamaican Dollar",
  "JOD - Jordanian Dinar",
  "JPY - Japanese Yen",
  "KES - Kenyan Shilling",
  "KGS - Kyrgyzstani Som",
  "KHR - Cambodian Riel",
  "KMF - Comorian Franc",
  "KPW - North Korean Won",
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
  "MNT - Mongolian Tugrik",
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
  "NIO - Nicaraguan Cordoba",
  "NOK - Norwegian Krone",
  "NPR - Nepalese Rupee",
  "NZD - New Zealand Dollar",
  "OMR - Omani Rial",
  "PAB - Panamanian Balboa",
  "PEN - Peruvian Sol",
  "PGK - Papua New Guinean Kina",
  "PHP - Philippine Peso",
  "PKR - Pakistani Rupee",
  "PLN - Polish Zloty",
  "PYG - Paraguayan Guarani",
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
  "STN - Sao Tome and Principe Dobra",
  "SVC - Salvadoran Colon",
  "SYP - Syrian Pound",
  "SZL - Eswatini Lilangeni",
  "THB - Thai Baht",
  "TJS - Tajikistani Somoni",
  "TMT - Turkmenistani Manat",
  "TND - Tunisian Dinar",
  "TOP - Tongan Paanga",
  "TRY - Turkish Lira",
  "TTD - Trinidad and Tobago Dollar",
  "TWD - New Taiwan Dollar",
  "TZS - Tanzanian Shilling",
  "UAH - Ukrainian Hryvnia",
  "UGX - Ugandan Shilling",
  "USD - United States Dollar",
  "UYU - Uruguayan Peso",
  "UZS - Uzbekistani Som",
  "VES - Venezuelan Bolivar",
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
   FALLBACK CITY LIST
========================================================= */

const FALLBACK_CITIES = {
  Pakistan: [
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
    "Bahawalpur",
    "Sargodha",
    "Hyderabad",
    "Abbottabad",
    "Mardan",
    "Gujrat",
    "Sahiwal",
    "Sukkur",
    "Larkana",
    "Sheikhupura",
    "Jhelum",
    "Wah Cantt",
    "Taxila",
    "Murree",
    "Mingora",
    "Nawabshah",
    "Okara",
    "Kasur",
    "Dera Ghazi Khan",
    "Rahim Yar Khan",
    "Chiniot",
    "Attock",
    "Mansehra",
    "Swabi",
    "Nowshera",
    "Kohat",
    "Bannu",
    "Dera Ismail Khan",
    "Gwadar",
    "Turbat",
    "Khuzdar",
  ],

  India: [
    "New Delhi",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Varanasi",
    "Srinagar",
    "Amritsar",
    "Chandigarh",
  ],

  "United States": [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Indianapolis",
    "Charlotte",
    "Seattle",
    "Denver",
    "Washington",
    "Boston",
    "Nashville",
    "Detroit",
    "Portland",
    "Las Vegas",
    "Miami",
    "Atlanta",
    "Orlando",
    "San Francisco",
  ],

  Canada: [
    "Toronto",
    "Montreal",
    "Vancouver",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Winnipeg",
    "Quebec City",
    "Hamilton",
    "Kitchener",
    "London",
    "Victoria",
    "Halifax",
    "Oshawa",
    "Windsor",
  ],

  "United Kingdom": [
    "London",
    "Birmingham",
    "Manchester",
    "Glasgow",
    "Liverpool",
    "Leeds",
    "Sheffield",
    "Edinburgh",
    "Bristol",
    "Cardiff",
    "Leicester",
    "Coventry",
    "Nottingham",
    "Newcastle upon Tyne",
    "Belfast",
  ],

  Australia: [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Gold Coast",
    "Canberra",
    "Newcastle",
    "Wollongong",
    "Geelong",
    "Hobart",
    "Townsville",
    "Cairns",
    "Darwin",
  ],

  Germany: [
    "Berlin",
    "Hamburg",
    "Munich",
    "Cologne",
    "Frankfurt",
    "Stuttgart",
    "Dusseldorf",
    "Leipzig",
    "Dortmund",
    "Essen",
    "Bremen",
    "Dresden",
    "Hanover",
    "Nuremberg",
    "Bonn",
  ],

  France: [
    "Paris",
    "Marseille",
    "Lyon",
    "Toulouse",
    "Nice",
    "Nantes",
    "Montpellier",
    "Strasbourg",
    "Bordeaux",
    "Lille",
    "Rennes",
    "Reims",
    "Le Havre",
    "Saint-Etienne",
    "Toulon",
  ],

  China: [
    "Beijing",
    "Shanghai",
    "Guangzhou",
    "Shenzhen",
    "Chengdu",
    "Chongqing",
    "Tianjin",
    "Wuhan",
    "Nanjing",
    "Xi'an",
    "Hangzhou",
    "Suzhou",
    "Qingdao",
    "Dalian",
    "Xiamen",
  ],

  Japan: [
    "Tokyo",
    "Yokohama",
    "Osaka",
    "Nagoya",
    "Sapporo",
    "Fukuoka",
    "Kobe",
    "Kyoto",
    "Kawasaki",
    "Saitama",
    "Hiroshima",
    "Sendai",
    "Chiba",
    "Naha",
  ],

  "United Arab Emirates": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Al Ain",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ],

  "Saudi Arabia": [
    "Riyadh",
    "Jeddah",
    "Mecca",
    "Medina",
    "Dammam",
    "Khobar",
    "Taif",
    "Tabuk",
    "Abha",
    "Jubail",
  ],

  "Turkey": [
    "Istanbul",
    "Ankara",
    "Izmir",
    "Bursa",
    "Adana",
    "Gaziantep",
    "Konya",
    "Antalya",
    "Kayseri",
    "Mersin",
    "Eskisehir",
    "Diyarbakir",
  ],

  "Bangladesh": [
    "Dhaka",
    "Chittagong",
    "Khulna",
    "Rajshahi",
    "Sylhet",
    "Rangpur",
    "Comilla",
    "Mymensingh",
    "Barisal",
  ],

  "Malaysia": [
    "Kuala Lumpur",
    "George Town",
    "Johor Bahru",
    "Ipoh",
    "Shah Alam",
    "Malacca City",
    "Kota Kinabalu",
    "Kuching",
    "Petaling Jaya",
    "Seremban",
  ],

  "Singapore": [
    "Singapore",
  ],

  "Indonesia": [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Makassar",
    "Palembang",
    "Depok",
    "Tangerang",
    "Bekasi",
    "Denpasar",
  ],

  "South Korea": [
    "Seoul",
    "Busan",
    "Incheon",
    "Daegu",
    "Daejeon",
    "Gwangju",
    "Suwon",
    "Ulsan",
    "Jeonju",
    "Jeju City",
  ],

  "Italy": [
    "Rome",
    "Milan",
    "Naples",
    "Turin",
    "Palermo",
    "Genoa",
    "Bologna",
    "Florence",
    "Bari",
    "Venice",
    "Verona",
  ],

  "Spain": [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Seville",
    "Zaragoza",
    "Malaga",
    "Murcia",
    "Palma",
    "Bilbao",
    "Alicante",
  ],

  "Brazil": [
    "Sao Paulo",
    "Rio de Janeiro",
    "Brasilia",
    "Salvador",
    "Fortaleza",
    "Belo Horizonte",
    "Manaus",
    "Curitiba",
    "Recife",
    "Porto Alegre",
  ],

  "Mexico": [
    "Mexico City",
    "Guadalajara",
    "Monterrey",
    "Puebla",
    "Tijuana",
    "Leon",
    "Juarez",
    "Merida",
    "Cancun",
    "Queretaro",
  ],

  "Russia": [
    "Moscow",
    "Saint Petersburg",
    "Novosibirsk",
    "Yekaterinburg",
    "Kazan",
    "Nizhny Novgorod",
    "Chelyabinsk",
    "Samara",
    "Omsk",
    "Rostov-on-Don",
  ],

  "Netherlands": [
    "Amsterdam",
    "Rotterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Groningen",
    "Tilburg",
    "Almere",
    "Breda",
  ],

  "Switzerland": [
    "Zurich",
    "Geneva",
    "Basel",
    "Lausanne",
    "Bern",
    "Winterthur",
    "Lucerne",
    "Lugano",
  ],

  "Qatar": [
    "Doha",
    "Al Rayyan",
    "Al Wakrah",
    "Umm Salal",
    "Al Khor",
  ],

  "Kuwait": [
    "Kuwait City",
    "Hawally",
    "Salmiya",
    "Farwaniya",
    "Jahra",
  ],

  "Oman": [
    "Muscat",
    "Salalah",
    "Sohar",
    "Nizwa",
    "Sur",
    "Rustaq",
  ],

  "Egypt": [
    "Cairo",
    "Alexandria",
    "Giza",
    "Shubra El Kheima",
    "Port Said",
    "Suez",
    "Luxor",
    "Aswan",
  ],

  "Nigeria": [
    "Lagos",
    "Abuja",
    "Kano",
    "Ibadan",
    "Benin City",
    "Port Harcourt",
    "Kaduna",
    "Enugu",
  ],

  "Kenya": [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Malindi",
  ],

  "South Africa": [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
    "East London",
  ],

  "Ireland": [
    "Dublin",
    "Cork",
    "Limerick",
    "Galway",
    "Waterford",
    "Drogheda",
  ],

  "Portugal": [
    "Lisbon",
    "Porto",
    "Amadora",
    "Braga",
    "Coimbra",
    "Funchal",
  ],

  "Greece": [
    "Athens",
    "Thessaloniki",
    "Patras",
    "Heraklion",
    "Larissa",
    "Volos",
  ],

  "Norway": [
    "Oslo",
    "Bergen",
    "Trondheim",
    "Stavanger",
    "Drammen",
    "Tromso",
  ],

  "Sweden": [
    "Stockholm",
    "Gothenburg",
    "Malmo",
    "Uppsala",
    "Vasteras",
    "Orebro",
  ],

  "Denmark": [
    "Copenhagen",
    "Aarhus",
    "Odense",
    "Aalborg",
    "Esbjerg",
  ],

  "Finland": [
    "Helsinki",
    "Espoo",
    "Tampere",
    "Vantaa",
    "Oulu",
    "Turku",
  ],

  "Austria": [
    "Vienna",
    "Graz",
    "Linz",
    "Salzburg",
    "Innsbruck",
    "Klagenfurt",
  ],

  "Belgium": [
    "Brussels",
    "Antwerp",
    "Ghent",
    "Charleroi",
    "Liege",
    "Bruges",
  ],

  "Poland": [
    "Warsaw",
    "Krakow",
    "Lodz",
    "Wroclaw",
    "Poznan",
    "Gdansk",
    "Szczecin",
    "Katowice",
  ],

  "Romania": [
    "Bucharest",
    "Cluj-Napoca",
    "Timisoara",
    "Iasi",
    "Constanta",
    "Craiova",
  ],

  "Ukraine": [
    "Kyiv",
    "Kharkiv",
    "Odesa",
    "Dnipro",
    "Lviv",
    "Zaporizhzhia",
    "Vinnytsia",
  ],

  "Argentina": [
    "Buenos Aires",
    "Cordoba",
    "Rosario",
    "Mendoza",
    "La Plata",
    "Mar del Plata",
  ],

  "Chile": [
    "Santiago",
    "Valparaiso",
    "Concepcion",
    "La Serena",
    "Antofagasta",
    "Temuco",
  ],

  "Colombia": [
    "Bogota",
    "Medellin",
    "Cali",
    "Barranquilla",
    "Cartagena",
    "Bucaramanga",
  ],

  "Peru": [
    "Lima",
    "Arequipa",
    "Trujillo",
    "Cusco",
    "Chiclayo",
    "Piura",
  ],
};

/* =========================================================
   HIRE COMPONENT
========================================================= */

function Hire() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    country: "Pakistan",
    currency: "PKR - Pakistani Rupee",
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

  const [cities, setCities] = useState(
    FALLBACK_CITIES.Pakistan || []
  );

  const [cityLoading, setCityLoading] = useState(false);

  const [cityError, setCityError] = useState("");

  const [files, setFiles] = useState([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitMessage, setSubmitMessage] =
    useState("");

  const [submitError, setSubmitError] =
    useState("");

  /* =========================================================
     LOAD CITIES WHEN COUNTRY CHANGES
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadCities = async () => {
      const selectedCountry = formData.country;

      if (!selectedCountry) {
        setCities([]);
        setCityError("");
        return;
      }

      setCityLoading(true);
      setCityError("");

      // Clear previously selected city
      setFormData((prev) => ({
        ...prev,
        location: "",
      }));

      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              country: selectedCountry,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load cities."
          );
        }

        const result = await response.json();

        const apiCities =
          Array.isArray(result?.data)
            ? result.data
            : [];

        const fallbackCities =
          FALLBACK_CITIES[selectedCountry] || [];

        const mergedCities = Array.from(
          new Set([
            ...apiCities,
            ...fallbackCities,
          ])
        )
          .filter(Boolean)
          .sort((a, b) =>
            a.localeCompare(b)
          );

        if (isMounted) {
          setCities(mergedCities);

          if (mergedCities.length === 0) {
            setCityError(
              "No city list was available for this country. You can enter the city manually."
            );
          }
        }
      } catch (error) {
        console.error(
          "City loading error:",
          error
        );

        if (isMounted) {
          const fallbackCities =
            FALLBACK_CITIES[selectedCountry] || [];

          setCities(fallbackCities);

          if (fallbackCities.length === 0) {
            setCityError(
              "City list could not be loaded. You can enter the city manually."
            );
          } else {
            setCityError(
              "Live city list could not be loaded. Showing available cities."
            );
          }
        }
      } finally {
        if (isMounted) {
          setCityLoading(false);
        }
      }
    };

    loadCities();

    return () => {
      isMounted = false;
    };
  }, [formData.country]);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
        location: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     FILE CHANGE
  ========================================================= */

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    setFiles(selectedFiles);
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

        setIsSubmitting(false);
        return;
      }

      const data = new FormData();

      data.append(
        "country",
        formData.country
      );

      data.append(
        "currency",
        formData.currency
      );

      data.append(
        "title",
        formData.title
      );

      data.append(
        "type",
        formData.type
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "scope",
        formData.scope
      );

      data.append(
        "deliverables",
        formData.deliverables
      );

      data.append(
        "budget",
        formData.budget
      );

      data.append(
        "processing",
        formData.processing
      );

      data.append(
        "standardTimeline",
        formData.standardTimeline
      );

      data.append(
        "urgentTimeline",
        formData.urgentTimeline
      );

      data.append(
        "humanResources",
        formData.humanResources
      );

      data.append(
        "roles",
        formData.roles
      );

      data.append(
        "skills",
        formData.skills
      );

      data.append(
        "tools",
        formData.tools
      );

      data.append(
        "physicalResources",
        formData.physicalResources
      );

      data.append(
        "additionalResources",
        formData.additionalResources
      );

      data.append(
        "location",
        formData.location
      );

      data.append(
        "fullLocation",
        formData.fullLocation
      );

      data.append(
        "communicationMethod",
        formData.communicationMethod
      );

      data.append(
        "notificationPeriod",
        formData.notificationPeriod
      );

      files.forEach((file) => {
        data.append(
          "uploadedFiles",
          file
        );
      });

      const response = await fetch(
        "http://127.0.0.1:5000/api/hire/submit",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

          body: data,
        }
      );

      const result =
        await response.json();

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

        setIsSubmitting(false);

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to submit requirement."
        );
      }

      setSubmitMessage(
        "Your hire requirement has been submitted successfully. The form is now ready for a new submission."
      );

      setFormData({
        country: "Pakistan",
        currency:
          "PKR - Pakistani Rupee",
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

      setCities(
        FALLBACK_CITIES.Pakistan || []
      );

      setCityError("");

      setFiles([]);

      const fileInput =
        document.getElementById(
          "hireFiles"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      console.log(
        "Hire submission:",
        result
      );
    } catch (error) {
      console.error(
        "Hire submission error:",
        error
      );

      setSubmitError(
        error.message ||
          "Something went wrong while submitting the requirement."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     FORM COMPLETION
  ========================================================= */

  const filledFields =
    Object.values(formData).filter(
      (value) =>
        typeof value === "string" &&
        value.trim() !== ""
    ).length;

  const totalFields =
    Object.keys(formData).length;

  const completion =
    totalFields > 0
      ? Math.round(
          (filledFields / totalFields) *
            100
        )
      : 0;

  return (
    <div className="app">

      <Navbar />

      <main className="deliver-page">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="deliver-header">

          <div>

            <span className="page-badge">
              HIRE
            </span>

            <h1>
              Post Your <span>Requirement</span>
            </h1>

            <p>
              Tell teams and service providers exactly what
              you need, including your requirements, budget,
              timeline, resources, location and preferred
              communication method.
            </p>

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

            New Requirement

          </div>

        </section>

        {/* ===================================================
            WORKSPACE
        =================================================== */}

        <section className="deliver-workspace">

          {/* =================================================
              LEFT GUIDE
          ================================================= */}

          <aside className="deliver-guide">

            <div className="side-heading">

              <span>01</span>

              <h3>
                Requirement Guide
              </h3>

            </div>

            <p className="side-intro">
              Provide complete information so suitable teams,
              professionals and service providers can understand
              exactly what you need.
            </p>

            <div className="guide-step active">
              <span>01</span>

              <div>
                <strong>
                  Basic Information
                </strong>

                <small>
                  Country, title, type and category
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>02</span>

              <div>
                <strong>
                  Requirement Details
                </strong>

                <small>
                  Description, scope and expected work
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>03</span>

              <div>
                <strong>
                  Budget & Processing
                </strong>

                <small>
                  Currency, budget and processing preference
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>04</span>

              <div>
                <strong>
                  Timeline
                </strong>

                <small>
                  Required and preferred completion timeline
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>05</span>

              <div>
                <strong>
                  Human Resources
                </strong>

                <small>
                  Required people, roles and expertise
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>06</span>

              <div>
                <strong>
                  Tools & Resources
                </strong>

                <small>
                  Software, equipment and supporting resources
                </small>
              </div>
            </div>

            <div className="guide-step">
              <span>07</span>

              <div>
                <strong>
                  Location & Communication
                </strong>

                <small>
                  City, address and preferred contact method
                </small>
              </div>
            </div>

            <div className="guide-tip">

              <strong>
                TIP
              </strong>

              <p>
                You can use this form for any type of requirement,
                including products, services, projects, consulting,
                research, construction, marketing, manufacturing,
                events, technical work or other professional needs.
              </p>

            </div>

          </aside>

          {/* =================================================
              CENTER FORM
          ================================================= */}

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

              {/* =============================================
                  01 BASIC INFORMATION
              ============================================= */}

              <div className="form-section-title">
                <span>01</span>
                Basic Information
              </div>

              {/* COUNTRY */}

              <div className="form-group">

                <label>
                  Country *
                </label>

                <input
                  list="hire-country-list"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Search or select your country"
                  autoComplete="country-name"
                  required
                />

                <datalist id="hire-country-list">
                  {COUNTRIES.map(
                    (country) => (
                      <option
                        value={country}
                        key={country}
                      />
                    )
                  )}
                </datalist>

                <small>
                  Select the country where the requirement
                  is located or where the work/service is
                  primarily needed.
                </small>

              </div>

              {/* TITLE */}

              <div className="form-group">

                <label>
                  Requirement Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Website Development, Office Renovation, Marketing Campaign, Research Support"
                  required
                />

                <small>
                  Give your requirement a short, clear and
                  meaningful title that explains what you need.
                </small>

              </div>

              {/* TYPE + CATEGORY */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Requirement Type *
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
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

                  <small>
                    Select the general nature of the requirement,
                    such as a product, service, task, project or
                    professional resource.
                  </small>

                </div>

                <div className="form-group">

                  <label>
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
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

                    <option value="Construction">
                      Construction
                    </option>

                    <option value="Manufacturing">
                      Manufacturing
                    </option>

                    <option value="Education & Training">
                      Education & Training
                    </option>

                    <option value="Events & Management">
                      Events & Management
                    </option>

                    <option value="Professional Services">
                      Professional Services
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                  <small>
                    Select the category that best represents
                    the work, product, service or expertise
                    you need.
                  </small>

                </div>

              </div>

              {/* =============================================
                  02 REQUIREMENT DETAILS
              ============================================= */}

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
                  placeholder={`Describe what you need in your own words.

For example:
• What product, service or work do you need?
• What problem should it solve?
• What features, quality or results do you expect?
• What quantity or scale is required?

You can describe software, construction work, research, marketing,
consulting, manufacturing, design, training, events or any other requirement.`}
                  required
                />

                <small>
                  Explain your actual requirement clearly. Include
                  important expectations, quantity, quality standards,
                  features, outcomes or any information that will help
                  providers understand your need.
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
                  placeholder={`Explain the boundaries and coverage of the work.

For example:
• What should be included?
• Which locations, departments, products or services are covered?
• What is outside the expected scope?
• Are there any limitations or specific conditions?`}
                />

                <small>
                  Define what the provider is expected to cover
                  and mention any boundaries, limitations or
                  important conditions.
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
                  placeholder={`List the main tasks, outputs or results you expect.

Example:
1. Initial planning or requirement analysis
2. Main work / implementation
3. Testing, review or quality checking
4. Final product, service or report
5. Handover, documentation or support

Use the list according to your own requirement.`}
                />

                <small>
                  Mention the main activities and final outputs
                  you expect from the selected provider.
                </small>

              </div>

              {/* =============================================
                  03 BUDGET & PROCESSING
              ============================================= */}

              <div className="form-section-title">
                <span>03</span>
                Budget & Processing
              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Currency *
                  </label>

                  <input
                    list="hire-currency-list"
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    placeholder="Search or select currency"
                    autoComplete="off"
                    required
                  />

                  <datalist id="hire-currency-list">
                    {CURRENCIES.map(
                      (currency) => (
                        <option
                          value={currency}
                          key={currency}
                        />
                      )
                    )}
                  </datalist>

                  <small>
                    Select the currency in which the total
                    budget will be provided.
                  </small>

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
                    placeholder="e.g. 100,000 or budget range"
                    required
                  />

                  <small>
                    Mention the maximum, expected or estimated
                    amount available for the complete requirement.
                  </small>

                </div>

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
                  Choose normal processing if the work can follow
                  the regular timeline, or urgent processing if you
                  need the provider to prioritize the requirement.
                </small>

              </div>

              {/* =============================================
                  04 TIMELINE
              ============================================= */}

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
                    placeholder="e.g. 30 days, 8 weeks, 3 months"
                    required
                  />

                  <small>
                    Mention the normal or required time within
                    which you expect the work to be completed.
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
                    placeholder="e.g. 15 days, 4 weeks or Not Applicable"
                  />

                  <small>
                    If you need the work completed faster than
                    the normal timeline, mention your preferred
                    urgent timeline.
                  </small>

                </div>

              </div>

              {/* =============================================
                  05 HUMAN RESOURCES
              ============================================= */}

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
                  placeholder={`Mention the number and type of people you need.

Example:
• 1 Project Manager
• 2 Technical Specialists
• 1 Designer
• 1 Researcher

You can use any roles relevant to your requirement.`}
                />

                <small>
                  Mention how many people or professionals may
                  be required and what type of work they should handle.
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
                  placeholder={`List the professional roles you expect.

Examples:
Project Manager, Engineer, Consultant, Designer,
Researcher, Marketing Specialist, Accountant, Developer,
Technician, Trainer or any other relevant role.`}
                />

                <small>
                  Mention the roles or professional positions
                  required for your specific work.
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
                  placeholder={`Mention the knowledge, skills or experience required.

Examples:
Technical expertise, industry knowledge, project management,
research skills, design skills, communication skills,
specific certifications, practical experience or other expertise.`}
                />

                <small>
                  Describe the skills, qualifications, knowledge,
                  certifications or experience that would make a
                  provider suitable for your requirement.
                </small>

              </div>

              {/* =============================================
                  06 TOOLS & RESOURCES
              ============================================= */}

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
                  placeholder={`Mention any specific tools, software, platforms or systems.

Examples:
Design software, accounting software, laboratory tools,
project management platforms, engineering software,
communication platforms, development tools or other required systems.

If no specific tool is required, you can write "Not specified".`}
                />

                <small>
                  Mention tools or software that the provider
                  must already have or use to complete the requirement.
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
                  placeholder={`Mention any physical equipment, facilities or materials needed.

Examples:
Machinery, laboratory equipment, cameras, vehicles,
construction equipment, office facilities, computers,
production equipment or other physical resources.`}
                />

                <small>
                  Mention physical equipment, facilities, machinery,
                  devices or materials needed for the work.
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
                  placeholder={`Mention anything else the provider may need.

Examples:
Reference material, documents, data, access permissions,
special materials, licenses, transportation, support staff,
brand information or other supporting resources.`}
                />

                <small>
                  Add any additional information, materials,
                  support or resources that are important for
                  completing the requirement.
                </small>

              </div>

              {/* =============================================
                  07 LOCATION & COMMUNICATION
              ============================================= */}

              <div className="form-section-title">
                <span>07</span>
                Location & Communication
              </div>

              <div className="form-group">

                <label>
                  Required City *
                </label>

                <input
                  list="hire-city-list"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={
                    cityLoading
                      ? "Loading cities..."
                      : cities.length > 0
                      ? "Search or select city"
                      : "Enter city manually"
                  }
                  autoComplete="address-level2"
                  required
                />

                <datalist id="hire-city-list">

                  {cities.map(
                    (city) => (
                      <option
                        value={city}
                        key={city}
                      />
                    )
                  )}

                </datalist>

                {cityLoading && (
                  <small>
                    Loading cities for{" "}
                    {formData.country}...
                  </small>
                )}

                {!cityLoading &&
                  cityError && (
                    <small>
                      {cityError}
                    </small>
                  )}

                {!cityLoading &&
                  !cityError &&
                  cities.length > 0 && (
                    <small>
                      Cities are based on your selected country:
                      <strong>
                        {" "}
                        {formData.country}
                      </strong>
                      . You can search the list or enter another
                      city manually if needed.
                    </small>
                  )}

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
                  placeholder={`Enter detailed location information if needed.

Examples:
Office address, project site, building, area,
industrial zone, institution, venue or other relevant location details.`}
                />

                <small>
                  Provide the complete address or detailed location
                  only when it is relevant to the requirement.
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
                  required
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
                  Select the communication method you prefer for
                  discussing the requirement, receiving updates
                  and coordinating with providers.
                </small>

              </div>

              {/* =============================================
                  08 DOCUMENTS
              ============================================= */}

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

                    {files.map(
                      (file, index) => (
                        <div
                          className="uploaded-file-item"
                          key={index}
                        >

                          <span>
                            {file.name}
                          </span>

                          <small>
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </small>

                        </div>
                      )
                    )}

                  </div>
                )}

                <small>
                  Upload specifications, reference documents,
                  quotations, drawings, images, reports,
                  requirements or any other useful supporting files.
                </small>

              </div>

              {/* =============================================
                  09 UPDATES
              ============================================= */}

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
                  Choose how often you would like to receive
                  requirement or project updates from the provider.
                </small>

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

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
                  {isSubmitting
                    ? "Submitting..."
                    : "Post Requirement →"}
                </button>

              </div>

            </form>

          </div>

          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}

          <aside className="project-summary">

            <div className="summary-header">

              <div>

                <span>
                  02
                </span>

                <h3>
                  Requirement Summary
                </h3>

              </div>

              <span className="live-label">
                LIVE
              </span>

            </div>

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

            <div className="summary-preview">

              <span>
                REQUIREMENT PREVIEW
              </span>

              <h2>
                {formData.title ||
                  "Your Requirement"}
              </h2>

              <strong>
                {formData.type ||
                  "Product / Service / Project"}
              </strong>

              <p>
                {formData.description ||
                  "Your requirement description will appear here as you fill in the form."}
              </p>

            </div>

            <div className="summary-details">

              <div>
                <span>
                  Country
                </span>

                <strong>
                  {formData.country ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Currency
                </span>

                <strong>
                  {formData.currency ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Type
                </span>

                <strong>
                  {formData.type ||
                    "Not specified"}
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
                  Budget
                </span>

                <strong>
                  {formData.budget
                    ? `${formData.currency} ${formData.budget}`
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
                  Timeline
                </span>

                <strong>
                  {formData.standardTimeline ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  City
                </span>

                <strong>
                  {formData.location ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Human Resources
                </span>

                <strong>
                  {formData.humanResources ||
                    "Not specified"}
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

            <div className="summary-checklist">

              <span>
                BEFORE POSTING
              </span>

              <p>
                ✓ Country selected
              </p>

              <p>
                ✓ Currency selected
              </p>

              <p>
                ✓ Clear requirement title
              </p>

              <p>
                ✓ Requirement type selected
              </p>

              <p>
                ✓ Appropriate category selected
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

      <Footer />

    </div>
  );
}

export default Hire;