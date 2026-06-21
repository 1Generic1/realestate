import "./Users.css";
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { userAPI, templateAPI, companyAPI } from "../../../services/adminApi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSendLetterModal, setShowSendLetterModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isActive: true,
  });
  const [templates, setTemplates] = useState([]);
  const [letterData, setLetterData] = useState({
    templateType: "visa",
    purpose: "",
    notes: "",
  });
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [sendingLetter, setSendingLetter] = useState(false);
  const [submittingPreview, setSubmittingPreview] = useState(false);
  const [purposeError, setPurposeError] = useState(false); // Add this for visual feedback

  useEffect(() => {
    loadUsers();
    loadTemplates();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      setError("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await templateAPI.getAllTemplates();
      const templateList = [
        {
          key: "visa",
          name: "Visa Reference",
          icon: "🛂",
          description: "For visa applications and immigration purposes",
        },
        {
          key: "employment",
          name: "Employment Reference",
          icon: "💼",
          description: "For job applications and employment verification",
        },
        {
          key: "bank",
          name: "Bank Reference",
          icon: "🏦",
          description: "For bank loans and financial institutions",
        },
        {
          key: "general",
          name: "General Reference",
          icon: "📄",
          description: "General purpose reference letter",
        },
      ];

      const customTemplates = Object.keys(response.data?.custom || {}).map(
        (name) => ({
          key: name,
          name: name,
          icon: "⭐",
          isCustom: true,
          description: "Custom reference letter template",
        }),
      );

      setTemplates([...templateList, ...customTemplates]);
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleViewDetails = async (user) => {
    try {
      const response = await userAPI.getUserById(user._id);
      setSelectedUser(response.data);
      setUserDetails(response.data);
      setShowViewDetailsModal(true);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load user details" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      isActive: user.isActive || false,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await userAPI.updateUser(selectedUser._id, {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        phone: editFormData.phone,
        isActive: editFormData.isActive,
      });

      setMessage({
        type: "success",
        text: `User ${editFormData.firstName} ${editFormData.lastName} updated successfully`,
      });
      setShowEditModal(false);
      loadUsers();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      )
    ) {
      try {
        await userAPI.deleteUserPermanent(user._id);
        setMessage({
          type: "success",
          text: `User ${user.firstName} ${user.lastName} deleted successfully`,
        });
        loadUsers();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete user" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    const action = newStatus ? "activate" : "deactivate";

    if (
      window.confirm(
        `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
      )
    ) {
      try {
        if (newStatus) {
          await userAPI.reactivateUser(user._id);
        } else {
          await userAPI.deactivateUser(user._id);
        }
        setMessage({
          type: "success",
          text: `User ${user.firstName} ${user.lastName} ${newStatus ? "activated" : "deactivated"} successfully`,
        });
        loadUsers();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        setMessage({ type: "error", text: `Failed to ${action} user` });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    }
  };

  const handleSendLetter = (user) => {
    setSelectedUser(user);
    setShowSendLetterModal(true);
    setLetterData({ templateType: "visa", purpose: "", notes: "" });
    setPurposeError(false); // Reset error when opening modal
  };

  const handlePreviewLetter = async () => {
    if (!letterData.purpose || letterData.purpose.trim() === "") {
      setPurposeError(true);
      toast.error("⚠️ Please enter a purpose for this letter before sending");
      return;
    }
    setPurposeError(false);
    setPreviewLoading(true);

    try {
      // ✅ FETCH REAL COMPANY DATA
      const companyResponse = await companyAPI.getCompanyInfo();
      const companyData = companyResponse.data;

      const template = templates.find((t) => t.key === letterData.templateType);

      setPreviewData({
        user: selectedUser,
        template: template,
        purpose: letterData.purpose,
        notes: letterData.notes,
        company: {
          name: companyData.name || "TAYE'S PROPERTY & REALTY SOLUTIONS",
          address: companyData.address || {},
          phone: companyData.phone || {},
          email: companyData.email || {},
          signatoryName: companyData.signatoryName || "Taye Adebayo",
          signatoryTitle: companyData.signatoryTitle || "Managing Director",
          signature: companyData.signature || "",  // ← THIS IS THE KEY
        },
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        referenceNumber: `TPR/${letterData.templateType.toUpperCase()}/${new Date().getFullYear()}/PREVIEW`,
      });

      setShowPreviewModal(true);
    } catch (error) {
      toast.error("Failed to generate preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmitLetter = async () => {
    if (!letterData.purpose || letterData.purpose.trim() === "") {
      setPurposeError(true);
      toast.error("⚠️ Please enter a purpose for this letter before sending");
      return;
    }

    if (sendingLetter || submittingPreview) return;

    try {
      setSendingLetter(true);
      // ✅ Check if the selected template is custom
      const selectedTemplate = templates.find(t => t.key === letterData.templateType);
      const isCustom = selectedTemplate?.isCustom || false;
      
      // ✅ Build request data
      const requestData = {
        purpose: letterData.purpose,
        notes: letterData.notes,
      };
      
      if (isCustom) {
        // For custom templates
        requestData.templateType = "custom";
        requestData.customTemplateName = letterData.templateType;  // ← ADD THIS
      } else {
        // For predefined templates
        requestData.templateType = letterData.templateType;
      }
      
      await userAPI.sendReferenceLetterNew(selectedUser._id, requestData);

      toast.success(`✅ Reference letter sent to ${selectedUser.firstName} ${selectedUser.lastName}`);
      setShowSendLetterModal(false);
      setShowPreviewModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send reference letter");
    } finally {
      setSendingLetter(false);
    }
  };

  const handleSendFromPreview = async () => {
    if (!letterData.purpose || letterData.purpose.trim() === "") {
      setPurposeError(true);
      toast.error("⚠️ Please enter a purpose for this letter before sending");
      setShowPreviewModal(false);
      setShowSendLetterModal(true);
      return;
    }

    if (sendingLetter || submittingPreview) return;

    try {
      setSubmittingPreview(true);
      await userAPI.sendReferenceLetterNew(selectedUser._id, {
        templateType: letterData.templateType,
        purpose: letterData.purpose,
        notes: letterData.notes,
      });

      toast.success(`✅ Reference letter sent to ${selectedUser.firstName} ${selectedUser.lastName}`);
      setShowSendLetterModal(false);
      setShowPreviewModal(false);
    } catch (error) {
      toast.error("Failed to send reference letter");
    } finally {
      setSubmittingPreview(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedUsers.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to deactivate ${selectedUsers.length} selected users?`,
      )
    ) {
      try {
        await userAPI.bulkDeactivateUsers(selectedUsers);
        setMessage({
          type: "success",
          text: `${selectedUsers.length} users deactivated successfully`,
        });
        setSelectedUsers([]);
        loadUsers();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to deactivate users" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    }
  };

  const handleBulkReactivate = async () => {
    if (selectedUsers.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to reactivate ${selectedUsers.length} selected users?`,
      )
    ) {
      try {
        await userAPI.bulkReactivateUsers(selectedUsers);
        setMessage({
          type: "success",
          text: `${selectedUsers.length} users reactivated successfully`,
        });
        setSelectedUsers([]);
        loadUsers();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to reactivate users" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedUsers.length} selected users? This action cannot be undone.`,
      )
    ) {
      try {
        for (const userId of selectedUsers) {
          await userAPI.deleteUserPermanent(userId);
        }
        setMessage({
          type: "success",
          text: `${selectedUsers.length} users deleted successfully`,
        });
        setSelectedUsers([]);
        loadUsers();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete users" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesStatus;
  });

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getRandomColor = (str) => {
    const colors = [
      "#b8860b",
      "#4caf50",
      "#2196f3",
      "#9c27b0",
      "#ff9800",
      "#f44336",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="users-loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="users-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Users</h3>
          <p>{error}</p>
          <button onClick={loadUsers} className="retry-btn">
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="users-container1">
        {/* Header */}
        <div className="users-header">
          <div>
            <h2>User Management</h2>
            <p>Manage users, send reference letters, and track user activity</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <span className="stat-icon">👥</span>
              <span className="stat-count">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-badge">
              <span className="stat-icon">🟢</span>
              <span className="stat-count">
                {users.filter((u) => u.isActive).length}
              </span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-badge">
              <span className="stat-icon">🔴</span>
              <span className="stat-count">
                {users.filter((u) => !u.isActive).length}
              </span>
              <span className="stat-label">Inactive</span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`users-message ${message.type}`}>{message.text}</div>
        )}

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bulk-actions">
            <span className="bulk-count">
              {selectedUsers.length} users selected
            </span>
            <button className="bulk-btn" onClick={handleBulkDeactivate}>
              🔴 Deactivate
            </button>
            <button className="bulk-btn" onClick={handleBulkReactivate}>
              🟢 Activate
            </button>
            <button className="bulk-btn delete" onClick={handleBulkDelete}>
              🗑️ Delete Selected
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="users-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-tab ${statusFilter === "active" ? "active" : ""}`}
              onClick={() => setStatusFilter("active")}
            >
              Active
            </button>
            <button
              className={`filter-tab ${statusFilter === "inactive" ? "active" : ""}`}
              onClick={() => setStatusFilter("inactive")}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="users-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="checkbox"
                  />
                </th>
                <th>User</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="user-row">
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="checkbox"
                      />
                    </td>
                    <td className="user-info-cell">
                      <div
                        className="user-avatar"
                        style={{ background: getRandomColor(user.email) }}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-role">User</div>
                      </div>
                    </td>
                    <td className="contact-cell">
                      <div className="contact-email">
                        <span className="contact-icon">📧</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="contact-phone">
                        <span className="contact-icon">📞</span>
                        <span>{user.phone || "Not provided"}</span>
                      </div>
                    </td>
                    <td className="status-cell">
                      <div className="status-actions">
                        <span
                          className={`status-badge ${user.isActive ? "status-active" : "status-inactive"}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          className="toggle-status-btn"
                          onClick={() => handleToggleStatus(user)}
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {user.isActive ? "🔴" : "🟢"}
                        </button>
                      </div>
                    </td>
                    <td className="date-cell">{formatDate(user.createdAt)}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn send-letter"
                        onClick={() => handleSendLetter(user)}
                        title="Send Reference Letter"
                      >
                        📄
                      </button>
                      <button
                        className="action-btn view"
                        onClick={() => handleViewDetails(user)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
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
                      <span className="empty-icon">👥</span>
                      <p>No users found</p>
                      <button className="refresh-btn" onClick={loadUsers}>
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

      {/* View Details Modal */}
      {showViewDetailsModal && selectedUser && (
        <div
          className="modal-overlay view-details-modal-overlay"
          onClick={() => setShowViewDetailsModal(false)}
        >
          <div
            className="modal-content view-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>User Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowViewDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-profile-header">
                <div
                  className="user-profile-avatar"
                  style={{ background: getRandomColor(selectedUser.email) }}
                >
                  {getInitials(selectedUser.firstName, selectedUser.lastName)}
                </div>
                <div className="user-profile-info">
                  <h2>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <p className="user-email-text">{selectedUser.email}</p>
                  <div className="user-profile-status">
                    <span
                      className={`status-badge ${selectedUser.isActive ? "status-active" : "status-inactive"}`}
                    >
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="user-details-grid">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                      {selectedUser.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Joined:</span>
                    <span className="detail-value">
                      {formatDate(selectedUser.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Account Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`status-badge ${selectedUser.isActive ? "status-active" : "status-inactive"}`}
                    >
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Verified:</span>
                    <span className="detail-value">
                      {selectedUser.emailVerified ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Login:</span>
                    <span className="detail-value">
                      {selectedUser.lastLogin
                        ? formatDate(selectedUser.lastLogin)
                        : "Never"}
                    </span>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Location</h4>
                  <div className="detail-row">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">
                      {selectedUser.location?.city || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">State:</span>
                    <span className="detail-value">
                      {selectedUser.location?.state || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Country:</span>
                    <span className="detail-value">
                      {selectedUser.location?.country || "Nigeria"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowViewDetailsModal(false)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  handleSendLetter(selectedUser);
                  setShowViewDetailsModal(false);
                }}
              >
                Send Reference Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div
          className="modal-overlay edit-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div className="edit-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>

            <div className="edit-user-modal-body">
              <div className="edit-user-form">
                <div className="edit-form-row">
                  <div className="edit-form-group">
                    <label className="edit-form-label">First Name</label>
                    <input
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          firstName: e.target.value,
                        })
                      }
                      className="edit-form-input"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label className="edit-form-label">Last Name</label>
                    <input
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          lastName: e.target.value,
                        })
                      }
                      className="edit-form-input"
                    />
                  </div>
                </div>

                <div className="edit-form-group">
                  <label className="edit-form-label">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="edit-form-input"
                  />
                </div>

                <div className="edit-form-group">
                  <label className="edit-form-label">Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className="edit-form-input"
                  />
                </div>

                <div className="edit-form-group">
                  <label className="edit-checkbox-label">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isActive: e.target.checked,
                        })
                      }
                    />
                    <span>Active Account</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="edit-modal-footer">
              <button
                className="edit-cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="edit-save-btn" onClick={handleUpdateUser}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Reference Letter Modal */}
      {showSendLetterModal && selectedUser && (
        <div
          className="modal-overlay send-letter-modal-overlay"
          onClick={() => !sendingLetter && setShowSendLetterModal(false)}
        >
          <div
            className="modal-content send-letter-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Send Reference Letter</h3>
              <button
                className="modal-close"
                onClick={() => !sendingLetter && setShowSendLetterModal(false)}
                disabled={sendingLetter}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-info-preview">
                <div
                  className="preview-avatar"
                  style={{ background: getRandomColor(selectedUser.email) }}
                >
                  {getInitials(selectedUser.firstName, selectedUser.lastName)}
                </div>
                <div className="preview-details">
                  <h4>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
              <div className="form-group">
                <label>Select Template</label>
                <div className="template-selector">
                  {templates.map((template) => (
                    <button
                      key={template.key}
                      className={`template-option ${letterData.templateType === template.key ? "selected" : ""}`}
                      onClick={() =>
                        !sendingLetter &&
                        setLetterData({
                          ...letterData,
                          templateType: template.key,
                        })
                      }
                      disabled={sendingLetter}
                    >
                      <span className="template-icon">{template.icon}</span>
                      <span className="template-name">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className={purposeError ? "label-error" : ""}>
                  Purpose <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., UK Visa Application, Job Application, Bank Loan"
                  value={letterData.purpose}
                  onChange={(e) => {
                    setLetterData({ ...letterData, purpose: e.target.value });
                    if (e.target.value.trim()) {
                      setPurposeError(false);
                    }
                  }}
                  className={`form-input ${purposeError ? "input-error" : ""}`}
                  disabled={sendingLetter}
                  required
                />
                {purposeError && (
                  <small className="error-message">
                    ⚠️ Purpose is required. Please enter a purpose for this
                    reference letter.
                  </small>
                )}
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  placeholder="Additional notes or instructions..."
                  value={letterData.notes}
                  onChange={(e) =>
                    !sendingLetter &&
                    setLetterData({ ...letterData, notes: e.target.value })
                  }
                  className="form-textarea"
                  rows="3"
                  disabled={sendingLetter}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => !sendingLetter && setShowSendLetterModal(false)}
                disabled={sendingLetter}
              >
                Cancel
              </button>
              <button
                className="btn-preview"
                onClick={handlePreviewLetter}
                disabled={previewLoading || sendingLetter}
              >
                {previewLoading ? "Loading..." : "Preview Letter"}
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmitLetter}
                disabled={sendingLetter}
              >
                {sendingLetter ? "Sending..." : "Send Letter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Letter Preview Modal */}
      {showPreviewModal && previewData && (
        <div
          className="modal-overlay preview-modal-overlay"
          onClick={() => !submittingPreview && setShowPreviewModal(false)}
        >
          <div
            className="modal-content preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Letter Preview</h3>
              <button
                className="modal-close"
                onClick={() => !submittingPreview && setShowPreviewModal(false)}
                disabled={submittingPreview}
              >
                ×
              </button>
            </div>
            <div className="modal-body preview-body">
              <div className="letter-preview">
                <div className="stamp1">
                    <div className="stamp-text1">OFFICIAL<br />DOCUMENT</div>
                </div>
                <div className="letter-header">
                  <h1>
                    TAYE'S <span>PROPERTY</span>
                  </h1>
                  <p>& REALTY SOLUTIONS</p>
                  <div className="letter-address">
                    {previewData.company.address?.street},{" "}
                    {previewData.company.address?.city},{" "}
                    {previewData.company.address?.state},{" "}
                    {previewData.company.address?.country}
                    <br />
                    Tel: {previewData.company.phone?.primary || "N/A"} | 
                    Email: {previewData.company.email?.general || "N/A"}
                  </div>
                </div>
                <div className="letter-ref">
                  <div>Date: {previewData.date}</div>
                  <div>Ref: {previewData.referenceNumber}</div>
                </div>
                <div className="letter-subject">
                  <h3>
                    {previewData.template?.name?.toUpperCase() ||
                      "REFERENCE LETTER"}
                  </h3>
                  <h2>LETTER OF REFERENCE</h2>
                </div>
                <div className="letter-content">
                  <p>Dear Recipient,</p>
                  <p>
                    This letter is to confirm that{" "}
                    <strong>
                      {previewData.user.firstName} {previewData.user.lastName}
                    </strong>{" "}
                    has been a valued client of TAYE'S PROPERTY & REALTY
                    SOLUTIONS.
                  </p>
                  <div className="client-info">
                    <h4>CLIENT INFORMATION</h4>
                    <p>
                      <strong>Full Name:</strong> {previewData.user.firstName}{" "}
                      {previewData.user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {previewData.user.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {previewData.user.phone || "Not provided"}
                    </p>
                  </div>
                  <p>
                    <strong>Purpose:</strong> {previewData.purpose}
                  </p>
                  {previewData.notes && (
                    <p>
                      <strong>Notes:</strong> {previewData.notes}
                    </p>
                  )}
                  <div class="confirmation">
                    <p>
                      ✓ We confirm that to the best of our knowledge, the client is a
                      legitimate business partner
                    </p>
                    <p>
                      ✓ There are no negative records associated with their dealings
                      with our company
                    </p>
                    <p>
                      ✓ The client has completed all documentation requirements in a
                      timely manner
                    </p>
                  </div>
                  <p>
                    Should you require any additional information, please do not
                    hesitate to contact our office directly.
                  </p>
                </div>
                <div className="letter-signature">
                  {previewData.company.signature && (
                    <div className="signature-image">
                      <img src={previewData.company.signature} alt="Signature" />
                    </div>
                  )}
                  <div className="signature-line"></div>
                  <div className="signature-name">
                    {previewData.company.signatoryName}
                  </div>
                  <div className="signature-title">
                    {previewData.company.signatoryTitle}
                  </div>
                  {/* ✅ STAMP on the right side */}
                  
                </div>
                <div className="letter-footer">
                  <p>
                    This is an official company document. Verification can be
                    made by contacting our office.
                  </p>
                  
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => !submittingPreview && setShowPreviewModal(false)}
                disabled={submittingPreview}
              >
                Edit
              </button>
              <button
                className="btn-primary"
                onClick={handleSendFromPreview}
                disabled={submittingPreview}
              >
                {submittingPreview ? "Sending..." : "Send Letter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;
