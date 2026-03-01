import React from "react";
import { FaGem, FaAward, FaUsers, FaHandshake } from "react-icons/fa";
import "./CoreValues.css";

const CoreValues = () => {
  const coreValues = [
    {
      icon: <FaGem />,
      title: "Integrity",
      description:
        "We uphold the highest standards of honesty and transparency in every transaction.",
    },
    {
      icon: <FaAward />,
      title: "Excellence",
      description:
        "We strive for excellence in service delivery and client satisfaction.",
    },
    {
      icon: <FaUsers />,
      title: "Client-Centric",
      description:
        "Our clients' needs and goals are at the heart of everything we do.",
    },
    {
      icon: <FaHandshake />,
      title: "Partnership",
      description:
        "We build lasting relationships based on trust and mutual success.",
    },
  ];

  return (
    <section className="values-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">What Drives Us</span>
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-description">
            The principles that guide every decision we make
          </p>
        </div>

        <div className="values-grid">
          {coreValues.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
