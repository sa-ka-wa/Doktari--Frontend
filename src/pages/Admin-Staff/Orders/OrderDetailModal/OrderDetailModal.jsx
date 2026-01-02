import React from "react";
import Modal from "../../../../components/common/Modal/Modal";
import Card from "../../../../components/common/Card/Card";
import "./OrderModals.css";

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details - ${order.order_number}`}
      size="lg"
    >
      <div className="order-detail-modal">
        {/* Order Header */}
        <div className="order-header">
          <div className="order-status">
            <span
              className={`status-badge status-${getStatusColor(order.status)}`}
            >
              {order.status.toUpperCase()}
            </span>
            <div className="order-meta">
              <span>
                Placed on: {new Date(order.created_at).toLocaleDateString()}
              </span>
              {order.updated_at && (
                <span>
                  Last updated:{" "}
                  {new Date(order.updated_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="order-total">
            <h3>{formatCurrency(order.total_amount)}</h3>
            <small>Total Amount</small>
          </div>
        </div>

        {/* Customer Information */}
        <Card className="info-section">
          <h4>Customer Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{order.user?.name || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{order.user?.email || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{order.user?.phone || "Not provided"}</p>
            </div>
            {order.user?.brand_name && (
              <div className="info-item">
                <label>Brand</label>
                <p>{order.user.brand_name}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Shipping & Billing */}
        <div className="address-section">
          <Card className="address-card">
            <h4>Shipping Address</h4>
            {order.shipping_address ? (
              <div className="address-details">
                <p>
                  <strong>{order.shipping_address.full_name || "N/A"}</strong>
                </p>
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}
                </p>
                <p>
                  {order.shipping_address.country} -{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p>Phone: {order.shipping_address.phone || "N/A"}</p>
              </div>
            ) : (
              <p className="text-muted">No shipping address provided</p>
            )}
          </Card>

          <Card className="address-card">
            <h4>Billing Address</h4>
            {order.billing_address ? (
              <div className="address-details">
                <p>
                  <strong>{order.billing_address.full_name || "N/A"}</strong>
                </p>
                <p>{order.billing_address.street}</p>
                <p>
                  {order.billing_address.city}, {order.billing_address.state}
                </p>
                <p>
                  {order.billing_address.country} -{" "}
                  {order.billing_address.postal_code}
                </p>
              </div>
            ) : (
              <p className="text-muted">Same as shipping address</p>
            )}
          </Card>
        </div>

        {/* Order Items */}
        <Card className="items-section">
          <h4>Order Items ({order.items?.length || 0})</h4>
          <div className="items-table">
            <div className="items-header">
              <div className="col-product">Product</div>
              <div className="col-price">Price</div>
              <div className="col-quantity">Qty</div>
              <div className="col-total">Total</div>
            </div>
            {order.items?.map((item, index) => (
              <div key={index} className="item-row">
                <div className="col-product">
                  <div className="product-info">
                    <div className="product-name">
                      {item.product?.title || "Product"}
                    </div>
                    {item.size && <small>Size: {item.size}</small>}
                    {item.color && <small>Color: {item.color}</small>}
                    {item.customization_data && (
                      <small className="customized">Customized</small>
                    )}
                  </div>
                </div>
                <div className="col-price">
                  {formatCurrency(item.unit_price)}
                </div>
                <div className="col-quantity">{item.quantity}</div>
                <div className="col-total">
                  {formatCurrency(item.total_price)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.tax_amount > 0 && (
              <div className="summary-row">
                <span>Tax (16%)</span>
                <span>{formatCurrency(order.tax_amount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatCurrency(order.shipping_amount)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </Card>

        {/* Tracking Information */}
        {order.tracking_number && (
          <Card className="tracking-section">
            <h4>Tracking Information</h4>
            <div className="tracking-info">
              <div className="tracking-item">
                <label>Carrier</label>
                <p>{order.carrier}</p>
              </div>
              <div className="tracking-item">
                <label>Tracking Number</label>
                <p className="tracking-number">{order.tracking_number}</p>
              </div>
              {order.estimated_delivery && (
                <div className="tracking-item">
                  <label>Estimated Delivery</label>
                  <p>
                    {new Date(order.estimated_delivery).toLocaleDateString()}
                  </p>
                </div>
              )}
              {order.delivered_at && (
                <div className="tracking-item">
                  <label>Delivered On</label>
                  <p>{new Date(order.delivered_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Order Notes */}
        {order.notes && (
          <Card className="notes-section">
            <h4>Order Notes</h4>
            <p className="notes-content">{order.notes}</p>
          </Card>
        )}

        {/* Cancellation Reason */}
        {order.status === "cancelled" && order.cancellation_reason && (
          <Card className="cancellation-section">
            <h4>Cancellation Reason</h4>
            <p className="cancellation-reason">{order.cancellation_reason}</p>
            {order.cancelled_at && (
              <small>
                Cancelled on:{" "}
                {new Date(order.cancelled_at).toLocaleDateString()}
              </small>
            )}
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
