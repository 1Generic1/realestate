import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCompany } from "../../../../context/CompanyContext";

import {
  FaSearch,
  FaPhone,
  FaUser,
  FaBars,
  FaTimes,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { company, loading, error } = useCompany();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Buy", path: "/buy" },
    //{ label: "Sell", path: "/sell" },
    { label: "Rent", path: "/rent" },
    { label: "Land", path: "/land" },
    { label: "Agents", path: "/agents" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Get dynamic values from backend
  const phoneNumber = company?.phone?.primary || "+234 801 234 5678";
  const emailAddress = company?.email?.general || "info@tayesproperty.com";
  const businessHours = company?.hours?.monday
    ? `Mon-Fri: ${company.hours.monday}`
    : "Mon-Fri: 9AM-6PM";

  const socialLinks = {
    facebook: company?.social?.facebook || "https://facebook.com",
    linkedin: company?.social?.linkedin || "https://linkedin.com",
    instagram: company?.social?.instagram || "https://instagram.com",
  };

  const mobilePhone = company?.phone?.primary || "(555) 123-4567";

  // Show loading state (optional - you can remove if you don't want it)
  if (loading) {
    return (
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div className="contact-info">
                <span>Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      {/* Top Bar - Now with Backend Data */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="contact-info">
              <FaPhone className="icon" />
              <span>{phoneNumber}</span>
              <span className="divider">|</span>
              <span>{emailAddress}</span>
              <span className="divider">|</span>
              <span>{businessHours}</span>
            </div>

            <div className="top-right">
              <Link to="/login" className="login-btn">
                <FaUser className="icon" />
                <span>Client Login</span>
              </Link>
              <div className="social-icons">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-gold">TAYE'S</span>
              <span className="logo-cream">PROPERTY</span>
              <div className="logo-tagline"> & REALTY SOLUTIONS </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="header-actions">
              <button
                className="search-toggle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Toggle search"
              >
                <FaSearch className="icon" />
              </button>

              <Link to="/valuation" className="cta-button">
                <span>Free Valuation</span>
              </Link>

              <button
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="search-bar">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search properties by location, price, or keyword..."
                  className="search-input"
                />
                <button className="search-button">
                  <FaSearch className="icon" />
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Now with Backend Phone Number */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="mobile-contact">
              <div className="contact-item">
                <FaPhone className="icon" />
                <span>{mobilePhone}</span>
              </div>
              <Link
                to="/consultation"
                className="mobile-cta"
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
