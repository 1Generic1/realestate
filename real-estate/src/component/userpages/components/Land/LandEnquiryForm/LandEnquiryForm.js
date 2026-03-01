import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import "./LandEnquiryForm.css";

const LandEnquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    landType: "",
    budget: "",
    timeline: "",
    location: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setSubmitStatus("success");
      setIsSubmitting(false);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          landType: "",
          budget: "",
          timeline: "",
          location: "",
          message: "",
        });
      }, 3000);
    }, 1500);
  };

  return (
    <section className="enquiry-form-section">
      <div className="container">
        <div className="form-wrapper" data-aos="fade-up">
          <div className="form-header">
            <span className="form-subtitle">Serious About Land?</span>
            <h2 className="form-title">Make an Enquiry</h2>
            <p className="form-description">
              Tell us what you're looking for and our land specialists will get
              back to you within 24 hours
            </p>
          </div>

          {submitStatus === "success" ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Thank You!</h3>
              <p>
                Your enquiry has been sent. A land specialist will contact you
                shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="form-row">
                <div className="form-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone *"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Preferred Location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <FaMapMarkerAlt className="input-icon" />
                  <select
                    name="landType"
                    value={formData.landType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Land Type *</option>
                    <option value="residential">Residential Land</option>
                    <option value="commercial">Commercial Land</option>
                    <option value="agricultural">Agricultural Land</option>
                    <option value="industrial">Industrial Land</option>
                    <option value="mixed">Mixed-Use Development</option>
                  </select>
                </div>
                <div className="form-group">
                  <FaDollarSign className="input-icon" />
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Budget Range *</option>
                    <option value="5-10m">₦5 - ₦10 million</option>
                    <option value="10-25m">₦10 - ₦25 million</option>
                    <option value="25-50m">₦25 - ₦50 million</option>
                    <option value="50-100m">₦50 - ₦100 million</option>
                    <option value="100m+">₦100 million+</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <FaClock className="input-icon" />
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                  >
                    <option value="">When do you plan to buy?</option>
                    <option value="immediate">Immediately</option>
                    <option value="1-3months">1-3 months</option>
                    <option value="3-6months">3-6 months</option>
                    <option value="6-12months">6-12 months</option>
                    <option value="researching">Just researching</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Additional details or questions..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Submit Enquiry"}
                {!isSubmitting && <FaPaperPlane className="btn-icon" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandEnquiryForm;
