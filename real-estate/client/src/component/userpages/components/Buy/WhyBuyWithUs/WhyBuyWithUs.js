import React from "react";
import {
  FaShieldAlt,
  FaHandshake,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import "./WhyBuyWithUs.css";

const WhyBuyWithUs = () => {
  const benefits = [
    {
      icon: <FaShieldAlt className="whybuy-icon" />,
      title: "Secure Transactions",
      description:
        "All transactions are legally vetted and secure with proper documentation.",
      stats: "100% Secure",
    },
    {
      icon: <FaHandshake className="whybuy-icon" />,
      title: "Trusted Advisors",
      description: "15+ years of experience in Nigerian real estate market.",
      stats: "500+ Happy Clients",
    },
    {
      icon: <FaChartLine className="whybuy-icon" />,
      title: "Best Returns",
      description:
        "Properties with proven appreciation and high ROI potential.",
      stats: "25% Avg. ROI",
    },
  ];

  return (
    <section className="whybuy-section-wrapper">
      <div className="whybuy-container">
        <div className="whybuy-header" data-aos="fade-up">
          <span className="whybuy-badge">Why Choose Us</span>
          <h2 className="whybuy-title">
            Why Buy With{" "}
            <span className="whybuy-title-gold">TAYE'S PROPERTY</span>
          </h2>
          <p className="whybuy-description">
            Experience excellence in real estate with our trusted services
          </p>
        </div>

        <div className="whybuy-grid">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="whybuy-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="whybuy-icon-wrapper">{benefit.icon}</div>
              <h3 className="whybuy-card-title">{benefit.title}</h3>
              <p className="whybuy-card-description">{benefit.description}</p>
              <div className="whybuy-stats">
                <FaCheckCircle className="whybuy-stats-check" />
                <span>{benefit.stats}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="whybuy-trust">
          <div className="whybuy-trust-item">
            <span className="whybuy-trust-number">15+</span>
            <span className="whybuy-trust-label">Years Experience</span>
          </div>
          <div className="whybuy-trust-item">
            <span className="whybuy-trust-number">500+</span>
            <span className="whybuy-trust-label">Properties Sold</span>
          </div>
          <div className="whybuy-trust-item">
            <span className="whybuy-trust-number">98%</span>
            <span className="whybuy-trust-label">Client Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBuyWithUs;
