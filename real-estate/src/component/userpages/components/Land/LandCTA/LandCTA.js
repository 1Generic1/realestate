import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "./LandCTA.css";

const LandCTA = () => {
  return (
    <section className="land-cta-section">
      <div className="container">
        <div className="cta-wrapper" data-aos="zoom-in">
          <div className="cta-content">
            <span className="cta-subtitle">Have Land to Sell?</span>
            <h2 className="cta-title">Turn Your Land into Capital</h2>
            <p className="cta-text">
              Get a free valuation for your land property. Our experts will
              provide market analysis and connect you with serious buyers.
            </p>

            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-badge">✓</span>
                Free professional valuation
              </div>
              <div className="cta-feature">
                <span className="feature-badge">✓</span>
                Access to serious buyers
              </div>
              <div className="cta-feature">
                <span className="feature-badge">✓</span>
                Fast closing process
              </div>
              <div className="cta-feature">
                <span className="feature-badge">✓</span>
                Legal support included
              </div>
            </div>

            <div className="cta-actions">
              <Link to="/contact" className="cta-btn-primary">
                Get Free Valuation <FaArrowRight className="btn-icon" />
              </Link>
              <div className="cta-contact">
                <span>Or contact us directly:</span>
                <div className="contact-links">
                  <a href="tel:+2345551234567" className="contact-link">
                    <FaPhone /> Call
                  </a>
                  <a
                    href="mailto:land@tayesproperty.com"
                    className="contact-link"
                  >
                    <FaEnvelope /> Email
                  </a>
                  <a
                    href="https://wa.me/2345551234567"
                    className="contact-link whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-stats">
            <div className="stat-circle">
              <span className="stat-number">500+</span>
              <span className="stat-label">Land Deals</span>
            </div>
            <div className="stat-circle">
              <span className="stat-number">₦50B+</span>
              <span className="stat-label">Transaction Value</span>
            </div>
            <div className="stat-circle">
              <span className="stat-number">98%</span>
              <span className="stat-label">Seller Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandCTA;
