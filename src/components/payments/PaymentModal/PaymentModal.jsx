// src/components/payments/PaymentModal/PaymentModal.jsx
import React from "react";
import Modal from "../../common/Modal";
import "./PaymentModal.css";

const PaymentModal = ({
  isOpen,
  onClose,
  status,
  order,
  payment,
  mpesaPhone,
  totalAmount,
}) => {
  const renderContent = () => {
    switch (status) {
      case "processing":
        return (
          <div className="payment-status processing">
            <div className="status-icon">
              <div className="phone-animation">
                <div className="phone">📱</div>
                <div className="wave"></div>
              </div>
            </div>
            <h3>Complete M-Pesa Payment</h3>
            <p className="instruction">
              Check your phone <strong>{mpesaPhone}</strong> for an M-Pesa
              prompt.
            </p>
            <p className="instruction">
              Enter your M-Pesa PIN to complete the payment of{" "}
              <strong>KSh {totalAmount?.toLocaleString()}</strong>.
            </p>
            <div className="loading-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <p className="waiting-text">Waiting for payment confirmation...</p>
            <button className="btn-secondary" onClick={onClose}>
              Cancel Payment
            </button>
          </div>
        );

      case "success":
        return (
          <div className="payment-status success">
            <div className="status-icon">✅</div>
            <h3>Payment Successful!</h3>
            <p>Your payment has been confirmed.</p>
            <div className="order-info">
              <p>
                Order Number: <strong>{order?.order_number}</strong>
              </p>
              <p>
                Amount:{" "}
                <strong>KSh {order?.total_amount?.toLocaleString()}</strong>
              </p>
              {payment?.mpesa_receipt_number && (
                <p>
                  M-Pesa Receipt:{" "}
                  <strong>{payment.mpesa_receipt_number}</strong>
                </p>
              )}
            </div>
            <p className="redirect-text">
              Redirecting to order confirmation...
            </p>
          </div>
        );

      case "failed":
        return (
          <div className="payment-status failed">
            <div className="status-icon">❌</div>
            <h3>Payment Failed</h3>
            <p>Your M-Pesa payment was not completed.</p>
            <p>Please try again or contact customer support.</p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={onClose}>
                Try Again
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        );

      case "timeout":
        return (
          <div className="payment-status timeout">
            <div className="status-icon">⏰</div>
            <h3>Payment Timeout</h3>
            <p>No response received from M-Pesa.</p>
            <p>Please check your phone and try again.</p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={onClose}>
                Try Again
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={status !== "processing" ? onClose : null}
      title={status === "processing" ? "Complete Payment" : "Payment Status"}
      showClose={status !== "processing"}
    >
      {renderContent()}
    </Modal>
  );
};

export default PaymentModal;
