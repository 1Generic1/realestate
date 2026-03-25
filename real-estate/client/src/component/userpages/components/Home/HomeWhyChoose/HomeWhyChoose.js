import React from "react";
import { FaAward, FaUsers, FaHeart, FaStar, FaShieldAlt } from "react-icons/fa";
import "./HomeWhyChoose.css";

const HomeWhyChoose = () => {
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

  return (
    <section className="home-why-choose">
      <div className="home-container">
        <div className="home-why-wrapper">
          <div className="home-why-content" data-aos="fade-right">
            <span className="home-section-tag">Why Choose Us</span>
            <h2 className="home-section-title">Your Success is Our Priority</h2>
            <p className="home-why-text">
              We combine deep industry knowledge with a personalized approach to
              deliver exceptional results for every client. Our commitment to
              excellence sets us apart.
            </p>

            <div className="home-why-grid">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="home-why-item">
                  <div className="home-why-icon">{item.icon}</div>
                  <div className="home-why-item-text">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="home-trust-badge">
              <FaShieldAlt className="home-shield-icon" />
              <div>
                <strong>100% Trust & Transparency</strong>
                <p>Licensed and regulated real estate professionals</p>
              </div>
            </div>
          </div>

          <div className="home-why-image" data-aos="fade-left">
            <div className="home-image-grid">
              <div className="home-image-item home-image-main">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Professional Team"
                />
              </div>
              <div className="home-image-item home-image-small">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Meeting"
                />
              </div>
              <div className="home-image-item home-image-small">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Handshake"
                />
              </div>
            </div>
            <div className="home-experience-badge">
              <span className="home-years">15+</span>
              <span className="home-years-text">Years of Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeWhyChoose;
