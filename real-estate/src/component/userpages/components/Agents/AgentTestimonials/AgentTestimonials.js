import React, { useState } from "react";
import {
  FaQuoteRight,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./AgentTestimonials.css";

const AgentTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Chief Obiora Eze",
      role: "Real Estate Investor",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Sarah Johnson helped me find the perfect investment property. Her market knowledge and negotiation skills are exceptional. I couldn't be happier with the results.",
      agent: "Sarah Johnson",
      rating: 5,
    },
    {
      name: "Mrs. Folake Williams",
      role: "Land Developer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Michael Chen's expertise in commercial real estate is unmatched. He guided us through every step of acquiring our office space. Highly recommended!",
      agent: "Michael Chen",
      rating: 5,
    },
    {
      name: "Dr. Ahmed Bello",
      role: "Home Buyer",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      text: "Working with Chioma was a pleasure. She understood exactly what we were looking for and found us our dream home within our budget.",
      agent: "Chioma Okafor",
      rating: 5,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

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
              {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                <FaStar key={i} className="star" />
              ))}
            </div>
            <p className="testimonial-text">
              "{testimonials[currentSlide].text}"
            </p>
            <div className="testimonial-footer">
              <div className="testimonial-author">
                <img
                  src={testimonials[currentSlide].image}
                  alt={testimonials[currentSlide].name}
                />
                <div>
                  <h4>{testimonials[currentSlide].name}</h4>
                  <p>{testimonials[currentSlide].role}</p>
                </div>
              </div>
              <div className="testimonial-agent">
                <span>
                  Worked with:{" "}
                  <strong>{testimonials[currentSlide].agent}</strong>
                </span>
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </section>
  );
};

export default AgentTestimonials;
