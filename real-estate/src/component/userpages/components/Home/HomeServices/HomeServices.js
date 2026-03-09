import React from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaHandshake,
  FaLandmark,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import "./HomeServices.css";

const HomeServices = () => {
  const services = [
    {
      icon: <FaBuilding />,
      title: "Property Acquisition",
      description:
        "Expert guidance in acquiring residential and commercial properties.",
      features: ["Market Analysis", "Due Diligence", "Negotiation Support"],
    },
    {
      icon: <FaLandmark />,
      title: "Land Banking",
      description:
        "Strategic land investment opportunities with high growth potential.",
      features: ["Feasibility Studies", "Zoning Analysis", "ROI Projections"],
    },
    {
      icon: <FaHandshake />,
      title: "Realty Advisory",
      description:
        "Professional consultation for property development and portfolio management.",
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
        "Tailored investment strategies for maximizing returns on real estate.",
      features: ["Asset Management", "Exit Strategies", "Performance Tracking"],
    },
    {
      icon: <FaShieldAlt />,
      title: "Legal & Compliance",
      description:
        "Comprehensive legal support for smooth property transactions.",
      features: [
        "Documentation",
        "Title Verification",
        "Regulatory Compliance",
      ],
    },
    {
      icon: <FaUsers />,
      title: "Client Advisory",
      description: "Personalized guidance throughout your property journey.",
      features: [
        "1-on-1 Consultation",
        "Market Updates",
        "After-Sales Support",
      ],
    },
  ];

  return (
    <section className="home-services">
      <div className="home-container">
        <div className="home-section-header" data-aos="fade-up">
          <span className="home-section-tag">What We Offer</span>
          <h2 className="home-section-title">Comprehensive Realty Solutions</h2>
          <p className="home-section-text">
            End-to-end professional services tailored to meet your property
            needs
          </p>
        </div>

        <div className="home-services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="home-service-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="home-service-icon-wrapper">
                <div className="home-service-icon">{service.icon}</div>
              </div>
              <h3 className="home-service-title">{service.title}</h3>
              <p className="home-service-description">{service.description}</p>
              <ul className="home-service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <FaCheckCircle className="home-feature-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/services" className="home-service-link">
                Learn More <FaArrowRight className="home-link-icon" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
