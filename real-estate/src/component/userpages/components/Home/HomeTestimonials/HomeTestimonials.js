import React from "react";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import "./HomeTestimonials.css";

const HomeTestimonials = () => {
  const testimonials = [
    {
      name: "Chief Adebayo O.",
      role: "Property Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "TAYE'S PROPERTY transformed our investment approach. Their market insights and professional guidance have been invaluable to our portfolio growth.",
      rating: 5,
    },
    {
      name: "Mrs. Folake Williams",
      role: "Land Investor",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "The team's integrity and expertise in land banking is unmatched. They helped me secure prime property that has appreciated significantly.",
      rating: 5,
    },
    {
      name: "Dr. Michael Okonkwo",
      role: "Commercial Client",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      text: "From consultation to completion, their advisory services were exceptional. Truly a partner you can trust with your real estate dreams.",
      rating: 5,
    },
  ];

  return (
    <section className="home-testimonials">
      <div className="home-container">
        <div className="home-section-header" data-aos="fade-up">
          <span className="home-section-tag">Client Stories</span>
          <h2 className="home-section-title">What Our Clients Say</h2>
          <p className="home-section-text">
            Real experiences from those who trusted us with their property
            journey
          </p>
        </div>

        <div className="home-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="home-testimonial-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <FaQuoteRight className="home-quote-icon" />
              <div className="home-testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="home-star" />
                ))}
              </div>
              <p className="home-testimonial-text">"{testimonial.text}"</p>
              <div className="home-testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
