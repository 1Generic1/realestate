import React from "react";
import "./AboutHero.css";

const AboutHero = () => {
  return (
    <section className="about-hero">
      <div className="about-hero-overlay"></div>
      <div className="container">
        <div className="about-hero-content">
          <div className="about-hero-badge">Who We Are</div>
          <h1 className="about-hero-title">
            Crafting <span className="gold-text">Real Estate Excellence</span>{" "}
            Since 2011
          </h1>
          <p className="about-hero-text">
            TAYE'S PROPERTY & REALTY SOLUTIONS has been at the forefront of
            Nigeria's real estate industry, providing unparalleled expertise and
            service to clients seeking premium property solutions.
          </p>
          <div className="about-hero-stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">850+</span>
              <span className="stat-label">Properties</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
