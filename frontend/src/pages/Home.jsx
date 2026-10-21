import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loggedIn = localStorage.getItem("hireDeliverLoggedIn");
    const savedUser = localStorage.getItem("hireDeliverUser");

    if (loggedIn === "true") {
      setIsLoggedIn(true);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const services = [
    {
      number: "01",
      title: "ORIC Management System",
      text: "Strengthening ORICs to enhance research, innovation and commercialization capabilities.",
    },
    {
      number: "02",
      title: "Research Commercialization",
      text: "Transforming research into market-ready products, services and solutions.",
    },
    {
      number: "03",
      title: "Intellectual Property Support",
      text: "Protecting and commercializing innovations through IP and patent support.",
    },
    {
      number: "04",
      title: "Technology Transfer",
      text: "Facilitating technology transfer and fostering innovation partnerships.",
    },
    {
      number: "05",
      title: "Cyber Security",
      text: "Comprehensive cybersecurity solutions designed to protect online assets and data.",
    },
    {
      number: "06",
      title: "Software Development",
      text: "Custom software solutions for institutional commercialization portals and databases.",
    },
    {
      number: "07",
      title: "Tendering & Contracting",
      text: "Professional handling of procurement processes and winning bid preparation.",
    },
    {
      number: "08",
      title: "PMO Services",
      text: "Certified professionals delivering outsourced PMO and business analysis services.",
    },
  ];

  const benefits = [
    {
      icon: "✦",
      title: "End-to-End Innovation Support",
      text: "From idea to commercialization.",
    },
    {
      icon: "✓",
      title: "Professional Training",
      text: "Delivered by certified experts.",
    },
    {
      icon: "◈",
      title: "Industry-Academia Collaboration",
      text: "Connecting research with industry needs.",
    },
    {
      icon: "⌘",
      title: "Digital Innovation Platform",
      text: "Driving efficiency through technology.",
    },
    {
      icon: "↗",
      title: "Capacity Building & Advisory",
      text: "Empowering innovation and growth.",
    },
  ];

  return (
    <div className="app">

      {/* NAVBAR */}
      <Navbar />


      {/* =========================================
          HOME CONTENT
      ========================================= */}

      <main className="home-page">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="modern-hero" id="home">

          <div className="hero-grid"></div>

          <div className="hero-glow hero-glow-one"></div>
          <div className="hero-glow hero-glow-two"></div>

          <div className="hero-content-modern">

            <div className="company-pill">
              <span className="pill-dot"></span>
              Technology Commercialization Centre International
            </div>

            <p className="hero-overline">
              INNOVATION • TECHNOLOGY • COMMERCIALIZATION
            </p>

            <h1>
              Transform Ideas
              <br />
              Into <span>Real Impact.</span>
            </h1>

            <p className="hero-description">
              Hire skilled teams for your requirements or deliver your own
              project ideas to people who need them. HireDeliver connects
              opportunities with the people and teams who can make them happen.
            </p>

            <div className="hero-buttons-modern">

              <Link to="/hire" className="hero-primary-btn">
                <span>Post a Requirement</span>
                <b>→</b>
              </Link>

              <Link to="/deliver" className="hero-secondary-btn">
                <span>Deliver a Project</span>
                <b>↗</b>
              </Link>

            </div>

            <div className="hero-trust">

              <div>
                <strong>HIRE</strong>
                <span>Find the right team</span>
              </div>

              <div className="trust-line"></div>

              <div>
                <strong>DELIVER</strong>
                <span>Turn ideas into solutions</span>
              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="visual-card visual-card-main">

              <div className="visual-card-top">
                <span className="visual-label">HIREDELIVER</span>
                <span className="visual-status">● LIVE</span>
              </div>

              <div className="visual-icon">
                <span>↗</span>
              </div>

              <h3>
                Ideas.
                <br />
                Teams.
                <br />
                <span>Impact.</span>
              </h3>

              <div className="visual-line"></div>

              <p>
                Connecting people who need solutions with teams ready to
                build, provide and deliver them.
              </p>

            </div>

            <div className="floating-card floating-card-one">
              <span>01</span>
              <strong>Hire</strong>
              <small>Post your requirement</small>
            </div>

            <div className="floating-card floating-card-two">
              <span>02</span>
              <strong>Deliver</strong>
              <small>Propose your solution</small>
            </div>

          </div>

        </section>


        {/* =========================================
            INTRO / PLATFORM
        ========================================= */}

        <section className="platform-intro">

          <div className="intro-label">
            <span></span>
            THE HIREDELIVER PLATFORM
          </div>

          <div className="intro-content">

            <h2>
              One platform.
              <br />
              <span>Two powerful possibilities.</span>
            </h2>

            <div className="intro-text">

              <p>
                HireDeliver creates a bridge between people who need products
                or services and teams who have the expertise to deliver them.
              </p>

              <p>
                Whether you are looking to hire someone for a requirement or
                want to present a project your team can complete, the platform
                provides a simple and structured way to connect opportunities.
              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            HIRE / DELIVER
        ========================================= */}

        <section className="opportunity-section">

          <div className="section-topline">

            <div>
              <span className="section-number">01</span>
              <span className="section-label">CHOOSE YOUR PATH</span>
            </div>

            <p>
              Start where your opportunity begins.
            </p>

          </div>

          <div className="opportunity-grid">

            <div className="opportunity-card opportunity-deliver">

              <div className="opportunity-number">01</div>

              <div className="opportunity-icon">
                ↗
              </div>

              <span className="opportunity-tag">
                FOR TEAMS & PROFESSIONALS
              </span>

              <h3>
                Have an idea?
                <br />
                <span>Deliver it.</span>
              </h3>

              <p>
                Propose a project, product or service that your team can
                successfully complete. Define your scope, cost, timeline and
                team members.
              </p>

              <div className="opportunity-list">
                <span>✓ Propose your own project</span>
                <span>✓ Define scope & deliverables</span>
                <span>✓ Set cost & timeline</span>
                <span>✓ Add your team members</span>
              </div>

              <Link to="/deliver" className="opportunity-button">
                Start Delivering
                <span>→</span>
              </Link>

            </div>


            <div className="opportunity-card opportunity-hire">

              <div className="opportunity-number">02</div>

              <div className="opportunity-icon">
                +
              </div>

              <span className="opportunity-tag">
                FOR CLIENTS & ORGANIZATIONS
              </span>

              <h3>
                Need something?
                <br />
                <span>Hire someone.</span>
              </h3>

              <p>
                Post any requirement, whether it is a product or service.
                Add your budget, location and timeline to clearly communicate
                what you need.
              </p>

              <div className="opportunity-list">
                <span>✓ Post any requirement</span>
                <span>✓ Request products or services</span>
                <span>✓ Set budget & location</span>
                <span>✓ Define your timeline</span>
              </div>

              <Link to="/hire" className="opportunity-button">
                Start Hiring
                <span>→</span>
              </Link>

            </div>

          </div>

        </section>


        {/* =========================================
            HOW IT WORKS
        ========================================= */}

        <section className="process-section">

          <div className="process-heading">

            <div>
              <span className="section-number">02</span>
              <span className="section-label">HOW IT WORKS</span>
            </div>

            <h2>
              Simple process.
              <br />
              <span>Meaningful results.</span>
            </h2>

          </div>

          <div className="process-grid">

            <div className="process-item">
              <span className="process-number">01</span>
              <div className="process-icon">+</div>
              <h3>Define</h3>
              <p>
                Clearly describe your requirement or the project you want
                to deliver.
              </p>
            </div>

            <div className="process-connector"></div>

            <div className="process-item">
              <span className="process-number">02</span>
              <div className="process-icon">◎</div>
              <h3>Connect</h3>
              <p>
                Bring requirements and capable teams together through a
                structured platform.
              </p>
            </div>

            <div className="process-connector"></div>

            <div className="process-item">
              <span className="process-number">03</span>
              <div className="process-icon">↗</div>
              <h3>Deliver</h3>
              <p>
                Move from opportunity to execution with clear scope,
                timelines and expectations.
              </p>
            </div>

          </div>

        </section>


        {/* =========================================
            ABOUT COMPANY
        ========================================= */}

        <section className="company-about" id="about">

          <div className="about-visual">

            <div className="about-pattern"></div>

            <div className="about-logo-box">

              <span className="about-logo-small">
                TCCI
              </span>

              <strong>
                TECHNOLOGY
                <br />
                COMMERCIALIZATION
              </strong>

              <small>
                CENTRE INTERNATIONAL
              </small>

            </div>

            <div className="about-side-text">
              INNOVATION
              <br />
              ECOSYSTEM
            </div>

          </div>

          <div className="about-content">

            <div className="intro-label">
              <span></span>
              ABOUT THE ORGANIZATION
            </div>

            <h2>
              Transforming research,
              <br />
              <span>innovation & technology</span>
              <br />
              into impact.
            </h2>

            <p className="about-lead">
              Technology Commercialization Centre International (TCCI)
              works to bridge the gap between academia, industry, government
              and investors to transform ideas into market-ready solutions.
            </p>

            <p>
              Through innovation support, commercialization, technology
              transfer, software development, cybersecurity, professional
              training and advisory services, TCCI supports organizations
              in moving ideas from concept toward practical impact.
            </p>

            <div className="about-highlight">
              <span>“</span>

              <p>
                Creating a sustainable innovation ecosystem that drives
                technology commercialization, enhances competitiveness
                and delivers meaningful impact.
              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            SERVICES
        ========================================= */}

        <section className="services-section" id="services">

          <div className="services-heading">

            <div>
              <span className="section-number">03</span>
              <span className="section-label">OUR SERVICES</span>
            </div>

            <h2>
              Expertise built around
              <br />
              <span>innovation & growth.</span>
            </h2>

            <p>
              TCCI provides a range of professional services supporting
              research, technology, commercialization and digital
              transformation.
            </p>

          </div>

          <div className="services-grid">

            {services.map((service) => (
              <div
                className="service-card"
                key={service.number}
              >

                <div className="service-top">
                  <span>{service.number}</span>
                  <b>↗</b>
                </div>

                <h3>{service.title}</h3>

                <p>{service.text}</p>

                <div className="service-line"></div>

              </div>
            ))}

          </div>

        </section>


        {/* =========================================
            WHY CHOOSE US
        ========================================= */}

        <section className="benefits-section">

          <div className="benefits-left">

            <div className="intro-label">
              <span></span>
              WHY CHOOSE US
            </div>

            <h2>
              Built for
              <br />
              <span>meaningful impact.</span>
            </h2>

            <p>
              From innovation support to digital solutions, our approach
              focuses on connecting expertise, technology and opportunity.
            </p>

            <div className="benefits-quote">
              <span>“</span>

              <p>
                From idea to commercialization, we help build the ecosystem
                around innovation.
              </p>

            </div>

          </div>

          <div className="benefits-right">

            {benefits.map((benefit, index) => (
              <div
                className="benefit-row"
                key={benefit.title}
              >

                <div className="benefit-icon">
                  {benefit.icon}
                </div>

                <div>

                  <span className="benefit-index">
                    0{index + 1}
                  </span>

                  <h3>{benefit.title}</h3>

                  <p>{benefit.text}</p>

                </div>

              </div>
            ))}

          </div>

        </section>


        {/* =========================================
            FINAL CTA
        ========================================= */}

        <section className="final-cta">

          <div className="cta-grid"></div>

          <div className="cta-content">

            <span className="cta-label">
              LET'S BUILD THE FUTURE TOGETHER
            </span>

            <h2>
              Have a requirement?
              <br />
              <span>Have something to deliver?</span>
            </h2>

            <p>
              Start your journey with HireDeliver and turn opportunities
              into action.
            </p>

            <div className="cta-buttons">

              <Link to="/hire" className="cta-primary">
                Post a Requirement →
              </Link>

              <Link to="/deliver" className="cta-secondary">
                Propose a Project ↗
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default Home;