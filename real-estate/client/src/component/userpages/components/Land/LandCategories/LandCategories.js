import React from "react";
import {
  FaHome,
  FaBuilding,
  FaTractor,
  FaIndustry,
  FaCity,
} from "react-icons/fa";
import "./LandCategories.css";

const LandCategories = () => {
  const categories = [
    {
      icon: <FaHome />,
      title: "Residential Land",
      description: "Perfect for building your dream home",
      count: "150+ plots",
      color: "#b8860b",
    },
    {
      icon: <FaBuilding />,
      title: "Commercial Land",
      description: "Prime locations for business",
      count: "80+ plots",
      color: "#b8860b",
    },
    {
      icon: <FaTractor />,
      title: "Agricultural Land",
      description: "Fertile land for farming",
      count: "120+ plots",
      color: "#b8860b",
    },
    {
      icon: <FaIndustry />,
      title: "Industrial Land",
      description: "Ready for development",
      count: "40+ plots",
      color: "#b8860b",
    },
    {
      icon: <FaCity />,
      title: "Mixed-Use Development",
      description: "High-growth investment zones",
      count: "60+ plots",
      color: "#b8860b",
    },
  ];

  return (
    <section className="land-categories-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Land Types</span>
          <h2 className="section-title">Find Land by Category</h2>
          <p className="section-description">
            Explore our diverse portfolio of land opportunities tailored to your
            needs
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="category-icon-wrapper">
                <div className="category-icon">{category.icon}</div>
              </div>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-description">{category.description}</p>
              <span className="category-count">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandCategories;
