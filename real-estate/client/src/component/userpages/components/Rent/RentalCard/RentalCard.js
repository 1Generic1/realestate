import React from "react";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import "./RentalCard.css";

const RentalCard = ({ rental, index }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="rental-card">
      <div className="rental-card-image">
        <img src={rental.image} alt={rental.title} />
        {rental.featured && <span className="rental-card-badge">Featured</span>}
        <button
          className="rental-card-favorite"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="rental-card-content">
        <h3 className="rental-card-title">{rental.title}</h3>

        <div className="rental-card-location">
          <FaMapMarkerAlt className="rental-location-icon" />
          <span>{rental.location}</span>
        </div>

        <div className="rental-card-price">
          <span className="rental-price-amount">{rental.price}</span>
          <span className="rental-price-period">/{rental.period}</span>
        </div>

        <div className="rental-card-features">
          <div className="rental-feature">
            <FaBed />
            <span>{rental.beds} Beds</span>
          </div>
          <div className="rental-feature">
            <FaBath />
            <span>{rental.baths} Baths</span>
          </div>
          <div className="rental-feature">
            <FaRulerCombined />
            <span>{rental.area}</span>
          </div>
        </div>

        <div className="rental-card-footer">
          <span className="rental-card-type">{rental.type}</span>
          <button className="rental-card-button">Inquire</button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
