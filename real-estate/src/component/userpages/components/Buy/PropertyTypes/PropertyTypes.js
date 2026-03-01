import React from "react";
import {
  FaHome,
  FaBuilding,
  FaHotel,
  FaTree,
  FaIndustry,
  FaStore,
} from "react-icons/fa";
import "./PropertyTypes.css";

const PropertyTypes = () => {
  const propertyTypes = [
    {
      icon: <FaHome />,
      name: "Houses",
      count: 1240,
      animation: "rotate-animation",
    },
    {
      icon: <FaBuilding />,
      name: "Flats",
      count: 890,
      animation: "flip-animation",
    },
    {
      icon: <FaHotel />,
      name: "Duplex",
      count: 450,
      animation: "bounce-animation",
    },
    {
      icon: <FaTree />,
      name: "Land",
      count: 320,
      animation: "pulse-animation",
    },
    {
      icon: <FaIndustry />,
      name: "Commercial",
      count: 180,
      animation: "shake-animation",
    },
    {
      icon: <FaStore />,
      name: "Shops",
      count: 95,
      animation: "wobble-animation",
    },
  ];

  return (
    <section className="property-types-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Browse by Type</span>
          <h2 className="section-title">Property Categories</h2>
          <p className="section-description">
            Find properties by type to narrow down your search
          </p>
        </div>

        <div className="types-grid">
          {propertyTypes.map((type, index) => (
            <div
              key={index}
              className={`type-card ${type.animation}`}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="type-icon-wrapper">
                <div className="type-icon">{type.icon}</div>
              </div>
              <h3 className="type-name">{type.name}</h3>
              <p className="type-count">
                {type.count.toLocaleString()} properties
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
