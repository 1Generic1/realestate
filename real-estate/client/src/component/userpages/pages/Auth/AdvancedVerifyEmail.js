import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authUserAPI } from "../../../../services/adminApi";
import "./Auth.css";

const AdvancedVerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const verificationCalled = useRef(false);
  
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showResendForm, setShowResendForm] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  
  // ✅ REF FOR TIMER TO CLEANUP
  const timerRef = useRef(null);

  // ✅ LOAD COOLDOWN FROM localStorage ON MOUNT
  useEffect(() => {
    const storedCooldown = localStorage.getItem("verificationCooldown");
    if (storedCooldown) {
      const remaining = parseInt(storedCooldown);
      if (remaining > 0) {
        setCooldown(remaining);
        startCooldownTimer(remaining);
      } else {
        localStorage.removeItem("verificationCooldown");
      }
    }
  }, []);

  // ✅ CLEANUP TIMER ON UNMOUNT
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // ✅ START COOLDOWN TIMER
  const startCooldownTimer = (seconds) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    let remaining = seconds;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCooldown(remaining);
      localStorage.setItem("verificationCooldown", remaining.toString());
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        localStorage.removeItem("verificationCooldown");
      }
    }, 1000);
  };

  // ✅ SET COOLDOWN AND PERSIST
  const setCooldownAndPersist = (seconds) => {
    setCooldown(seconds);
    localStorage.setItem("verificationCooldown", seconds.toString());
    startCooldownTimer(seconds);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail") || "";
    setEmail(storedEmail);
    setNewEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (token && !verificationCalled.current) {
      verificationCalled.current = true;
      verifyEmail(token);
    } else if (!token) {
      const storedEmail = localStorage.getItem("pendingVerificationEmail") || "";
      if (storedEmail) {
        setShowResendForm(true);
        setStatus("idle");
      } else {
        navigate("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      setStatus("loading");
      const response = await authUserAPI.verifyEmailAdvanced(verificationToken);
      setStatus("success");
      setMessage(response.message || "Email verified successfully!");
      toast.success("✅ Email verified successfully! Redirecting to login...");
      localStorage.removeItem("pendingVerificationEmail");
      localStorage.removeItem("verificationCooldown");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      const errorMsg = error.response?.data?.error || "Failed to verify email. Please try again.";
      
      if (errorMsg.toLowerCase().includes("already verified")) {
        setIsAlreadyVerified(true);
        setMessage("✅ This email is already verified! Redirecting to login...");
        toast.info("✅ Email already verified! Redirecting to login...");
        localStorage.removeItem("pendingVerificationEmail");
        localStorage.removeItem("verificationCooldown");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }
      
      if (errorMsg.toLowerCase().includes("expired")) {
        setMessage("⏰ Verification link has expired. Please request a new one below.");
        toast.error("⏰ Verification link has expired");
        setShowResendForm(true);
      } else {
        setMessage(errorMsg);
        toast.error(errorMsg);
        setShowResendForm(true);
      }
    }
  };

  const handleResendVerification = async () => {
    if (isAlreadyVerified) {
      toast.info("✅ Email already verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!email) {
      setMessage("Please enter your email address");
      setStatus("error");
      toast.error("Please enter your email address");
      return;
    }
    
    if (resending || cooldown > 0) return;

    try {
      setResending(true);
      setStatus("loading");
      setMessage("Sending verification email...");
      
      console.log("📤 Sending resend request for:", email);
      
      const response = await authUserAPI.resendVerificationEmail({ email });
      
      console.log("📥 Resend response:", response);
      
      if (response.success) {
        setStatus("success");
        setMessage("✅ Verification email resent! Please check your inbox.");
        toast.success("✅ Verification email resent! Please check your inbox.");
        
        // ✅ PERSIST COOLDOWN
        setCooldownAndPersist(60);
      } else {
        setStatus("error");
        const errorMsg = response.error || "Failed to resend verification email";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Resend error:", error);
      setStatus("error");
      
      if (error.response?.data?.error?.toLowerCase().includes("already verified")) {
        setIsAlreadyVerified(true);
        setMessage("✅ This email is already verified! Redirecting to login...");
        toast.info("✅ Email already verified! Redirecting to login...");
        localStorage.removeItem("pendingVerificationEmail");
        localStorage.removeItem("verificationCooldown");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }
      
      if (error.response?.data?.remainingSeconds) {
        const remaining = error.response.data.remainingSeconds;
        setCooldownAndPersist(remaining);
        const msg = `⏳ Please wait ${remaining} seconds before requesting another email`;
        setMessage(msg);
        toast.warning(msg);
      } else {
        const errorMsg = error.response?.data?.error || "Failed to resend verification email";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setResending(false);
    }
  };

  const handleChangeEmail = async () => {
    if (isAlreadyVerified) {
      toast.info("✅ Email already verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!newEmail || newEmail.trim() === "") {
      setMessage("Please enter a valid email address");
      setStatus("error");
      toast.error("Please enter a valid email address");
      return;
    }

    if (newEmail === email) {
      setMessage("Email is the same. No changes needed.");
      setStatus("error");
      toast.warning("Email is the same. No changes needed.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setMessage("Please enter a valid email address");
      setStatus("error");
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setUpdatingEmail(true);
      setStatus("loading");
      setMessage("Updating email address...");

      const response = await authUserAPI.changeVerificationEmail({
        oldEmail: email,
        newEmail: newEmail,
      });

      if (response.success) {
        setEmail(newEmail);
        setShowChangeEmail(false);
        setStatus("success");
        setMessage("✅ Email updated successfully! A new verification link has been sent.");
        toast.success("✅ Email updated successfully! A new verification link has been sent.");
        localStorage.setItem("pendingVerificationEmail", newEmail);
        
        // ✅ PERSIST COOLDOWN
        setCooldownAndPersist(60);
      } else {
        setStatus("error");
        const errorMsg = response.error || "Failed to update email";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Change email error:", error);
      setStatus("error");
      
      if (error.response?.data?.error?.toLowerCase().includes("already verified")) {
        setIsAlreadyVerified(true);
        setMessage("✅ This email is already verified! Redirecting to login...");
        toast.info("✅ Email already verified! Redirecting to login...");
        localStorage.removeItem("pendingVerificationEmail");
        localStorage.removeItem("verificationCooldown");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }
      
      const errorMsg = error.response?.data?.error || "Failed to update email. Please try again.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUpdatingEmail(false);
    }
  };

  // ============= RENDER: NO TOKEN =============
  if (!token) {
    if (isAlreadyVerified) {
      return (
        <div className="advanced-verify-container">
          <div className="auth-container">
            <div className="auth-card verification-card">
              <FaCheckCircle className="success-icon" />
              <h2>Email Already Verified! ✅</h2>
              <p>Redirecting to login...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="advanced-verify-container">
        <div className="auth-container">
          <div className="auth-card verification-card">
            <h2>Verify Your Email</h2>
            <p className="verification-subtitle">
              We sent a verification link to your email address.
            </p>

            {!showChangeEmail ? (
              <>
                <div className="verification-email-display">
                  <span className="email-label">📧</span>
                  <span className="email-address">{email || "No email found"}</span>
                  <button 
                    className="edit-email-btn"
                    onClick={() => setShowChangeEmail(true)}
                    title="Change email"
                  >
                    <FaEdit />
                  </button>
                </div>

                {message && status === "error" && (
                  <div className="error-message">{message}</div>
                )}
                {message && status === "success" && (
                  <div className="success-message">{message}</div>
                )}

                <div className="resend-section">
                  <p className="resend-section-title">📧 Need help with verification?</p>

                  <div className="verification-actions">
                    <button
                      className={`verification-btn resend-btn ${cooldown > 0 ? "disabled" : ""}`}
                      onClick={handleResendVerification}
                      disabled={resending || cooldown > 0 || !email}
                    >
                      {resending ? (
                        <>
                          <FaSpinner className="spinner-small" /> Sending...
                        </>
                      ) : cooldown > 0 ? (
                        `Resend available in ${cooldown}s`
                      ) : (
                        "Resend Verification Email"
                      )}
                    </button>

                    <button
                      className="verification-btn change-email-btn"
                      onClick={() => setShowChangeEmail(true)}
                    >
                      ✏️ Wrong email? Change it
                    </button>
                  </div>

                  <p className="help-text">
                    💡 Didn't receive the email? Check your spam folder or click the button above.
                  </p>
                </div>
              </>
            ) : (
              <div className="change-email-form">
                <h3 className="change-email-title">Change Email Address</h3>
                <p className="change-email-subtitle">
                  Enter the correct email address. We'll send a new verification link.
                </p>
                
                <div className="form-group">
                  <label>Current Email</label>
                  <input
                    type="email"
                    value={email}
                    className="form-input"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>New Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter correct email address"
                    className="form-input"
                    autoFocus
                  />
                </div>

                {message && status === "error" && (
                  <div className="error-message">{message}</div>
                )}

                <div className="change-email-actions">
                  <button
                    className="verification-btn secondary"
                    onClick={() => {
                      setShowChangeEmail(false);
                      setNewEmail(email);
                      setMessage("");
                      setStatus("idle");
                    }}
                    disabled={updatingEmail}
                  >
                    Cancel
                  </button>
                  <button
                    className="verification-btn resend-btn"
                    onClick={handleChangeEmail}
                    disabled={updatingEmail || !newEmail}
                  >
                    {updatingEmail ? (
                      <>
                        <FaSpinner className="spinner-small" /> Updating...
                      </>
                    ) : (
                      "Update Email & Resend"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============= RENDER: HAS TOKEN =============
  return (
    <div className="advanced-verify-container"> 
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

          {status === "error" && !isAlreadyVerified && (
            <>
              <FaTimesCircle className="error-icon" />
              <h2>Verification Failed</h2>
              <p>{message}</p>
              
              {showResendForm && (
                <div className="verification-actions">
                  <button
                    className={`verification-btn resend-btn ${cooldown > 0 ? "disabled" : ""}`}
                    onClick={handleResendVerification}
                    disabled={resending || cooldown > 0}
                  >
                    {resending ? (
                      <>
                        <FaSpinner className="spinner-small" /> Sending...
                      </>
                    ) : cooldown > 0 ? (
                      `Resend available in ${cooldown}s`
                    ) : (
                      "Resend Verification Email"
                    )}
                  </button>
                  
                  <Link to="/login" className="verification-btn secondary">
                    Back to Login
                  </Link>
                </div>
              )}
            </>
          )}

          {isAlreadyVerified && (
            <>
              <FaCheckCircle className="success-icon" />
              <h2>Already Verified! ✅</h2>
              <p>This email has already been verified. Redirecting to login...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedVerifyEmail;