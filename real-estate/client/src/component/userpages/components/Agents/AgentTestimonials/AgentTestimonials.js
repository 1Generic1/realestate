import React, { useState, useEffect } from "react";
import {
  FaQuoteRight,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { testimonialAPI } from "../../../../../services/adminApi";
import "./AgentTestimonials.css";

const AgentTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      // Fetch all approved testimonials
      const response = await testimonialAPI.getAllTestimonials({ limit: 10 });
      setTestimonials(response.data || []);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  if (loading) {
    return (
      <section className="agent-testimonials-section">
        <div className="container">
          <div className="testimonials-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentSlide];

  return (
    <section className="agent-testimonials-section">
      <div className="container">
        <div className="testimonials-header" data-aos="fade-up">
          <span className="testimonials-subtitle">Client Feedback</span>
          <h2 className="testimonials-title">
            What Clients Say About Our Agents
          </h2>
        </div>

        <div
          className="testimonials-slider"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="testimonial-card">
            <FaQuoteRight className="quote-icon" />
            <div className="testimonial-rating">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <FaStar key={i} className="star" />
              ))}
            </div>
            <p className="testimonial-text">"{currentTestimonial.content}"</p>
            <div className="testimonial-footer">
              <div className="testimonial-author">
                {currentTestimonial.image ? (
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                  />
                ) : (
                  <div className="default-avatar">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4>{currentTestimonial.name}</h4>
                  <p>{currentTestimonial.role || "Client"}</p>
                </div>
              </div>
            </div>
          </div>

          {testimonials.length > 1 && (
            <>
              <button className="slider-btn prev" onClick={prevSlide}>
                <FaChevronLeft />
              </button>
              <button className="slider-btn next" onClick={nextSlide}>
                <FaChevronRight />
              </button>

              <div className="slide-indicators">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AgentTestimonials;
