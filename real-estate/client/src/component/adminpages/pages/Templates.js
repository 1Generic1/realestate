import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import TemplateEditor from "../components/TemplateEditor";
import { templateAPI } from "../../../services/adminApi";
import "./Templates.css";

const Templates = () => {
  const [templates, setTemplates] = useState({
    visa: null,
    employment: null,
    bank: null,
    general: null,
    custom: {},
  });
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    recipientTitle: "",
    letterTitle: "",
    salutation: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await templateAPI.getAllTemplates();
      setTemplates(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load templates" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomTemplate = async () => {
    if (
      !newTemplate.name ||
      !newTemplate.recipientTitle ||
      !newTemplate.letterTitle ||
      !newTemplate.salutation
    ) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    try {
      await templateAPI.createCustomTemplate(newTemplate);
      setMessage({
        type: "success",
        text: "Custom template created successfully",
      });
      setShowCustomModal(false);
      setNewTemplate({
        name: "",
        recipientTitle: "",
        letterTitle: "",
        salutation: "",
      });
      loadTemplates();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to create template",
      });
    }
  };

  const handleDeleteCustomTemplate = async (name) => {
    if (window.confirm(`Delete template "${name}"?`)) {
      try {
        await templateAPI.deleteCustomTemplate(name);
        setMessage({ type: "success", text: "Template deleted successfully" });
        loadTemplates();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete template" });
      }
    }
  };

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">Loading templates...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="templates-container">
        <div className="templates-header">
          <div>
            <h2>Reference Letter Templates</h2>
            <p>Manage templates for different types of reference letters</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCustomModal(true)}
          >
            + Create Custom Template
          </button>
        </div>

        {message.text && (
          <div
            className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}
          >
            {message.text}
          </div>
        )}

        <div className="templates-grid">
          {templateList.map((template) => (
            <div key={template.key} className="template-card">
              <div className="template-card-header">
                <div className="template-icon">{template.icon}</div>
                <div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </div>
              <div className="template-preview">
                <div className="preview-line">
                  <strong>Recipient:</strong>{" "}
                  {templates[template.key]?.recipientTitle}
                </div>
                <div className="preview-line">
                  <strong>Title:</strong> {templates[template.key]?.letterTitle}
                </div>
                <div className="preview-line">
                  <strong>Salutation:</strong>{" "}
                  {templates[template.key]?.salutation}
                </div>
              </div>
              <button
                className="btn-edit"
                onClick={() =>
                  setEditingTemplate({
                    type: template.key,
                    data: templates[template.key],
                  })
                }
              >
                Edit Template
              </button>
            </div>
          ))}
        </div>

        {Object.keys(templates.custom).length > 0 && (
          <div className="custom-templates-section">
            <h3>Custom Templates</h3>
            <div className="custom-templates-grid">
              {Object.entries(templates.custom).map(([name, template]) => (
                <div key={name} className="custom-template-card">
                  <div className="custom-template-header">
                    <span className="custom-template-icon">📋</span>
                    <span className="custom-template-name">{name}</span>
                    <div className="custom-template-actions">
                      <button
                        className="icon-btn edit"
                        onClick={() =>
                          setEditingTemplate({
                            type: `custom/${name}`,
                            data: template,
                            customName: name,
                          })
                        }
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDeleteCustomTemplate(name)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="custom-template-preview">
                    <div>
                      <strong>Recipient:</strong> {template.recipientTitle}
                    </div>
                    <div>
                      <strong>Title:</strong> {template.letterTitle}
                    </div>
                    <div>
                      <strong>Salutation:</strong> {template.salutation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Custom Template Modal */}
        {showCustomModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowCustomModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create Custom Template</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowCustomModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Template Name</label>
                  <input
                    type="text"
                    placeholder="e.g., School Reference, Court Reference"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Recipient Title</label>
                  <input
                    type="text"
                    placeholder="e.g., TO THE ADMISSIONS COMMITTEE"
                    value={newTemplate.recipientTitle}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        recipientTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Letter Title</label>
                  <input
                    type="text"
                    placeholder="e.g., STUDENT REFERENCE LETTER"
                    value={newTemplate.letterTitle}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        letterTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Salutation</label>
                  <input
                    type="text"
                    placeholder="e.g., Dear Admissions Committee"
                    value={newTemplate.salutation}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        salutation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowCustomModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreateCustomTemplate}
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Template Editor Modal */}
        {editingTemplate && (
          <TemplateEditor
            template={editingTemplate}
            onClose={() => setEditingTemplate(null)}
            onSave={loadTemplates}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Templates;
