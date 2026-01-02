import React, { useState } from "react";
import Modal from "../../../components/common/Modal/Modal";
import "./OrderModals.css";

const StatusUpdateModal = ({ isOpen, onClose, order, onUpdate }) => {
  const [status, setStatus] = useState(order?.status || "pending");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      description: "Order is awaiting processing",
    },
    {
      value: "processing",
      label: "Processing",
      description: "Order is being prepared",
    },
    {
      value: "shipped",
      label: "Shipped",
      description: "Order has been shipped",
    },
    {
      value: "delivered",
      label: "Delivered",
      description: "Order has been delivered",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      description: "Order has been cancelled",
    },
  ];

  const handleSubmit = async () => {
    if (!status) {
      setError("Please select a status");
      return;
    }

    if (status === "cancelled" && !reason.trim()) {
      setError("Please provide a cancellation reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onUpdate(status, reason.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus !== "cancelled") {
      setReason("");
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Order Status">
      <div className="status-update-modal">
        <div className="order-info">
          <p>Updating status for:</p>
          <h4>{order.order_number}</h4>
          <p className="customer-info">
            Customer: {order.user?.name} • Current Status:
            <span className={`current-status status-${order.status}`}>
              {order.status}
            </span>
          </p>
        </div>

        <div className="form-group">
          <label>Select New Status</label>
          <div className="status-options">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`status-option ${
                  status === option.value ? "active" : ""
                }`}
                onClick={() => handleStatusChange(option.value)}
              >
                <div className="option-header">
                  <span
                    className={`status-indicator status-${option.value}`}
                  ></span>
                  <strong>{option.label}</strong>
                </div>
                <p className="option-description">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {status === "cancelled" && (
          <div className="form-group">
            <label htmlFor="cancellationReason">Cancellation Reason *</label>
            <textarea
              id="cancellationReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              rows="3"
              className="form-control"
            />
            <small className="text-muted">
              This reason will be shared with the customer.
            </small>
          </div>
        )}

        {/* Status-specific notes */}
        <div className="status-notes">
          {status === "shipped" && (
            <div className="alert alert-info">
              <i className="fas fa-info-circle"></i>
              After marking as shipped, you can add tracking information.
            </div>
          )}
          {status === "delivered" && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              Marking as delivered completes the order process.
            </div>
          )}
          {status === "cancelled" && (
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle"></i>
              Cancelling will restore product stock and notify the customer.
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="modal-actions">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || status === order.status}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusUpdateModal;
