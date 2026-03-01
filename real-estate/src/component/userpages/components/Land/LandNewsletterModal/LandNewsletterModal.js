import React, { useState, useEffect } from "react";
import { FaTimes, FaCheckCircle, FaBook, FaArrowRight } from "react-icons/fa";
import "./LandNewsletterModal.css";

const LandNewsletterModal = ({ isOpen, onClose, onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [landInterest, setLandInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubscribe(email);
      setIsSuccess(true);
      setIsSubmitting(false);

      // Reset form after 2 seconds and close
      setTimeout(() => {
        setIsSuccess(false);
        setEmail("");
        setName("");
        setLandInterest("");
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    // Don't close if submitting
    if (isSubmitting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}></div>
      <div className="modal-container" role="dialog" aria-modal="true">
        <button
          className="modal-close"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          <FaTimes />
        </button>

        {!isSuccess ? (
          <>
            <div className="modal-header">
              <div className="modal-icon">
                <FaBook />
              </div>
              <h2 className="modal-title">Free Land Investment Guide</h2>
              <p className="modal-subtitle">
                Get our comprehensive guide with 10 essential things to know
                before buying land
              </p>
            </div>

            <div className="modal-benefits">
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Due diligence checklist</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Zoning and planning secrets</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>ROI calculation methods</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Red flags to avoid</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Financing options explained</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <select
                  value={landInterest}
                  onChange={(e) => setLandInterest(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">I'm interested in (Optional)</option>
                  <option value="residential">Residential Land</option>
                  <option value="commercial">Commercial Land</option>
                  <option value="agricultural">Agricultural Land</option>
                  <option value="investment">Investment Opportunities</option>
                </select>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Download Free Guide"}
                {!isSubmitting && <FaArrowRight className="btn-icon" />}
              </button>
            </form>

            <p className="privacy-note">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>

            <div className="modal-footer">
              <button className="footer-link" onClick={handleClose}>
                Maybe later
              </button>
              <button className="footer-link" onClick={handleClose}>
                No thanks
              </button>
            </div>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>Thank You!</h3>
            <p>Your guide has been sent to {email}</p>
            <p className="success-note">Please check your inbox</p>
          </div>
        )}
      </div>
    </>
  );
};

export default LandNewsletterModal;
