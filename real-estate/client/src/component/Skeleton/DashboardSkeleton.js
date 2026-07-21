import React from "react";
import "./Skeleton.css";

const DashboardSkeleton = () => {
  return (
    <div className="skeleton-dashboard-container">
      {/* Welcome */}
      <div className="skeleton-dashboard-welcome">
        <div>
          <div className="skeleton-title skeleton"></div>
          <div className="skeleton-subtitle skeleton"></div>
        </div>
        <div className="skeleton-date skeleton"></div>
      </div>

      {/* Stats */}
      <div className="skeleton-dashboard-stats">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-dashboard-stat skeleton"></div>
        ))}
      </div>

      {/* Sections */}
      <div className="skeleton-dashboard-sections">
        <div className="skeleton-section">
          <div className="skeleton-section-header">
            <div className="skeleton-title skeleton"></div>
            <div className="skeleton-btn skeleton"></div>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-list-item">
              <div className="skeleton-avatar skeleton"></div>
              <div className="skeleton-text skeleton"></div>
              <div className="skeleton-text-small skeleton"></div>
            </div>
          ))}
        </div>

        <div className="skeleton-section">
          <div className="skeleton-section-header">
            <div className="skeleton-title skeleton"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-list-item">
              <div className="skeleton-text skeleton"></div>
              <div className="skeleton-text-small skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
