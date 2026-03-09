import React from "react";
import { FaGem, FaAward, FaUsers, FaHandshake } from "react-icons/fa";
import "./CoreValues.css";

const CoreValues = () => {
  const values = [
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
    <section className="about-values">
      <div className="about-container">
        <div className="about-section-header" data-aos="fade-up">
          <span className="about-section-tag">What Drives Us</span>
          <h2 className="about-section-title">Our Core Values</h2>
          <p className="about-section-text">
            The principles that guide every decision we make
          </p>
        </div>

        <div className="about-values-grid">
          {values.map((value, index) => (
            <div
              key={index}
              className="about-value-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="about-value-icon">{value.icon}</div>
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
