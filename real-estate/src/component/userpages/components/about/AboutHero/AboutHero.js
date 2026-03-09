import React from "react";
import "./AboutHero.css";

const AboutHero = () => {
  return (
    <section className="about-hero">
      <div className="about-hero-overlay"></div>
      <div className="about-container">
        <div className="about-hero-content" data-aos="fade-up">
          <span
            className="about-hero-badge"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Who We Are
          </span>
          <h1
            className="about-hero-title"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Crafting{" "}
            <span className="about-gold-text">Real Estate Excellence</span>{" "}
            Since 2011
          </h1>
          <p
            className="about-hero-text"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            TAYE'S PROPERTY & REALTY SOLUTIONS has been at the forefront of
            Nigeria's real estate industry, providing unparalleled expertise and
            service to clients seeking premium property solutions.
          </p>
          <div
            className="about-hero-stats"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="about-stat-item">
              <span className="about-stat-number">15+</span>
              <span className="about-stat-label">Years</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">500+</span>
              <span className="about-stat-label">Clients</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-number">850+</span>
              <span className="about-stat-label">Properties</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
