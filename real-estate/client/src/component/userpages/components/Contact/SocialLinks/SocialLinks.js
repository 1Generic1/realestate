import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { useCompany } from "../../../../../context/CompanyContext";
import "./SocialLinks.css";

const SocialLinks = () => {
  const { company } = useCompany();

  // Define social media platforms with their icons and default colors
  const socialPlatforms = [
    {
      key: "facebook",
      icon: <FaFacebookF />,
      label: "Facebook",
      color: "#1877f2",
    },
    {
      key: "twitter",
      icon: <FaTwitter />,
      label: "Twitter",
      color: "#1da1f2",
    },
    {
      key: "linkedin",
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
      color: "#0077b5",
    },
    {
      key: "instagram",
      icon: <FaInstagram />,
      label: "Instagram",
      color: "#e4405f",
    },
  ];

  // Filter to only show social links that exist in the database
  const activeSocialLinks = socialPlatforms
    .map((platform) => ({
      ...platform,
      url: company?.social?.[platform.key],
    }))
    .filter((platform) => platform.url); // Only keep if URL exists in DB

  // If no social links are configured, don't render the section
  if (activeSocialLinks.length === 0) {
    return null;
  }

  return (
    <section className="social-connect-section">
      <div className="container">
        <div className="social-wrapper" data-aos="zoom-in">
          <h2 className="social-title">Connect With Us</h2>
          <p className="social-text">
            Follow us on social media for the latest property updates and real
            estate insights
          </p>
          <div className="social-links">
            {activeSocialLinks.map((social, index) => (
              <a
                key={social.key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={social.label}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                style={{ "--social-color": social.color }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;
