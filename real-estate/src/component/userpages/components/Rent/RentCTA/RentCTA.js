import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import "./RentCTA.css";

const RentCTA = () => {
  return (
    <section className="rent-cta">
      <div className="rent-container">
        <div className="rent-cta-wrapper" data-aos="zoom-in">
          <h2 className="rent-cta-title">Need Help Finding a Rental?</h2>
          <p className="rent-cta-text">
            Our rental specialists are ready to assist you in finding your
            perfect home. Get in touch with us today.
          </p>

          <div className="rent-cta-buttons">
            <Link to="/contact" className="rent-cta-button rent-cta-primary">
              Contact Rentals Team
              <FaArrowRight className="rent-cta-icon" />
            </Link>

            <div className="rent-cta-contact">
              <a href="tel:+2345551234567" className="rent-cta-contact-item">
                <FaPhone />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:rentals@tayesproperty.com"
                className="rent-cta-contact-item"
              >
                <FaEnvelope />
                <span>Email</span>
              </a>
              <a
                href="https://wa.me/2345551234567"
                className="rent-cta-contact-item"
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentCTA;
