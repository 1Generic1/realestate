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
  const [downloadingLetterId, setDownloadingLetterId] = useState(null); // Track which letter is downloading
  const dropdownRef = useRef(null);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Buy", path: "/buy" },
    { label: "Rent", path: "/rent" },
    { label: "Land", path: "/land" },
    { label: "Agents", path: "/agents" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Check if user is logged in on component mount
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Close dropdown when clicking outside
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
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        await fetchReferenceLetters();
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
  };

  const fetchReferenceLetters = async () => {
    setLoadingLetters(true);
    try {
      const response = await authUserAPI.getReferenceLetters();
      if (response && response.success) {
        setReferenceLetters(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching reference letters:", error);
    } finally {
      setLoadingLetters(false);
    }
  };

  const logout = () => {
    authUserAPI.logout();
    setUser(null);
    setReferenceLetters([]);
    setIsUserDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Updated download function with loading state to prevent multiple clicks
  const handleDownloadLetter = async (letterId) => {
    // Prevent multiple downloads of the same letter
    if (downloadingLetterId === letterId) {
      console.log("Download already in progress for this letter");
      return;
    }

    setDownloadingLetterId(letterId);

    try {
      console.log("Downloading letter:", letterId);
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

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `Hi, ${user.firstName}`;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get dynamic values from backend (company context)
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

  // Show loading state (optional)
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
      {/* Top Bar - Now with Backend Data */}
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
                // User Dropdown when logged in
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
                        <FaUserCircle className="dropdown-user-icon" />
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

                      {/* Reference Letters Section */}
                      <div className="dropdown-section">
                        <div className="dropdown-section-title">
                          <FaFileAlt className="section-icon" />
                          Reference Letters
                        </div>
                        {loadingLetters ? (
                          <div className="dropdown-loading">Loading...</div>
                        ) : referenceLetters.length > 0 ? (
                          <div className="reference-letters-list">
                            {referenceLetters.map((letter) => (
                              <button
                                key={letter._id || letter.letterId}
                                className={`dropdown-item letter-item ${downloadingLetterId === letter.letterId ? "downloading" : ""}`}
                                onClick={() =>
                                  handleDownloadLetter(letter.letterId)
                                }
                                disabled={
                                  downloadingLetterId === letter.letterId
                                }
                              >
                                {downloadingLetterId === letter.letterId ? (
                                  <FaSpinner className="item-icon spinning" />
                                ) : (
                                  <FaFileAlt className="item-icon" />
                                )}
                                <div className="letter-info">
                                  <div className="letter-id">
                                    {letter.letterId}
                                  </div>
                                  <div className="letter-date">
                                    {new Date(
                                      letter.generatedAt,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="dropdown-empty">
                            No reference letters yet
                          </div>
                        )}
                      </div>

                      <div className="dropdown-divider"></div>

                      {/* Logout Button */}
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
            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-gold">TAYE'S</span>
              <span className="logo-cream">PROPERTY</span>
              <div className="logo-tagline"> & REALTY SOLUTIONS </div>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Header Actions */}
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

          {/* Search Bar */}
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
        <div className="mobile-menu">
          <div className="mobile-nav">
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

            {/* Mobile User Section - Shows different UI when logged in */}
            {user ? (
              // Logged in user - Show user info and reference letters
              <div className="mobile-user-section">
                <div className="mobile-user-header">
                  <FaUserCircle className="mobile-user-icon" />
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
                  Reference Letters
                </div>
                
                {loadingLetters ? (
                  <div className="mobile-loading">Loading...</div>
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
                
                <button className="mobile-logout-btn" onClick={logout}>
                  <FaSignOutAlt className="icon" />
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in - Show login button
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
      )}
    </header>
  );
};

export default Header;
