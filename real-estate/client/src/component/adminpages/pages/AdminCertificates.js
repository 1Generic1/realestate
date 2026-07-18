import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { userAPI } from "../../../services/adminApi";
import { toast } from "react-toastify";
import "./AdminCertificates.css";
// ✅ IMPORT THE REUSABLE COMPONENT
import CertificatePreviewModal from "../components/CertificatePreviewModal";

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCert, setSelectedCert] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    loadCertificates();
  }, []);

  // Load certificates from API
  const loadCertificates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await userAPI.getAllCertificates(params);
      console.log("📥 Certificates response:", response);
      
      if (response.success) {
        setCertificates(response.data || []);
      } else {
        toast.error("Failed to load certificates");
      }
    } catch (error) {
      console.error("❌ Load certificates error:", error);
      toast.error(error.response?.data?.error || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "NGN") => {
    if (!amount) return "₦0.00";
    const symbols = {
      NGN: "₦",
      USD: "$",
      EUR: "€",
      GBP: "£",
      GHS: "GH₵",
      KES: "KSh",
      ZAR: "R",
    };
    const symbol = symbols[currency] || "₦";
    return symbol + Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ACTIVE: { class: "cert-status-active", label: "ACTIVE" },
      COMPLETED: { class: "cert-status-completed", label: "COMPLETED" },
      PENDING: { class: "cert-status-pending", label: "PENDING" },
      MATURED: { class: "cert-status-matured", label: "MATURED" },
    };
    const s = statusMap[status] || statusMap.ACTIVE;
    return <span className={`cert-status-badge ${s.class}`}>{s.label}</span>;
  };

  // ✅ Handle download
  const handleDownload = async (certificateId, investorId) => {
    try {
      setDownloading(true);
      await userAPI.downloadCertificate(investorId, certificateId);
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download certificate");
    } finally {
      setDownloading(false);
    }
  };

  // ✅ Handle view details
  const handleViewDetails = (cert) => {
    setSelectedCert(cert);
    setShowDetailsModal(true);
  };

  // ✅ Handle preview certificate using reusable component
  const handlePreviewCertificate = async (cert) => {
    try {
      setPreviewLoading(true);
      setSelectedCert(cert);
      
      // Generate HTML preview
      const previewData = {
        principal: cert.principal,
        currency: cert.currency || "NGN",
        investmentDate: cert.investmentDate,
        investmentPlan: cert.investmentPlan,
        annualReturn: cert.annualReturn,
        grossMonthlyReturn: cert.grossMonthlyReturn,
        withholdingTax: cert.withholdingTax,
        netMonthlyReturn: cert.netMonthlyReturn,
        paymentDate: cert.paymentDate,
        status: cert.status,
      };

      const response = await userAPI.previewCertificate(cert.investorId, previewData);
      
      if (response.success) {
        // Open in new tab
        const newWindow = window.open('', '_blank', 'width=1000,height=800');
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Certificate Preview - ${cert.certificateId}</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f0eb; 
                    font-family: 'Times New Roman', Times, serif;
                  }
                  .container { max-width: 900px; margin: 0 auto; }
                  .preview-watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-30deg);
                    font-size: 80px;
                    font-weight: 900;
                    color: rgba(184, 134, 11, 0.08);
                    pointer-events: none;
                    z-index: 999;
                    letter-spacing: 20px;
                    user-select: none;
                  }
                  @media print {
                    .preview-watermark { display: none; }
                  }
                  @media (max-width: 768px) {
                    body { padding: 10px; }
                    .preview-watermark { font-size: 40px; letter-spacing: 10px; }
                  }
                </style>
              </head>
              <body>
                <div class="preview-watermark">PREVIEW</div>
                <div class="container">
                  ${response.data.html}
                </div>
              </body>
            </html>
          `);
          newWindow.document.close();
          toast.success('Preview opened in new tab');
        } else {
          toast.error('Popup blocked. Please allow popups for this site.');
        }
      } else {
        // Fallback to PDF if available
        if (cert.pdfUrl) {
          window.open(cert.pdfUrl, '_blank');
          toast.info('Opening PDF preview');
        } else {
          toast.error('Failed to generate preview');
        }
      }
    } catch (error) {
      console.error('Preview error:', error);
      // Fallback to PDF if available
      if (cert.pdfUrl) {
        window.open(cert.pdfUrl, '_blank');
        toast.info('Opening PDF preview');
      } else {
        toast.error(error.response?.data?.error || 'Failed to preview certificate');
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  // ✅ Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const timeoutId = setTimeout(() => loadCertificates(), 500);
    return () => clearTimeout(timeoutId);
  };

  // ✅ Handle status filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setTimeout(() => loadCertificates(), 100);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="cert-loading">
          <div className="cert-loading-spinner"></div>
          <p>Loading certificates...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="cert-container">
        {/* Header */}
        <div className="cert-header">
          <div>
            <h2>Investment Certificates</h2>
            <p>Manage all investment certificates generated for users</p>
          </div>
          <button
            className="cert-btn-add"
            onClick={() => (window.location.href = "/admin/users")}
          >
            ➕ Generate New
          </button>
        </div>

        {/* Stats */}
        <div className="cert-stats">
          <div className="cert-stat-card">
            <div className="cert-stat-icon">📜</div>
            <div className="cert-stat-info">
              <h3>{certificates.length}</h3>
              <p>Total Certificates</p>
            </div>
          </div>
          <div className="cert-stat-card">
            <div className="cert-stat-icon">🟢</div>
            <div className="cert-stat-info">
              <h3>
                {certificates.filter((c) => c.status === "ACTIVE").length}
              </h3>
              <p>Active</p>
            </div>
          </div>
          <div className="cert-stat-card">
            <div className="cert-stat-icon">📊</div>
            <div className="cert-stat-info">
              <h3>
                {certificates.filter((c) => c.status === "COMPLETED").length}
              </h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="cert-stat-card">
            <div className="cert-stat-icon">⏳</div>
            <div className="cert-stat-info">
              <h3>
                {certificates.filter((c) => c.status === "PENDING").length}
              </h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="cert-filters">
          <div className="cert-search">
            <input
              type="text"
              placeholder="Search by certificate ID or investor..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="cert-filter-group">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="cert-filter-select"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PENDING">PENDING</option>
              <option value="MATURED">MATURED</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {certificates.length > 0 ? (
          <div className="cert-table-container">
            <table className="cert-table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Investor</th>
                  <th>Plan</th>
                  <th>Principal</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert._id || cert.certificateId}>
                    <td className="cert-id">{cert.certificateId}</td>
                    <td>{cert.investorName || "N/A"}</td>
                    <td>{cert.investmentPlan}</td>
                    <td>{formatCurrency(cert.principal, cert.currency)}</td>
                    <td>{getStatusBadge(cert.status)}</td>
                    <td>{formatDate(cert.issuanceDate)}</td>
                    <td className="cert-actions">
                      {/* ✅ Preview PDF */}
                      <button
                        className="cert-action-btn preview"
                        onClick={() => handlePreviewCertificate(cert)}
                        title="Preview PDF"
                        disabled={previewLoading}
                      >
                        📄
                      </button>
                      {/* ✅ View Details */}
                      <button
                        className="cert-action-btn view"
                        onClick={() => handleViewDetails(cert)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      {/* ✅ Download PDF */}
                      <button
                        className="cert-action-btn download"
                        onClick={() => handleDownload(cert.certificateId, cert.investorId)}
                        title="Download PDF"
                        disabled={downloading}
                      >
                        📥
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="cert-empty">
            <div className="cert-empty-icon">📜</div>
            <h3>No Certificates Yet</h3>
            <p>
              Generate your first investment certificate by going to the
              Users page and clicking the 📜 button next to a user.
            </p>
            <button
              className="cert-btn-primary"
              onClick={() => (window.location.href = "/admin/users")}
            >
              Go to Users
            </button>
          </div>
        )}
      </div>

      {/* ============================================
          VIEW DETAILS MODAL
          ============================================ */}
      {showDetailsModal && selectedCert && (
        <div className="cert-details-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="cert-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-header">
              <h3>Certificate Details</h3>
              <button
                className="cert-modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="cert-modal-body cert-details-body">
              <div className="cert-details-grid">
                <div className="cert-details-item">
                  <label>Certificate ID</label>
                  <span className="cert-details-value">{selectedCert.certificateId}</span>
                </div>
                <div className="cert-details-item">
                  <label>Investor</label>
                  <span>{selectedCert.investorName}</span>
                </div>
                <div className="cert-details-item">
                  <label>Email</label>
                  <span>{selectedCert.investorEmail}</span>
                </div>
                <div className="cert-details-item">
                  <label>Investment Plan</label>
                  <span>{selectedCert.investmentPlan}</span>
                </div>
                <div className="cert-details-item">
                  <label>Principal</label>
                  <span className="cert-details-gold">
                    {formatCurrency(selectedCert.principal, selectedCert.currency)}
                  </span>
                </div>
                <div className="cert-details-item">
                  <label>Annual Return</label>
                  <span>{selectedCert.annualReturn}% per annum</span>
                </div>
                <div className="cert-details-item">
                  <label>Gross Monthly Return</label>
                  <span>{formatCurrency(selectedCert.grossMonthlyReturn, selectedCert.currency)}</span>
                </div>
                <div className="cert-details-item">
                  <label>Withholding Tax</label>
                  <span>{formatCurrency(selectedCert.withholdingTax, selectedCert.currency)}</span>
                </div>
                <div className="cert-details-item">
                  <label>Net Monthly Return</label>
                  <span>{formatCurrency(selectedCert.netMonthlyReturn, selectedCert.currency)}</span>
                </div>
                <div className="cert-details-item">
                  <label>Payment Date</label>
                  <span>{selectedCert.paymentDate}</span>
                </div>
                <div className="cert-details-item">
                  <label>Status</label>
                  <span>{getStatusBadge(selectedCert.status)}</span>
                </div>
                <div className="cert-details-item">
                  <label>Issued Date</label>
                  <span>{formatDate(selectedCert.issuanceDate)}</span>
                </div>
                <div className="cert-details-item">
                  <label>Downloads</label>
                  <span>{selectedCert.downloadedCount || 0}</span>
                </div>
                <div className="cert-details-item">
                  <label>Email Sent</label>
                  <span>{selectedCert.sentViaEmail ? "✅ Yes" : "❌ No"}</span>
                </div>
              </div>
            </div>
            <div className="cert-modal-footer">
              <button
                className="cert-btn-secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              <button
                className="cert-btn-primary"
                onClick={() => {
                  handleDownload(selectedCert.certificateId, selectedCert.investorId);
                }}
                disabled={downloading}
              >
                📥 Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          ✅ PREVIEW MODAL - USING REUSABLE COMPONENT
          ============================================ */}
      <CertificatePreviewModal
        show={showPreviewModal}
        certPreviewHtml={previewHtml}
        loading={previewLoading}
        onClose={() => setShowPreviewModal(false)}
        onDownload={() => {
          if (selectedCert) {
            handleDownload(selectedCert.certificateId, selectedCert.investorId);
          }
        }}
        downloading={downloading}
        showDownload={true}
      />
    </AdminLayout>
  );
};

export default AdminCertificates;