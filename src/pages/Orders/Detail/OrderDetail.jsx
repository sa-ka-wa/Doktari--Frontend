import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useOrders } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/common/LoadingSpinner/LoadingSpinner";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";
import OrderItemsList from "../../../components/orders/OrderItemsList";
import ShippingInfo from "../../../components/orders/ShippingInfo";
import PaymentInfo from "../../../components/payments/PaymentInfo";
import TrackingInfo from "../../../components/orders/TrackingInfo";
import CancelOrderModal from "../../../components/orders/CancelOrderModal";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchOrder, currentOrder, loading, error, cancelOrder } = useOrders();
  const { user } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  const handleCancelOrder = async (reason) => {
    try {
      await cancelOrder(orderId, reason);
      setShowCancelModal(false);
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const handleReorder = () => {
    // Implement reorder logic
    // This would add all items from the order back to the cart
    console.log("Reorder items:", currentOrder.items);
    navigate("/cart");
  };

  const handleTrackOrder = () => {
    if (currentOrder?.tracking_number) {
      // Open tracking in new window
      window.open(`/orders/${orderId}/track`, "_blank");
    }
  };

  const handleContactSupport = () => {
    // Implement contact support
    window.location.href = `mailto:support@afrochic.com?subject=Question about Order #${currentOrder?.order_number}`;
  };

  if (loading && !currentOrder) {
    return (
      <div className="order-detail-loading">
        <LoadingSpinner />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-error">
        <div className="error-content">
          <h2>Unable to load order</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => fetchOrder(orderId)} className="btn-primary">
              Try Again
            </button>
            <Link to="/orders" className="btn-secondary">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="order-not-found">
        <h2>Order not found</h2>
        <p>The order you're looking for doesn't exist.</p>
        <Link to="/orders" className="btn-primary">
          View All Orders
        </Link>
      </div>
    );
  }

  const canCancel =
    currentOrder.status === "pending" ||
    currentOrder.status === "processing" ||
    currentOrder.status === "confirmed";

  const isAdminOrStaff =
    user?.role === "admin" ||
    user?.role === "staff" ||
    user?.role === "brand_admin";

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        {/* Header */}
        <div className="order-detail-header">
          <div className="order-header-info">
            <h1>Order #{currentOrder.order_number}</h1>
            <div className="order-meta">
              <span className="order-date">
                Placed on{" "}
                {new Date(currentOrder.created_at).toLocaleDateString()}
              </span>
              <OrderStatusBadge status={currentOrder.status} />
            </div>
          </div>
          <div className="order-header-actions">
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn-secondary"
              >
                Cancel Order
              </button>
            )}
            <button onClick={handleReorder} className="btn-primary">
              Reorder
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="order-detail-content">
          {/* Left Column */}
          <div className="order-left-column">
            {/* Order Items */}
            <div className="order-section">
              <h2 className="section-title">Items</h2>
              <OrderItemsList items={currentOrder.items} />
            </div>

            {/* Shipping Information */}
            <div className="order-section">
              <h2 className="section-title">Shipping Information</h2>
              <ShippingInfo shipping={currentOrder.shipping_info} />
            </div>

            {/* Payment Information */}
            <div className="order-section">
              <h2 className="section-title">Payment Information</h2>
              <PaymentInfo
                payment={currentOrder.payment}
                total={currentOrder.total_amount}
                subtotal={currentOrder.subtotal}
                shipping={currentOrder.shipping_cost}
                tax={currentOrder.tax_amount}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="order-right-column">
            {/* Order Summary */}
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>KSh {currentOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>KSh {currentOrder.shipping_cost?.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>KSh {currentOrder.tax_amount?.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>KSh {currentOrder.total_amount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Tracking Information */}
            {currentOrder.tracking_number && (
              <div className="tracking-section">
                <h3>Tracking</h3>
                <TrackingInfo
                  trackingNumber={currentOrder.tracking_number}
                  carrier={currentOrder.carrier}
                  status={currentOrder.shipping_status}
                  lastUpdate={currentOrder.tracking_last_update}
                />
                <button onClick={handleTrackOrder} className="btn-secondary">
                  Track Package
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="action-section">
              <h3>Need Help?</h3>
              <div className="action-buttons">
                <button
                  onClick={handleContactSupport}
                  className="btn-secondary"
                >
                  Contact Support
                </button>
                <Link to="/orders" className="btn-primary">
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        {(isAdminOrStaff || currentOrder.status_history?.length > 0) && (
          <div className="order-timeline-section">
            <h2 className="section-title">Order Timeline</h2>
            <div className="timeline">
              {currentOrder.status_history?.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-status">{event.status}</span>
                      <span className="timeline-date">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {event.note && (
                      <p className="timeline-note">{event.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderNumber={currentOrder.order_number}
      />
    </div>
  );
};

export default OrderDetail;
