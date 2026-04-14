import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";
import { publicPropertyAPI } from "../../../../../services/adminApi";
import "./PropertyGrid.css";

const PropertyGrid = ({ searchTerm, propertyType, priceRange }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
    loadProperties();
  }, [searchTerm, propertyType, priceRange]);

  useEffect(() => {
    if (currentPage > 1) {
      loadProperties();
    }
  }, [currentPage]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add search term
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm;
      }

      // Add property type filter
      if (propertyType && propertyType !== "") {
        params.category = propertyType;
      }

      // Add price filter
      if (priceRange && priceRange !== "all" && priceRange !== "") {
        if (priceRange.includes("-")) {
          const [min, max] = priceRange.split("-");
          if (max) {
            params.minPrice = parseInt(min);
            params.maxPrice = parseInt(max);
          }
        } else if (priceRange === "100000000+") {
          params.minPrice = 100000000;
        }
      }

      console.log("Fetching properties with params:", params);

      const response = await publicPropertyAPI.getPropertiesByType(
        "buy",
        params,
      );

      setProperties(response.data || []);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage),
      );
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const formatPrice = (price) => {
    if (!price) return "₦0";
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B`;
    } else if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const getDisplayType = (category, type) => {
    if (type === "land") return "Land";
    const types = {
      house: "House",
      apartment: "Apartment",
      flat: "Flat",
      duplex: "Duplex",
      commercial: "Commercial",
      penthouse: "Penthouse",
    };
    return types[category] || category || "Property";
  };

  const getBadge = (property) => {
    if (property.featured) return "Featured";
    if (property.status === "sold") return "Sold";
    if (property.status === "pending") return "Pending";
    return null;
  };

  const isNewProperty = (createdAt) => {
    const createdDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  };

  if (loading && properties.length === 0) {
    return (
      <section className="property-grid-section">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading properties...</p>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Search Results Info */}
        {(searchTerm ||
          propertyType ||
          (priceRange && priceRange !== "all" && priceRange !== "")) &&
          !loading && (
            <div className="search-results-info">
              <p>
                Found {properties.length} propert
                {properties.length !== 1 ? "ies" : "y"}
                {searchTerm && (
                  <span className="search-term"> matching "{searchTerm}"</span>
                )}
                {propertyType && (
                  <span className="filter-badge"> {propertyType}</span>
                )}
                {priceRange && priceRange !== "all" && priceRange !== "" && (
                  <span className="filter-badge price">
                    {" "}
                    Selected price range
                  </span>
                )}
              </p>
              {(searchTerm ||
                propertyType ||
                (priceRange && priceRange !== "all" && priceRange !== "")) && (
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

        {properties.length === 0 && !loading ? (
          <div className="no-results">
            <p>No properties found matching your criteria.</p>
            <button
              className="clear-filters-btn"
              onClick={() => window.location.reload()}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="properties-grid">
              {properties.map((property, index) => {
                const displayType = getDisplayType(
                  property.category,
                  property.type,
                );
                const isLand = property.type === "land";
                const badge = getBadge(property);
                const isNew = isNewProperty(property.createdAt);
                const imageUrl =
                  property.thumbnail ||
                  property.images?.[0] ||
                  "/placeholder-property.jpg";

                return (
                  <div
                    key={property._id}
                    className="property-card"
                    data-aos="fade-up"
                    data-aos-delay={(index % 6) * 100}
                  >
                    <div className="property-image">
                      <img src={imageUrl} alt={property.title} />
                      {badge && <span className="property-badge">{badge}</span>}
                      {isNew && <span className="new-badge">New</span>}
                      <button
                        className="favorite-btn"
                        onClick={() => toggleFavorite(property._id)}
                      >
                        {favorites.includes(property._id) ? (
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
                      <p className="property-price">
                        {formatPrice(property.price)}
                      </p>

                      {!isLand && property.type !== "land" ? (
                        <div className="property-features">
                          {property.bedrooms > 0 && (
                            <span className="feature">
                              <FaBed /> {property.bedrooms} Beds
                            </span>
                          )}
                          {property.bathrooms > 0 && (
                            <span className="feature">
                              <FaBath /> {property.bathrooms} Baths
                            </span>
                          )}
                          <span className="feature">
                            <FaRulerCombined />{" "}
                            {property.size || `${property.sizeSqm || 0} sqm`}
                          </span>
                        </div>
                      ) : (
                        <div className="property-features">
                          <span className="feature">
                            <FaRulerCombined />{" "}
                            {property.size || `${property.sizeSqm || 0} sqm`}
                          </span>
                          <span className="feature-type">{displayType}</span>
                        </div>
                      )}

                      <div className="property-footer">
                        <span className="property-type">{displayType}</span>
                        <button
                          className="view-details-btn"
                          onClick={() =>
                            (window.location.href = `/property/${property._id}`)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && currentPage < totalPages && (
              <div className="load-more-wrapper" data-aos="fade-up">
                <button
                  onClick={loadMore}
                  className="load-more-btn"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "View More Properties"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PropertyGrid;
