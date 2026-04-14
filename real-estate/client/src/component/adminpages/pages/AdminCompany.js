import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import { companyAPI } from "../../../services/adminApi";
import "./AdminCompany.css";

const AdminCompany = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [companyData, setCompanyData] = useState({
    name: "",
    tagline: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      mapLink: "",
    },
    phone: {
      primary: "",
      secondary: "",
      whatsapp: "",
    },
    email: {
      general: "",
      support: "",
      sales: "",
      rentals: "",
    },
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed",
      notes: "Public holidays may vary",
    },
    social: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    signatoryName: "",
    signatoryTitle: "",
    signature: "",
  });

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getCompanyInfo();
      if (response.data) {
        setCompanyData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load company info");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields (e.g., phone.primary, email.general, address.street)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCompanyData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCompanyData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await companyAPI.uploadSignature(file);
      setCompanyData((prev) => ({
        ...prev,
        signature: response.data.url,
      }));
      toast.success("Signature uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload signature");
    }
  };

  const handleDeleteSignature = async () => {
    if (window.confirm("Are you sure you want to delete the signature?")) {
      try {
        await companyAPI.deleteSignature();
        setCompanyData((prev) => ({
          ...prev,
          signature: "",
        }));
        toast.success("Signature deleted successfully");
      } catch (error) {
        toast.error("Failed to delete signature");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyAPI.updateCompany(companyData);
      toast.success("Company information updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update company information",
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading company information...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-company">
        <div className="admin-company-header">
          <h2>Company Settings</h2>
          <p>Manage your company information, branding, and signatures</p>
        </div>

        {/* Tab Navigation */}
        <div className="company-tabs">
          <button
            className={`tab-btn ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact
          </button>
          <button
            className={`tab-btn ${activeTab === "hours" ? "active" : ""}`}
            onClick={() => setActiveTab("hours")}
          >
            Business Hours
          </button>
          <button
            className={`tab-btn ${activeTab === "signature" ? "active" : ""}`}
            onClick={() => setActiveTab("signature")}
          >
            Signature
          </button>
          <button
            className={`tab-btn ${activeTab === "social" ? "active" : ""}`}
            onClick={() => setActiveTab("social")}
          >
            Social Media
          </button>
        </div>

        <form onSubmit={handleSubmit} className="company-form">
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={companyData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={companyData.tagline || ""}
                  onChange={handleInputChange}
                  placeholder="Your company slogan"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={companyData.description || ""}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell visitors about your company..."
                />
              </div>
            </div>
          )}

          {/* Contact Information Tab */}
          {activeTab === "contact" && (
            <div className="form-section">
              <h3>Contact Information</h3>

              <h4>Phone Numbers</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Phone *</label>
                  <input
                    type="text"
                    name="phone.primary"
                    value={companyData.phone?.primary || ""}
                    onChange={handleInputChange}
                    placeholder="+234 801 234 5678"
                  />
                </div>
                <div className="form-group">
                  <label>Secondary Phone</label>
                  <input
                    type="text"
                    name="phone.secondary"
                    value={companyData.phone?.secondary || ""}
                    onChange={handleInputChange}
                    placeholder="+234 802 345 6789"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  name="phone.whatsapp"
                  value={companyData.phone?.whatsapp || ""}
                  onChange={handleInputChange}
                  placeholder="+234 803 456 7890"
                />
              </div>

              <h4>Email Addresses</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>General Email *</label>
                  <input
                    type="email"
                    name="email.general"
                    value={companyData.email?.general || ""}
                    onChange={handleInputChange}
                    placeholder="info@company.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Support Email</label>
                  <input
                    type="email"
                    name="email.support"
                    value={companyData.email?.support || ""}
                    onChange={handleInputChange}
                    placeholder="support@company.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sales Email</label>
                  <input
                    type="email"
                    name="email.sales"
                    value={companyData.email?.sales || ""}
                    onChange={handleInputChange}
                    placeholder="sales@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Rentals Email</label>
                  <input
                    type="email"
                    name="email.rentals"
                    value={companyData.email?.rentals || ""}
                    onChange={handleInputChange}
                    placeholder="rentals@company.com"
                  />
                </div>
              </div>

              <h4>Address</h4>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="address.street"
                  value={companyData.address?.street || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={companyData.address?.city || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={companyData.address?.state || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={companyData.address?.country || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={companyData.address?.postalCode || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Map Link</label>
                <input
                  type="url"
                  name="address.mapLink"
                  value={companyData.address?.mapLink || ""}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          )}

          {/* Business Hours Tab */}
          {activeTab === "hours" && (
            <div className="form-section">
              <h3>Business Hours</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Monday</label>
                  <input
                    type="text"
                    name="hours.monday"
                    value={companyData.hours?.monday || ""}
                    onChange={handleInputChange}
                    placeholder="9:00 AM - 5:00 PM"
                  />
                </div>
                <div className="form-group">
                  <label>Tuesday</label>
                  <input
                    type="text"
                    name="hours.tuesday"
                    value={companyData.hours?.tuesday || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Wednesday</label>
                  <input
                    type="text"
                    name="hours.wednesday"
                    value={companyData.hours?.wednesday || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Thursday</label>
                  <input
                    type="text"
                    name="hours.thursday"
                    value={companyData.hours?.thursday || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Friday</label>
                  <input
                    type="text"
                    name="hours.friday"
                    value={companyData.hours?.friday || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Saturday</label>
                  <input
                    type="text"
                    name="hours.saturday"
                    value={companyData.hours?.saturday || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Sunday</label>
                <input
                  type="text"
                  name="hours.sunday"
                  value={companyData.hours?.sunday || ""}
                  onChange={handleInputChange}
                  placeholder="Closed"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input
                  type="text"
                  name="hours.notes"
                  value={companyData.hours?.notes || ""}
                  onChange={handleInputChange}
                  placeholder="Public holidays may vary"
                />
              </div>
            </div>
          )}

          {/* Signature Tab */}
          {activeTab === "signature" && (
            <div className="form-section">
              <h3>Signature Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Signatory Name</label>
                  <input
                    type="text"
                    name="signatoryName"
                    value={companyData.signatoryName || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., Taye Adebayo"
                  />
                </div>
                <div className="form-group">
                  <label>Signatory Title</label>
                  <input
                    type="text"
                    name="signatoryTitle"
                    value={companyData.signatoryTitle || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., Managing Director"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Signature Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                />
                {companyData.signature && (
                  <div className="image-preview">
                    <img src={companyData.signature} alt="Signature" />
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={handleDeleteSignature}
                    >
                      Delete Signature
                    </button>
                  </div>
                )}
                <small className="form-hint">
                  Upload a clear image of the signatory's signature (PNG, JPG)
                </small>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="form-section">
              <h3>Social Media Links</h3>
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="url"
                  name="social.facebook"
                  value={companyData.social?.facebook || ""}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="url"
                  name="social.twitter"
                  value={companyData.social?.twitter || ""}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  name="social.instagram"
                  value={companyData.social?.instagram || ""}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="social.linkedin"
                  value={companyData.social?.linkedin || ""}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCompany;
