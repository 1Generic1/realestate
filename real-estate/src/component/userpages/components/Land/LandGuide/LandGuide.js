import React from 'react';
import { FaSearch, FaFileAlt, FaCheckCircle, FaHandshake, FaArrowRight } from 'react-icons/fa';
import './LandGuide.css';

const LandGuide = () => {
  const steps = [
    {
      icon: <FaSearch />,
      title: "1. Research & Identify",
      description: "Define your goals, budget, and preferred locations. Research market trends and land values."
    },
    {
      icon: <FaFileAlt />,
      title: "2. Due Diligence",
      description: "Verify land titles, conduct surveys, check zoning regulations, and assess development potential."
    },
    {
      icon: <FaCheckCircle />,
      title: "3. Legal Review",
      description: "Engage a lawyer to review documents, conduct searches, and ensure clean title transfer."
    },
    {
      icon: <FaHandshake />,
      title: "4. Closing & Transfer",
      description: "Negotiate final terms, sign agreements, process payment, and register the land."
    }
  ];

  const downloadGuide = () => {
    // Trigger the newsletter modal
    document.dispatchEvent(new CustomEvent('openNewsletterModal'));
  };

  return (
    <section className="land-guide-section">
      <div className="container">
        <div className="guide-wrapper">
          <div className="guide-content" data-aos="fade-right">
            <span className="guide-subtitle">Expert Knowledge</span>
            <h2 className="guide-title">Your Complete Land Buying Guide</h2>
            <p className="guide-description">
              Navigate the land buying process with confidence. Our comprehensive guide covers everything from 
              initial research to final registration.
            </p>
            
            <div className="guide-steps">
              {steps.map((step, index) => (
                <div key={index} className="guide-step">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={downloadGuide} className="download-guide-btn">
              Download Free Guide <FaArrowRight className="btn-icon" />
            </button>
          </div>
          
          <div className="guide-image" data-aos="fade-left">
            <img 
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Land Guide"
            />
            <div className="image-overlay">
              <div className="guide-badge">
                <span>Includes</span>
                <ul>
                  <li>✓ Due Diligence Checklist</li>
                  <li>✓ Document Templates</li>
                  <li>✓ Zoning Guide</li>
                  <li>✓ ROI Calculator</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandGuide;