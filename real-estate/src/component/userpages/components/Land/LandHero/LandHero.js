import React from "react";
import { FaSearch } from "react-icons/fa";
import "./LandHero.css";

const LandHero = () => {
  return (
    <section className="land-hero">
      <div className="land-hero-overlay"></div>
      <div className="container">
        <div className="land-hero-content" data-aos="fade-up">
          <span className="land-hero-badge">Prime Land Investments</span>
          <h1 className="land-hero-title">
            Discover <span className="gold-text">Premium Land</span>{" "}
            Opportunities
          </h1>
          <p className="land-hero-text">
            Explore residential, commercial, and agricultural land with high
            growth potential. Expert guidance for smart land investments.
          </p>

          <div className="land-search-wrapper">
            <div className="land-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by location, size, or purpose..."
                className="land-search-input"
              />
              <button className="land-search-btn">Search Land</button>
            </div>
          </div>

          <div className="land-quick-stats">
            <div className="quick-stat">
              <span className="stat-value">500+</span>
              <span className="stat-label">Available Plots</span>
            </div>
            <div className="quick-stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Locations</span>
            </div>
            <div className="quick-stat">
              <span className="stat-value">15+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandHero;
