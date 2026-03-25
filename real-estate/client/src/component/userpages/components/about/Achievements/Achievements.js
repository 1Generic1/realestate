import React from "react";
import "./Achievements.css";

const Achievements = () => {
  const achievements = [
    { number: "15+", label: "Years of Excellence" },
    { number: "500+", label: "Happy Clients" },
    { number: "850+", label: "Properties Handled" },
    { number: "98%", label: "Client Satisfaction" },
  ];

  return (
    <section className="about-achievements">
      <div className="about-container">
        <div className="about-achievements-grid">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="about-achievement-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="about-achievement-number">{item.number}</div>
              <div className="about-achievement-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
