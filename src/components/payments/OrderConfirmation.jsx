import React from "react";
import "./OrderConfirmation.css";

const OrderConfirmation = ({ order, orderNumber, orderId, paymentId }) => {
  const getOrderData = () => {
    if (order) return order;

    return {
      order_number: orderNumber || "Loading...",
      id: orderId,
      payment_id: paymentId,
      total_amount: 0,
      created_at: new Date().toISOString(),
      items: [],
      status: "processing",
    };
  };

  const orderData = getOrderData();

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h2>Order Confirmation</h2>
        <div className="confirmation-id">
          <span className="label">Order ID:</span>
          <span className="value">{orderData.order_number}</span>
        </div>
      </div>

      <div className="confirmation-details">
        <div className="detail-row">
          <span className="label">Order Date:</span>
          <span className="value">
            {new Date(orderData.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {orderData.payment_id && (
          <div className="detail-row">
            <span className="label">Payment ID:</span>
            <span className="value">{orderData.payment_id}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="label">Status:</span>
          <span className={`status-badge status-${orderData.status}`}>
            {orderData.status}
          </span>
        </div>

        {orderData.total_amount > 0 && (
          <div className="detail-row total">
            <span className="label">Total Amount:</span>
            <span className="value total-amount">
              KSh {orderData.total_amount.toLocaleString()}
            </span>
          </div>
        )}

        {orderData.items && orderData.items.length > 0 && (
          <div className="order-items-summary">
            <h3>Items Ordered</h3>
            <div className="items-list">
              {orderData.items.slice(0, 3).map((item, index) => (
                <div key={index} className="item-summary">
                  <span className="item-name">{item.product_title}</span>
                  <span className="item-quantity">×{item.quantity}</span>
                  <span className="item-price">
                    KSh {(item.product_price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              {orderData.items.length > 3 && (
                <div className="more-items">
                  +{orderData.items.length - 3} more items
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="confirmation-note">
        <p>
          A confirmation email has been sent to your registered email address.
          You can track your order in the "My Orders" section.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
