import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./PaymentFailed.css";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const error = location.state?.error || "Payment processing failed";
  const orderId = location.state?.orderId;

  const handleRetryPayment = () => {
    if (orderId) {
      navigate(`/payments/retry/${orderId}`);
    } else {
      navigate("/cart");
    }
  };

  const handleContactSupport = () => {
    const subject = `Payment Failed - Order ${orderId || "Unknown"}`;
    const body = `I need help with a failed payment. Error: ${error}`;
    window.location.href = `mailto:support@afrochic.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="payment-failed-page">
      <div className="payment-failed-container">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="failed-icon"
        >
          <div className="failed-icon-circle">
            <span className="failed-icon-x">✕</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="failed-content"
        >
          <h1 className="failed-title">Payment Failed</h1>
          <p className="failed-message">
            We couldn't process your payment. Please try again.
          </p>

          {error && (
            <div className="error-details">
              <p className="error-message">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          <div className="failed-actions">
            <button onClick={handleRetryPayment} className="btn-primary">
              Try Again
            </button>
            <button onClick={handleContactSupport} className="btn-secondary">
              Contact Support
            </button>
            <button onClick={() => navigate("/cart")} className="btn-outline">
              Back to Cart
            </button>
          </div>

          <div className="troubleshooting-section">
            <h3>Common Solutions:</h3>
            <ul className="troubleshooting-list">
              <li>Check your payment details and try again</li>
              <li>Ensure you have sufficient funds in your account</li>
              <li>Verify your internet connection is stable</li>
              <li>Try using a different payment method</li>
              <li>Contact your bank if the issue persists</li>
            </ul>
          </div>

          <div className="support-section">
            <p>
              Need immediate help?{" "}
              <a href="tel:+254700000000" className="support-phone">
                Call +254 700 000 000
              </a>
            </p>
            <p>
              Or email us at{" "}
              <a href="mailto:support@afrochic.com" className="support-email">
                support@afrochic.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentFailed;
