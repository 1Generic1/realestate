import React from "react";
import { FaShieldAlt, FaHandshake, FaBolt } from "react-icons/fa";
import "./WhyRentWithUs.css";

const WhyRentWithUs = () => {
  const benefits = [
    {
      icon: <FaShieldAlt />,
      title: "Verified Listings",
      description:
        "All properties are verified for authentic documentation and quality",
    },
    {
      icon: <FaHandshake />,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises or hidden charges",
    },
    {
      icon: <FaBolt />,
      title: "Quick Response",
      description: "Get responses within 24 hours to all your inquiries",
    },
  ];

  return (
    <section className="rent-why">
      <div className="rent-container">
        <div className="rent-why-grid">
          {/* Left Content */}
          <div className="rent-why-content" data-aos="fade-right">
            <span className="rent-why-tag">Why Choose Us</span>
            <h2 className="rent-why-title">Rent with Confidence</h2>
            <p className="rent-why-text">
              We make renting simple, transparent, and stress-free. Our
              commitment to quality ensures you find the perfect home.
            </p>
          </div>

          {/* Right Benefits */}
          <div className="rent-benefits-grid">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rent-benefit-card"
                data-aos="fade-left"
                data-aos-delay={index * 100}
              >
                <div className="rent-benefit-icon-wrapper">
                  <div className="rent-benefit-icon">{benefit.icon}</div>
                </div>
                <h3 className="rent-benefit-title">{benefit.title}</h3>
                <p className="rent-benefit-description">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyRentWithUs;
