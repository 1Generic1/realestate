import React from "react";
import LandCard from "../LandCard/LandCard";
import "./FeaturedLand.css";

const FeaturedLand = ({ featuredLands = [], loading = false }) => {
  if (loading) {
    return (
      <section className="featured-land-section">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading featured lands...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredLands || featuredLands.length === 0) {
    return null;
  }

  return (
    <section className="featured-land-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Featured Properties</span>
          <h2 className="section-title">Premium Land Listings</h2>
          <p className="section-description">
            Hand-picked land opportunities with high growth potential
          </p>
        </div>

        <div className="featured-grid">
          {featuredLands.map((land, index) => (
            <LandCard key={land._id} land={land} index={index} />
          ))}
        </div>

        <div className="view-all-wrapper" data-aos="fade-up">
          <button
            className="view-all-btn"
            onClick={() => (window.location.href = "/land")}
          >
            View All Land Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLand;
