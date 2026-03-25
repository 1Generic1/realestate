import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPhone, FaEnvelope } from "react-icons/fa";
import { useCompany } from "../../../../../context/CompanyContext";
import "./HomeCTA.css";

const HomeCTA = () => {
  const { getPhone, getEmail } = useCompany();

  // Get data from database
  const phoneNumber = getPhone();
  const emailAddress = getEmail();

  return (
    <section className="home-cta">
      <div className="home-container">
        <div className="home-cta-wrapper" data-aos="zoom-in">
          <h2 className="home-cta-title" data-aos="fade-up">
            Ready to Start Your Property Journey?
          </h2>
          <p className="home-cta-text" data-aos="fade-up" data-aos-delay="100">
            Let's discuss how we can help you achieve your real estate goals
            with our expert guidance.
          </p>

          <div
            className="home-cta-buttons"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link to="/consultation" className="home-cta-btn-primary">
              Schedule Free Consultation{" "}
              <FaArrowRight className="home-cta-icon" />
            </Link>
            <Link to="/contact" className="home-cta-btn-secondary">
              Contact Us Today
            </Link>
          </div>

          <div
            className="home-cta-contact"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <a
              href={`tel:${phoneNumber.replace(/\D/g, "")}`}
              className="home-cta-contact-item"
            >
              <FaPhone />
              <span>{phoneNumber}</span>
            </a>
            <a
              href={`mailto:${emailAddress}`}
              className="home-cta-contact-item"
            >
              <FaEnvelope />
              <span>{emailAddress}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
