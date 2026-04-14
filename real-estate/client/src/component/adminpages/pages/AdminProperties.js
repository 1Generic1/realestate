import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaStar,
  FaRegStar,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaBed,
  FaBath,
  FaRuler,
  FaMapMarkerAlt,
} from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { propertyAPI } from "../../../services/adminApi";
import "./AdminProperties.css";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "buy",
    category: "house",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    sizeSqm: "",
    description: "",
    features: "",
    status: "available",
    featured: false,
    address: {
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadProperties();
  }, [currentPage, statusFilter, typeFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (statusFilter !== "all") params.status = statusFilter;
      if (typeFilter !== "all") params.type = typeFilter;

      const response = await propertyAPI.getAllPropertiesAdmin(params);
      setProperties(response.data || []);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage),
      );
    } catch (error) {
      toast.error("Failed to load properties");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        title: property.title || "",
        type: property.type || "buy",
        category: property.category || "house",
        price: property.price || "",
        location: property.location || "",
        bedrooms: property.bedrooms || "",
        bathrooms: property.bathrooms || "",
        size: property.size || "",
        sizeSqm: property.sizeSqm || "",
        description: property.description || "",
        features: property.features ? property.features.join(", ") : "",
        status: property.status || "available",
        featured: property.featured || false,
        address: property.address || {
          street: "",
          city: "",
          state: "",
          country: "Nigeria",
        },
      });
      setImagePreviews(property.images || []);
      setImageFiles([]);
    } else {
      setEditingProperty(null);
      setFormData({
        title: "",
        type: "buy",
        category: "house",
        price: "",
        location: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        sizeSqm: "",
        description: "",
        features: "",
        status: "available",
        featured: false,
        address: {
          street: "",
          city: "",
          state: "",
          country: "Nigeria",
        },
      });
      setImagePreviews([]);
      setImageFiles([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProperty(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imagePreviews.length + files.length > 10) {
      toast.error("Maximum 10 images allowed per property");
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (imageFiles[index]) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.price ||
      !formData.location ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!editingProperty && imagePreviews.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingProperty) {
        await propertyAPI.updateProperty(editingProperty._id, {
          ...formData,
          features: formData.features.split(",").map((f) => f.trim()),
        });
        toast.success("Property updated successfully");
      } else {
        const submitFormData = new FormData();
        submitFormData.append("title", formData.title);
        submitFormData.append("type", formData.type);
        submitFormData.append("category", formData.category);
        submitFormData.append("price", formData.price);
        submitFormData.append("location", formData.location);
        submitFormData.append("bedrooms", formData.bedrooms);
        submitFormData.append("bathrooms", formData.bathrooms);
        submitFormData.append("size", formData.size);
        submitFormData.append("sizeSqm", formData.sizeSqm);
        submitFormData.append("description", formData.description);
        submitFormData.append(
          "features",
          JSON.stringify(formData.features.split(",").map((f) => f.trim())),
        );
        submitFormData.append("status", formData.status);
        submitFormData.append("featured", formData.featured);
        submitFormData.append("address", JSON.stringify(formData.address));

        imageFiles.forEach((file) => {
          submitFormData.append("images", file);
        });

        await propertyAPI.createProperty(submitFormData);
        toast.success("Property created successfully");
      }

      handleCloseModal();
      loadProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (property) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${property.title}"? This action cannot be undone.`,
      )
    ) {
      try {
        await propertyAPI.deleteProperty(property._id);
        toast.success("Property deleted successfully");
        loadProperties();
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  const handleToggleFeatured = async (property) => {
    try {
      await propertyAPI.toggleFeatured(property._id);
      toast.success(
        `Property ${!property.featured ? "added to" : "removed from"} featured`,
      );
      loadProperties();
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  const handleOpenViewModal = (property) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProperty(null);
  };

  const handleOpenImageModal = (images, index = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1,
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <span className="status-badge status-available">✅ Available</span>
        );
      case "sold":
        return <span className="status-badge status-sold">💰 Sold</span>;
      case "rented":
        return <span className="status-badge status-rented">🏠 Rented</span>;
      case "pending":
        return <span className="status-badge status-pending">⏳ Pending</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "buy":
        return "💰";
      case "rent":
        return "🏠";
      case "land":
        return "🌾";
      default:
        return "🏠";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "₦0";
    return `₦${price.toLocaleString()}`;
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-properties-loading">
          <div className="loading-spinner"></div>
          <p>Loading properties...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-properties">
        {/* Header */}
        <div className="admin-properties-header">
          <div>
            <h2>Property Management</h2>
            <p>Manage all property listings, images, and details</p>
          </div>
          <button className="btn-add" onClick={() => handleOpenModal()}>
            <FaPlus /> Add New Property
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-info">
              <h3>{properties.length}</h3>
              <p>Total Properties</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>
                {properties.filter((p) => p.status === "available").length}
              </h3>
              <p>Available</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{properties.filter((p) => p.featured).length}</h3>
              <p>Featured</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <h3>
                {properties
                  .reduce((sum, p) => sum + (p.views || 0), 0)
                  .toLocaleString()}
              </h3>
              <p>Total Views</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-properties-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
              <option value="land">Land</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Properties Table */}
        <div className="admin-properties-table-container">
          <table className="admin-properties-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title / Location</th>
                <th>Type</th>
                <th>Price</th>
                <th>Details</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property._id}>
                    <td className="image-cell">
                      {property.thumbnail ? (
                        <img
                          src={property.thumbnail}
                          alt={property.title}
                          className="property-thumb"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleOpenImageModal(property.images, 0)
                          }
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td className="title-cell">
                      <div className="property-title">{property.title}</div>
                      <div className="property-location">
                        <FaMapMarkerAlt /> {property.location}
                      </div>
                    </td>
                    <td className="type-cell">
                      <span className="type-badge">
                        {getTypeIcon(property.type)} {property.type}
                      </span>
                    </td>
                    <td className="price-cell">
                      {formatPrice(property.price)}
                    </td>
                    <td className="details-cell">
                      <div className="property-details">
                        {property.bedrooms > 0 && (
                          <span>
                            <FaBed /> {property.bedrooms}
                          </span>
                        )}
                        {property.bathrooms > 0 && (
                          <span>
                            <FaBath /> {property.bathrooms}
                          </span>
                        )}
                        {property.size && (
                          <span>
                            <FaRuler /> {property.size}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="status-cell">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="featured-cell">
                      <button
                        className={`featured-btn ${property.featured ? "active" : ""}`}
                        onClick={() => handleToggleFeatured(property)}
                      >
                        {property.featured ? <FaStar /> : <FaRegStar />}
                      </button>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view"
                        onClick={() => handleOpenViewModal(property)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => handleOpenModal(property)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(property)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <p>No properties found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="page-btn"
            >
              <FaChevronLeft />
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* ==================== VIEW PROPERTY MODAL ==================== */}
      {showViewModal && selectedProperty && (
        <div className="propertymodal-overlay" onClick={handleCloseViewModal}>
          <div
            className="propertymodal-content view-property-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="propertymodal-header">
              <h3>{selectedProperty.title}</h3>
              <button
                className="propertymodal-close"
                onClick={handleCloseViewModal}
              >
                ×
              </button>
            </div>
            <div className="propertymodal-body">
              <div className="property-images-preview">
                {selectedProperty.images &&
                selectedProperty.images.length > 0 ? (
                  selectedProperty.images.slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${selectedProperty.title} ${idx + 1}`}
                      onClick={() => {
                        handleCloseViewModal();
                        handleOpenImageModal(selectedProperty.images, idx);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  ))
                ) : (
                  <div className="no-images-message">No images available</div>
                )}
                {selectedProperty.images &&
                  selectedProperty.images.length > 4 && (
                    <div className="more-images">
                      +{selectedProperty.images.length - 4} more
                    </div>
                  )}
              </div>
              <div className="property-info">
                <div className="info-row">
                  <strong>Location:</strong> {selectedProperty.location}
                </div>
                <div className="info-row">
                  <strong>Price:</strong> {formatPrice(selectedProperty.price)}
                </div>
                <div className="info-row">
                  <strong>Type:</strong> {selectedProperty.type}
                </div>
                <div className="info-row">
                  <strong>Status:</strong> {selectedProperty.status}
                </div>
                {selectedProperty.bedrooms > 0 && (
                  <div className="info-row">
                    <strong>Bedrooms:</strong> {selectedProperty.bedrooms}
                  </div>
                )}
                {selectedProperty.bathrooms > 0 && (
                  <div className="info-row">
                    <strong>Bathrooms:</strong> {selectedProperty.bathrooms}
                  </div>
                )}
                {selectedProperty.size && (
                  <div className="info-row">
                    <strong>Size:</strong> {selectedProperty.size}
                  </div>
                )}
                <div className="info-row full">
                  <strong>Description:</strong>
                  <p>{selectedProperty.description}</p>
                </div>
                {selectedProperty.features &&
                  selectedProperty.features.length > 0 && (
                    <div className="info-row full">
                      <strong>Features:</strong>
                      <div className="features-list">
                        {selectedProperty.features.map((f, i) => (
                          <span key={i} className="feature-tag">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="propertymodal-footer">
              <button className="btn-secondary" onClick={handleCloseViewModal}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  handleCloseViewModal();
                  handleOpenModal(selectedProperty);
                }}
              >
                Edit Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== IMAGE GALLERY MODAL ==================== */}
      {showImageModal && currentImages.length > 0 && (
        <div className="propertymodal-overlay" onClick={handleCloseImageModal}>
          <div
            className="propertymodal-content image-gallery-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="propertymodal-header">
              <h3>Property Images</h3>
              <button
                className="propertymodal-close"
                onClick={handleCloseImageModal}
              >
                ×
              </button>
            </div>
            <div className="gallery-container">
              <img
                src={currentImages[currentImageIndex]}
                alt={`Gallery ${currentImageIndex + 1}`}
              />
              {currentImages.length > 1 && (
                <>
                  <button
                    className="gallery-nav prev"
                    onClick={handlePrevImage}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="gallery-nav next"
                    onClick={handleNextImage}
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              <div className="gallery-indicators">
                {currentImages.map((_, i) => (
                  <button
                    key={i}
                    className={`gallery-dot ${i === currentImageIndex ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD/EDIT PROPERTY MODAL - ALL FIELDS ON ONE PAGE ==================== */}
      {showModal && (
        <div className="propertymodal-overlay" onClick={handleCloseModal}>
          <div
            className="propertymodal-content property-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="propertymodal-header">
              <h3>{editingProperty ? "Edit Property" : "Add New Property"}</h3>
              <button
                className="propertymodal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="property-form">
              <div className="property-form-scroll">
                <div className="form-row">
                  <div className="form-group full">
                    <label>Property Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="buy">Buy</option>
                      <option value="rent">Rent</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="flat">Flat</option>
                      <option value="duplex">Duplex</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₦) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Size (e.g., 450 sqm)</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Size (sqm) - Numeric</label>
                    <input
                      type="number"
                      name="sizeSqm"
                      value={formData.sizeSqm}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group full">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Features (comma separated)</label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    placeholder="Pool, Garden, Parking, etc."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      <span>Featured Property</span>
                    </label>
                  </div>
                </div>

                <div className="form-group full">
                  <label>Property Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <small>
                    Maximum 10 images. First image will be thumbnail.
                  </small>
                  <div className="image-previews">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="image-preview-item">
                        <img src={preview} alt={`Preview ${idx + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(idx)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="propertymodal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingProperty
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProperties;
