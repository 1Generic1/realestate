import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCompany } from "../../../../context/CompanyContext";
import {
  FaSearch,
  FaPhone,
  FaUser,
  FaBars,
  FaTimes,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaUserCircle,
  FaChevronDown,
  FaFileAlt,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { authUserAPI } from "../../../../services/adminApi";
import "./Header.css";
import EditProfileModal from "../EditProfileModal";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    company,
    loading: companyLoading,
    error: companyError,
  } = useCompany();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [referenceLetters, setReferenceLetters] = useState([]);
  const [loadingLetters, setLoadingLetters] = useState(false);
  const [downloadingLetterId, setDownloadingLetterId] = useState(null);
  const dropdownRef = useRef(null);

  const [investmentCertificates, setInvestmentCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [downloadingCertId, setDownloadingCertId] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Buy", path: "/buy" },
    { label: "Rent", path: "/rent" },
    { label: "Land", path: "/land" },
    { label: "Agents", path: "/agents" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await authUserAPI.getCurrentUser();
        console.log("📥 getCurrentUser response:", response);
        
        if (response && response.success) {
          const freshUser = response.data;
          console.log("✅ User loaded:", freshUser);
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
          
          // Fetch letters and certificates
          await Promise.all([
            fetchReferenceLetters(),
            fetchInvestmentCertificates(),
          ]);
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        logout();
      }
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await authUserAPI.getCurrentUser();
        if (response && response.success) {
          const freshUser = response.data;
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
          await Promise.all([
            fetchReferenceLetters(),
            fetchInvestmentCertificates(),
          ]);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  const fetchReferenceLetters = async () => {
    setLoadingLetters(true);
    try {
      const response = await authUserAPI.getReferenceLetters();
      console.log("📥 Reference letters response:", response);
      
      if (response && response.success) {
        const letters = response.data || [];
        console.log("✅ Reference letters found:", letters.length);
        setReferenceLetters(letters);
      } else {
        setReferenceLetters([]);
      }
    } catch (error) {
      console.error("Error fetching reference letters:", error);
      setReferenceLetters([]);
    } finally {
      setLoadingLetters(false);
    }
  };

  const fetchInvestmentCertificates = async () => {
    setLoadingCertificates(true);
    try {
      const response = await authUserAPI.getInvestmentCertificates();
      console.log("📥 Investment certificates response:", response);
      
      if (response && response.success) {
        const certificates = response.data || [];
        console.log("✅ Investment certificates found:", certificates.length);
        setInvestmentCertificates(certificates);
      } else {
        setInvestmentCertificates([]);
      }
    } catch (error) {
      console.error("Error fetching investment certificates:", error);
      setInvestmentCertificates([]);
    } finally {
      setLoadingCertificates(false);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    if (downloadingCertId === certificateId) return;

    setDownloadingCertId(certificateId);

    try {
      const result = await authUserAPI.downloadInvestmentCertificate(certificateId);
      if (result && result.success) {
        toast.success("Certificate download started");
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download investment certificate");
    } finally {
      setDownloadingCertId(null);
    }
  };

  const handleEditProfile = () => {
    setIsUserDropdownOpen(false);
    setShowEditProfileModal(true);
  };

  const logout = () => {
    authUserAPI.logout();
    setUser(null);
    setReferenceLetters([]);
    setInvestmentCertificates([]);
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDownloadLetter = async (letterId) => {
    if (downloadingLetterId === letterId) return;

    setDownloadingLetterId(letterId);

    try {
      const result = await authUserAPI.downloadReferenceLetter(letterId);
      if (result && result.success) {
        toast.success("Download started");
      }
    } catch (error) {
      console.error("Error downloading letter:", error);
      toast.error("Failed to download reference letter");
    } finally {
      setDownloadingLetterId(null);
    }
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `Hi, ${user.firstName}`;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const phoneNumber = company?.phone?.primary || "+234 801 234 5678";
  const emailAddress = company?.email?.general || "info@tayesproperty.com";
  const businessHours = company?.hours?.monday
    ? `Mon-Fri: ${company.hours.monday}`
    : "Mon-Fri: 9AM-6PM";

  const socialLinks = {
    facebook: company?.social?.facebook || "https://facebook.com",
    linkedin: company?.social?.linkedin || "https://linkedin.com",
    instagram: company?.social?.instagram || "https://instagram.com",
  };

  const mobilePhone = company?.phone?.primary || "(555) 123-4567";

  if (companyLoading) {
    return (
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div className="contact-info">
                <span>Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="contact-info">
              <FaPhone className="icon" />
              <span>{phoneNumber}</span>
              <span className="divider">|</span>
              <span>{emailAddress}</span>
              <span className="divider">|</span>
              <span>{businessHours}</span>
            </div>

            <div className="top-right">
              {user ? (
                <div className="user-dropdown" ref={dropdownRef}>
                  <button
                    className="user-dropdown-btn"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <FaUserCircle className="user-icon" />
                    <span>{getUserDisplayName()}</span>
                    <FaChevronDown
                      className={`dropdown-arrow ${isUserDropdownOpen ? "open" : ""}`}
                    />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="user-dropdown-menu">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="Avatar" 
                              className="dropdown-avatar-img"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <FaUserCircle className="dropdown-user-icon" />
                          )}
                        </div>
                        <div>
                          <div className="dropdown-user-name">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="dropdown-user-email">
                            {user?.email}
                          </div>
                        </div>
                      </div>

                      <div className="dropdown-divider"></div>

                      {/* Reference Letters */}
                      <div className="dropdown-section">
                        <div className="dropdown-section-title">
                          <FaFileAlt className="section-icon" />
                          Reference Letters ({referenceLetters.length})
                        </div>
                        {loadingLetters ? (
                          <div className="dropdown-loading">
                            <FaSpinner className="spinning" /> Loading...
                          </div>
                        ) : referenceLetters.length > 0 ? (
                          <div className="reference-letters-list">
                            {referenceLetters.map((letter) => (
                              <button
                                key={letter._id || letter.letterId}
                                className={`dropdown-item letter-item ${downloadingLetterId === letter.letterId ? "downloading" : ""}`}
                                onClick={() => handleDownloadLetter(letter.letterId)}
                                disabled={downloadingLetterId === letter.letterId}
                              >
                                {downloadingLetterId === letter.letterId ? (
                                  <FaSpinner className="item-icon spinning" />
                                ) : (
                                  <FaFileAlt className="item-icon" />
                                )}
                                <div className="letter-info">
                                  <div className="letter-id">{letter.letterId}</div>
                                  <div className="letter-date">
                                    {new Date(letter.generatedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="dropdown-empty">No reference letters yet</div>
                        )}
                      </div>

                      <div className="dropdown-divider"></div>

                      {/* Investment Certificates */}
                      <div className="dropdown-section">
                        <div className="dropdown-section-title">
                          <FaFileAlt className="section-icon" />
                          Investment Certificates ({investmentCertificates.length})
                        </div>
                        {loadingCertificates ? (
                          <div className="dropdown-loading">
                            <FaSpinner className="spinning" /> Loading...
                          </div>
                        ) : investmentCertificates.length > 0 ? (
                          <div className="reference-letters-list">
                            {investmentCertificates.map((cert) => (
                              <button
                                key={cert._id || cert.certificateId}
                                className={`dropdown-item letter-item ${downloadingCertId === cert.certificateId ? "downloading" : ""}`}
                                onClick={() => handleDownloadCertificate(cert.certificateId)}
                                disabled={downloadingCertId === cert.certificateId}
                              >
                                {downloadingCertId === cert.certificateId ? (
                                  <FaSpinner className="item-icon spinning" />
                                ) : (
                                  <FaFileAlt className="item-icon" />
                                )}
                                <div className="letter-info">
                                  <div className="letter-id">{cert.certificateId}</div>
                                  <div className="letter-date">
                                    {new Date(cert.generatedAt || cert.issuanceDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="dropdown-empty">No investment certificates yet</div>
                        )}
                      </div>

                      <div className="dropdown-divider"></div>

                      <button
                        className="dropdown-item edit-profile"
                        onClick={handleEditProfile}
                      >
                        <FaUserCircle className="item-icon" />
                        Edit Profile
                      </button>

                      <button className="dropdown-item logout" onClick={logout}>
                        <FaSignOutAlt className="item-icon" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-btn">
                  <FaUser className="icon" />
                  <span>Client Login</span>
                </Link>
              )}

              <div className="social-icons">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <Link to="/" className="logo">
              <span className="logo-gold">TAYE'S</span>
              <span className="logo-cream">PROPERTY</span>
              <div className="logo-tagline"> & REALTY SOLUTIONS </div>
            </Link>

            <nav className="nav-desktop">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="header-actions">
              <button
                className="search-toggle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Toggle search"
              >
                <FaSearch className="icon" />
              </button>

              <Link to="/valuation" className="cta-button">
                <span>Free Valuation</span>
              </Link>

              <button
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="search-bar">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search properties by location, price, or keyword..."
                  className="search-input"
                />
                <button className="search-button">
                  <FaSearch className="icon" />
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="mobile-overlay" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav">
              <button 
                className="mobile-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
              
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-header">
                    <div className="mobile-user-avatar">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt="Avatar" 
                          className="mobile-avatar-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <FaUserCircle className="mobile-user-icon" />
                      )}
                    </div>
                    <div className="mobile-user-info">
                      <div className="mobile-user-name">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="mobile-user-email">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="mobile-divider"></div>
                  
                  <div className="mobile-section-title">
                    <FaFileAlt className="section-icon" />
                    Reference Letters ({referenceLetters.length})
                  </div>
                  
                  {loadingLetters ? (
                    <div className="mobile-loading">
                      <FaSpinner className="spinning" /> Loading...
                    </div>
                  ) : referenceLetters.length > 0 ? (
                    <div className="mobile-reference-list">
                      {referenceLetters.map((letter) => (
                        <button
                          key={letter._id || letter.letterId}
                          className="mobile-reference-item"
                          onClick={() => handleDownloadLetter(letter.letterId)}
                          disabled={downloadingLetterId === letter.letterId}
                        >
                          {downloadingLetterId === letter.letterId ? (
                            <FaSpinner className="spinning" />
                          ) : (
                            <FaFileAlt />
                          )}
                          <div className="mobile-reference-info">
                            <div className="mobile-reference-id">{letter.letterId}</div>
                            <div className="mobile-reference-date">
                              {new Date(letter.generatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mobile-empty">No reference letters yet</div>
                  )}
                  
                  <div className="mobile-divider"></div>
                  
                  <div className="mobile-section-title">
                    <FaFileAlt className="section-icon" />
                    Investment Certificates ({investmentCertificates.length})
                  </div>
                  
                  {loadingCertificates ? (
                    <div className="mobile-loading">
                      <FaSpinner className="spinning" /> Loading...
                    </div>
                  ) : investmentCertificates.length > 0 ? (
                    <div className="mobile-reference-list">
                      {investmentCertificates.map((cert) => (
                        <button
                          key={cert._id || cert.certificateId}
                          className="mobile-reference-item"
                          onClick={() => handleDownloadCertificate(cert.certificateId)}
                          disabled={downloadingCertId === cert.certificateId}
                        >
                          {downloadingCertId === cert.certificateId ? (
                            <FaSpinner className="spinning" />
                          ) : (
                            <FaFileAlt />
                          )}
                          <div className="mobile-reference-info">
                            <div className="mobile-reference-id">{cert.certificateId}</div>
                            <div className="mobile-reference-date">
                              {new Date(cert.generatedAt || cert.issuanceDate).toLocaleDateString()}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mobile-empty">No investment certificates yet</div>
                  )}
                  
                  <div className="mobile-divider"></div>
                  
                  <button 
                    className="mobile-edit-profile-btn"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleEditProfile();
                    }}
                  >
                    <FaUserCircle className="icon" />
                    Edit Profile
                  </button>
                  
                  <button className="mobile-logout-btn" onClick={logout}>
                    <FaSignOutAlt className="icon" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="mobile-login-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="icon" />
                  Client Login
                </Link>
              )}

              <div className="mobile-contact">
                <div className="contact-item">
                  <FaPhone className="icon" />
                  <span>{mobilePhone}</span>
                </div>
                <Link
                  to="/consultation"
                  className="mobile-cta"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={user}
        onUpdate={refreshUserData}
      />
    </header>
  );
};

export default Header;