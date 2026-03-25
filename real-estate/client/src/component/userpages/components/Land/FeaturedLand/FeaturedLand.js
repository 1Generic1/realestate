import React from "react";
import LandCard from "../LandCard/LandCard";
import "./FeaturedLand.css";

const FeaturedLand = () => {
  const featuredLands = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Prime Residential Plot",
      location: "Ikeja, Lagos",
      size: "500 sqm",
      price: "₦45,000,000",
      type: "Residential",
      features: ["Road Access", "Electricity", "Water", "C of O"],
      zoning: "Residential Zone",
      agent: "Sarah Johnson",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Commercial Development Land",
      location: "Victoria Island, Lagos",
      size: "1200 sqm",
      price: "₦120,000,000",
      type: "Commercial",
      features: ["High Traffic", "Planning Permit", "Utilities"],
      zoning: "Commercial Zone",
      agent: "Michael Chen",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Agricultural Farmland",
      location: "Ogun State",
      size: "5 hectares",
      price: "₦25,000,000",
      type: "Agricultural",
      features: ["Fertile Soil", "Water Access", "Road Network"],
      zoning: "Agricultural Zone",
      agent: "Folake Williams",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Mixed-Use Development Plot",
      location: "Lekki Phase 1",
      size: "2000 sqm",
      price: "₦85,000,000",
      type: "Mixed-Use",
      features: ["Corner Plot", "All Utilities", "Approved Layout"],
      zoning: "Mixed-Use Zone",
      agent: "Ahmed Hassan",
    },
  ];

  return (
    <section className="featured-land-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Featured Properties</span>
          <h2 className="section-title">Premium Land Listings</h2>
          <p className="section-description">
            Hand-picked land opportunities with high growth potential
          </p>
        </div>

        <div className="featured-grid">
          {featuredLands.map((land, index) => (
            <LandCard key={land.id} land={land} index={index} />
          ))}
        </div>

        <div className="view-all-wrapper" data-aos="fade-up">
          <button className="view-all-btn">View All Land Listings</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLand;
