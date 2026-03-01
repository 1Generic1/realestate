import React from "react";
import { FaBullseye, FaEye, FaCheckCircle } from "react-icons/fa";
import "./MissionVision.css";

const MissionVision = () => {
  return (
    <section className="mission-vision-section">
      <div className="container">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <div className="card-icon">
              <FaBullseye />
            </div>
            <h3>Our Mission</h3>
            <p>
              To empower clients with expert guidance, transparent dealings, and
              personalized solutions that turn property dreams into reality.
            </p>
            <ul className="mission-list">
              <li>
                <FaCheckCircle /> Expert guidance for every client
              </li>
              <li>
                <FaCheckCircle /> Transparent and ethical dealings
              </li>
              <li>
                <FaCheckCircle /> Personalized property solutions
              </li>
            </ul>
          </div>
          <div className="vision-card">
            <div className="card-icon">
              <FaEye />
            </div>
            <h3>Our Vision</h3>
            <p>
              To be the most trusted and innovative real estate solutions
              provider, setting benchmarks in property excellence across the
              nation.
            </p>
            <ul className="vision-list">
              <li>
                <FaCheckCircle /> Industry benchmark for excellence
              </li>
              <li>
                <FaCheckCircle /> Innovation in real estate
              </li>
              <li>
                <FaCheckCircle /> Nationwide recognition
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
