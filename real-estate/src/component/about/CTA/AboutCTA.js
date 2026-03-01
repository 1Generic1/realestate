import React from "react";
import { Link } from "react-router-dom";
import "./AboutCTA.css";

const AboutCTA = () => {
  return (
    <section className="about-cta">
      <div className="container">
        <div className="cta-wrapper">
          <h2>Ready to Work With Us?</h2>
          <p>
            Let's discuss how we can help you achieve your real estate goals
          </p>
          <div className="cta-buttons">
            <Link to="/consultation" className="btn-primary">
              Schedule Consultation
            </Link>
            <Link to="/contact" className="btn-outline light">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
