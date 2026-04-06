import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { userAPI } from "../../../services/adminApi";
import "./ReferenceLetters.css";

const ReferenceLetters = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [referenceLetters, setReferenceLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLetters, setLoadingLetters] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadUsers();
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

  const loadUserLetters = async (user) => {
    setSelectedUser(user);
    setLoadingLetters(true);
    try {
      const response = await userAPI.getUserReferenceLetters(user._id);
      setReferenceLetters(response.data.referenceLetters || []);
    } catch (error) {
      console.error("Failed to load reference letters:", error);
      setReferenceLetters([]);
    } finally {
      setLoadingLetters(false);
    }
  };

  const handleViewLetter = (letter) => {
    setSelectedLetter(letter);
    setShowViewModal(true);
  };

  // ✅ ADD THIS FUNCTION HERE - Admin download handler
  const handleDownloadPDF = async (letterId) => {
    if (!selectedUser) return;

    setDownloading(true);
    try {
      await userAPI.downloadUserReferenceLetter(selectedUser._id, letterId);
      setMessage({ type: "success", text: "Download started successfully" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Download failed:", error);
      setMessage({
        type: "error",
        text: "Failed to download reference letter",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setDownloading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) || user.email.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="letters-loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="letters-container">
        {/* Header */}
        <div className="letters-header">
          <div>
            <h2>Reference Letters</h2>
            <p>View and manage reference letters sent to users</p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`users-message ${message.type}`}>{message.text}</div>
        )}

        {/* Search */}
        <div className="letters-search">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="letters-layout">
          {/* Users Sidebar */}
          <div className="users-sidebar">
            <h3>Users ({filteredUsers.length})</h3>
            <div className="users-list">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`user-item ${selectedUser?._id === user._id ? "active" : ""}`}
                  onClick={() => loadUserLetters(user)}
                >
                  <div
                    className="user-avatar"
                    style={{ background: getRandomColor(user.email) }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <div className="user-info">
                    <div className="user-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="no-users">No users found</div>
              )}
            </div>
          </div>

          {/* Letters Content */}
          <div className="letters-content">
            {!selectedUser ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <p>Select a user to view their reference letters</p>
              </div>
            ) : loadingLetters ? (
              <div className="loading-letters">
                <div className="loading-spinner-small"></div>
                <p>Loading reference letters...</p>
              </div>
            ) : referenceLetters.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>
                  No reference letters sent to {selectedUser.firstName}{" "}
                  {selectedUser.lastName}
                </p>
              </div>
            ) : (
              <>
                <div className="letters-header-info">
                  <h3>
                    Reference Letters for {selectedUser.firstName}{" "}
                    {selectedUser.lastName}
                  </h3>
                  <span className="letters-count">
                    {referenceLetters.length} letters
                  </span>
                </div>
                <div className="letters-grid">
                  {referenceLetters.map((letter, index) => (
                    <div key={letter.letterId} className="letter-card">
                      <div className="letter-card-header">
                        <div className="letter-icon">📄</div>
                        <div className="letter-info">
                          <div className="letter-id">{letter.letterId}</div>
                          <div className="letter-date">
                            {formatDate(letter.generatedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="letter-card-body">
                        <div className="letter-type">
                          <span className="label">Type:</span>
                          <span className="value">
                            {letter.letterType?.toUpperCase() || "VISA"}
                          </span>
                        </div>
                        {letter.purpose && (
                          <div className="letter-purpose">
                            <span className="label">Purpose:</span>
                            <span className="value">{letter.purpose}</span>
                          </div>
                        )}
                        {letter.notes && (
                          <div className="letter-notes">
                            <span className="label">Notes:</span>
                            <span className="value">{letter.notes}</span>
                          </div>
                        )}
                        <div className="letter-status">
                          <span className="label">Status:</span>
                          <span
                            className={`status-badge ${letter.sentViaEmail ? "sent" : "pending"}`}
                          >
                            {letter.sentViaEmail ? "✓ Sent" : "Pending"}
                          </span>
                        </div>
                        {letter.downloadedCount > 0 && (
                          <div className="letter-downloads">
                            <span className="label">Downloads:</span>
                            <span className="value">
                              {letter.downloadedCount} times
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="letter-card-footer">
                        <button
                          className="btn-view"
                          onClick={() => handleViewLetter(letter)}
                        >
                          👁️ Preview
                        </button>
                        <button
                          className="btn-download"
                          onClick={() => handleDownloadPDF(letter.letterId)}
                          disabled={downloading}
                        >
                          {downloading
                            ? "⏳ Downloading..."
                            : "📥 Download PDF"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* View Letter Modal */}
        {showViewModal && selectedLetter && (
          <div
            className="modal-overlay"
            onClick={() => setShowViewModal(false)}
          >
            <div
              className="modal-content preview-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Reference Letter</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowViewModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body preview-body">
                <div className="letter-preview">
                  <div className="letter-header">
                    <h1>
                      TAYE'S <span>PROPERTY</span>
                    </h1>
                    <p>& REALTY SOLUTIONS</p>
                    <div className="letter-address">
                      123 Business District, Lagos, Lagos State, Nigeria
                      <br />
                      Tel: +234 801 234 5678 | Email: info@tayesproperty.com
                    </div>
                  </div>

                  <div className="letter-ref">
                    <div>Date: {formatDate(selectedLetter.generatedAt)}</div>
                    <div>Ref: {selectedLetter.letterId}</div>
                  </div>

                  <div className="letter-subject">
                    <h3>TO WHOM IT MAY CONCERN</h3>
                    <h2>LETTER OF REFERENCE</h2>
                  </div>

                  <div className="letter-content">
                    <p>Dear Sir/Madam,</p>

                    <p>
                      This letter is to confirm that{" "}
                      <strong>
                        {selectedUser?.firstName} {selectedUser?.lastName}
                      </strong>{" "}
                      has been a valued client of TAYE'S PROPERTY & REALTY
                      SOLUTIONS.
                    </p>

                    <div className="client-info">
                      <h4>CLIENT INFORMATION</h4>
                      <p>
                        <strong>Full Name:</strong> {selectedUser?.firstName}{" "}
                        {selectedUser?.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUser?.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedUser?.phone || "Not provided"}
                      </p>
                    </div>

                    {selectedLetter.purpose && (
                      <p>
                        <strong>Purpose:</strong> {selectedLetter.purpose}
                      </p>
                    )}

                    {selectedLetter.notes && (
                      <p>
                        <strong>Notes:</strong> {selectedLetter.notes}
                      </p>
                    )}

                    <p>
                      We confirm that to the best of our knowledge, the client
                      is a legitimate business partner and there are no negative
                      records associated with their dealings with our company.
                    </p>

                    <p>
                      Should you require any additional information, please do
                      not hesitate to contact our office directly.
                    </p>
                  </div>

                  <div className="letter-signature">
                    <div className="signature-line"></div>
                    <div className="signature-name">Taye Adebayo</div>
                    <div className="signature-title">Managing Director</div>
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
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleDownloadPDF(selectedLetter.letterId)}
                  disabled={downloading}
                >
                  {downloading ? "Downloading..." : "Download PDF"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReferenceLetters;
