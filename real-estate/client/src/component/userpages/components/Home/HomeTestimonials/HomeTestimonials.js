import React, { useState, useEffect } from "react";
import {
  FaQuoteRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { testimonialAPI } from "../../../../../services/adminApi";
import "./HomeTestimonials.css";

const HomeTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    loadTestimonials();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await testimonialAPI.getFeaturedTestimonials(10);
      setTestimonials(response.data || []);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setCardsToShow(1);
    } else if (window.innerWidth <= 1024) {
      setCardsToShow(2);
    } else {
      setCardsToShow(3);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FaStar key={i} className="home-star" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="home-star" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="home-star empty" />);
    }
    return stars;
  };

  const goToPrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, testimonials.length - cardsToShow),
    );
  };

  const visibleTestimonials = testimonials.slice(
    startIndex,
    startIndex + cardsToShow,
  );

  if (loading) {
    return (
      <section className="home-testimonials">
        <div className="home-container">
          <div className="testimonials-loading">
            <div className="loading-spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="home-testimonials">
      <div className="home-container">
        {/* Section Header */}
        <div className="home-section-header" data-aos="fade-up">
          <span className="home-section-tag">Testimonials</span>
          <h2 className="home-section-title">
            What Our <span className="gold-text">Clients Say</span>
          </h2>
          <p className="home-section-text">
            Real stories from people who found their dream properties with us
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="testimonials-slider-container">
          {/* Navigation Arrows */}
          {startIndex > 0 && (
            <button className="slider-arrow prev" onClick={goToPrevious}>
              <FaChevronLeft />
            </button>
          )}

          {/* Testimonials Grid */}
          <div className="home-testimonials-grid">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className="home-testimonial-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <FaQuoteRight className="home-quote-icon" />
                <div className="home-testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="home-testimonial-text">"{testimonial.content}"</p>
                <div className="home-testimonial-author">
                  {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name} />
                  ) : (
                    <div className="author-avatar-placeholder">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role || "Happy Client"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Arrow */}
          {startIndex + cardsToShow < testimonials.length && (
            <button className="slider-arrow next" onClick={goToNext}>
              <FaChevronRight />
            </button>
          )}
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {Array.from({
            length: Math.ceil(testimonials.length / cardsToShow),
          }).map((_, index) => (
            <button
              key={index}
              className={`indicator ${Math.floor(startIndex / cardsToShow) === index ? "active" : ""}`}
              onClick={() => setStartIndex(index * cardsToShow)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
