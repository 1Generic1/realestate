import React from "react";
import { FaHome, FaBuilding, FaTree, FaHardHat } from "react-icons/fa";
import "./SearchCategories.css";

const SearchCategories = () => {
  const categories = [
    {
      icon: <FaHome />,
      title: "Houses",
      count: "2,500+",
      animation: "searchcat-spin-on-hover",
    },
    {
      icon: <FaBuilding />,
      title: "Flats",
      count: "1,800+",
      animation: "searchcat-bounce-on-hover",
    },
    {
      icon: <FaTree />,
      title: "Lands",
      count: "500+",
      animation: "searchcat-pulse-on-hover",
    },
    {
      icon: <FaHardHat />,
      title: "New Projects",
      count: "120+",
      animation: "searchcat-glow-on-hover",
    },
  ];

  return (
    <section className="searchcat-section">
      <div className="searchcat-container">
        <div className="searchcat-grid">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`searchcat-card ${category.animation}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="searchcat-icon-wrapper">
                <div className="searchcat-icon">{category.icon}</div>
              </div>
              <h3 className="searchcat-title">{category.title}</h3>
              <p className="searchcat-count">{category.count} Properties</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchCategories;