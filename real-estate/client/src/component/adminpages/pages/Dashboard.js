import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { userAPI, templateAPI } from "../../../services/adminApi";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalTemplates: 0,
    customTemplates: 0,
    totalLetters: 0,
    totalCertificates: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentLetters, setRecentLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get users data
      const usersResponse = await userAPI.getAllUsers();
      const users = usersResponse.data || [];

      // Get templates data
      const templatesResponse = await templateAPI.getAllTemplates();
      const customCount = Object.keys(
        templatesResponse.data?.custom || {},
      ).length;

      // Calculate stats
      const activeUsers = users.filter((u) => u.isActive).length;
      const inactiveUsers = users.length - activeUsers;

      // Get recent users (last 5)
      const recent = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalUsers: users.length,
        activeUsers: activeUsers,
        inactiveUsers: inactiveUsers,
        totalTemplates: 4 + customCount,
        customTemplates: customCount,
        totalLetters: 0, 
        totalCertificates: 0,
      });

      setRecentUsers(recent);
      setRecentLetters([]); // You can implement this when you add letters
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "#b8860b",
      bgColor: "rgba(184, 134, 11, 0.1)",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: "🟢",
      color: "#4caf50",
      bgColor: "rgba(76, 175, 80, 0.1)",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      icon: "🔴",
      color: "#f44336",
      bgColor: "rgba(244, 67, 54, 0.1)",
      trend: "-2%",
      trendUp: false,
    },
    {
      title: "Total Templates",
      value: stats.totalTemplates,
      icon: "📝",
      color: "#2196f3",
      bgColor: "rgba(33, 150, 243, 0.1)",
      trend: `+${stats.customTemplates}`,
      trendUp: true,
    },
    {
      title: "Custom Templates",
      value: stats.customTemplates,
      icon: "⭐",
      color: "#ff9800",
      bgColor: "rgba(255, 152, 0, 0.1)",
      trend: "new",
      trendUp: true,
    },
    {
      title: "Reference Letters",
      value: stats.totalLetters,
      icon: "📄",
      color: "#9c27b0",
      bgColor: "rgba(156, 39, 176, 0.1)",
      trend: "+0",
      trendUp: false,
    },
    {
      title: "Investment Certificates",
      value: stats.totalCertificates,
      icon: "📜",
      color: "#e91e63",
      bgColor: "rgba(233, 30, 99, 0.1)",
      trend: "+0",
      trendUp: false,
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div className="welcome-content">
            <h2>Welcome back, Admin!</h2>
            <p>Here's what's happening with your platform today.</p>
          </div>
          <div className="welcome-date">
            <span className="date-icon">📅</span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ borderTopColor: stat.color }}
            >
              <div className="stat-header">
                <div
                  className="stat-icon"
                  style={{ background: stat.bgColor, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div
                  className={`stat-trend ${stat.trendUp ? "trend-up" : "trend-down"}`}
                >
                  {stat.trend}
                </div>
              </div>
              <div className="stat-info">
                <h3>{stat.value.toLocaleString()}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="dashboard-sections">
          {/* Recent Users */}
          <div className="recent-section">
            <div className="section-header">
              <h3>📋 Recent Users</h3>
              <button
                className="view-all-btn"
                onClick={() => (window.location.href = "/admin/users")}
              >
                View All
              </button>
            </div>
            <div className="recent-list">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className="recent-item">
                    <div
                      className="recent-avatar"
                      style={{ background: "#b8860b" }}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="recent-info">
                      <h4>
                        {user.firstName} {user.lastName}
                      </h4>
                      <p>{user.email}</p>
                    </div>
                    <div className="recent-meta">
                      <span className="recent-date">
                        {formatDate(user.createdAt)}
                      </span>
                      <span
                        className={`user-status ${user.isActive ? "status-active" : "status-inactive"}`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <div className="section-header">
              <h3>⚡ Quick Actions</h3>
            </div>
            <div className="actions-grid">
              <button
                className="action-card"
                onClick={() => (window.location.href = "/admin/users")}
              >
                <span className="action-icon">👥</span>
                <h4>Manage Users</h4>
                <p>View and manage all registered users</p>
              </button>
              <button
                className="action-card"
                onClick={() => (window.location.href = "/admin/templates")}
              >
                <span className="action-icon">📝</span>
                <h4>Manage Templates</h4>
                <p>Create and edit reference letter templates</p>
              </button>
              <button
                className="action-card"
                onClick={() => (window.location.href = "/admin/letters")}
              >
                <span className="action-icon">📄</span>
                <h4>Reference Letters</h4>
                <p>Send and manage reference letters</p>
              </button>
               <button
                className="action-card"
                onClick={() => (window.location.href = "/admin/certificates")}
              >
                <span className="action-icon">📜</span>
                <h4>Investment Certificates</h4>
                <p>Generate and manage investment certificates</p>
              </button>
            </div>
          </div>
        </div>

        {/* Templates Overview */}
        <div className="templates-overview">
          <div className="section-header">
            <h3>📝 Template Overview</h3>
            <button
              className="view-all-btn"
              onClick={() => (window.location.href = "/admin/templates")}
            >
              Manage Templates
            </button>
          </div>
          <div className="template-stats">
            <div className="template-stat-item">
              <div className="template-stat-icon">🛂</div>
              <div className="template-stat-info">
                <span className="template-stat-label">Visa Template</span>
                <span className="template-stat-status">Active</span>
              </div>
            </div>
            <div className="template-stat-item">
              <div className="template-stat-icon">💼</div>
              <div className="template-stat-info">
                <span className="template-stat-label">Employment Template</span>
                <span className="template-stat-status">Active</span>
              </div>
            </div>
            <div className="template-stat-item">
              <div className="template-stat-icon">🏦</div>
              <div className="template-stat-info">
                <span className="template-stat-label">Bank Template</span>
                <span className="template-stat-status">Active</span>
              </div>
            </div>
            <div className="template-stat-item">
              <div className="template-stat-icon">📄</div>
              <div className="template-stat-info">
                <span className="template-stat-label">General Template</span>
                <span className="template-stat-status">Active</span>
              </div>
            </div>
            {stats.customTemplates > 0 && (
              <div className="template-stat-item">
                <div className="template-stat-icon">⭐</div>
                <div className="template-stat-info">
                  <span className="template-stat-label">Custom Templates</span>
                  <span className="template-stat-status">
                    {stats.customTemplates} created
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
