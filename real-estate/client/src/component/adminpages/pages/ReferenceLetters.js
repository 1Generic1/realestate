import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { userAPI, companyAPI } from "../../../services/adminApi";
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
  // ✅ ADD THIS - companyData state
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    loadUsers();
    loadCompanyData(); // ✅ Load company data
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

  // ✅ ADD loadCompanyData function
  const loadCompanyData = async () => {
    try {
      const response = await companyAPI.getCompanyInfo();
      setCompanyData(response.data);
    } catch (error) {
      console.error("Failed to load company data:", error);
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

  // ✅ ADD formatDateShort function
  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  // Get company display data
  const getCompanyDisplay = () => {
    if (!companyData) {
      return {
        name: "TAYE'S PROPERTY & REALTY SOLUTIONS",
        street: "123 Business District",
        city: "Lagos",
        state: "Lagos State",
        country: "Nigeria",
        phone: "+234 801 234 5678",
        email: "info@tayesproperty.com",
        signatoryName: "Taye Adebayo",
        signatoryTitle: "Managing Director",
        signature: "",
      };
    }
    return {
      name: companyData.name || "TAYE'S PROPERTY & REALTY SOLUTIONS",
      street: companyData.address?.street || "123 Business District",
      city: companyData.address?.city || "Lagos",
      state: companyData.address?.state || "Lagos State",
      country: companyData.address?.country || "Nigeria",
      phone: companyData.phone?.primary || "+234 801 234 5678",
      email: companyData.email?.general || "info@tayesproperty.com",
      signatoryName: companyData.signatoryName || "Taye Adebayo",
      signatoryTitle: companyData.signatoryTitle || "Managing Director",
      signature: companyData.signature || "",
    };
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
                  {/* Header */}
                  <div className="letter-header">
                    <h1>
                      TAYE'S <span>PROPERTY</span>
                    </h1>
                    <p>& REALTY SOLUTIONS</p>
                    <div className="letter-address">
                      {getCompanyDisplay().street}, {getCompanyDisplay().city},{" "}
                      {getCompanyDisplay().state}, {getCompanyDisplay().country}
                      <br />
                      Tel: {getCompanyDisplay().phone} | Email:{" "}
                      {getCompanyDisplay().email}
                    </div>
                  </div>

                  {/* Reference Info */}
                  <div className="letter-ref">
                    <div>Date: {formatDateShort(selectedLetter.generatedAt)}</div>
                    <div>Ref: {selectedLetter.letterId}</div>
                  </div>

                  {/* Subject */}
                  <div className="letter-subject">
                    <h3>{selectedLetter.recipientTitle || "TO WHOM IT MAY CONCERN"}</h3>
                    <h2>{selectedLetter.letterTitle || "LETTER OF REFERENCE"}</h2>
                  </div>

                  {/* Content */}
                  <div className="letter-content">
                    <p>{selectedLetter.salutation || "Dear Sir/Madam"},</p>

                    <p>
                      This letter is to confirm that{" "}
                      <strong>
                        {selectedUser?.firstName} {selectedUser?.lastName}
                      </strong>{" "}
                      has been a valued client of TAYE'S PROPERTY & REALTY SOLUTIONS.
                    </p>

                    {/* Client Info Box */}
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

                    <p>
                      {selectedUser?.firstName} {selectedUser?.lastName} has
                      engaged with our company for professional real estate advisory
                      and property consultation services. Throughout our professional
                      relationship, the client has demonstrated genuine interest in
                      legitimate real estate investments and has maintained professional
                      conduct in all interactions.
                    </p>

                    {/* Purpose Section */}
                    <div className="purpose-section">
                      <h4>PURPOSE OF THIS LETTER</h4>
                      <p>{selectedLetter.purpose || "Not specified"}</p>
                    </div>

                    {/* Notes Section */}
                    {selectedLetter.notes && (
                      <div className="notes-section">
                        <h4>ADDITIONAL NOTES</h4>
                        <p>{selectedLetter.notes}</p>
                      </div>
                    )}

                    {/* Confirmation Statement */}
                    <div className="confirmation">
                      <p>
                        ✓ We confirm that to the best of our knowledge, the
                        client is a legitimate business partner
                      </p>
                      <p>
                        ✓ There are no negative records associated with their
                        dealings with our company
                      </p>
                      <p>
                        ✓ The client has completed all documentation
                        requirements in a timely manner
                      </p>
                    </div>

                    <p>
                      Should you require any additional information, please do
                      not hesitate to contact our office directly.
                    </p>
                  </div>

                  {/* Signature Section */}
                  <div className="signature-section">
                    <div className="signature-box">
                      {getCompanyDisplay().signature && (
                        <div className="signature-image">
                          <img
                            src={getCompanyDisplay().signature}
                            alt="Signature"
                          />
                        </div>
                      )}
                      <div className="signature-line"></div>
                      <div className="signature-name">
                        {getCompanyDisplay().signatoryName}
                      </div>
                      <div className="signature-title">
                        {getCompanyDisplay().signatoryTitle}
                      </div>
                    </div>

                    {/* Stamp on the right side */}
                    <div className="stamp">
                      <div className="stamp-text">OFFICIAL<br />DOCUMENT</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="letter-footer">
                    <p>
                      This is an official company document. Verification can be made by
                      contacting our office.
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