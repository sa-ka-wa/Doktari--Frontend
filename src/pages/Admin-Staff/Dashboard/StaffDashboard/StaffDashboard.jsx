import React, { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext.jsx";
import { useBrand } from "../../../../context/BrandContext.jsx";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { brand, loading } = useBrand();
  const location = useLocation();

  if (loading) return <p>Loading brand...</p>;

  const isActive = (path) =>
    location.pathname === `/staff${path}` ||
    location.pathname.startsWith(`/staff${path}`);

  return (
    <div className="staff-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src={brand?.logo_url || "/default-logo.svg"}
            alt={brand?.name || "Brand Logo"}
          />
          <h2>{brand?.name || "Staff"} Dashboard</h2>
          <div className="brand-badge">
            <span className="badge-role">Staff Panel</span>
            {brand && <span className="badge-name">{brand.name}</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/staff/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            📊 Dashboard Overview
          </Link>

          <Link
            to="/staff/orders"
            className={`nav-link ${isActive("/orders") ? "active" : ""}`}
          >
            📦 Order Management
          </Link>

          <Link
            to="/staff/products"
            className={`nav-link ${isActive("/products") ? "active" : ""}`}
          >
            👕 Product Management
          </Link>

          <Link
            to="/staff/inventory"
            className={`nav-link ${isActive("/inventory") ? "active" : ""}`}
          >
            📊 Inventory
          </Link>

          <Link
            to="/staff/customers"
            className={`nav-link ${isActive("/customers") ? "active" : ""}`}
          >
            👥 Customers
          </Link>

          <Link
            to="/staff/shipping"
            className={`nav-link ${isActive("/shipping") ? "active" : ""}`}
          >
            🚚 Shipping & Tracking
          </Link>

          <Link
            to="/staff/reports"
            className={`nav-link ${isActive("/reports") ? "active" : ""}`}
          >
            📈 Reports
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || "S"}</div>
            <div className="user-details">
              <span className="user-name">{user?.name || "Staff User"}</span>
              <span className="user-role">
                {user?.role === "brand_admin" ? "Brand Admin" : "Staff"}
                {brand && ` • ${brand.name}`}
              </span>
            </div>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffDashboard;
