import React, { useState } from "react";
import { templateAPI } from "../../../services/adminApi";
import "./TemplateEditor.css";

const TemplateEditor = ({ template, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    recipientTitle: template.data?.recipientTitle || "",
    letterTitle: template.data?.letterTitle || "",
    salutation: template.data?.salutation || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await templateAPI.updateTemplate(template.type, formData);
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update template");
    } finally {
      setLoading(false);
    }
  };

  const getTemplateTitle = () => {
    if (template.type === "visa") return "Visa Reference Template";
    if (template.type === "employment") return "Employment Reference Template";
    if (template.type === "bank") return "Bank Reference Template";
    if (template.type === "general") return "General Reference Template";
    if (template.type.startsWith("custom/"))
      return `Custom Template: ${template.customName}`;
    return "Edit Template";
  };

  return (
    <div className="editor-overlay" onClick={onClose}>
      <div className="editor-container" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <h3>{getTemplateTitle()}</h3>
          <button className="editor-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          {error && <div className="editor-error">{error}</div>}

          <div className="editor-field">
            <label>Recipient Title</label>
            <input
              type="text"
              name="recipientTitle"
              value={formData.recipientTitle}
              onChange={handleChange}
              placeholder="e.g., TO THE EMBASSY/VISA OFFICER"
              required
            />
            <small>This appears at the top of the letter</small>
          </div>

          <div className="editor-field">
            <label>Letter Title</label>
            <input
              type="text"
              name="letterTitle"
              value={formData.letterTitle}
              onChange={handleChange}
              placeholder="e.g., LETTER OF REFERENCE"
              required
            />
            <small>The main heading of the letter</small>
          </div>

          <div className="editor-field">
            <label>Salutation</label>
            <input
              type="text"
              name="salutation"
              value={formData.salutation}
              onChange={handleChange}
              placeholder="e.g., Dear Visa Officer"
              required
            />
            <small>The opening greeting of the letter</small>
          </div>

          <div className="editor-preview">
            <h4>Preview</h4>
            <div className="preview-box">
              <div className="preview-recipient">
                {formData.recipientTitle || "RECIPIENT TITLE"}
              </div>
              <div className="preview-title">
                {formData.letterTitle || "LETTER TITLE"}
              </div>
              <div className="preview-salutation">
                {formData.salutation || "Salutation"},
              </div>
            </div>
          </div>

          <div className="editor-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateEditor;
