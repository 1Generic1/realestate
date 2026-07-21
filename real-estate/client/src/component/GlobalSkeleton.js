import React from "react";
import "./GlobalSkeleton.css";

const GlobalSkeleton = ({ isVisible = false }) => {
  return (
    <div id="global-skeleton" className={`global-skeleton-overlay ${isVisible ? 'active' : ''}`}>
      <div className="global-skeleton-container">
        {/* Header Skeleton */}
        <div className="skeleton-header">
          <div className="skeleton-header-left">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
          </div>
          <div className="skeleton-header-right">
            <div className="skeleton-line skeleton-btn"></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="skeleton-stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-stat-card"></div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="skeleton-content">
          <div className="skeleton-content-left">
            <div className="skeleton-line skeleton-heading"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-row">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-row-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line skeleton-short"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="skeleton-content-right">
            <div className="skeleton-line skeleton-heading"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-line"></div>
                <div className="skeleton-line skeleton-short"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSkeleton;