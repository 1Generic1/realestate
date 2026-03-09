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
          {/* Logo & Description - Fade right */}
          <div
            className="footer-column"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
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
              <a href="#" data-aos="zoom-in" data-aos-delay="200">
                <FaBuilding />
              </a>
              <a href="#" data-aos="zoom-in" data-aos-delay="300">
                <FaUsers />
              </a>
              <a href="#" data-aos="zoom-in" data-aos-delay="400">
                <FaHandshake />
              </a>
            </div>
          </div>

          {/* Quick Links - Fade up */}
          <div
            className="footer-column"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <h4>Quick Links</h4>
            <ul>
              <li data-aos="fade-up" data-aos-delay="250">
                <Link to="/">Home</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="300">
                <Link to="/about">About Us</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="350">
                <Link to="/services">Our Services</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="400">
                <Link to="/vision">Vision & Mission</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="450">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Our Services - Fade up */}
          <div
            className="footer-column"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            <h4>Our Services</h4>
            <ul>
              <li data-aos="fade-up" data-aos-delay="450">
                <Link to="/services#acquisition">Property Acquisition</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="500">
                <Link to="/services#land">Land Banking</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="550">
                <Link to="/services#advisory">Realty Advisory</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="600">
                <Link to="/services#investment">Investment Solutions</Link>
              </li>
              <li data-aos="fade-up" data-aos-delay="650">
                <Link to="/services#legal">Legal & Compliance</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Fade left */}
          <div
            className="footer-column"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li data-aos="fade-left" data-aos-delay="250">
                <FaMapMarkerAlt />
                <span>123 Business District, Lagos, Nigeria</span>
              </li>
              <li data-aos="fade-left" data-aos-delay="300">
                <FaPhone />
                <span>(555) 123-4567</span>
              </li>
              <li data-aos="fade-left" data-aos-delay="350">
                <FaEnvelope />
                <span>info@tayesproperty.com</span>
              </li>
              <li data-aos="fade-left" data-aos-delay="400">
                <FaClock />
                <span>Mon-Fri: 8AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom - Fade up */}
        <div
          className="footer-bottom"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="500"
        >
          <p>
            &copy; 2026 TAYE'S PROPERTY & REALTY SOLUTIONS. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy" data-aos="zoom-in" data-aos-delay="550">
              Privacy Policy
            </Link>
            <Link to="/terms" data-aos="zoom-in" data-aos-delay="600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
