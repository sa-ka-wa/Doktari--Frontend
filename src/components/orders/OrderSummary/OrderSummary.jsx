// src/components/orders/OrderSummary/OrderSummary.jsx
import React from "react";
import "./OrderSummary.css";

const OrderSummary = ({
  items,
  subtotal,
  shippingCost,
  taxAmount,
  total,
  shippingMethod,
  isProcessing,
}) => {
  const getShippingMethodName = (method) => {
    const methods = {
      standard: "Standard Shipping",
      express: "Express Shipping",
      overnight: "Overnight Shipping",
    };
    return methods[method] || "Standard Shipping";
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>

      <div className="order-items">
        {items.map((item) => (
          <div key={item.id} className="order-item">
            <div className="item-image">
              <img src={item.image_url || item.imageUrl} alt={item.title} />
            </div>
            <div className="item-details">
              <div className="item-title">{item.title}</div>
              <div className="item-variants">
                {item.size && (
                  <span className="variant">Size: {item.size}</span>
                )}
                {item.color && (
                  <span className="variant">Color: {item.color}</span>
                )}
              </div>
              <div className="item-quantity">Qty: {item.quantity}</div>
            </div>
            <div className="item-price">
              KSh {(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="price-breakdown">
        <div className="price-row">
          <span>Subtotal</span>
          <span>KSh {subtotal.toLocaleString()}</span>
        </div>
        <div className="price-row">
          <span>Shipping ({getShippingMethodName(shippingMethod)})</span>
          <span>KSh {shippingCost.toLocaleString()}</span>
        </div>
        <div className="price-row">
          <span>VAT (16%)</span>
          <span>KSh {taxAmount.toLocaleString()}</span>
        </div>
        <div className="price-divider"></div>
        <div className="price-row total">
          <span>Total</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="secure-checkout">
        <div className="secure-badge">
          <span className="lock-icon">🔒</span>
          <span>Secure Checkout</span>
        </div>
        <p className="secure-note">
          Your payment is processed securely via M-Pesa.
        </p>
      </div>

      {isProcessing && (
        <div className="processing-notice">
          <div className="spinner"></div>
          <p>Processing your order...</p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
