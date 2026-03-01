import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaTrophy,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import "./JoinTeam.css";

const JoinTeam = () => {
  const benefits = [
    "good commission structure",
    "good training program",
    "Marketing support",
    "Lead generation system",
    "Flexible work schedule",
    "Career growth opportunities",
  ];

  return (
    <section className="join-team-section">
      <div className="container">
        <div className="join-team-wrapper">
          <div className="join-team-content" data-aos="fade-right">
            <span className="join-subtitle">Career Opportunities</span>
            <h2 className="join-title">Join Our Growing Team</h2>
            <p className="join-text">
              Are you passionate about real estate? We're always looking for
              talented, motivated individuals to join our team of professional
              agents.
            </p>

            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="join-stats">
              <div className="join-stat">
                <FaTrophy className="stat-icon" />
                <div>
                  <span className="stat-number">#1</span>
                  <span className="stat-label">Brokerage</span>
                </div>
              </div>
              <div className="join-stat">
                <FaUsers className="stat-icon" />
                <div>
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Active Agents</span>
                </div>
              </div>
              <div className="join-stat">
                <FaChartLine className="stat-icon" />
                <div>
                  <span className="stat-number">1500+</span>
                  <span className="stat-label">Deals/Year</span>
                </div>
              </div>
            </div>

            <Link to="/careers" className="join-btn">
              Apply Now <FaArrowRight />
            </Link>
          </div>

          <div className="join-team-image" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Join Our Team"
            />
            <div className="image-badge">
              <span>Join Us</span>
              <strong>Today</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinTeam;
