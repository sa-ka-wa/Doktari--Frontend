// src/pages/Admin-Staff/Orders/OrderDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderDetailModal from "../OrderDetailModal/OrderDetailModal";
import Card from "../../../../components/common/Card/Card";
import LoadingSpinner from "../../../../components/common/LoadingSpinner/LoadingSpinner";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call - replace with actual API
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockOrder = {
          id: id,
          order_number: `ORD-${id}`,
          status: "processing",
          created_at: "2024-01-15T10:30:00Z",
          total_amount: 12500,
          subtotal: 10000,
          tax_amount: 2000,
          shipping_amount: 500,
          user: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+254712345678",
          },
          shipping_address: {
            full_name: "John Doe",
            street: "123 Main Street",
            city: "Nairobi",
            state: "Nairobi County",
            country: "Kenya",
            postal_code: "00100",
            phone: "+254712345678",
          },
          billing_address: {
            full_name: "John Doe",
            street: "123 Main Street",
            city: "Nairobi",
            state: "Nairobi County",
            country: "Kenya",
            postal_code: "00100",
          },
          items: [
            {
              product: { title: "Premium T-Shirt" },
              unit_price: 2500,
              quantity: 2,
              total_price: 5000,
              size: "L",
              color: "Blue",
            },
            {
              product: { title: "Designer Hoodie" },
              unit_price: 5000,
              quantity: 1,
              total_price: 5000,
              size: "M",
              color: "Black",
            },
          ],
          payment_status: "paid",
          shipping_method: "Standard Delivery",
        };

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        setOrder(mockOrder);
      } catch (err) {
        setError("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "KES 0";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="error-container">
          <h2>Error Loading Order</h2>
          <p>{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/staff/orders")}
            className="btn btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      {/* Page Header */}
      <div className="page-header">
        <button
          onClick={() => navigate("/staff/orders")}
          className="btn btn-back"
        >
          ← Back to Orders
        </button>
        <div className="header-title">
          <h1>Order #{order.order_number}</h1>
          <div className="order-meta">
            <span className="order-date">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
            <span
              className={`status-badge status-${getStatusColor(order.status)}`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="order-content">
        {/* Order Details Section */}
        <div className="order-main">
          {/* Use the modal component for quick view */}
          <OrderDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            order={order}
          />

          {/* Customer Info Card */}
          <Card className="customer-card">
            <h3>Customer Information</h3>
            <div className="customer-info">
              <div className="info-row">
                <label>Name:</label>
                <span>{order.user?.name || "N/A"}</span>
              </div>
              <div className="info-row">
                <label>Email:</label>
                <span>{order.user?.email || "N/A"}</span>
              </div>
              <div className="info-row">
                <label>Phone:</label>
                <span>{order.user?.phone || "N/A"}</span>
              </div>
            </div>
          </Card>

          {/* Order Items Card */}
          <Card className="items-card">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.items?.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-info">
                    <h4>{item.product?.title || "Product"}</h4>
                    <div className="item-details">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-price">
                    {formatCurrency(item.total_price)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Actions Card */}
          <Card className="actions-card">
            <h3>Order Actions</h3>
            <div className="action-buttons">
              <button className="btn btn-outline-primary">Update Status</button>
              <button className="btn btn-outline-primary">Add Tracking</button>
              <button className="btn btn-outline-primary">
                Email Customer
              </button>
              <button className="btn btn-outline-danger">Cancel Order</button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="order-sidebar">
          {/* Order Summary */}
          <Card className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.tax_amount > 0 && (
              <div className="summary-item">
                <span>Tax:</span>
                <span>{formatCurrency(order.tax_amount)}</span>
              </div>
            )}
            <div className="summary-item">
              <span>Shipping:</span>
              <span>{formatCurrency(order.shipping_amount)}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span className="total-amount">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </Card>

          {/* Shipping Info */}
          <Card className="shipping-card">
            <h3>Shipping Information</h3>
            {order.shipping_address && (
              <div className="shipping-info">
                <p>
                  <strong>{order.shipping_address.full_name}</strong>
                </p>
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}
                </p>
                <p>
                  {order.shipping_address.country}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p>Phone: {order.shipping_address.phone}</p>
              </div>
            )}
          </Card>

          {/* Timeline */}
          <Card className="timeline-card">
            <h3>Order Timeline</h3>
            <div className="timeline">
              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span>Order Placed</span>
                  <small>
                    {new Date(order.created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>
              <div
                className={`timeline-item ${
                  order.status !== "pending" ? "active" : ""
                }`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span>Processing</span>
                  <small>Started processing</small>
                </div>
              </div>
              <div
                className={`timeline-item ${
                  ["shipped", "delivered"].includes(order.status)
                    ? "active"
                    : ""
                }`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span>Shipped</span>
                  <small>Out for delivery</small>
                </div>
              </div>
              <div
                className={`timeline-item ${
                  order.status === "delivered" ? "active" : ""
                }`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span>Delivered</span>
                  <small>Order completed</small>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
