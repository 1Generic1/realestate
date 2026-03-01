import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import "./SocialLinks.css";

const SocialLinks = () => {
  const socialLinks = [
    {
      icon: <FaFacebookF />,
      url: "https://facebook.com",
      label: "Facebook",
      color: "#1877f2",
    },
    {
      icon: <FaTwitter />,
      url: "https://twitter.com",
      label: "Twitter",
      color: "#1da1f2",
    },
    {
      icon: <FaLinkedinIn />,
      url: "https://linkedin.com",
      label: "LinkedIn",
      color: "#0077b5",
    },
    {
      icon: <FaInstagram />,
      url: "https://instagram.com",
      label: "Instagram",
      color: "#e4405f",
    },
  ];

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
            {socialLinks.map((social, index) => (
              <a
                key={index}
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
