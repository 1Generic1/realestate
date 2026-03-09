import React from "react";
import { FaBuilding, FaHome, FaHotel, FaStore } from "react-icons/fa";
import "./RentCategories.css";

const RentCategories = () => {
  const categories = [
    {
      icon: <FaBuilding />,
      title: "Apartments",
      count: "124",
      description: "Modern apartments in prime locations",
    },
    {
      icon: <FaHome />,
      title: "Houses",
      count: "86",
      description: "Spacious houses with great amenities",
    },
    {
      icon: <FaHotel />,
      title: "Flats",
      count: "92",
      description: "Cozy flats perfect for families",
    },
    {
      icon: <FaStore />,
      title: "Commercial",
      count: "34",
      description: "Retail spaces and offices for rent",
    },
  ];

  return (
    <section className="rent-categories">
      <div className="rent-container">
        {/* Header */}
        <div className="rent-section-header" data-aos="fade-up">
          <span className="rent-section-tag">Categories</span>
          <h2 className="rent-section-title">Browse by Property Type</h2>
          <p className="rent-section-text">
            Find the perfect rental that matches your lifestyle
          </p>
        </div>

        {/* Grid */}
        <div className="rent-categories-grid">
          {categories.map((category, index) => (
            <div
              key={index}
              className="rent-category-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="rent-category-inner">
                {/* Icon */}
                <div className="rent-category-icon-wrapper">
                  <div className="rent-category-icon">{category.icon}</div>
                </div>

                {/* Content */}
                <h3 className="rent-category-title">{category.title}</h3>
                <p className="rent-category-description">
                  {category.description}
                </p>

                {/* Count */}
                <div className="rent-category-footer">
                  <span className="rent-category-count">
                    {category.count} available
                  </span>
                  <div className="rent-category-line"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentCategories;
