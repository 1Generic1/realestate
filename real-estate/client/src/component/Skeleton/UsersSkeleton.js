import React from "react";
import "./Skeleton.css";

const UsersSkeleton = () => {
  return (
    <div className="skeleton-users-container">
      {/* Header */}
      <div className="skeleton-header">
        <div>
          <div className="skeleton-header-title skeleton"></div>
          <div className="skeleton-header-subtitle skeleton"></div>
        </div>
        <div className="skeleton-header-btn skeleton"></div>
      </div>

      {/* Stats */}
      <div className="skeleton-stats">
        <div className="skeleton-stat-card skeleton"></div>
        <div className="skeleton-stat-card skeleton"></div>
        <div className="skeleton-stat-card skeleton"></div>
        <div className="skeleton-stat-card skeleton"></div>
      </div>

      {/* Filters */}
      <div className="skeleton-filters">
        <div className="skeleton-search skeleton"></div>
        <div className="skeleton-filter-group">
          <div className="skeleton-filter skeleton"></div>
          <div className="skeleton-filter skeleton"></div>
        </div>
      </div>

      {/* Table */}
      <div className="skeleton-table">
        <div className="skeleton-table-header">
          <span className="skeleton"></span>
          <span className="skeleton"></span>
          <span className="skeleton"></span>
          <span className="skeleton"></span>
          <span className="skeleton"></span>
          <span className="skeleton"></span>
        </div>
        
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-checkbox skeleton"></div>
            <div className="skeleton-avatar skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-text skeleton"></div>
            <div className="skeleton-actions">
              <div className="skeleton-action-btn skeleton"></div>
              <div className="skeleton-action-btn skeleton"></div>
              <div className="skeleton-action-btn skeleton"></div>
              <div className="skeleton-action-btn skeleton"></div>
              <div className="skeleton-action-btn skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersSkeleton;
