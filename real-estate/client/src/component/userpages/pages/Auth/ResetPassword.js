import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { authUserAPI } from "../../../../services/adminApi";
import "./Auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authUserAPI.resetPassword(token, { password });
      setResetComplete(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (resetComplete) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <FaCheckCircle className="success-icon" size={60} color="#4caf50" />
            <h2 className="auth-title">Password Reset Complete!</h2>
            <p className="auth-subtitle">
              Your password has been successfully reset.
            </p>
            <Link to="/login" className="auth-btn" style={{ marginTop: "20px" }}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo">
            <span className="auth-logo-icon">🔑</span>
            <span className="auth-logo-text">
              TAYE'S <span className="auth-logo-gold">PROPERTY</span>
            </span>
          </div>
          <h2 className="auth-title">Set New Password</h2>
          <p className="auth-subtitle">Choose a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <FaLock className="auth-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              disabled={loading}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="auth-input-group">
            <FaLock className="auth-input-icon" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
