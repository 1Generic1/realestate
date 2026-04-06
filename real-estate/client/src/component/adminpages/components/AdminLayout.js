import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const navigation = [
  { name: "Dashboard", path: "/admin", icon: "📊" },
  { name: "Users", path: "/admin/users", icon: "👥" },
  { name: "Templates", path: "/admin/templates", icon: "📝" },
  { name: "Reference Letters", path: "/admin/letters", icon: "📄" },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      {/* Mobile menu button */}
      <button
        className="admin-mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <h2>
            TAYE'S <span>PROPERTY</span>
          </h2>
          <p>Admin Panel</p>
        </div>

        <nav className="admin-sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="admin-logout-btn">
          <span className="admin-nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-main-header">
          <h1>
            {navigation.find((n) => n.path === location.pathname)?.name ||
              "Dashboard"}
          </h1>
        </div>
        <div className="admin-main-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
