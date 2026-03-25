import React, { useState } from "react";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import "./PropertyAlerts.css";

const PropertyAlerts = () => {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    houses: false,
    flats: false,
    lands: false,
    commercial: false,
  });
  const [subscribed, setSubscribed] = useState(false);

  const handlePreferenceChange = (type) => {
    setPreferences({
      ...preferences,
      [type]: !preferences[type],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Alert preferences:", { email, preferences });
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="property-alerts-card" data-aos="fade-left">
      <div className="alerts-icon-wrapper">
        <FaBell className="alerts-icon" />
      </div>
      <h3 className="alerts-title">Property Alerts</h3>
      <p className="alerts-subtitle">
        Get notified when new properties match your criteria
      </p>

      <form onSubmit={handleSubmit} className="alerts-form">
        <input
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="alerts-input"
        />

        <div className="preferences-group">
          <p className="preferences-label">I'm interested in:</p>
          <div className="preferences-grid">
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.houses}
                onChange={() => handlePreferenceChange("houses")}
              />
              <span>Houses</span>
            </label>
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.flats}
                onChange={() => handlePreferenceChange("flats")}
              />
              <span>Flats</span>
            </label>
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.lands}
                onChange={() => handlePreferenceChange("lands")}
              />
              <span>Lands</span>
            </label>
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.commercial}
                onChange={() => handlePreferenceChange("commercial")}
              />
              <span>Commercial</span>
            </label>
          </div>
        </div>

        <button type="submit" className="alerts-submit-btn">
          <FaBell /> Subscribe to Alerts
        </button>
      </form>

      {subscribed && (
        <div className="alert-success">
          <FaCheckCircle /> Alert set! We'll notify you at {email}
        </div>
      )}

      <p className="privacy-note">🔒 No spam. Unsubscribe anytime.</p>
    </div>
  );
};

export default PropertyAlerts;
