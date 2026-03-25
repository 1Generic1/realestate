import React, { useState } from "react";
import { FaEye, FaBullseye, FaGem } from "react-icons/fa";
import "./HomeVision.css";

const HomeVision = () => {
  const [activeVision, setActiveVision] = useState(0);

  const visionItems = [
    {
      icon: <FaEye />,
      title: "Our Vision",
      description:
        "To be the most trusted and innovative real estate solutions provider, setting benchmarks in property excellence across the nation.",
      color: "var(--home-gold)",
    },
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      description:
        "Empowering clients with expert guidance, transparent dealings, and personalized solutions that turn property dreams into reality.",
      color: "var(--home-rose-gold)",
    },
    {
      icon: <FaGem />,
      title: "Our Values",
      description:
        "Integrity, Excellence, Innovation, and Client-Centric Approach in everything we do.",
      color: "var(--home-purple)",
    },
  ];

  return (
    <section className="home-vision">
      <div className="home-container">
        <div className="home-section-header" data-aos="fade-up">
          <span className="home-section-tag">Who We Are</span>
          <h2 className="home-section-title">
            Defining Excellence in Real Estate
          </h2>
          <p className="home-section-text">
            At TAYE'S PROPERTY & REALTY SOLUTIONS, we don't just transact
            properties – we build lasting relationships and create value for our
            clients.
          </p>
        </div>

        <div className="home-vision-grid">
          {visionItems.map((item, index) => (
            <div
              key={index}
              className={`home-vision-card ${activeVision === index ? "active" : ""}`}
              onMouseEnter={() => setActiveVision(index)}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="home-vision-icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h3 className="home-vision-title">{item.title}</h3>
              <p className="home-vision-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeVision;
