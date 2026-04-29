import React, { useState } from "react";
import {
  FaSearch,
  FaHome,
  FaBuilding,
  FaTree,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./BuyHero.css";

const BuyHero = ({ onSearch, onPropertyTypeFilter, onPriceFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching:", { searchTerm, propertyType, priceRange });

    if (onSearch) {
      onSearch(searchTerm);
    }

    if (onPropertyTypeFilter) {
      onPropertyTypeFilter(propertyType);
    }

    if (onPriceFilter) {
      onPriceFilter(priceRange);
    }
  };

  const handleQuickFilter = (type, value) => {
    if (type === "propertyType") {
      setPropertyType(value);
      if (onPropertyTypeFilter) {
        onPropertyTypeFilter(value);
      }
    } else if (type === "price") {
      setPriceRange(value);
      if (onPriceFilter) {
        onPriceFilter(value);
      }
    } else if (type === "search") {
      setSearchTerm(value);
      if (onSearch) {
        onSearch(value);
      }
    }

    setTimeout(() => {
      if (onSearch) onSearch(searchTerm || value);
      if (onPropertyTypeFilter) onPropertyTypeFilter(propertyType || value);
      if (onPriceFilter) onPriceFilter(priceRange || value);
    }, 100);
  };

  const getPriceRangeValue = (range) => {
    switch (range) {
      case "0-20m":
        return "0-20000000";
      case "20-50m":
        return "20000000-50000000";
      case "50-100m":
        return "50000000-100000000";
      case "100m+":
        return "100000000+";
      default:
        return "all";
    }
  };

  return (
    <section className="buyhero-section">
      <div className="buyhero-overlay"></div>
      <div className="buyhero-container">
        <div className="buyhero-content" data-aos="fade-up">
          <div className="buyhero-icon-wrapper">
            <FaHome className="buyhero-icon pulse-animation" />
          </div>
          <h1 className="buyhero-title">
            Find Your <span className="buyhero-gold-text">Dream Property</span>
          </h1>
          <p className="buyhero-text">
            Discover thousands of properties for sale across Nigeria. From
            luxury homes to commercial spaces.
          </p>

          <form onSubmit={handleSearch} className="buyhero-search-form">
            <div className="buyhero-search-main">
              <div className="buyhero-search-input-wrapper">
                <FaSearch className="buyhero-search-icon" />
                <input
                  type="text"
                  placeholder="Search by location, property name or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="buyhero-search-input"
                />
              </div>
              <button type="submit" className="buyhero-search-btn">
                Search
              </button>
            </div>

            <div className="buyhero-search-filters">
              <div className="buyhero-filter-group">
                <select
                  value={propertyType}
                  onChange={(e) => {
                    setPropertyType(e.target.value);
                    if (onPropertyTypeFilter) {
                      onPropertyTypeFilter(e.target.value);
                    }
                  }}
                  className="buyhero-filter-select"
                >
                  <option value="">Property Type</option>
                  <option value="house">Houses</option>
                  <option value="apartment">Apartments</option>
                  <option value="flat">Flats</option>
                  <option value="duplex">Duplex</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              <div className="buyhero-filter-group">
                <select
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                    if (onPriceFilter) {
                      onPriceFilter(getPriceRangeValue(e.target.value));
                    }
                  }}
                  className="buyhero-filter-select"
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

          <div className="buyhero-quick-filters">
            <span className="buyhero-quick-filters-label">Popular:</span>
            <button
              className="buyhero-quick-filter-btn"
              onClick={() => handleQuickFilter("propertyType", "house")}
            >
              <FaHome /> Houses
            </button>
            <button
              className="buyhero-quick-filter-btn"
              onClick={() => handleQuickFilter("propertyType", "apartment")}
            >
              <FaBuilding /> Apartments
            </button>
            <button
              className="buyhero-quick-filter-btn"
              onClick={() => handleQuickFilter("propertyType", "land")}
            >
              <FaTree /> Lands
            </button>
            <button
              className="buyhero-quick-filter-btn"
              onClick={() => handleQuickFilter("search", "Lekki")}
            >
              <FaMapMarkerAlt /> Lekki
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyHero;