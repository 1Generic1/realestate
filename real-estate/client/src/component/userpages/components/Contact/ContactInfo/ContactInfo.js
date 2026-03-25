import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useCompany } from "../../../../../context/CompanyContext";
import "./ContactInfo.css";

const ContactInfo = () => {
  const { company, getPhone, getEmail, getFullAddress, getBusinessHours } =
    useCompany();

  const businessHours = getBusinessHours();

  // Create contact data from database
  const contactInfoData = [
    {
      icon: <FaPhone />,
      title: "Phone",
      details: [
        company?.phone?.primary || "+234 (555) 123-4567",
        company?.phone?.secondary || "+234 (555) 765-4321",
      ].filter(Boolean), // Remove empty entries
      action: `tel:${company?.phone?.primary?.replace(/\D/g, "") || "+2345551234567"}`,
      actionText: "Call Now",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: [
        company?.email?.general || "info@tayesproperty.com",
        company?.email?.support || "support@tayesproperty.com",
      ].filter(Boolean),
      action: `mailto:${company?.email?.general || "info@tayesproperty.com"}`,
      actionText: "Send Email",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Office Address",
      details: [
        company?.address?.street || "123 Business District",
        `${company?.address?.city || "Lagos"}, ${company?.address?.country || "Nigeria"}`,
      ],
      action:
        company?.address?.mapLink || "https://maps.google.com/?q=Lagos,Nigeria",
      actionText: "Get Directions",
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: [
        `Mon-Fri: ${businessHours.weekdays}`,
        businessHours.saturday !== "Closed"
          ? `Sat: ${businessHours.saturday}`
          : null,
        businessHours.sunday !== "Closed"
          ? `Sun: ${businessHours.sunday}`
          : null,
      ].filter(Boolean),
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
