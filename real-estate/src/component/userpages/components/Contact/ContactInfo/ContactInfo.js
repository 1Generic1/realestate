import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "./ContactInfo.css";

const ContactInfo = () => {
  const contactInfoData = [
    {
      icon: <FaPhone />,
      title: "Phone",
      details: ["+234 (555) 123-4567", "+234 (555) 765-4321"],
      action: "tel:+2345551234567",
      actionText: "Call Now",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: ["info@tayesproperty.com", "support@tayesproperty.com"],
      action: "mailto:info@tayesproperty.com",
      actionText: "Send Email",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Office Address",
      details: ["123 Business District", "Lagos, Nigeria"],
      action: "https://maps.google.com/?q=Lagos,Nigeria",
      actionText: "Get Directions",
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: ["Mon-Fri: 8AM - 6PM", "Sat: 9AM - 2PM", "Sun: Closed"],
      action: null,
      actionText: null,
    },
  ];

  return (
    <section className="contact-info-section">
      <div className="container">
        <div className="info-grid">
          {contactInfoData.map((item, index) => (
            <div
              key={index}
              className="info-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="info-icon-wrapper">
                <div className="info-icon">{item.icon}</div>
              </div>
              <h3 className="info-title">{item.title}</h3>
              {item.details.map((detail, idx) => (
                <p key={idx} className="info-detail">
                  {detail}
                </p>
              ))}
              {item.action && (
                <a
                  href={item.action}
                  className="info-action"
                  target={item.action.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                >
                  {item.actionText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
