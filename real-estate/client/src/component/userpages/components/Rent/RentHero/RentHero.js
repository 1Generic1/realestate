import React, { useState } from "react";
import {
  FaKey,
  FaMapMarkerAlt,
  FaDollarSign,
  FaBuilding,
  FaSearch,
} from "react-icons/fa";
import "./RentHero.css";

const RentHero = () => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    budget: "",
    type: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching rentals:", searchParams);
  };

  return (
    <section className="rent-hero">
      <div className="rent-hero-overlay"></div>

      <div className="rent-container">
        <div
          className="rent-hero-content"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          {/* Animated Icon */}
          <div className="rent-hero-icon-wrapper">
            <div className="rent-hero-icon-glow">
              <FaKey className="rent-hero-icon" />
            </div>
          </div>

          {/* Text Content */}
          <span
            className="rent-hero-badge"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Find Your Perfect Rental
          </span>
          <h1
            className="rent-hero-title"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover <span className="rent-hero-highlight">Your Next Home</span>
          </h1>
          <p
            className="rent-hero-subtitle"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Explore premium rental properties in prime locations. From luxury
            apartments to cozy flats, we've got you covered.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="rent-hero-form"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="rent-form-group">
              <FaMapMarkerAlt className="rent-form-icon" />
              <input
                type="text"
                placeholder="Location"
                value={searchParams.location}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, location: e.target.value })
                }
                className="rent-form-input"
              />
            </div>

            <div className="rent-form-group">
              <FaDollarSign className="rent-form-icon" />
              <select
                value={searchParams.budget}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, budget: e.target.value })
                }
                className="rent-form-select"
              >
                <option value="">Budget</option>
                <option value="0-3m">₦0 - ₦3M/year</option>
                <option value="3-6m">₦3M - ₦6M/year</option>
                <option value="6-10m">₦6M - ₦10M/year</option>
                <option value="10m+">₦10M+/year</option>
              </select>
            </div>

            <div className="rent-form-group">
              <FaBuilding className="rent-form-icon" />
              <select
                value={searchParams.type}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, type: e.target.value })
                }
                className="rent-form-select"
              >
                <option value="">Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="flat">Flat</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <button type="submit" className="rent-form-button">
              <FaSearch className="rent-button-icon" />
              Search
            </button>
          </form>

          {/* Stats */}
          <div
            className="rent-hero-stats"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="rent-stat-item">
              <span className="rent-stat-number">500+</span>
              <span className="rent-stat-label">Properties</span>
            </div>
            <div className="rent-stat-dot"></div>
            <div className="rent-stat-item">
              <span className="rent-stat-number">24h</span>
              <span className="rent-stat-label">Response</span>
            </div>
            <div className="rent-stat-dot"></div>
            <div className="rent-stat-item">
              <span className="rent-stat-number">100%</span>
              <span className="rent-stat-label">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentHero;
