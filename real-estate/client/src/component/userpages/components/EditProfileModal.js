import React, { useState, useEffect } from "react";
import { FaSpinner, FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { authUserAPI } from "../../../services/adminApi";
import "./EditProfileModal.css";

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: {
      flat: "",
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Populate form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: {
          flat: user.location?.flat || "",
          street: user.location?.street || "",
          city: user.location?.city || "",
          state: user.location?.state || "",
          country: user.location?.country || "Nigeria",
        },
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Handle avatar change with upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setAvatarFile(file);
    setUploadingAvatar(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      // Upload avatar to server
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await authUserAPI.updateAvatar(formData);
      if (response && response.success) {
        toast.success('Avatar updated successfully!');
        
        // ✅ Get fresh user data from API
        const userResponse = await authUserAPI.getCurrentUser();
        if (userResponse && userResponse.success) {
          const freshUser = userResponse.data;
          // ✅ Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(freshUser));
          // ✅ Update parent component
          if (onUpdate) {
            await onUpdate();
          }
        }
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload avatar');
      // Revert preview on error
      setAvatarPreview(user?.avatar || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await authUserAPI.deleteAvatar();
      toast.success('Avatar removed successfully');
      setAvatarPreview(null);
      setAvatarFile(null);
      
      // ✅ Get fresh user data from API
      const userResponse = await authUserAPI.getCurrentUser();
      if (userResponse && userResponse.success) {
        const freshUser = userResponse.data;
        // ✅ Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(freshUser));
        if (onUpdate) {
          await onUpdate();
        }
      }
    } catch (error) {
      console.error('Avatar removal error:', error);
      toast.error('Failed to remove avatar');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password if any password field is filled
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      // Prepare data for update
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        location: {
          flat: formData.location.flat,
          street: formData.location.street,
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
        },
      };

      // Update profile
      await authUserAPI.updateProfile(updateData);

      // Update password if provided
      if (formData.currentPassword && formData.newPassword) {
        await authUserAPI.changePassword(
          formData.currentPassword,
          formData.newPassword
        );
      }

      toast.success("Profile updated successfully!");
      
      // Call onUpdate callback to refresh user data
      if (onUpdate) {
        await onUpdate();
      }

      onClose();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'current') setShowCurrentPassword(!showCurrentPassword);
    if (field === 'new') setShowNewPassword(!showNewPassword);
    if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="epm-overlay" onClick={onClose}>
      <div className="epm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="epm-header">
          <h3>Edit <span>Profile</span></h3>
          <button className="epm-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <form className="epm-body" onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="epm-avatar-section">
            <div className="epm-avatar">
              {uploadingAvatar ? (
                <FaSpinner className="epm-avatar-spinner" />
              ) : avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" />
              ) : (
                <FaUserCircle />
              )}
            </div>
            <div className="epm-avatar-actions">
              <label htmlFor="avatar-upload" className={uploadingAvatar ? 'uploading' : ''}>
                {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
              {avatarPreview && (
                <button
                  type="button"
                  className="epm-remove-avatar"
                  onClick={handleRemoveAvatar}
                  disabled={uploadingAvatar}
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="epm-form-row">
            <div className="epm-form-group">
              <label>
                First Name <span className="epm-required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                disabled={loading}
              />
              {errors.firstName && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>
                  {errors.firstName}
                </span>
              )}
            </div>
            <div className="epm-form-group">
              <label>
                Last Name <span className="epm-required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                disabled={loading}
              />
              {errors.lastName && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="epm-form-row">
            <div className="epm-form-group">
              <label>
                Email <span className="epm-required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                disabled={loading}
              />
              {errors.email && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>
                  {errors.email}
                </span>
              )}
            </div>
            <div className="epm-form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="epm-location-section">
            <div className="epm-location-title">Location</div>
            <div className="epm-form-row">
              <div className="epm-form-group">
                <label>Flat/Apartment</label>
                <input
                  type="text"
                  name="location.flat"
                  value={formData.location.flat}
                  onChange={handleChange}
                  placeholder="e.g., Apt 4B"
                  disabled={loading}
                />
              </div>
              <div className="epm-form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="location.street"
                  value={formData.location.street}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main Street"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="epm-form-row">
              <div className="epm-form-group">
                <label>City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="e.g., Lagos"
                  disabled={loading}
                />
              </div>
              <div className="epm-form-group">
                <label>State</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="e.g., Lagos State"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="epm-form-row">
              <div className="epm-form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  placeholder="e.g., Nigeria"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Change Password Section with Show/Hide */}
          <div className="epm-password-section">
            <div className="epm-password-title">Change Password</div>
            
            {/* Current Password */}
            <div className="epm-form-group">
              <label>Current Password</label>
              <div className="epm-password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="epm-password-toggle"
                  onClick={() => togglePasswordVisibility('current')}
                  disabled={loading}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.currentPassword && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>
                  {errors.currentPassword}
                </span>
              )}
            </div>

            {/* New Password + Confirm Password */}
            <div className="epm-form-row">
              <div className="epm-form-group">
                <label>New Password</label>
                <div className="epm-password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="epm-password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={loading}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <span style={{ color: "#dc3545", fontSize: "12px" }}>
                    {errors.newPassword}
                  </span>
                )}
              </div>
              <div className="epm-form-group">
                <label>Confirm Password</label>
                <div className="epm-password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="epm-password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span style={{ color: "#dc3545", fontSize: "12px" }}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="epm-footer">
          <button className="epm-btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="epm-btn-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="epm-spinner" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;