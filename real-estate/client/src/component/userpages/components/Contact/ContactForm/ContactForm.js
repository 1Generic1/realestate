import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { inquiryAPI } from "../../../../../services/api";
import "./ContactForm.css";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for message length
    if (formData.message.trim().length < 10) {
      toast.error(
        "Message must be at least 10 characters long. Please provide more details.",
      );
      return;
    }

    // Validate other required fields
    if (!formData.name || !formData.email || !formData.service) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestPayload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        serviceType: formData.service,
        inquiryType: "general",
        source: "contact_form",
      };

      if (formData.phone && formData.phone.trim() !== "") {
        requestPayload.phone = formData.phone;
      }

      const response = await inquiryAPI.submitInquiry(requestPayload);

      if (response && response.success === true) {
        toast.success(
          response.message ||
            "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        );

        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        toast.error(
          response?.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      let errorMessage =
        "Network error. Please check your connection and try again.";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    handleChange(e);
  };

  // Show character count for message
  const messageCharCount = formData.message.length;
  const isMessageValid = messageCharCount >= 10 || messageCharCount === 0;

  return (
    <div className="contact-form-container" data-aos="fade-right">
      <div className="contact-form-header">
        <span className="contact-form-subtitle">Send a Message</span>
        <h2 className="contact-form-title">We'd Love to Hear From You</h2>
        <p className="contact-form-description">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form-main">
        <div className="contact-form-row">
          <div className="contact-form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Full Name *"
              required
              disabled={isSubmitting}
              className="contact-form-input"
            />
          </div>
          <div className="contact-form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email *"
              required
              disabled={isSubmitting}
              className="contact-form-input"
            />
          </div>
        </div>

        <div className="contact-form-row">
          <div className="contact-form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Your Phone (Optional)"
              disabled={isSubmitting}
              className="contact-form-input"
            />
          </div>
          <div className="contact-form-group">
            <select
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="contact-form-select"
            >
              <option value="">Select Service *</option>
              <option value="acquisition">Property Acquisition</option>
              <option value="land">Land Banking</option>
              <option value="advisory">Realty Advisory</option>
              <option value="investment">Investment Solutions</option>
              <option value="legal">Legal & Compliance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="contact-form-group contact-form-group-full">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="5"
            placeholder="Your Message * (Minimum 10 characters)"
            required
            disabled={isSubmitting}
            className={`contact-form-textarea ${formData.message && !isMessageValid ? "contact-form-textarea-error" : ""}`}
          ></textarea>
          {formData.message && (
            <div
              className={`contact-form-char-count ${messageCharCount >= 10 ? "contact-form-char-valid" : "contact-form-char-invalid"}`}
            >
              {messageCharCount} / 10+ characters
              {messageCharCount < 10 && ` (Need ${10 - messageCharCount} more)`}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="contact-form-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
          <FaPaperPlane className="contact-form-send-icon" />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
