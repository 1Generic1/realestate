import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./LandHero.css";

const LandHero = ({ onSearch, onPriceFilter, selectedPrice }) => {
  const [searchValue, setSearchValue] = useState("");
  const [priceValue, setPriceValue] = useState(selectedPrice || "all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceValue(value);
    if (onPriceFilter) {
      onPriceFilter(value);
    }
  };

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

          <form onSubmit={handleSubmit} className="land-search-wrapper">
            <div className="land-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by location, size, or purpose..."
                className="land-search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="land-search-btn">
                Search Land
              </button>
            </div>

            {/* Price Filter Dropdown */}
            <div className="land-filter-wrapper">
              <select
                className="land-price-filter"
                value={priceValue}
                onChange={handlePriceChange}
              >
                <option value="all">All Prices</option>
                <option value="0-10000000">Under ₦10M</option>
                <option value="10000000-50000000">₦10M - ₦50M</option>
                <option value="50000000-100000000">₦50M - ₦100M</option>
                <option value="100000000-250000000">₦100M - ₦250M</option>
                <option value="250000000+">₦250M+</option>
              </select>
            </div>
          </form>

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
