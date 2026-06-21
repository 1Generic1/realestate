import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { authUserAPI } from "../../../../services/adminApi";
import "./Auth.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authUserAPI.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.error || "Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card verification-card">
        {status === "loading" && (
          <>
            <FaSpinner className="spinner" />
            <h2>Verifying your email...</h2>
            <p>Please wait while we confirm your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="success-icon" />
            <h2>Email Verified! ✅</h2>
            <p>{message}</p>
            <Link to="/login" className="verification-btn">
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className="error-icon" />
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <Link to="/login" className="verification-btn">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
