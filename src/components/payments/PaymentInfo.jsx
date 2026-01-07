import React from "react";
import "./PaymentInfo.css";

const PaymentInfo = ({ payment, method, status, amount }) => {
  const paymentMethods = {
    mpesa: {
      name: "M-Pesa",
      icon: "📱",
      color: "#10b981",
    },
    card: {
      name: "Credit/Debit Card",
      icon: "💳",
      color: "#3b82f6",
    },
    cash: {
      name: "Cash on Delivery",
      icon: "💰",
      color: "#f59e0b",
    },
    bank: {
      name: "Bank Transfer",
      icon: "🏦",
      color: "#8b5cf6",
    },
  };

  const currentMethod = paymentMethods[method] || {
    name: method,
    icon: "💳",
    color: "#6b7280",
  };

  const statusColors = {
    paid: "#10b981",
    pending: "#f59e0b",
    failed: "#ef4444",
    refunded: "#8b5cf6",
    processing: "#3b82f6",
  };

  return (
    <div className="payment-info">
      <div className="payment-header">
        <div className="payment-method">
          <span
            className="method-icon"
            style={{ backgroundColor: currentMethod.color }}
          >
            {currentMethod.icon}
          </span>
          <div className="method-details">
            <h3 className="method-name">{currentMethod.name}</h3>
            <p className="method-description">
              {method === "mpesa" && "Mobile money payment via M-Pesa"}
              {method === "card" && "Secure credit/debit card payment"}
              {method === "cash" && "Pay when your order arrives"}
              {method === "bank" && "Direct bank transfer"}
            </p>
          </div>
        </div>

        <div
          className="payment-status-badge"
          style={{
            backgroundColor: `${statusColors[status]}20`,
            color: statusColors[status],
            borderColor: statusColors[status],
          }}
        >
          {status}
        </div>
      </div>

      {payment && (
        <div className="payment-details">
          <div className="detail-row">
            <span className="detail-label">Payment ID:</span>
            <span className="detail-value">{payment.id}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">
              {payment.transaction_id || "N/A"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Payment Date:</span>
            <span className="detail-value">
              {new Date(payment.created_at).toLocaleString()}
            </span>
          </div>

          {payment.phone && (
            <div className="detail-row">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{payment.phone}</span>
            </div>
          )}
        </div>
      )}

      <div className="payment-amount">
        <div className="amount-row">
          <span className="amount-label">Amount Paid:</span>
          <span className="amount-value">KSh {amount?.toLocaleString()}</span>
        </div>

        {payment?.fees && (
          <div className="amount-row">
            <span className="amount-label">Transaction Fees:</span>
            <span className="amount-value">
              KSh {payment.fees.toLocaleString()}
            </span>
          </div>
        )}

        <div className="amount-row total">
          <span className="amount-label">Net Amount:</span>
          <span className="amount-value total-amount">
            KSh {(amount - (payment?.fees || 0)).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="payment-actions">
        <button className="action-btn download-receipt">
          <span className="action-icon">📄</span>
          Download Receipt
        </button>

        {payment?.transaction_id && (
          <button className="action-btn view-transaction">
            <span className="action-icon">🔍</span>
            View Transaction
          </button>
        )}

        {status === "failed" && (
          <button className="action-btn retry-payment">
            <span className="action-icon">🔄</span>
            Retry Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentInfo;
