import React, { useState, useEffect } from "react";
import { useOrders } from "../../../../context/OrderContext";
import { useAuth } from "../../../../context/AuthContext";
import { useBrand } from "../../../../context/BrandContext";
import Card from "../../../../components/common/Card/Card";
import LoadingSpinner from "../../../../components/common/LoadingSpinner/LoadingSpinner";
import "./StaffOverview.css";

const StaffOverview = () => {
  const { user: currentUser } = useAuth();
  const { brand: currentBrand } = useBrand();
  const {
    orders = [],
    loading,
    error,
    stats,
    fetchOrders,
    fetchOrderStats,
  } = useOrders();

  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setDashboardLoading(true);
      try {
        await Promise.all([
          fetchOrderStats({ days: 30 }),
          fetchOrders({ limit: 10 }),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchOrderStats, fetchOrders]);

  // Get recent orders (first 5)
  const recentOrders = orders.slice(0, 5);

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "KES 0";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "danger",
    };
    return colors[status] || "secondary";
  };

  if (dashboardLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>Staff Dashboard</h1>
        <p>
          Welcome back, <strong>{currentUser?.name}</strong>!
          {currentBrand && ` You're managing ${currentBrand.name}.`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-grid mb-5">
        <Card className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats?.total_revenue || 0)}</h3>
            <p>Total Revenue</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              Last 30 days
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.total_orders || 0}</h3>
            <p>Total Orders</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              Last 30 days
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon avg-order">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats?.average_order_value || 0)}</h3>
            <p>Average Order</p>
            <div className="stat-trend neutral">
              <i className="fas fa-minus"></i>
              Average
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.status_counts?.pending || 0}</h3>
            <p>Pending Orders</p>
            <div className="stat-trend warning">
              <i className="fas fa-exclamation-circle"></i>
              Needs attention
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Recent Orders */}
          <Card className="recent-orders-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <a href="/staff/orders" className="btn btn-sm btn-primary">
                View All
              </a>
            </div>
            <div className="recent-orders-list">
              {recentOrders.length === 0 ? (
                <div className="no-data">No recent orders</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="recent-order-item">
                    <div className="order-info">
                      <div className="order-number">
                        <strong>{order.order_number}</strong>
                        <span
                          className={`status-badge status-${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <span className="customer">
                          {order.user?.name || "Customer"}
                        </span>
                        <span className="amount">
                          {formatCurrency(order.total_amount)}
                        </span>
                        <span className="date">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`/staff/orders/${order.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      <i className="fas fa-eye"></i>
                    </a>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="quick-actions-card mt-4">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              <a href="/staff/products/new" className="quick-action-btn">
                <i className="fas fa-plus"></i>
                <span>New Product</span>
              </a>
              <a href="/staff/orders" className="quick-action-btn">
                <i className="fas fa-truck"></i>
                <span>Update Shipping</span>
              </a>
              <button
                className="quick-action-btn"
                onClick={() => fetchOrderStats({ days: 30 })}
              >
                <i className="fas fa-chart-bar"></i>
                <span>Refresh Stats</span>
              </button>
              <a href="/staff/inventory" className="quick-action-btn">
                <i className="fas fa-boxes"></i>
                <span>Check Inventory</span>
              </a>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Order Status Overview */}
          <Card className="status-overview-card">
            <h3>Order Status Overview</h3>
            <div className="status-chart">
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => (
                <div key={status} className="status-bar">
                  <div className="status-label">
                    <span className={`status-dot status-${status}`}></span>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                  <div className="status-count">
                    {stats?.status_counts?.[status] || 0}
                  </div>
                  <div className="status-percentage">
                    {stats?.total_orders
                      ? (
                          ((stats.status_counts?.[status] || 0) /
                            stats.total_orders) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Feed */}
          <Card className="activity-feed-card mt-4">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  fetchOrderStats({ days: 30 });
                  fetchOrders({ limit: 10 });
                }}
              >
                Refresh
              </button>
            </div>
            <div className="activity-list">
              {loading ? (
                <div className="activity-item">
                  <div className="activity-icon info">
                    <i className="fas fa-sync fa-spin"></i>
                  </div>
                  <div className="activity-content">
                    <p>Loading activity...</p>
                  </div>
                </div>
              ) : recentOrders.length > 0 ? (
                recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="activity-item">
                    <div
                      className={`activity-icon ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>Order {order.order_number}</strong> -{" "}
                        {order.status}
                      </p>
                      <small>
                        {new Date(order.created_at).toLocaleDateString()} •
                        {formatCurrency(order.total_amount)}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <div className="activity-icon info">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="activity-content">
                    <p>No recent activity</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffOverview;
