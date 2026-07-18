import React from "react";
import "./GlobalLoader.css";

const GlobalLoader = () => {
  return (
    <div id="global-loader" className="global-loader-overlay">
      <div className="global-loader-container">
        {/* Spinner Ring */}
        <div className="global-loader-spinner"></div>
        
        {/* Text */}
        <p className="global-loader-text">Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;