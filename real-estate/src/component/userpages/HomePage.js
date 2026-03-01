import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaHandshake,
  FaLandmark,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaEye,
  FaBullseye,
  FaAward,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaQuoteRight,
  FaClock,
  FaHeart,
  FaStar,
  FaGem,
  FaHome,
  FaKey,
  FaRegBuilding,
} from "react-icons/fa";
import "./styles/HomePage.css";

const HomePage = () => {
  const [activeVision, setActiveVision] = useState(0);
  const [stats, setStats] = useState({
    years: 0,
    clients: 0,
    properties: 0,
    satisfaction: 0,
  });

  // Animation for stats counter
  useEffect(() => {
    const targetStats = {
      years: 15,
      clients: 500,
      properties: 850,
      satisfaction: 98,
    };

    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setStats({
        years: Math.min(
          Math.floor((targetStats.years / steps) * currentStep),
          targetStats.years,
        ),
        clients: Math.min(
          Math.floor((targetStats.clients / steps) * currentStep),
          targetStats.clients,
        ),
        properties: Math.min(
          Math.floor((targetStats.properties / steps) * currentStep),
          targetStats.properties,
        ),
        satisfaction: Math.min(
          Math.floor((targetStats.satisfaction / steps) * currentStep),
          targetStats.satisfaction,
        ),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const visionItems = [
    {
      icon: <FaEye />,
      title: "Our Vision",
      description:
        "To be the most trusted and innovative real estate solutions provider, setting benchmarks in property excellence across the nation.",
      color: "var(--color-gold)",
    },
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      description:
        "Empowering clients with expert guidance, transparent dealings, and personalized solutions that turn property dreams into reality.",
      color: "var(--color-rose-gold)",
    },
    {
      icon: <FaGem />,
      title: "Our Values",
      description:
        "Integrity, Excellence, Innovation, and Client-Centric Approach in everything we do.",
      color: "var(--color-purple)",
    },
  ];

  const services = [
    {
      icon: <FaBuilding />,
      title: "Property Acquisition",
      description:
        "Expert guidance in acquiring residential and commercial properties that match your investment goals.",
      features: ["Market Analysis", "Due Diligence", "Negotiation Support"],
    },
    {
      icon: <FaLandmark />,
      title: "Land Banking",
      description:
        "Strategic land investment opportunities with high growth potential and comprehensive feasibility studies.",
      features: ["Feasibility Studies", "Zoning Analysis", "ROI Projections"],
    },
    {
      icon: <FaHandshake />,
      title: "Realty Advisory",
      description:
        "Professional consultation for property development, portfolio management, and market entry strategies.",
      features: [
        "Portfolio Strategy",
        "Risk Assessment",
        "Market Intelligence",
      ],
    },
    {
      icon: <FaChartLine />,
      title: "Investment Solutions",
      description:
        "Tailored investment strategies for maximizing returns on real estate assets.",
      features: ["Asset Management", "Exit Strategies", "Performance Tracking"],
    },
    {
      icon: <FaShieldAlt />,
      title: "Legal & Compliance",
      description:
        "Comprehensive legal support ensuring smooth and compliant property transactions.",
      features: [
        "Documentation",
        "Title Verification",
        "Regulatory Compliance",
      ],
    },
    {
      icon: <FaUsers />,
      title: "Client Advisory",
      description:
        "Personalized guidance throughout your property journey, from first inquiry to final handover.",
      features: [
        "1-on-1 Consultation",
        "Market Updates",
        "After-Sales Support",
      ],
    },
  ];

  const whyChooseUs = [
    {
      icon: <FaAward />,
      title: "15+ Years Excellence",
      description: "Decades of experience in the real estate industry",
    },
    {
      icon: <FaUsers />,
      title: "Expert Team",
      description: "Certified professionals with deep market knowledge",
    },
    {
      icon: <FaHeart />,
      title: "Client First Approach",
      description: "Your satisfaction is our top priority",
    },
    {
      icon: <FaStar />,
      title: "Proven Track Record",
      description: "500+ successful transactions and happy clients",
    },
  ];

  const testimonials = [
    {
      name: "Chief Adebayo O.",
      role: "Property Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "TAYE'S PROPERTY transformed our investment approach. Their market insights and professional guidance have been invaluable to our portfolio growth.",
      rating: 5,
    },
    {
      name: "Mrs. Folake Williams",
      role: "Land Investor",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "The team's integrity and expertise in land banking is unmatched. They helped me secure prime property that has appreciated significantly.",
      rating: 5,
    },
    {
      name: "Dr. Michael Okonkwo",
      role: "Commercial Client",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      text: "From consultation to completion, their advisory services were exceptional. Truly a partner you can trust with your real estate dreams.",
      rating: 5,
    },
  ];

  const partners = [
    "Partner 1",
    "Partner 2",
    "Partner 3",
    "Partner 4",
    "Partner 5",
  ];

  return (
    <div className="homepage">
      {/* HERO SECTION - Company Focused */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">Welcome to Excellence</div>
          <h1 className="hero-title">
            Your Trusted Partner in{" "}
            <span className="gold-text">Property & Realty Solutions</span>
          </h1>
          <p className="hero-subtitle">
            With over 15 years of experience, we provide comprehensive real
            estate services backed by integrity, expertise, and a commitment to
            your success.
          </p>

          <div className="hero-cta">
            <Link to="/consultation" className="btn-primary">
              Schedule Consultation <FaArrowRight />
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More About Us
            </Link>
          </div>

          {/* Stats Counter */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.years}+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.clients}+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.properties}+</span>
              <span className="stat-label">Properties Handled</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.satisfaction}%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* VISION/MISSION SECTION */}
      <section className="vision-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Who We Are</span>
            <h2 className="section-title">
              Defining Excellence in Real Estate
            </h2>
            <p className="section-description">
              At TAYE'S PROPERTY & REALTY SOLUTIONS, we don't just transact
              properties – we build lasting relationships and create value for
              our clients.
            </p>
          </div>

          <div className="vision-grid">
            {visionItems.map((item, index) => (
              <div
                key={index}
                className={`vision-card ${activeVision === index ? "active" : ""}`}
                onMouseEnter={() => setActiveVision(index)}
              >
                <div className="vision-icon" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="vision-title">{item.title}</h3>
                <p className="vision-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION - Professional Services */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">What We Offer</span>
            <h2 className="section-title">Comprehensive Realty Solutions</h2>
            <p className="section-description">
              End-to-end professional services tailored to meet your property
              needs
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon-wrapper">
                  <div className="service-icon">{service.icon}</div>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/services" className="service-link">
                  Learn More <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose-section">
        <div className="container">
          <div className="why-choose-wrapper">
            <div className="why-choose-content">
              <span className="section-subtitle">Why Choose Us</span>
              <h2 className="section-title">Your Success is Our Priority</h2>
              <p className="why-choose-text">
                We combine deep industry knowledge with a personalized approach
                to deliver exceptional results for every client. Our commitment
                to excellence sets us apart.
              </p>

              <div className="features-grid">
                {whyChooseUs.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">{feature.icon}</div>
                    <div className="feature-text">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="trust-badge">
                <FaShieldAlt className="shield-icon" />
                <div>
                  <strong>100% Trust & Transparency</strong>
                  <p>Licensed and regulated real estate professionals</p>
                </div>
              </div>
            </div>

            <div className="why-choose-image">
              <div className="image-grid">
                <div className="image-item main">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Professional Team"
                  />
                </div>
                <div className="image-item small">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Meeting"
                  />
                </div>
                <div className="image-item small">
                  <img
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Handshake"
                  />
                </div>
              </div>
              <div className="experience-badge">
                <span className="years">15+</span>
                <span className="text">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Client Stories</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-description">
              Real experiences from those who trusted us with their property
              journey
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <FaQuoteRight className="quote-icon" />
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS / TRUST SECTION */}
      <section className="partners-section">
        <div className="container">
          <div className="partners-wrapper">
            <h3>Trusted by Industry Leaders</h3>
            <div className="partners-grid">
              {partners.map((partner, index) => (
                <div key={index} className="partner-item">
                  <div className="partner-placeholder"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-wrapper">
            <h2 className="cta-title">Ready to Start Your Property Journey?</h2>
            <p className="cta-text">
              Let's discuss how we can help you achieve your real estate goals
              with our expert guidance.
            </p>
            <div className="cta-buttons">
              <Link to="/consultation" className="btn-primary large">
                Schedule Free Consultation
              </Link>
              <Link to="/contact" className="btn-outline light">
                Contact Us Today
              </Link>
            </div>
            <div className="cta-contact">
              <div className="contact-item">
                <FaPhone />
                <span>(555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <span>info@tayesproperty.com</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
