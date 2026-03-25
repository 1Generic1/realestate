import React from "react";
import {
  FaShieldAlt,
  FaHandshake,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import "./WhyBuyWithUs.css";

const WhyBuyWithUs = () => {
  const benefits = [
    {
      icon: <FaShieldAlt />,
      title: "Verified Listings",
      description: "All properties are verified for authentic documentation",
      stats: "5,000+",
      animation: "glow-animation",
    },
    {
      icon: <FaHandshake />,
      title: "Best Price Guarantee",
      description: "We negotiate the best deals for our clients",
      stats: "₦2B+ saved",
      animation: "scale-animation",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Flexible Payment",
      description: "Multiple payment options and mortgage assistance",
      stats: "15+ partners",
      animation: "swing-animation",
    },
  ];

  return (
    <section className="why-buy-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Why Choose Us</span>
          <h2 className="section-title">Buy with Confidence</h2>
          <p className="section-description">
            We make your property purchase safe, transparent, and hassle-free
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`benefit-card ${benefit.animation}`}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="benefit-icon-wrapper">
                <div className="benefit-icon">{benefit.icon}</div>
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
              <div className="benefit-stats">
                <FaCheckCircle className="stats-check" />
                <span>{benefit.stats}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="trust-badges" data-aos="fade-up">
          <div className="badge">
            <span className="badge-number">15+</span>
            <span className="badge-text">Years Experience</span>
          </div>
          <div className="badge">
            <span className="badge-number">5,000+</span>
            <span className="badge-text">Happy Clients</span>
          </div>
          <div className="badge">
            <span className="badge-number">98%</span>
            <span className="badge-text">Satisfaction Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBuyWithUs;
