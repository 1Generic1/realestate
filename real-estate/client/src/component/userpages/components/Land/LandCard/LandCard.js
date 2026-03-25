import React from "react";
import { FaMapMarkerAlt, FaRuler, FaTag, FaCheckCircle } from "react-icons/fa";
import "./LandCard.css";

const LandCard = ({ land, index }) => {
  if (!land) return null;

  const { image, title, location, size, price, type, features, zoning, agent } =
    land;

  return (
    <div className="land-card" data-aos="fade-up" data-aos-delay={index * 100}>
      <div className="land-card-image">
        <img src={image} alt={title} />
        <span className="land-type-badge">{type}</span>
      </div>

      <div className="land-card-content">
        <h3 className="land-title">{title}</h3>

        <div className="land-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{location}</span>
        </div>

        <div className="land-specs">
          <div className="spec">
            <FaRuler className="spec-icon" />
            <span>{size}</span>
          </div>
          <div className="spec">
            <FaTag className="spec-icon" />
            <span className="land-price">{price}</span>
          </div>
        </div>

        <div className="land-features">
          {features.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="feature-tag">
              <FaCheckCircle className="feature-icon" />
              {feature}
            </span>
          ))}
        </div>

        <div className="land-footer">
          <span className="zoning">{zoning}</span>
          <span className="agent-name">Agent: {agent}</span>
        </div>

        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};

export default LandCard;
