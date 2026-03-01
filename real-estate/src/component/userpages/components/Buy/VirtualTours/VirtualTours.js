import React, { useState } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./VirtualTours.css";

const VirtualTours = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const tours = [
    {
      id: 1,
      title: "Luxury Villa, Lekki",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      views: "2.5k views",
    },
    {
      id: 2,
      title: "Modern Duplex, Ikoyi",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      views: "1.8k views",
    },
    {
      id: 3,
      title: "Penthouse, VI",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      views: "3.2k views",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tours.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tours.length) % tours.length);
  };

  return (
    <section className="virtual-tours-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">360° Experience</span>
          <h2 className="section-title">Virtual Property Tours</h2>
          <p className="section-description">
            Explore properties from anywhere with our immersive 3D tours
          </p>
        </div>

        <div className="tours-slider" data-aos="fade-up">
          <div className="slider-container">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {tours.map((tour) => (
                <div key={tour.id} className="tour-slide">
                  <div className="tour-image">
                    <img src={tour.image} alt={tour.title} />
                    <div className="tour-overlay">
                      <button className="play-button">
                        <FaPlay />
                      </button>
                      <div className="tour-info">
                        <h3>{tour.title}</h3>
                        <span>{tour.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="slider-btn prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="slider-btn next" onClick={nextSlide}>
            <FaChevronRight />
          </button>

          <div className="slider-dots">
            {tours.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="tours-grid">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className="tour-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img src={tour.image} alt={tour.title} />
              <div className="tour-card-overlay">
                <button className="small-play-btn">
                  <FaPlay />
                </button>
                <h4>{tour.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VirtualTours;
