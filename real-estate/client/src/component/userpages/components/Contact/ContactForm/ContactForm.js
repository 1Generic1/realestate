import React, { useState } from "react";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import "./ContactForm.css";

const ContactForm = () => {
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitted: true, success: false, message: "Sending..." });

    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: "Thank you! Your message has been sent successfully.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="form-container" data-aos="fade-right">
      <div className="form-header">
        <span className="form-subtitle">Send a Message</span>
        <h2 className="form-title">We'd Love to Hear From You</h2>
        <p className="form-description">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone"
              required
            />
          </div>
          <div className="form-group">
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select Service</option>
              <option value="acquisition">Property Acquisition</option>
              <option value="land">Land Banking</option>
              <option value="advisory">Realty Advisory</option>
              <option value="investment">Investment Solutions</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group full">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            placeholder="Your Message"
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Send Message <FaPaperPlane className="send-icon" />
        </button>
      </form>

      {formStatus.submitted && formStatus.success && (
        <div className="form-success" data-aos="fade-up">
          <FaCheckCircle className="success-icon" />
          <p>{formStatus.message}</p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
