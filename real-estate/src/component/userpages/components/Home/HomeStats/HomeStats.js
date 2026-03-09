import React, { useState, useEffect } from "react";
import "./HomeStats.css";

const HomeStats = () => {
  const [stats, setStats] = useState({
    years: 0,
    clients: 0,
    properties: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const targetStats = {
      years: 15,
      clients: 500,
      properties: 850,
      satisfaction: 98,
    };

    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setStats({
        years: Math.min(
          Math.floor((targetStats.years / steps) * currentStep),
          targetStats.years,
        ),
        clients: Math.min(
          Math.floor((targetStats.clients / steps) * currentStep),
          targetStats.clients,
        ),
        properties: Math.min(
          Math.floor((targetStats.properties / steps) * currentStep),
          targetStats.properties,
        ),
        satisfaction: Math.min(
          Math.floor((targetStats.satisfaction / steps) * currentStep),
          targetStats.satisfaction,
        ),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="home-stats">
      <div className="home-container">
        <div className="home-stats-grid">
          <div className="home-stat-card" data-aos="fade-up">
            <span className="home-stat-number">{stats.years}+</span>
            <span className="home-stat-label">Years of Excellence</span>
          </div>
          <div
            className="home-stat-card"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <span className="home-stat-number">{stats.clients}+</span>
            <span className="home-stat-label">Happy Clients</span>
          </div>
          <div
            className="home-stat-card"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span className="home-stat-number">{stats.properties}+</span>
            <span className="home-stat-label">Properties Handled</span>
          </div>
          <div
            className="home-stat-card"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <span className="home-stat-number">{stats.satisfaction}%</span>
            <span className="home-stat-label">Client Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
