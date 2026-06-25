//this is not the header used navigate to component/userpages/components/Header/Header.js for the header used in the website  
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
import "./styles/Header.css";

const Header = () => {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { label: "Homess", path: "/" },
    { label: "Buys", path: "/buy" },
    //{ label: "Sell", path: "/sell" },
    { label: "Rent", path: "/rent" },
    { label: "Land", path: "/land" },
    { label: "Agents", path: "/agents" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // ✅ Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="contact-info">
              <FaPhone className="icon" />
              <span>(xxx) xxxx-4567</span>
              <span className="divider">|</span>
              <span>info@tayesproperty.com</span>
              <span className="divider">|</span>
              <span>Mon-Fri: 9AM-6PM</span>
            </div>

            <div className="top-right">
              <Link to="/login" className="login-btn">
                <FaUser className="icon" />
                <span>Client Login</span>
              </Link>
              <div className="social-icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="https://instagram.com"
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

      {/* Mobile Menu with Backdrop */}
      {isMenuOpen && (
        <>
          {/* Backdrop Overlay - click to close */}
          <div 
            className="mobile-overlay" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav">
              {/* Close button inside menu */}
              <button 
                className="mobile-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
              
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
                <Link
                  to="/login"
                  className="mobile-login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="icon" />
                  <span>Clients Login</span>
                </Link>
                <div className="contact-item">
                  <FaPhone className="icon" />
                  <span>(555) 123-45677</span>
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
        </>
      )}
    </header>
  );
};

export default Header;