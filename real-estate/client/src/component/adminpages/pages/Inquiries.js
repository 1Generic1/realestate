import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { inquiryAPI } from "../../../services/adminApi";
import "./Inquiries.css";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryAPI.getAllInquiries();
      setInquiries(response.data || []);
    } catch (error) {
      setError("Failed to load inquiries");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowViewModal(true);
    // Mark as read
    if (inquiry.status === "new") {
      markAsRead(inquiry._id);
    }
  };

  const markAsRead = async (id) => {
    try {
      await inquiryAPI.updateStatus(id, "read");
      loadInquiries();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await inquiryAPI.updateStatus(id, status);
      setMessage({ type: "success", text: "Status updated successfully" });
      loadInquiries();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update status" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await inquiryAPI.deleteInquiry(id);
        setMessage({ type: "success", text: "Inquiry deleted successfully" });
        loadInquiries();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete inquiry" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <span className="status-badge status-new">🆕 New</span>;
      case "read":
        return <span className="status-badge status-read">📖 Read</span>;
      case "replied":
        return <span className="status-badge status-replied">💬 Replied</span>;
      case "archived":
        return (
          <span className="status-badge status-archived">📦 Archived</span>
        );
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getServiceTypeLabel = (serviceType) => {
    const services = {
      acquisition: "Property Acquisition",
      land: "Land Banking",
      advisory: "Realty Advisory",
      investment: "Investment Solutions",
      legal: "Legal & Compliance",
      other: "Other",
    };
    return services[serviceType] || serviceType;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="inquiries-loading">
          <div className="loading-spinner"></div>
          <p>Loading inquiries...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="inquiries-container">
        {/* Header */}
        <div className="inquiries-header">
          <div>
            <h2>Contact Form Inquiries</h2>
            <p>Manage messages from the contact form</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <span className="stat-icon">📧</span>
              <span className="stat-count">{inquiries.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-badge">
              <span className="stat-icon">🆕</span>
              <span className="stat-count">
                {inquiries.filter((i) => i.status === "new").length}
              </span>
              <span className="stat-label">Unread</span>
            </div>
            <div className="stat-badge">
              <span className="stat-icon">💬</span>
              <span className="stat-count">
                {inquiries.filter((i) => i.status === "replied").length}
              </span>
              <span className="stat-label">Replied</span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`inquiries-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="inquiries-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or message..."
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
              className={`filter-tab ${statusFilter === "new" ? "active" : ""}`}
              onClick={() => setStatusFilter("new")}
            >
              🆕 New
            </button>
            <button
              className={`filter-tab ${statusFilter === "read" ? "active" : ""}`}
              onClick={() => setStatusFilter("read")}
            >
              📖 Read
            </button>
            <button
              className={`filter-tab ${statusFilter === "replied" ? "active" : ""}`}
              onClick={() => setStatusFilter("replied")}
            >
              💬 Replied
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="inquiries-table-container">
          <table className="inquiries-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name / Contact</th>
                <th>Service</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="inquiry-row">
                    <td className="date-cell">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="contact-cell">
                      <div className="contact-name">{inquiry.name}</div>
                      <div className="contact-email">{inquiry.email}</div>
                      {inquiry.phone && (
                        <div className="contact-phone">{inquiry.phone}</div>
                      )}
                    </td>
                    <td className="service-cell">
                      {getServiceTypeLabel(inquiry.serviceType)}
                    </td>
                    <td className="message-cell">
                      <div className="message-preview">
                        {inquiry.message.length > 100
                          ? inquiry.message.substring(0, 100) + "..."
                          : inquiry.message}
                      </div>
                    </td>
                    <td className="status-cell">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view"
                        onClick={() => handleViewInquiry(inquiry)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="action-btn reply"
                        onClick={() =>
                          handleUpdateStatus(inquiry._id, "replied")
                        }
                        title="Mark as Replied"
                      >
                        💬
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteInquiry(inquiry._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">📭</span>
                      <p>No inquiries found</p>
                      <button className="refresh-btn" onClick={loadInquiries}>
                        Refresh
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Inquiry Modal */}
      {showViewModal && selectedInquiry && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div
            className="modal-content view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Inquiry Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="inquiry-details">
                <div className="detail-section">
                  <h4>Client Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedInquiry.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {selectedInquiry.email}
                    </span>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">
                        {selectedInquiry.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Inquiry Details</h4>
                  <div className="detail-row">
                    <span className="detail-label">Service:</span>
                    <span className="detail-value">
                      {getServiceTypeLabel(selectedInquiry.serviceType)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      {getStatusBadge(selectedInquiry.status)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {formatDate(selectedInquiry.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="detail-section full">
                  <h4>Message</h4>
                  <div className="message-full">{selectedInquiry.message}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  window.location.href = `mailto:${selectedInquiry.email}`;
                  handleUpdateStatus(selectedInquiry._id, "replied");
                  setShowViewModal(false);
                }}
              >
                Reply via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Inquiries;
