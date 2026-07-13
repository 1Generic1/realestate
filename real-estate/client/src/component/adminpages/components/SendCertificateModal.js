import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./SendCertificateModal.css";

const SendCertificateModal = ({
  show,
  selectedUser,
  certificateData,
  setCertificateData,
  sendingCertificate,
  certPreviewLoading,
  onClose,
  onPreview,
  onSubmit,
  getInitials,
  getRandomColor,
}) => {
  if (!show || !selectedUser) return null;

  const handleChange = (field, value) => {
    setCertificateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      certificateData.principal &&
      certificateData.investmentDate &&
      certificateData.investmentPlan
    );
  };

  return (
    <div
      className="cert-modal-overlay"
      onClick={() => !sendingCertificate && onClose()}
    >
      <div
        className="cert-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cert-modal-header">
          <h3>Send Investment Certificate</h3>
          <button
            className="cert-modal-close"
            onClick={() => !sendingCertificate && onClose()}
            disabled={sendingCertificate}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="cert-modal-body">
          {/* User Info */}
          <div className="cert-user-info">
            <div
              className="cert-user-avatar"
              style={{ background: getRandomColor(selectedUser.email) }}
            >
              {getInitials(selectedUser.firstName, selectedUser.lastName)}
            </div>
            <div className="cert-user-details">
              <h4>
                {selectedUser.firstName} {selectedUser.lastName}
              </h4>
              <p>{selectedUser.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className="cert-form">
            {/* Row 1: Principal + Currency */}
            <div className="cert-form-row">
              <div className="cert-form-group">
                <label>
                  Principal <span className="cert-required">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5000000"
                  value={certificateData.principal}
                  onChange={(e) => handleChange("principal", e.target.value)}
                  disabled={sendingCertificate}
                />
              </div>
              <div className="cert-form-group">
                <label>Currency</label>
                <select
                  value={certificateData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  disabled={sendingCertificate}
                >
                  <option value="NGN">₦ NGN</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                  <option value="GHS">GH₵ GHS</option>
                  <option value="KES">KSh KES</option>
                  <option value="ZAR">R ZAR</option>
                </select>
              </div>
            </div>

            {/* Row 2: Investment Date + Plan */}
            <div className="cert-form-row">
              <div className="cert-form-group">
                <label>
                  Investment Date <span className="cert-required">*</span>
                </label>
                <input
                  type="date"
                  value={certificateData.investmentDate}
                  onChange={(e) => handleChange("investmentDate", e.target.value)}
                  disabled={sendingCertificate}
                />
              </div>
              <div className="cert-form-group">
                <label>
                  Investment Plan <span className="cert-required">*</span>
                </label>
                <select
                  value={certificateData.investmentPlan}
                  onChange={(e) => handleChange("investmentPlan", e.target.value)}
                  disabled={sendingCertificate}
                >
                  <option value="">Select Plan</option>
                  <option value="Silver Plan (6 months)">Silver Plan (6 months)</option>
                  <option value="Gold Plan (12 months)">Gold Plan (12 months)</option>
                  <option value="Platinum Plan (24 months)">Platinum Plan (24 months)</option>
                  <option value="Diamond Plan (36 months)">Diamond Plan (36 months)</option>
                  <option value="Fixed Investment Plan">Fixed Investment Plan</option>
                </select>
              </div>
            </div>

            {/* Row 3: Annual Return + Gross Monthly Return */}
            <div className="cert-form-row">
              <div className="cert-form-group">
                <label>Annual Return (%)</label>
                <input
                  type="number"
                  placeholder="e.g., 15"
                  value={certificateData.annualReturn}
                  onChange={(e) => handleChange("annualReturn", e.target.value)}
                  disabled={sendingCertificate}
                />
              </div>
              <div className="cert-form-group">
                <label>Gross Monthly Return</label>
                <input
                  type="number"
                  placeholder="e.g., 62500"
                  value={certificateData.grossMonthlyReturn}
                  onChange={(e) => handleChange("grossMonthlyReturn", e.target.value)}
                  disabled={sendingCertificate}
                />
              </div>
            </div>

            {/* Row 4: Withholding Tax + Net Monthly Return */}
            <div className="cert-form-row">
              <div className="cert-form-group">
                <label>Withholding Tax</label>
                <input
                  type="number"
                  placeholder="e.g., 6250"
                  value={certificateData.withholdingTax}
                  onChange={(e) => handleChange("withholdingTax", e.target.value)}
                  disabled={sendingCertificate}
                />
              </div>
              <div className="cert-form-group">
                <label>Net Monthly Return</label>
                <input
                  type="number"
                  placeholder="e.g., 56250"
                  value={certificateData.netMonthlyReturn}
                  onChange={(e) => handleChange("netMonthlyReturn", e.target.value)}
                  disabled={sendingCertificate}
                />
              </div>
            </div>

            {/* Row 5: Payment Date + Status */}
            <div className="cert-form-row">
              <div className="cert-form-group">
                <label>Payment Date</label>
                <input
                  type="text"
                  placeholder="e.g., Monthly (15th of each month)"
                  value={certificateData.paymentDate}
                  onChange={(e) => handleChange("paymentDate", e.target.value)}
                  disabled={sendingCertificate}
                />
              </div>
              <div className="cert-form-group">
                <label>Status</label>
                <select
                  value={certificateData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  disabled={sendingCertificate}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="MATURED">MATURED</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - All buttons have disabled states to prevent double clicks */}
        <div className="cert-modal-footer">
          <button
            className="cert-btn-secondary"
            onClick={() => !sendingCertificate && onClose()}
            disabled={sendingCertificate}
          >
            Cancel
          </button>
          <button
            className="cert-btn-preview"
            onClick={onPreview}
            disabled={certPreviewLoading || sendingCertificate || !isFormValid()}
          >
            {certPreviewLoading ? (
              <>
                <FaSpinner className="cert-spinner" /> Loading...
              </>
            ) : (
              "Preview"
            )}
          </button>
          <button
            className="cert-btn-primary"
            onClick={onSubmit}
            disabled={sendingCertificate || !isFormValid()}
          >
            {sendingCertificate ? (
              <>
                <FaSpinner className="cert-spinner" /> Sending...
              </>
            ) : (
              "Generate & Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendCertificateModal;
