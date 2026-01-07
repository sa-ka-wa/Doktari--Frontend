import React from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";
import "./OrderCard.css";

const OrderCard = ({ order, onView, onReorder }) => {
  const getTotalItems = () => {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-info">
          <h3 className="order-number">Order #{order.order_number}</h3>
          <span className="order-date">{formatDate(order.created_at)}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="order-card-content">
        <div className="order-items-preview">
          {order.items?.slice(0, 3).map((item, index) => (
            <div key={index} className="order-item">
              <img
                src={item.product_image || "/placeholder.jpg"}
                alt={item.product_title}
                className="item-image"
              />
              <div className="item-info">
                <h4 className="item-title">{item.product_title}</h4>
                <p className="item-details">
                  {item.quantity} × KSh {item.product_price.toLocaleString()}
                  {item.size && ` • Size: ${item.size}`}
                  {item.color && ` • Color: ${item.color}`}
                </p>
              </div>
            </div>
          ))}
          {order.items?.length > 3 && (
            <div className="more-items">
              +{order.items.length - 3} more items
            </div>
          )}
        </div>

        <div className="order-summary">
          <div className="summary-item">
            <span>Items:</span>
            <span>{getTotalItems()}</span>
          </div>
          <div className="summary-item">
            <span>Total:</span>
            <span className="order-total">
              KSh {order.total_amount?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="order-card-actions">
        <button onClick={() => onView(order.id)} className="btn-primary">
          View Details
        </button>
        {order.status === "delivered" && (
          <button onClick={() => onReorder(order)} className="btn-secondary">
            Reorder
          </button>
        )}
        {order.status === "delivered" && (
          <Link to={`/orders/${order.id}/review`} className="btn-outline">
            Write Review
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
