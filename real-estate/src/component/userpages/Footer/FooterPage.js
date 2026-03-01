import React from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaUsers,
  FaHandshake,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import "./FooterPage.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <span className="footer-logo-gold">TAYE'S</span>
              <span className="footer-logo-cream">PROPERTY</span>
              <span className="footer-logo-small">& REALTY SOLUTIONS</span>
            </div>
            <p className="footer-description">
              Your trusted partner in property and realty solutions, delivering
              excellence with integrity and expertise.
            </p>
            <div className="footer-social">
              <a href="#">
                <FaBuilding />
              </a>
              <a href="#">
                <FaUsers />
              </a>
              <a href="#">
                <FaHandshake />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Our Services</Link>
              </li>
              <li>
                <Link to="/vision">Vision & Mission</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Our Services</h4>
            <ul>
              <li>
                <Link to="/services#acquisition">Property Acquisition</Link>
              </li>
              <li>
                <Link to="/services#land">Land Banking</Link>
              </li>
              <li>
                <Link to="/services#advisory">Realty Advisory</Link>
              </li>
              <li>
                <Link to="/services#investment">Investment Solutions</Link>
              </li>
              <li>
                <Link to="/services#legal">Legal & Compliance</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt />
                <span>123 Business District, Lagos, Nigeria</span>
              </li>
              <li>
                <FaPhone />
                <span>(555) 123-4567</span>
              </li>
              <li>
                <FaEnvelope />
                <span>info@tayesproperty.com</span>
              </li>
              <li>
                <FaClock />
                <span>Mon-Fri: 8AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2026 TAYE'S PROPERTY & REALTY SOLUTIONS. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
