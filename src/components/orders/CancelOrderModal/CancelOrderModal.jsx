import React, { useState } from "react";
import Modal from "../../common/Modal/Modal";
import "./CancelOrderModal.css";

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderNumber }) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const cancelReasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Delivery time too long",
    "Ordered by mistake",
    "Payment issues",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = reason === "Other" ? otherReason : reason;
    if (finalReason.trim()) {
      onConfirm(finalReason);
      setReason("");
      setOtherReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    setOtherReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cancel Order">
      <div className="cancel-order-modal">
        <p className="cancel-warning">
          Are you sure you want to cancel order <strong>#{orderNumber}</strong>?
          This action cannot be undone.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cancel-reason">
              Please tell us why you're canceling:
            </label>
            <select
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="cancel-reason-select"
            >
              <option value="">Select a reason</option>
              {cancelReasons.map((reasonOption) => (
                <option key={reasonOption} value={reasonOption}>
                  {reasonOption}
                </option>
              ))}
            </select>
          </div>

          {reason === "Other" && (
            <div className="form-group">
              <label htmlFor="other-reason">Please specify:</label>
              <textarea
                id="other-reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please provide more details..."
                required
                className="other-reason-textarea"
                rows={3}
              />
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Keep Order
            </button>
            <button
              type="submit"
              className="btn-danger"
              disabled={!reason || (reason === "Other" && !otherReason.trim())}
            >
              Cancel Order
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CancelOrderModal;
