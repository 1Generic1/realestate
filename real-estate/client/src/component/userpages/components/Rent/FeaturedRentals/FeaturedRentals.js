import React from "react";
import RentalCard from "../RentalCard/RentalCard";
import "./FeaturedRentals.css";

const FeaturedRentals = () => {
  const rentals = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Luxury 3-Bedroom Apartment",
      location: "Ikoyi, Lagos",
      price: "₦8.5M",
      period: "year",
      beds: 3,
      baths: 2,
      area: "180 sqm",
      type: "Apartment",
      featured: true,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Cozy 2-Bedroom Flat",
      location: "Lekki Phase 1, Lagos",
      price: "₦4.2M",
      period: "year",
      beds: 2,
      baths: 2,
      area: "120 sqm",
      type: "Flat",
      featured: false,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Modern 4-Bedroom House",
      location: "Banana Island, Lagos",
      price: "₦12M",
      period: "year",
      beds: 4,
      baths: 3,
      area: "280 sqm",
      type: "House",
      featured: true,
    },
  ];

  return (
    <section className="rent-featured">
      <div className="rent-container">
        {/* Header */}
        <div className="rent-section-header" data-aos="fade-up">
          <span className="rent-section-tag">Featured Rentals</span>
          <h2 className="rent-section-title">Handpicked Properties</h2>
          <p className="rent-section-text">
            Discover our selection of premium rental properties
          </p>
        </div>

        {/* Grid */}
        <div className="rent-featured-grid">
          {rentals.map((rental, index) => (
            <div
              key={rental.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <RentalCard rental={rental} />
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="rent-view-all" data-aos="fade-up">
          <a href="/rent/all" className="rent-view-all-link">
            View All Rentals
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRentals;
