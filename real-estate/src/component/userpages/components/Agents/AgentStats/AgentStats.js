import React, { useEffect, useState } from "react";
import { FaUsers, FaTrophy, FaHandshake, FaStar } from "react-icons/fa";
import "./AgentStats.css";

const AgentStats = () => {
  const [stats, setStats] = useState({
    agents: 0,
    experience: 0,
    deals: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const targetStats = {
      agents: 25,
      experience: 15,
      deals: 1500,
      satisfaction: 98,
    };

    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setStats({
        agents: Math.min(
          Math.floor((targetStats.agents / steps) * currentStep),
          targetStats.agents,
        ),
        experience: Math.min(
          Math.floor((targetStats.experience / steps) * currentStep),
          targetStats.experience,
        ),
        deals: Math.min(
          Math.floor((targetStats.deals / steps) * currentStep),
          targetStats.deals,
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

  const statData = [
    {
      icon: <FaUsers />,
      value: stats.agents,
      label: "Expert Agents",
      suffix: "+",
    },
    {
      icon: <FaTrophy />,
      value: stats.experience,
      label: "Years Experience",
      suffix: "+",
    },
    {
      icon: <FaHandshake />,
      value: stats.deals,
      label: "Deals Closed",
      suffix: "+",
    },
    {
      icon: <FaStar />,
      value: stats.satisfaction,
      label: "Client Satisfaction",
      suffix: "%",
    },
  ];

  return (
    <section className="agent-stats-section">
      <div className="container">
        <div className="stats-grid">
          {statData.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <span className="stat-value">
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentStats;
