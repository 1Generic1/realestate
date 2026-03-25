import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa"; // Removed FaHome
import "./HomeHero.css";

const HomeHero = () => {
  return (
    <section className="home-hero">
      <div className="home-hero-overlay"></div>

      {/* Animated Background Particles */}
      <div className="home-hero-particles">
        <div className="home-particle home-particle-1"></div>
        <div className="home-particle home-particle-2"></div>
        <div className="home-particle home-particle-3"></div>
        <div className="home-particle home-particle-4"></div>
      </div>

      <div className="home-container">
        <div className="home-hero-content">
          {/* ICON SECTION REMOVED - Delete this entire block */}

          {/* Badge */}
          <span
            className="home-hero-badge"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Welcome to Excellence
          </span>

          {/* Title */}
          <h1
            className="home-hero-title"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Your Trusted Partner in{" "}
            <span className="home-gold-text">Property & Realty Solutions</span>
          </h1>

          {/* Description */}
          <p className="home-hero-text" data-aos="fade-up" data-aos-delay="300">
            With over 15 years of experience, we provide comprehensive real
            estate services backed by integrity, expertise, and a commitment to
            your success.
          </p>

          {/* CTA Buttons */}
          <div
            className="home-hero-buttons"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link to="/consultation" className="home-btn-primary">
              Schedule Consultation <FaArrowRight className="home-btn-icon" />
            </Link>
            <Link to="/about" className="home-btn-secondary">
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
