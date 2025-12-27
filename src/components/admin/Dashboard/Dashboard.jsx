import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const stats = [
    { label: "Total Brands", value: "12", change: "+2", trend: "up" },
    { label: "Total Products", value: "156", change: "+15", trend: "up" },
    { label: "Active Users", value: "2,845", change: "+124", trend: "up" },
    { label: "Revenue", value: "$24,580", change: "+$2,450", trend: "up" },
  ];

  const recentActivities = [
    {
      action: "New brand added",
      target: "Prolific Streetwear",
      time: "2 hours ago",
    },
    {
      action: "Product updated",
      target: "Medical Scrubs",
      time: "4 hours ago",
    },
    {
      action: "User registered",
      target: "john@example.com",
      time: "6 hours ago",
    },
    { action: "Order completed", target: "#ORD-7842", time: "1 day ago" },
  ];

  return (
    <div className="dashboard">
      {/* Stats Overview */}
      <section className="stats-section">
        <h2>Overview</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
                <span className={`stat-change ${stat.trend}`}>
                  {stat.change}
                </span>
              </div>
              <div className="stat-icon">
                {stat.trend === "up" ? "📈" : "📉"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activities */}
      <section className="activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">⚡</div>
              <div className="activity-content">
                <p className="activity-text">
                  <strong>{activity.action}</strong> - {activity.target}
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            Add New Brand
          </button>
          <button className="action-btn">
            <span className="action-icon">👕</span>
            Create Product
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            View Reports
          </button>
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            Settings
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
