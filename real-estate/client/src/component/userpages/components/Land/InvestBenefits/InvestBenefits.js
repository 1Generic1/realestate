import React from "react";
import {
  FaChartLine,
  FaShieldAlt,
  FaBuilding,
  FaTree,
  FaArrowUp,
  FaCheckCircle,
} from "react-icons/fa";
import "./InvestBenefits.css";

const InvestBenefits = () => {
  const benefits = [
    {
      icon: <FaChartLine />,
      title: "High Appreciation",
      description:
        "Land values typically appreciate 10-15% annually in prime locations",
      stats: "+12.5% avg. return",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Investment",
      description:
        "Tangible asset with permanent value that never depreciates like buildings",
      stats: "100% asset security",
    },
    {
      icon: <FaBuilding />,
      title: "Development Potential",
      description:
        "Flexibility to build residential, commercial, or mixed-use properties",
      stats: "3x value potential",
    },
    {
      icon: <FaTree />,
      title: "Scarcity Value",
      description:
        "Land is a finite resource that becomes more valuable over time",
      stats: "Limited availability",
    },
  ];

  const testimonials = [
    {
      quote:
        "I invested in land through TAYE'S PROPERTY 5 years ago. Today it's worth 3x what I paid.",
      name: "Chief Obiora Eze",
      role: "Real Estate Investor",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote:
        "Their market insights helped me secure prime land that's perfect for my development project.",
      name: "Mrs. Folake Williams",
      role: "Property Developer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <section className="invest-benefits-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Why Invest in Land</span>
          <h2 className="section-title">Smart Investment, Solid Returns</h2>
          <p className="section-description">
            Land remains one of the most secure and profitable investment
            options in Nigeria
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="benefit-icon-wrapper">
                <div className="benefit-icon">{benefit.icon}</div>
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
              <div className="benefit-stats">
                <FaArrowUp className="stats-arrow" />
                <span className="stats-value">{benefit.stats}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="market-stats" data-aos="fade-up">
          <div className="stat-box">
            <span className="stat-number">15-20%</span>
            <span className="stat-label">Annual Appreciation</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">₦50B+</span>
            <span className="stat-label">Land Market Value</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">500+</span>
            <span className="stat-label">Successful Deals</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
        </div>

        <div className="testimonials-container" data-aos="fade-up">
          <h3 className="testimonials-heading">What Our Investors Say</h3>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
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
      </div>
    </section>
  );
};

export default InvestBenefits;
