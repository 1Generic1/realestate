import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDollarSign,
  FaBuilding,
  FaPaperPlane,
} from "react-icons/fa";
import "./RentalInquiryForm.css";

const RentalInquiryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    budget: "",
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        budget: "",
        type: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <section className="rent-inquiry">
      <div className="rent-container">
        <div className="rent-inquiry-wrapper">
          {/* Header */}
          <div className="rent-inquiry-header" data-aos="fade-up">
            <span className="rent-inquiry-tag">Find Your Rental</span>
            <h2 className="rent-inquiry-title">
              Tell Us What You're Looking For
            </h2>
            <p className="rent-inquiry-subtitle">
              Fill out the form below and our rental specialists will get back
              to you within 24 hours
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rent-inquiry-form"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="rent-form-row">
              <div className="rent-form-group">
                <FaUser className="rent-form-field-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rent-form-field"
                />
              </div>

              <div className="rent-form-group">
                <FaEnvelope className="rent-form-field-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rent-form-field"
                />
              </div>
            </div>

            <div className="rent-form-row">
              <div className="rent-form-group">
                <FaPhone className="rent-form-field-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="rent-form-field"
                />
              </div>

              <div className="rent-form-group">
                <FaMapMarkerAlt className="rent-form-field-icon" />
                <input
                  type="text"
                  name="location"
                  placeholder="Preferred Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="rent-form-field"
                />
              </div>
            </div>

            <div className="rent-form-row">
              <div className="rent-form-group">
                <FaDollarSign className="rent-form-field-icon" />
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="rent-form-field"
                >
                  <option value="">Budget Range</option>
                  <option value="0-3m">₦0 - ₦3M/year</option>
                  <option value="3-6m">₦3M - ₦6M/year</option>
                  <option value="6-10m">₦6M - ₦10M/year</option>
                  <option value="10m+">₦10M+/year</option>
                </select>
              </div>

              <div className="rent-form-group">
                <FaBuilding className="rent-form-field-icon" />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="rent-form-field"
                >
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div className="rent-form-group rent-form-full">
              <textarea
                name="message"
                rows="4"
                placeholder="Additional requirements or questions (optional)"
                value={formData.message}
                onChange={handleChange}
                className="rent-form-textarea"
              ></textarea>
            </div>

            <button
              type="submit"
              className="rent-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Inquiry"}
              {!isSubmitting && <FaPaperPlane className="rent-submit-icon" />}
            </button>

            {isSuccess && (
              <div className="rent-form-success">
                Thank you! We'll contact you shortly.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default RentalInquiryForm;
