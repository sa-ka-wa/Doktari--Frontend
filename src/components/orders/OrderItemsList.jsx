import React from "react";
import { Link } from "react-router-dom";
import "./OrderItemsList.css";

const OrderItemsList = ({ items }) => {
  return (
    <div className="order-items-list">
      {items?.map((item, index) => (
        <div key={index} className="order-item-row">
          <div className="item-image-container">
            <img
              src={item.product_image || "/placeholder.jpg"}
              alt={item.product_title}
              className="item-image"
            />
            <span className="item-quantity">×{item.quantity}</span>
          </div>

          <div className="item-details">
            <Link to={`/products/${item.product_id}`} className="item-title">
              {item.product_title}
            </Link>
            <div className="item-attributes">
              {item.size && (
                <span className="attribute">Size: {item.size}</span>
              )}
              {item.color && (
                <span className="attribute">Color: {item.color}</span>
              )}
              {item.customization && (
                <span className="attribute">Custom: {item.customization}</span>
              )}
            </div>
            <div className="item-price">
              KSh {(item.product_price * item.quantity).toLocaleString()}
            </div>
          </div>

          <div className="item-actions">
            <Link
              to={`/products/${item.product_id}`}
              className="view-product-link"
            >
              View Product
            </Link>
            {item.reviewable && (
              <Link
                to={`/products/${item.product_id}/review?order=${item.order_id}`}
                className="review-link"
              >
                Write Review
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;
