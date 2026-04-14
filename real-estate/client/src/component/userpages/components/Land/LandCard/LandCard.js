import React from "react";
import { FaMapMarkerAlt, FaRuler, FaTag, FaCheckCircle } from "react-icons/fa";
import "./LandCard.css";

const LandCard = ({ land, index }) => {
  if (!land) return null;

  // Map backend fields to component expected fields
  const imageUrl =
    land.images?.[0] || land.thumbnail || "/placeholder-land.jpg";
  const landTitle = land.title || "Land Property";
  const landLocation =
    land.location || land.address?.city || "Location not specified";
  const landSize = land.size || `${land.sizeSqm || 0} sqm`;
  const landPrice = land.price
    ? `₦${land.price.toLocaleString()}`
    : "Price on request";
  const landType =
    land.type === "land" ? land.landUse || "Land" : land.category || "Land";
  const landFeatures = land.features || ["Survey Plan", "C of O"];
  const landZoning = land.zoning || land.category || "Residential";
  const agentName = land.agentName || land.agent?.name || "Taye's Property";

  return (
    <div className="land-card" data-aos="fade-up" data-aos-delay={index * 100}>
      <div className="land-card-image">
        <img src={imageUrl} alt={landTitle} />
        <span className="land-type-badge">{landType}</span>
      </div>

      <div className="land-card-content">
        <h3 className="land-title">{landTitle}</h3>

        <div className="land-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{landLocation}</span>
        </div>

        <div className="land-specs">
          <div className="spec">
            <FaRuler className="spec-icon" />
            <span>{landSize}</span>
          </div>
          <div className="spec">
            <FaTag className="spec-icon" />
            <span className="land-price">{landPrice}</span>
          </div>
        </div>

        <div className="land-features">
          {landFeatures.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="feature-tag">
              <FaCheckCircle className="feature-icon" />
              {feature}
            </span>
          ))}
        </div>

        <div className="land-footer">
          <span className="zoning">{landZoning}</span>
          <span className="agent-name">Agent: {agentName}</span>
        </div>

        <button
          className="view-details-btn"
          onClick={() => (window.location.href = `/property/${land._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default LandCard;
