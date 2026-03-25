import React from "react";
import { FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { useCompany } from "../../../../../context/CompanyContext";
import "./MapSection.css";

const MapSection = () => {
  const { company, getFullAddress } = useCompany();

  // Get map data from database with fallbacks
  const mapEmbedUrl =
    company?.address?.mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.626332779!2d3.3218725!3d6.5243793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1645567890123!5m2!1sen!2s";

  const mapDirectionsLink =
    company?.address?.mapLink || "https://maps.google.com/?q=Lagos,Nigeria";

  const fullAddress = getFullAddress();

  // Extract city and country for display if needed, or use full address
  const displayAddress = company?.address?.street
    ? `${company.address.street}, ${company.address.city || "Lagos"}, ${company.address.country || "Nigeria"}`
    : fullAddress;

  return (
    <div className="map-container" data-aos="fade-left">
      <div className="map-wrapper">
        <iframe
          title="Office Location"
          src={mapEmbedUrl}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      <div className="map-overlay">
        <div className="map-address">
          <FaMapMarkerAlt className="map-marker" />
          <div>
            <h4>Visit Our Office</h4>
            <p>{displayAddress}</p>
          </div>
        </div>
        <a
          href={mapDirectionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link"
        >
          Get Directions <FaPaperPlane className="arrow-icon" />
        </a>
      </div>
    </div>
  );
};

export default MapSection;
