import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaArrowRight,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaCalendarCheck,
} from "react-icons/fa";
import "./BuyCTA.css";

const BuyCTA = () => {
  return (
    <section className="buy-cta-section">
      <div className="container1">
        <div className="cta-wrapper1">
          {/* Main CTA Card */}
          <div className="cta-card" data-aos="zoom-in">
            {/* Animated Background */}
            <div className="cta-bg-animation">
              <div className="bg-circle circle-1"></div>
              <div className="bg-circle circle-2"></div>
            </div>

            {/* Content */}
            <div className="cta-content">
              {/* Icon */}
              <div className="cta-icon-wrapper">
                <div className="cta-icon-pulse">
                  <FaHome className="cta-main-icon" />
                </div>
                <div className="cta-icon-ring"></div>
              </div>

              {/* Text Content */}
              <h2 className="cta-title">
                Ready to Find Your{" "}
                <span className="gradient-text">Dream Home</span>?
              </h2>
              <p className="cta-text">
                Let our expert agents guide you through the process and help you
                find the perfect property.
              </p>

              {/* CTA Buttons */}
              <div className="cta-buttons-container">
                <Link to="/consultation" className="cta-button-primary">
                  <span className="button-text">Schedule Viewing</span>
                  <FaCalendarCheck className="button-icon" />
                  <span className="button-glow"></span>
                </Link>

                <Link to="/contact" className="cta-button-secondary">
                  <span>Talk to Agent</span>
                  <FaArrowRight className="button-arrow" />
                </Link>
              </div>

              {/* Contact Options */}
              <div className="cta-contact-options">
                <p className="contact-label">Quick contact:</p>
                <div className="contact-grid">
                  <a href="tel:+2345551234567" className="contact-item phone">
                    <div className="contact-icon-wrapper">
                      <FaPhone />
                    </div>
                    <div className="contact-details">
                      <span className="contact-type">Call Us</span>
                      <span className="contact-value">(555) 123-4567</span>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/2345551234567"
                    className="contact-item whatsapp"
                  >
                    <div className="contact-icon-wrapper">
                      <FaWhatsapp />
                    </div>
                    <div className="contact-details">
                      <span className="contact-type">WhatsApp</span>
                      <span className="contact-value">Chat with us</span>
                    </div>
                  </a>

                  <a
                    href="mailto:info@tayesproperty.com"
                    className="contact-item email"
                  >
                    <div className="contact-icon-wrapper">
                      <FaEnvelope />
                    </div>
                    <div className="contact-details">
                      <span className="contact-type">Email</span>
                      <span className="contact-value">
                        info@tayesproperty.com
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyCTA;
