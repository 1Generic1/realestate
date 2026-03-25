import React from "react";
import "./ContactHero.css";

const ContactHero = () => {
  return (
    <section className="contact-hero">
      <div className="contact-hero-overlay"></div>
      <div className="container">
        <div className="contact-hero-content" data-aos="fade-up">
          <span className="contact-hero-badge">Get In Touch</span>
          <h1 className="contact-hero-title">
            Let's <span className="gold-text">Connect</span>
          </h1>
          <p className="contact-hero-text">
            Have questions about our services? Ready to start your property
            journey? We're here to help. Reach out to us today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
