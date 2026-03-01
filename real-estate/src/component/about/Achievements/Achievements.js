import React from "react";
import "./Achievements.css";

const Achievements = () => {
  const achievements = [
    { number: "15+", label: "Years of Excellence" },
    { number: "500+", label: "Happy Clients" },
    { number: "850+", label: "Properties Handled" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "Team Members" },
    { number: "5+", label: "Industry Awards" },
  ];

  return (
    <section className="achievements-section">
      <div className="container">
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <div className="achievement-number">{achievement.number}</div>
              <div className="achievement-label">{achievement.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
