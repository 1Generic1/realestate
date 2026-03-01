import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";
import "./PropertyGrid.css";

const PropertyGrid = () => {
  const [favorites, setFavorites] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const properties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "Lekki Phase 1, Lagos",
      price: "₦250,000,000",
      type: "House",
      beds: 5,
      baths: 4,
      area: "450 sqm",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Featured",
      isNew: true,
    },
    {
      id: 2,
      title: "Executive 3-Bedroom Flat",
      location: "Victoria Island, Lagos",
      price: "₦85,000,000",
      type: "Flat",
      beds: 3,
      baths: 2,
      area: "180 sqm",
      image:
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Hot Deal",
      isNew: true,
    },
    {
      id: 3,
      title: "Prime Residential Land",
      location: "Ibeju-Lekki, Lagos",
      price: "₦45,000,000",
      type: "Land",
      beds: 0,
      baths: 0,
      area: "500 sqm",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Investment",
      isNew: false,
    },
    {
      id: 4,
      title: "Contemporary Duplex",
      location: "Banana Island, Lagos",
      price: "₦180,000,000",
      type: "Duplex",
      beds: 4,
      baths: 3,
      area: "350 sqm",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Premium",
      isNew: true,
    },
    {
      id: 5,
      title: "2-Bedroom Apartment",
      location: "Ikeja GRA, Lagos",
      price: "₦65,000,000",
      type: "Flat",
      beds: 2,
      baths: 2,
      area: "120 sqm",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Reduced",
      isNew: false,
    },
    {
      id: 6,
      title: "Commercial Plaza",
      location: "VI, Lagos",
      price: "₦350,000,000",
      type: "Commercial",
      beds: 0,
      baths: 2,
      area: "600 sqm",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Investment",
      isNew: true,
    },
    {
      id: 7,
      title: "Luxury Penthouse",
      location: "Ikoyi, Lagos",
      price: "₦420,000,000",
      type: "Penthouse",
      beds: 5,
      baths: 5,
      area: "550 sqm",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Luxury",
      isNew: true,
    },
    {
      id: 8,
      title: "Terrace Duplex",
      location: "Ajah, Lagos",
      price: "₦95,000,000",
      type: "Duplex",
      beds: 4,
      baths: 3,
      area: "280 sqm",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "New Listing",
      isNew: true,
    },
  ];

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, properties.length));
  };

  return (
    <section className="property-grid-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Browse Properties</span>
          <h2 className="section-title">Featured Properties for Sale</h2>
          <p className="section-description">
            Discover our hand-picked selection of premium properties
          </p>
        </div>

        <div className="properties-grid">
          {properties.slice(0, visibleCount).map((property, index) => (
            <div
              key={property.id}
              className="property-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="property-image">
                <img src={property.image} alt={property.title} />
                {property.badge && (
                  <span className="property-badge">{property.badge}</span>
                )}
                {property.isNew && <span className="new-badge">New</span>}
                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(property.id)}
                >
                  {favorites.includes(property.id) ? (
                    <FaHeart className="favorite-active" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>

              <div className="property-details">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-location">
                  <FaMapMarkerAlt className="location-icon" />
                  {property.location}
                </p>
                <p className="property-price">{property.price}</p>

                {property.type !== "Land" && property.type !== "Commercial" ? (
                  <div className="property-features">
                    <span className="feature">
                      <FaBed /> {property.beds} Beds
                    </span>
                    <span className="feature">
                      <FaBath /> {property.baths} Baths
                    </span>
                    <span className="feature">
                      <FaRulerCombined /> {property.area}
                    </span>
                  </div>
                ) : (
                  <div className="property-features">
                    <span className="feature">
                      <FaRulerCombined /> {property.area}
                    </span>
                    <span className="feature-type">{property.type}</span>
                  </div>
                )}

                <div className="property-footer">
                  <span className="property-type">{property.type}</span>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < properties.length && (
          <div className="load-more-wrapper" data-aos="fade-up">
            <button onClick={loadMore} className="load-more-btn">
              View More Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyGrid;
