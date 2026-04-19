// client/src/component/userpages/pages/Auth/SignUp.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaGoogle,
  FaFacebook,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelopeOpen,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authUserAPI } from "../../../../services/adminApi";
import "./Auth.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralSource: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.email) {
      toast.error("Please enter your email address");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!formData.password) {
      toast.error("Please create a password");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authUserAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        referralSource: formData.referralSource,
      });

      console.log("✅ Success Response:", response);

      if (response && response.success === true) {
        toast.success(
          response.message ||
            "Account created successfully! Please check your email to verify your account.",
        );

        setUserEmail(formData.email);
        setTimeout(() => {
          setShowVerificationMessage(true);
        }, 2000);
      } else {
        toast.error(response?.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);

      // Check the status code and display appropriate message
      const statusCode = err.response?.status;
      const errorData = err.response?.data;

      console.log("Status Code:", statusCode);
      console.log("Error Data:", errorData);

      let errorMessage = "Registration failed. Please try again.";

      // Handle different status codes
      if (statusCode === 400) {
        // Bad Request - Check for specific error types
        if (errorData?.errorType === "DuplicateError") {
          errorMessage =
            "User with this email already exists. Please use a different email or login.";
        } else if (errorData?.errorType === "ValidationError") {
          errorMessage =
            errorData.message || "Please check your input and try again.";
        } else {
          errorMessage =
            errorData?.error ||
            errorData?.message ||
            "Invalid information provided.";
        }
      } else if (statusCode === 401) {
        errorMessage = "Unauthorized. Please check your credentials.";
      } else if (statusCode === 403) {
        errorMessage = "Access forbidden. Please contact support.";
      } else if (statusCode === 404) {
        errorMessage = "Service not found. Please try again later.";
      } else if (statusCode === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (statusCode === 408 || err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your connection.";
      }

      console.log("Displaying error message:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If verification message is shown, display the verification screen
  if (showVerificationMessage) {
    return (
      <div className="auth-container">
        <div className="auth-bg-decoration">
          <div className="auth-bg-circle auth-bg-circle-1"></div>
          <div className="auth-bg-circle auth-bg-circle-2"></div>
          <div className="auth-bg-circle auth-bg-circle-3"></div>
        </div>

        <div className="auth-card verification-card" data-aos="fade-up">
          <div className="verification-icon">
            <FaEnvelopeOpen />
          </div>
          <h2 className="verification-title">Verify Your Email</h2>
          <p className="verification-text">
            We've sent a verification link to:
          </p>
          <p className="verification-email">{userEmail}</p>
          <p className="verification-instruction">
            Please check your email and click the verification link to activate
            your account. If you don't see the email, check your spam folder.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="verification-btn"
          >
            Go to Login
          </button>
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
            <span className="auth-logo-icon">🏠</span>
            <span className="auth-logo-text">
              TAYE'S <span className="auth-logo-gold">PROPERTY</span>
            </span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join us to start your property journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-row">
            <div className="auth-input-group">
              <FaUser className="auth-input-icon" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="auth-input"
                disabled={loading}
              />
            </div>
            <div className="auth-input-group">
              <FaUser className="auth-input-icon" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="auth-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <FaEnvelope className="auth-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <FaPhone className="auth-input-icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="auth-input"
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <FaLock className="auth-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              disabled={loading}
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
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              disabled={loading}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="auth-input-group">
            <select
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              className="auth-select"
              disabled={loading}
            >
              <option value="">How did you hear about us? (Optional)</option>
              <option value="google">Google Search</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="friend">Friend/Family</option>
              <option value="direct">Direct Visit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
            <FaArrowRight className="auth-btn-icon" />
          </button>
        </form>

        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>

        <div className="auth-social">
          <button className="auth-social-btn google">
            <FaGoogle /> Google
          </button>
          <button className="auth-social-btn facebook">
            <FaFacebook /> Facebook
          </button>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
