import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaStar,
  FaRegStar,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { testimonialAPI } from "../../../services/adminApi";
import "./AdminTestimonials.css";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    featured: false,
    displayOrder: 0,
    status: "approved",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load testimonials when statusFilter changes
  useEffect(() => {
    loadTestimonials();
  }, [statusFilter]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      // For "all" tab, don't send any status filter to get ALL testimonials
      // For specific status tabs, send the status parameter
      const params = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const response = await testimonialAPI.getAllTestimonialsAdmin(params);
      setTestimonials(response.data || []);
    } catch (error) {
      toast.error("Failed to load testimonials");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name || "",
        role: testimonial.role || "",
        company: testimonial.company || "",
        content: testimonial.content || "",
        rating: testimonial.rating || 5,
        featured: testimonial.featured || false,
        displayOrder: testimonial.displayOrder || 0,
        status: testimonial.status || "approved",
      });
      setImagePreview(testimonial.image || "");
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
        featured: false,
        displayOrder: 0,
        status: "approved",
      });
      setImagePreview("");
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setImageFile(null);
    setImagePreview("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.content) {
      toast.error("Name and testimonial content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      let testimonialId = editingTestimonial?._id;

      if (editingTestimonial) {
        // Update text fields
        await testimonialAPI.updateTestimonial(testimonialId, {
          name: formData.name,
          role: formData.role,
          company: formData.company,
          content: formData.content,
          rating: formData.rating,
          featured: formData.featured,
          displayOrder: formData.displayOrder,
          status: formData.status,
        });

        // Upload new image if selected
        if (imageFile) {
          await testimonialAPI.uploadTestimonialImage(testimonialId, imageFile);
        }

        toast.success("Testimonial updated successfully");
      } else {
        // Create new testimonial with image
        const submitFormData = new FormData();
        submitFormData.append("name", formData.name);
        submitFormData.append("role", formData.role);
        submitFormData.append("company", formData.company);
        submitFormData.append("content", formData.content);
        submitFormData.append("rating", formData.rating);
        submitFormData.append("featured", formData.featured);
        submitFormData.append("displayOrder", formData.displayOrder);
        submitFormData.append("status", formData.status);
        if (imageFile) {
          submitFormData.append("image", imageFile);
        }

        await testimonialAPI.createTestimonial(submitFormData);
        toast.success("Testimonial created successfully");
      }

      handleCloseModal();
      loadTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (testimonial) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${testimonial.name}"'s testimonial?`,
      )
    ) {
      try {
        await testimonialAPI.deleteTestimonial(testimonial._id);
        toast.success("Testimonial deleted successfully");
        loadTestimonials();
      } catch (error) {
        toast.error("Failed to delete testimonial");
      }
    }
  };

  const handleToggleStatus = async (testimonial) => {
    const newStatus =
      testimonial.status === "approved" ? "rejected" : "approved";
    try {
      await testimonialAPI.updateTestimonial(testimonial._id, {
        status: newStatus,
      });
      toast.success(
        `Testimonial ${newStatus === "approved" ? "approved" : "rejected"}`,
      );
      loadTestimonials();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async (testimonial) => {
    try {
      await testimonialAPI.toggleFeatured(testimonial._id);
      toast.success(
        `Testimonial ${!testimonial.featured ? "added to" : "removed from"} featured`,
      );
      loadTestimonials();
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="star-filled" />
        ) : (
          <FaRegStar key={i} className="star-empty" />
        ),
      );
    }
    return stars;
  };

  // Filter by search term only (status is already filtered by the API)
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-testimonials-loading">
          <div className="loading-spinner"></div>
          <p>Loading testimonials...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-testimonials">
        <div className="admin-testimonials-header">
          <div>
            <h2>Testimonials Management</h2>
            <p>Manage client testimonials displayed on the website</p>
          </div>
          <button className="btn-add" onClick={() => handleOpenModal()}>
            + Add New Testimonial
          </button>
        </div>

        <div className="admin-testimonials-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-tab ${statusFilter === "approved" ? "active" : ""}`}
              onClick={() => setStatusFilter("approved")}
            >
              Approved
            </button>
            <button
              className={`filter-tab ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`filter-tab ${statusFilter === "rejected" ? "active" : ""}`}
              onClick={() => setStatusFilter("rejected")}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="admin-testimonials-table-container">
          <table className="admin-testimonials-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Client</th>
                <th>Testimonial</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.length > 0 ? (
                filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial._id}>
                    <td className="image-cell">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="testimonial-thumb"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td className="client-cell">
                      <div className="client-name">{testimonial.name}</div>
                      <div className="client-role">{testimonial.role}</div>
                      {testimonial.company && (
                        <div className="client-company">
                          {testimonial.company}
                        </div>
                      )}
                    </td>
                    <td className="content-cell">
                      <div className="content-preview">
                        {testimonial.content.length > 100
                          ? testimonial.content.substring(0, 100) + "..."
                          : testimonial.content}
                      </div>
                    </td>
                    <td className="rating-cell">
                      <div className="stars">
                        {renderStars(testimonial.rating)}
                      </div>
                    </td>
                    <td className="status-cell">
                      <span
                        className={`status-badge status-${testimonial.status}`}
                      >
                        {testimonial.status}
                      </span>
                    </td>
                    <td className="featured-cell">
                      <button
                        className={`featured-btn ${testimonial.featured ? "active" : ""}`}
                        onClick={() => handleToggleFeatured(testimonial)}
                        title={
                          testimonial.featured
                            ? "Remove from featured"
                            : "Mark as featured"
                        }
                      >
                        {testimonial.featured
                          ? "⭐ Featured"
                          : "☆ Not Featured"}
                      </button>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit"
                        onClick={() => handleOpenModal(testimonial)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`action-btn status ${testimonial.status === "approved" ? "reject" : "approve"}`}
                        onClick={() => handleToggleStatus(testimonial)}
                        title={
                          testimonial.status === "approved"
                            ? "Reject"
                            : "Approve"
                        }
                      >
                        {testimonial.status === "approved" ? (
                          <FaTimes />
                        ) : (
                          <FaCheck />
                        )}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(testimonial)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <p>No testimonials found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content testimonial-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="testimonial-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Role/Title</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g., CEO, Homeowner"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Company (Optional)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC Corporation"
                />
              </div>

              <div className="form-group">
                <label>Testimonial Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Write the testimonial here..."
                  maxLength="500"
                />
                <small>{formData.content.length}/500 characters</small>
              </div>

              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${star <= formData.rating ? "active" : ""}`}
                      onClick={() => handleRatingClick(star)}
                    >
                      {star <= formData.rating ? <FaStar /> : <FaRegStar />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  <small>Lower numbers appear first</small>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  <span>Feature this testimonial on homepage</span>
                </label>
              </div>

              <div className="form-group">
                <label>Client Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-footer">
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
                    : editingTestimonial
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

export default AdminTestimonials;
