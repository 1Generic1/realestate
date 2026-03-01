import React from "react";
import "./AgentsHero.css";

const AgentsHero = () => {
  return (
    <section className="agents-hero">
      <div className="agents-hero-overlay"></div>
      <div className="container">
        <div className="agents-hero-content" data-aos="fade-up">
          <span className="agents-hero-badge">Our Expert Team</span>
          <h1 className="agents-hero-title">
            Meet Our <span className="gold-text">Professional Agents</span>
          </h1>
          <p className="agents-hero-text">
            Dedicated real estate professionals committed to helping you find
            the perfect property with expertise and personalized service.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AgentsHero;
