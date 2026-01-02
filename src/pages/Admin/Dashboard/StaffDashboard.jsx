import React, { useState, useEffect } from "react";
import { useOrders } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
import { useBrand } from "../../../context/BrandContext";
import Card from "../../../components/common/Card/Card";
import LoadingSpinner from "../../../components/common/LoadingSpinner/LoadingSpinner";
import OrderManagement from "../Orders/OrderManagement";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const { user: currentUser } = useAuth();
  const { brand: currentBrand } = useBrand();
  const {
    fetchOrderStats,
    stats,
    loading: ordersLoading,
    fetchOrders,
    orders,
  } = useOrders();

  const [activeTab, setActiveTab] = useState("overview");
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchOrderStats({ days: 30 }),
          fetchOrders({ limit: 10 }),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchOrderStats, fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      setRecentOrders(orders.slice(0, 5));
    }
  }, [orders]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value?.toFixed(1) || 0}%`;
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="staff-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Staff Dashboard</h1>
          <p className="subtitle">
            Welcome back, <strong>{currentUser.name}</strong>
            {currentBrand && (
              <span>
                {" "}
                • Managing <strong>{currentBrand.name}</strong>
              </span>
            )}
          </p>
        </div>
        <div className="header-right">
          <div className="date-display">
            <i className="fas fa-calendar"></i>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats?.total_revenue || 0)}</h3>
            <p>Total Revenue (30 days)</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              {formatPercentage(12.5)}
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.total_orders || 0}</h3>
            <p>Total Orders (30 days)</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              {formatPercentage(8.2)}
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon avg-order">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats?.average_order_value || 0)}</h3>
            <p>Average Order Value</p>
            <div className="stat-trend negative">
              <i className="fas fa-arrow-down"></i>
              {formatPercentage(2.3)}
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
            <div className="stat-trend neutral">
              <i className="fas fa-minus"></i>
              {formatPercentage(0)}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Recent Orders */}
          <Card className="recent-orders-card">
            <div className="card-header">
              <h3>Recent Orders</h3>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setActiveTab("orders")}
              >
                View All
              </button>
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
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <span className="customer">{order.user?.name}</span>
                        <span className="amount">
                          {formatCurrency(order.total_amount)}
                        </span>
                        <span className="date">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-secondary">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <i className="fas fa-plus"></i>
                <span>Create Product</span>
              </button>
              <button className="quick-action-btn">
                <i className="fas fa-truck"></i>
                <span>Update Shipping</span>
              </button>
              <button className="quick-action-btn">
                <i className="fas fa-tag"></i>
                <span>Manage Discounts</span>
              </button>
              <button className="quick-action-btn">
                <i className="fas fa-chart-bar"></i>
                <span>View Reports</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Order Status Overview */}
          <Card className="status-overview-card">
            <h3>Order Status Overview</h3>
            <div className="status-chart">
              {stats?.status_counts &&
                Object.entries(stats.status_counts).map(([status, count]) => (
                  <div key={status} className="status-bar">
                    <div className="status-label">
                      <span className={`status-dot status-${status}`}></span>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                    <div className="status-count">{count}</div>
                    <div className="status-percentage">
                      {stats.total_orders
                        ? ((count / stats.total_orders) * 100).toFixed(1)
                        : 0}
                      %
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Activity Feed */}
          <Card className="activity-feed-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button className="btn btn-sm btn-secondary">Refresh</button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="activity-content">
                  <p>
                    <strong>Order #ORD-20231215-1234</strong> was shipped
                  </p>
                  <small>2 minutes ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon info">
                  <i className="fas fa-info-circle"></i>
                </div>
                <div className="activity-content">
                  <p>
                    <strong>New order</strong> received from Jane Doe
                  </p>
                  <small>15 minutes ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon warning">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="activity-content">
                  <p>
                    <strong>Low stock</strong> for Product "Blue T-Shirt"
                  </p>
                  <small>1 hour ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon primary">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="activity-content">
                  <p>
                    <strong>Payment received</strong> for Order
                    #ORD-20231215-5678
                  </p>
                  <small>2 hours ago</small>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* If orders tab is active, show full order management */}
      {activeTab === "orders" && (
        <div className="full-order-management">
          <div className="section-header">
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <h2>Order Management</h2>
          </div>
          <OrderManagement />
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
