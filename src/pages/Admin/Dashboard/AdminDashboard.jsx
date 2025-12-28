import React, { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../../../context/AuthContext.jsx";
import { useBrand } from "../../../context/BrandContext.jsx";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { brand, loading } = useBrand();
  const location = useLocation();

  if (loading) return <p>Loading brand...</p>; // optional loading state

  const isActive = (path) =>
    location.pathname === `/admin${path}` ||
    location.pathname.startsWith(`/admin${path}`);

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src={brand?.logo_url || "/default-logo.svg"}
            alt={brand?.name || "Brand Logo"}
          />

          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {/* <Link
            to="/admin/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            📊 Dashboard
          </Link> */}
          <Link
            to="/admin/brands"
            className={`nav-link ${isActive("/brands") ? "active" : ""}`}
          >
            🎨 Brand Management
          </Link>
          <Link
            to="/admin/products"
            className={`nav-link ${isActive("/products") ? "active" : ""}`}
          >
            👕 Product Management
          </Link>
          <Link
            to="/admin/users"
            className={`nav-link ${isActive("/users") ? "active" : ""}`}
          >
            👥 User Management
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-details">
              <span className="user-name">{user?.name || "Admin User"}</span>
              <span className="user-role">{user?.role || "Administrator"}</span>
            </div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
