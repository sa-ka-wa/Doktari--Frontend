import React from "react";
import "./OrderStatusBadge.css";

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        className: "status-pending",
        icon: "⏳",
      },
      processing: {
        label: "Processing",
        className: "status-processing",
        icon: "🔄",
      },
      confirmed: {
        label: "Confirmed",
        className: "status-confirmed",
        icon: "✅",
      },
      shipped: {
        label: "Shipped",
        className: "status-shipped",
        icon: "🚚",
      },
      delivered: {
        label: "Delivered",
        className: "status-delivered",
        icon: "📦",
      },
      cancelled: {
        label: "Cancelled",
        className: "status-cancelled",
        icon: "❌",
      },
      refunded: {
        label: "Refunded",
        className: "status-refunded",
        icon: "💰",
      },
    };

    return (
      configs[status] || {
        label: status,
        className: "status-default",
        icon: "❓",
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <span className={`order-status-badge ${config.className}`}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
