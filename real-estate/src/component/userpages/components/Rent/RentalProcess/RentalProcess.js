import React from "react";
import {
  FaSearch,
  FaCalendarCheck,
  FaFileSignature,
  FaKey,
} from "react-icons/fa";
import "./RentalProcess.css";

const RentalProcess = () => {
  const steps = [
    {
      icon: <FaSearch />,
      number: "01",
      title: "Search",
      description: "Browse available rentals that match your criteria",
    },
    {
      icon: <FaCalendarCheck />,
      number: "02",
      title: "View",
      description: "Schedule viewings of your favorite properties",
    },
    {
      icon: <FaFileSignature />,
      number: "03",
      title: "Apply",
      description: "Submit your application and documents",
    },
    {
      icon: <FaKey />,
      number: "04",
      title: "Move In",
      description: "Sign agreement and get your keys",
    },
  ];

  return (
    <section className="rent-process">
      <div className="rent-container">
        {/* Header */}
        <div className="rent-section-header" data-aos="fade-up">
          <span className="rent-section-tag">Simple Process</span>
          <h2 className="rent-section-title">Rent in 4 Easy Steps</h2>
          <p className="rent-section-text">
            We've made renting simple and stress-free
          </p>
        </div>

        {/* Steps */}
        <div className="rent-process-grid">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rent-process-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="rent-process-number">{step.number}</div>
              <div className="rent-process-icon-wrapper">
                <div className="rent-process-icon">{step.icon}</div>
              </div>
              <h3 className="rent-process-title">{step.title}</h3>
              <p className="rent-process-description">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="rent-process-line"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentalProcess;
