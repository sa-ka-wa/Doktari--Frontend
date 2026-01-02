import React, { useState } from "react";
import Modal from "../../../components/common/Modal/Modal";
import "./OrderModals.css";

const TrackingModal = ({ isOpen, onClose, order, onSave }) => {
  const [trackingData, setTrackingData] = useState({
    tracking_number: "",
    carrier: "",
    estimated_delivery: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const carrierOptions = [
    "DHL",
    "FedEx",
    "UPS",
    "USPS",
    "Aramex",
    "G4S",
    "Sendy",
    "Pigeon",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrackingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!trackingData.tracking_number.trim()) {
      setError("Tracking number is required");
      return;
    }

    if (!trackingData.carrier) {
      setError("Please select a carrier");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave(trackingData);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to add tracking information"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (carrier) => {
    setTrackingData((prev) => ({
      ...prev,
      carrier,
    }));
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Tracking Information">
      <div className="tracking-modal">
        <div className="order-info">
          <p>Adding tracking for order:</p>
          <h4>{order.order_number}</h4>
          <p className="customer-info">
            Shipping to: {order.shipping_address?.city || "Unknown location"}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="carrier">Shipping Carrier *</label>
          <select
            id="carrier"
            name="carrier"
            value={trackingData.carrier}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select a carrier</option>
            {carrierOptions.map((carrier) => (
              <option key={carrier} value={carrier}>
                {carrier}
              </option>
            ))}
          </select>

          {/* Quick carrier selection */}
          <div className="quick-carriers">
            {carrierOptions.slice(0, 6).map((carrier) => (
              <button
                key={carrier}
                type="button"
                className={`quick-carrier-btn ${
                  trackingData.carrier === carrier ? "active" : ""
                }`}
                onClick={() => handleQuickSelect(carrier)}
              >
                {carrier}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tracking_number">Tracking Number *</label>
          <input
            type="text"
            id="tracking_number"
            name="tracking_number"
            value={trackingData.tracking_number}
            onChange={handleChange}
            placeholder="Enter tracking number..."
            className="form-control"
          />
          <small className="text-muted">
            This number will be shared with the customer
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="estimated_delivery">Estimated Delivery Date</label>
          <input
            type="date"
            id="estimated_delivery"
            name="estimated_delivery"
            value={trackingData.estimated_delivery}
            onChange={handleChange}
            className="form-control"
            min={new Date().toISOString().split("T")[0]}
          />
          <small className="text-muted">
            Optional: Estimated delivery date for customer
          </small>
        </div>

        {/* Preview */}
        <div className="tracking-preview">
          <h5>Preview</h5>
          <div className="preview-card">
            <div className="preview-row">
              <strong>Carrier:</strong>
              <span>{trackingData.carrier || "Not selected"}</span>
            </div>
            <div className="preview-row">
              <strong>Tracking #:</strong>
              <span className="tracking-preview-number">
                {trackingData.tracking_number || "Not entered"}
              </span>
            </div>
            {trackingData.estimated_delivery && (
              <div className="preview-row">
                <strong>Est. Delivery:</strong>
                <span>
                  {new Date(
                    trackingData.estimated_delivery
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="status-update-note">
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Note:</strong> Adding tracking information will
              automatically update the order status to{" "}
              <span className="badge bg-primary">shipped</span>. The customer
              will be notified of this update.
            </div>
          </div>
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
            disabled={
              loading || !trackingData.tracking_number || !trackingData.carrier
            }
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : (
              "Save Tracking Info"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TrackingModal;
