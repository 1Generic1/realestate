import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import "./AgentCard.css";

const AgentCard = ({ agent, index }) => {
  return (
    <div className="agent-card" data-aos="fade-up" data-aos-delay={index * 100}>
      <div className="agent-image">
        <img src={agent.image} alt={agent.name} />
        <div className="agent-social">
          <a href={agent.social?.facebook}>
            <FaFacebookF />
          </a>
          <a href={agent.social?.twitter}>
            <FaTwitter />
          </a>
          <a href={agent.social?.linkedin}>
            <FaLinkedinIn />
          </a>
          <a href={agent.social?.instagram}>
            <FaInstagram />
          </a>
        </div>
      </div>

      <div className="agent-info">
        <h3 className="agent-name">{agent.name}</h3>
        <p className="agent-title">{agent.title}</p>

        <div className="agent-specialties">
          {agent.specialties.map((specialty, idx) => (
            <span key={idx} className="specialty-tag">
              {specialty}
            </span>
          ))}
        </div>

        <div className="agent-stats">
          <div className="agent-stat">
            <span className="stat-count">{agent.deals}+</span>
            <span className="stat-label">Deals</span>
          </div>
          <div className="agent-stat">
            <span className="stat-count">{agent.experience}</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="agent-stat">
            <span className="stat-count">{agent.rating}</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>

        <div className="agent-contact">
          <a href={`tel:${agent.phone}`} className="contact-link">
            <FaPhone /> Call
          </a>
          <a href={`mailto:${agent.email}`} className="contact-link">
            <FaEnvelope /> Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
