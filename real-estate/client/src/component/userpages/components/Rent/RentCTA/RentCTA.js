import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { useCompany } from "../../../../../context/CompanyContext";
import "./RentCTA.css";

const RentCTA = () => {
  const { company, getPhone, getEmail } = useCompany();

  // Get data from database with fallbacks
  const phoneNumber = getPhone();
  const emailAddress = getEmail();

  // Create WhatsApp URL from phone number
  const whatsappNumber =
    company?.phone?.whatsapp?.replace(/\D/g, "") ||
    phoneNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Rent-specific email (you can add this to your Company model if needed)
  const rentalsEmail =
    company?.email?.rentals || company?.email?.general || emailAddress;

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
              <a
                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                className="rent-cta-contact-item"
              >
                <FaPhone />
                <span>Call Us</span>
              </a>
              <a
                href={`mailto:${rentalsEmail}`}
                className="rent-cta-contact-item"
              >
                <FaEnvelope />
                <span>Email</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
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
