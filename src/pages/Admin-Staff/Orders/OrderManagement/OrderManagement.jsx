import React, { useState, useEffect } from "react";
import { useOrders } from "../../../../context/OrderContext";
import { useAuth } from "../../../../context/AuthContext";
import SearchBar from "../../../../components/common/SearchBar/SearchBar";
import Card from "../../../../components/common/Card/Card";
import LoadingSpinner from "../../../../components/common/LoadingSpinner/LoadingSpinner";
import OrderDetailModal from "../OrderDetailModal/OrderDetailModal";
import StatusUpdateModal from "../OrderDetailModal/StatusUpdateModal";
import TrackingModal from "../OrderDetailModal/TrackingModal";
import "./OrderManagement.css";

const OrderManagement = () => {
  const {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
    addTrackingInfo,
    searchOrders,
  } = useOrders();

  const { user: currentUser } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  useEffect(() => {
    const params = {};
    if (filterStatus !== "all") params.status = filterStatus;
    if (searchTerm) params.search = searchTerm;

    fetchOrders(params);
  }, [filterStatus, fetchOrders]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      searchOrders(term);
    } else {
      fetchOrders();
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleAddTracking = (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

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

  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="order-management">
      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-row">
          <div className="filter-group">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search orders by number, customer, or email..."
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-select"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <div className="orders-container">
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-orders">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-number-cell">
                        <strong>{order.order_number}</strong>
                        <small>
                          {order.items_count} item
                          {order.items_count !== 1 ? "s" : ""}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-name">
                          {order.user?.name || "N/A"}
                        </div>
                        <div className="customer-email">
                          {order.user?.email || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        {new Date(order.created_at).toLocaleDateString()}
                        <br />
                        <small>
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="items-cell">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="item-tag">
                            {item.product?.title?.substring(0, 20) || "Product"}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="item-tag">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong className="amount-cell">
                        {formatCurrency(order.total_amount)}
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.tracking_number ? (
                        <div className="tracking-cell">
                          <div className="tracking-info">
                            <i className="fas fa-truck"></i>
                            <span>
                              {order.carrier}: {order.tracking_number}
                            </span>
                          </div>
                          {order.estimated_delivery && (
                            <small>
                              Est:{" "}
                              {new Date(
                                order.estimated_delivery
                              ).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      ) : (
                        <span className="no-tracking">No tracking</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="btn btn-sm btn-secondary"
                          title="View details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>

                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <button
                              onClick={() => handleUpdateStatus(order)}
                              className="btn btn-sm btn-primary"
                              title="Update status"
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>
                          )}

                        {order.status === "processing" &&
                          !order.tracking_number && (
                            <button
                              onClick={() => handleAddTracking(order)}
                              className="btn btn-sm btn-info"
                              title="Add tracking"
                            >
                              <i className="fas fa-truck"></i>
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <OrderDetailModal
            isOpen={showOrderDetail}
            onClose={() => {
              setShowOrderDetail(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />

          <StatusUpdateModal
            isOpen={showStatusModal}
            onClose={() => {
              setShowStatusModal(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            onUpdate={async (status, reason) => {
              await updateOrderStatus(selectedOrder.id, status, reason);
              setShowStatusModal(false);
              setSelectedOrder(null);
            }}
          />

          <TrackingModal
            isOpen={showTrackingModal}
            onClose={() => {
              setShowTrackingModal(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
            onSave={async (trackingData) => {
              await addTrackingInfo(selectedOrder.id, trackingData);
              setShowTrackingModal(false);
              setSelectedOrder(null);
            }}
          />
        </>
      )}
    </div>
  );
};

export default OrderManagement;
