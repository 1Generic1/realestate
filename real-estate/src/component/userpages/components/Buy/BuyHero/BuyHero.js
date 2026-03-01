import React, { useState } from "react";
import {
  FaSearch,
  FaHome,
  FaBuilding,
  FaTree,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./BuyHero.css";

const BuyHero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching:", { searchTerm, propertyType, priceRange });
    // Add search logic here
  };

  return (
    <section className="buy-hero">
      <div className="buy-hero-overlay"></div>
      <div className="container">
        <div className="buy-hero-content" data-aos="fade-up">
          <div className="hero-icon-wrapper">
            <FaHome className="hero-icon pulse-animation" />
          </div>
          <h1 className="buy-hero-title">
            Find Your <span className="gold-text">Dream Property</span>
          </h1>
          <p className="buy-hero-text">
            Discover thousands of properties for sale across Nigeria. From
            luxury homes to commercial spaces.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="search-main">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by location, property name or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>

            <div className="search-filters">
              <div className="filter-group">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Property Type</option>
                  <option value="house">Houses</option>
                  <option value="flat">Flats/Apartments</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="filter-group">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Price Range</option>
                  <option value="0-20m">₦0 - ₦20M</option>
                  <option value="20-50m">₦20M - ₦50M</option>
                  <option value="50-100m">₦50M - ₦100M</option>
                  <option value="100m+">₦100M+</option>
                </select>
              </div>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="quick-filters">
            <span className="quick-filters-label">Popular:</span>
            <button className="quick-filter-btn">
              <FaHome /> Houses
            </button>
            <button className="quick-filter-btn">
              <FaBuilding /> Flats
            </button>
            <button className="quick-filter-btn">
              <FaTree /> Lands
            </button>
            <button className="quick-filter-btn">
              <FaMapMarkerAlt /> Lekki
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyHero;
