import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaEnvelopeOpen } from "react-icons/fa";
import { toast } from "react-toastify";
import { authUserAPI } from "../../../../services/adminApi";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate email
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // ✅ Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIX: Send email as an object with email property
      await authUserAPI.forgotPassword({ email });
      setSubmitted(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.error || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card verification-card">
          <div className="verification-icon">
            <FaEnvelopeOpen />
          </div>
          <h2 className="verification-title">Check Your Email</h2>
          <p className="verification-text">
            We've sent a password reset link to:
          </p>
          <p className="verification-email">{email}</p>
          <p className="verification-instruction">
            Please check your inbox and spam folder. The link will expire in 1 hour.
          </p>
          <Link to="/login" className="verification-btn">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-bg-decoration">
        <div className="auth-bg-circle auth-bg-circle-1"></div>
        <div className="auth-bg-circle auth-bg-circle-2"></div>
        <div className="auth-bg-circle auth-bg-circle-3"></div>
      </div>

      <div className="auth-card" data-aos="fade-up">
        <div className="auth-card-header">
          <div className="auth-logo">
            <span className="auth-logo-icon">🔐</span>
            <span className="auth-logo-text">
              TAYE'S <span className="auth-logo-gold">PROPERTY</span>
            </span>
          </div>
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <FaEnvelope className="auth-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              disabled={loading}
              required
              autoFocus
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="auth-link">
            <FaArrowLeft /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;