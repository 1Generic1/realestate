// client/src/component/userpages/pages/Auth/Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { authUserAPI } from "../../../../services/adminApi";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // ✅ LOAD SAVED EMAIL ON MOUNT
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (rememberMe && savedEmail) {
      setFormData({
        email: savedEmail,
        password: "",
        rememberMe: true,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "rememberMe" && !checked) {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMe");
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return false;
    }
    if (!formData.password) {
      toast.error("Please enter your password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authUserAPI.login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      console.log("Login response:", response);

      if (response && response.success === true) {
        toast.success("Login successful! Redirecting...");

        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMe");
        }

        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("Token stored successfully");
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(response?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.errorType === "EmailNotVerified") {
        toast.error(
          "Please verify your email before logging in. Check your inbox for the verification link."
        );
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to continue your property journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="auth-options">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="auth-forgot-link"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
            <FaArrowRight className="auth-btn-icon" />
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
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
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;