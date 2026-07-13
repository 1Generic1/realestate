import React, { useRef, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import "./CertificatePreviewModal.css";

const CertificatePreviewModal = ({
  show,
  certPreviewHtml,
  loading = false,
  onClose,
  onDownload,
  downloading = false,
  showDownload = true,
}) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (show && certPreviewHtml && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(certPreviewHtml);
      doc.close();
    }
  }, [show, certPreviewHtml]);

  if (!show) return null;

  return (
    <div
      className="cert-preview-overlay"
      onClick={() => !loading && onClose()}
    >
      <div
        className="cert-preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cert-preview-header">
          <h3>📄 Certificate Preview</h3>
          <button
            className="cert-preview-close"
            onClick={() => !loading && onClose()}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Body with iframe */}
        <div className="cert-preview-body">
          {loading ? (
            <div className="cert-preview-loading">
              <FaSpinner className="cert-preview-spinner" />
              <p>Loading preview...</p>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              className="cert-preview-iframe"
              title="Certificate Preview"
              sandbox="allow-same-origin"
            />
          )}
        </div>

        {/* Footer */}
        <div className="cert-preview-footer">
          <button
            className="cert-preview-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          {showDownload && (
            <button
              className="cert-preview-btn-primary"
              onClick={onDownload}
              disabled={downloading || loading}
            >
              {downloading ? (
                <>
                  <FaSpinner className="cert-preview-spinner-small" /> Downloading...
                </>
              ) : (
                "📥 Download PDF"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;