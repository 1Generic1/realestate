import React from "react";
import "./RecentlySold.css";

const RecentlySold = () => {
  const soldProperties = [
    {
      id: 1,
      title: "4-Bedroom Duplex",
      location: "Lekki Phase 1",
      price: "₦145,000,000",
      soldDate: "Feb 2026",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "3-Bedroom Flat",
      location: "Victoria Island",
      price: "₦95,000,000",
      soldDate: "Feb 2026",
      image:
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "Land Plot",
      location: "Ibeju-Lekki",
      price: "₦38,000,000",
      soldDate: "Jan 2026",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "Commercial Space",
      location: "Ikeja",
      price: "₦210,000,000",
      soldDate: "Jan 2026",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <section className="recently-sold-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Market Activity</span>
          <h2 className="section-title">Recently Sold Properties</h2>
          <p className="section-description">
            See what properties are selling for in today's market
          </p>
        </div>

        <div className="sold-grid">
          {soldProperties.map((property, index) => (
            <div
              key={property.id}
              className="sold-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="sold-image">
                <img src={property.image} alt={property.title} />
                <span className="sold-badge">Sold</span>
              </div>
              <div className="sold-details">
                <h4>{property.title}</h4>
                <p className="sold-location">{property.location}</p>
                <p className="sold-price">{property.price}</p>
                <p className="sold-date">Sold: {property.soldDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlySold;
