import React from "react";
import "./ShippingInfo.css";

const ShippingInfo = ({ shipping, method, cost }) => {
  if (!shipping) {
    return (
      <div className="no-shipping-info">
        <p>No shipping information available.</p>
      </div>
    );
  }

  const shippingMethods = {
    standard: {
      name: "Standard Shipping",
      estimated: "3-7 business days",
      icon: "📦",
    },
    express: {
      name: "Express Shipping",
      estimated: "1-3 business days",
      icon: "🚀",
    },
    overnight: {
      name: "Overnight Shipping",
      estimated: "Next business day",
      icon: "⚡",
    },
    pickup: {
      name: "Store Pickup",
      estimated: "Ready in 1-2 hours",
      icon: "🏪",
    },
  };

  const currentMethod = shippingMethods[method] || {
    name: method,
    estimated: "Varies",
    icon: "📦",
  };

  return (
    <div className="shipping-info">
      <div className="shipping-address">
        <h3 className="section-title">Delivery Address</h3>
        <div className="address-details">
          <p className="address-line">{shipping.address}</p>
          <p className="address-line">
            {shipping.city}, {shipping.state} {shipping.zip}
          </p>
          <p className="address-line">{shipping.country}</p>
          {shipping.phone && (
            <p className="address-phone">
              <strong>Phone:</strong> {shipping.phone}
            </p>
          )}
        </div>
      </div>

      <div className="shipping-method">
        <h3 className="section-title">Shipping Method</h3>
        <div className="method-details">
          <div className="method-header">
            <span className="method-icon">{currentMethod.icon}</span>
            <div className="method-info">
              <h4 className="method-name">{currentMethod.name}</h4>
              <p className="method-estimated">
                Estimated delivery: {currentMethod.estimated}
              </p>
            </div>
          </div>
          {cost && (
            <div className="method-cost">
              <span className="cost-label">Shipping Cost:</span>
              <span className="cost-amount">KSh {cost.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {shipping.instructions && (
        <div className="shipping-instructions">
          <h3 className="section-title">Delivery Instructions</h3>
          <p className="instructions-text">{shipping.instructions}</p>
        </div>
      )}

      <div className="shipping-status">
        <h3 className="section-title">Shipping Status</h3>
        <div className="status-timeline">
          <div className="timeline-step completed">
            <div className="step-dot"></div>
            <div className="step-content">
              <h4>Order Received</h4>
              <p>Your order has been received</p>
            </div>
          </div>
          <div className="timeline-step active">
            <div className="step-dot"></div>
            <div className="step-content">
              <h4>Processing</h4>
              <p>Your order is being prepared</p>
            </div>
          </div>
          <div className="timeline-step pending">
            <div className="step-dot"></div>
            <div className="step-content">
              <h4>Shipped</h4>
              <p>Will update when shipped</p>
            </div>
          </div>
          <div className="timeline-step pending">
            <div className="step-dot"></div>
            <div className="step-content">
              <h4>Delivered</h4>
              <p>Will update when delivered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
