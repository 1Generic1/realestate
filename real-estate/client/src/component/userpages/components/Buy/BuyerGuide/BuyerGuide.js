import React, { useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";
import "./BuyerGuide.css";

const BuyerGuide = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Guide requested for:", email);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }
  };

  return (
    <div className="buyer-guide-card" data-aos="fade-right">
      <div className="guide-icon-wrapper">
        <FaBook className="guide-icon" />
      </div>
      <h3 className="guide-title">Free Buyer's Guide</h3>
      <p className="guide-subtitle">
        Everything you need to know before buying property
      </p>

      <ul className="guide-features">
        <li>
          <FaCheckCircle className="check-icon" /> 10 Steps to Buying
        </li>
        <li>
          <FaCheckCircle className="check-icon" /> Document Checklist
        </li>
        <li>
          <FaCheckCircle className="check-icon" /> Mortgage Guide
        </li>
        <li>
          <FaCheckCircle className="check-icon" /> Hidden Costs Explained
        </li>
        <li>
          <FaCheckCircle className="check-icon" /> Legal Requirements
        </li>
      </ul>

      {!showForm ? (
        <button className="guide-btn" onClick={() => setShowForm(true)}>
          Download Free Guide <FaArrowRight className="btn-icon" />
        </button>
      ) : (
        <form onSubmit={handleDownload} className="guide-form">
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="guide-input"
          />
          <button type="submit" className="guide-submit-btn">
            <FaDownload /> {downloaded ? "Sent!" : "Get Guide"}
          </button>
        </form>
      )}

      {downloaded && (
        <div className="download-success">
          Guide sent to {email}! Check your inbox.
        </div>
      )}
    </div>
  );
};

export default BuyerGuide;
