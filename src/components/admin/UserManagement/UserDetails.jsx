import React from "react";
import "./UserDetails.css";

const UserDetails = ({ user }) => {
  if (!user) {
    return (
      <div className="user-details-empty">
        <p>No user selected</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      super_admin: "Super Admin",
      admin: "Admin",
      brand_admin: "Brand Admin",
      brand_staff: "Brand Staff",
      customer: "Customer",
    };
    return roleMap[role] || role;
  };

  const getStatusDisplay = (user) => {
    // Simple status check - you might have actual status field
    return "Active";
  };

  const getStatusClass = (user) => {
    return "active";
  };

  return (
    <div className="user-details">
      {/* Header with avatar and basic info */}
      <div className="user-header">
        <div className="user-avatar-section">
          {user.avatar_url ? (
            <img
              src={`http://localhost:5000${user.avatar_url}`}
              alt={user.name}
              className="user-avatar-large"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <div className="avatar-placeholder-large">
              {user.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <div className="user-basic-info">
          <h3>{user.name}</h3>
          <p className="user-email">{user.email}</p>
          <div className="user-meta">
            <span className={`role-badge role-${user.role}`}>
              {getRoleDisplay(user.role)}
            </span>
            <span className={`status ${getStatusClass(user)}`}>
              {getStatusDisplay(user)}
            </span>
          </div>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="details-grid">
        <div className="detail-section">
          <h4>Personal Information</h4>
          <div className="detail-item">
            <span className="detail-label">Full Name:</span>
            <span className="detail-value">{user.name || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{user.phone || "N/A"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{user.location || "N/A"}</span>
          </div>
        </div>

        <div className="detail-section">
          <h4>Account Information</h4>
          <div className="detail-item">
            <span className="detail-label">User ID:</span>
            <span className="detail-value">{user.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role:</span>
            <span className={`detail-value role-${user.role}`}>
              {getRoleDisplay(user.role)}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Brand:</span>
            <span className="detail-value">
              {user.brand_name ? (
                <span className="brand-info">
                  {user.brand_name} (ID: {user.brand_id})
                </span>
              ) : (
                "No Brand"
              )}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Account Created:</span>
            <span className="detail-value">{formatDate(user.created_at)}</span>
          </div>
        </div>

        <div className="detail-section">
          <h4>Preferences</h4>
          {user.preferences && Object.keys(user.preferences).length > 0 ? (
            Object.entries(user.preferences).map(([key, value]) => (
              <div key={key} className="detail-item">
                <span className="detail-label">
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  :
                </span>
                <span className="detail-value">
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </span>
              </div>
            ))
          ) : (
            <p className="no-preferences">No preferences set</p>
          )}
        </div>

        <div className="detail-section">
          <h4>Activity</h4>
          <div className="detail-item">
            <span className="detail-label">Last Login:</span>
            <span className="detail-value">
              {user.last_login ? formatDate(user.last_login) : "N/A"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Profile Updated:</span>
            <span className="detail-value">
              {user.updated_at ? formatDate(user.updated_at) : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {user.stats && (
        <div className="stats-section">
          <h4>User Statistics</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{user.stats.orders || 0}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{user.stats.products || 0}</div>
              <div className="stat-label">Products Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                ${(user.stats.total_spent || 0).toFixed(2)}
              </div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{user.stats.active_orders || 0}</div>
              <div className="stat-label">Active Orders</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions Section */}
      <div className="actions-section">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button className="btn btn-secondary">
            <i className="fas fa-envelope"></i> Send Email
          </button>
          <button className="btn btn-secondary">
            <i className="fas fa-redo"></i> Reset Password
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit Profile
          </button>
          <button className="btn btn-warning">
            <i className="fas fa-user-tag"></i> Change Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
