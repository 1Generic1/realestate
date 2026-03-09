import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./AboutCTA.css";

const AboutCTA = () => {
  return (
    <section className="about-cta">
      <div className="about-container">
        <div className="about-cta-wrapper" data-aos="zoom-in">
          <h2 className="about-cta-title" data-aos="fade-up">
            Ready to Work With Us?
          </h2>
          <p className="about-cta-text" data-aos="fade-up" data-aos-delay="100">
            Let's discuss how we can help you achieve your real estate goals
          </p>
          <div
            className="about-cta-buttons"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link
              to="/consultation"
              className="about-cta-btn about-cta-primary"
            >
              Schedule Consultation <FaArrowRight className="about-cta-icon" />
            </Link>
            <Link to="/contact" className="about-cta-btn about-cta-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
