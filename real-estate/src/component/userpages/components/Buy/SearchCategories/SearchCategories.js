import React from "react";
import { FaHome, FaBuilding, FaTree, FaHardHat } from "react-icons/fa";
import "./SearchCategories.css";

const SearchCategories = () => {
  const categories = [
    {
      icon: <FaHome />,
      title: "Houses",
      count: "2,500+",
      animation: "spin-on-hover",
    },
    {
      icon: <FaBuilding />,
      title: "Flats",
      count: "1,800+",
      animation: "bounce-on-hover",
    },
    {
      icon: <FaTree />,
      title: "Lands",
      count: "500+",
      animation: "pulse-on-hover",
    },
    {
      icon: <FaHardHat />,
      title: "New Projects",
      count: "120+",
      animation: "glow-on-hover",
    },
  ];

  return (
    <section className="search-categories-section">
      <div className="container-search">
        <div className="categories-grid1">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`category-card ${category.animation}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="category-icon-wrapper">
                <div className="category-icon">{category.icon}</div>
              </div>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-count">{category.count} Properties</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchCategories;
