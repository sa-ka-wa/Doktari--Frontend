import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useOrders } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import SuccessAnimation from "../../../components/payments/SuccessAnimation";
import OrderConfirmation from "../../../components/payments/OrderConfirmation";
import DownloadReceipt from "../../../components/payments/DownloadReceipt";
import ShareOrder from "../../../components/orders/ShareOrder";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { fetchOrder } = useOrders();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = location.state?.orderId;
  const paymentId = location.state?.paymentId;
  const orderNumber = location.state?.orderNumber;

  useEffect(() => {
    // Clear cart on success page
    clearCart();

    // Fetch order details if we have orderId
    const loadOrderDetails = async () => {
      if (orderId) {
        try {
          const orderData = await fetchOrder(orderId);
          setOrder(orderData);
        } catch (err) {
          setError("Failed to load order details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, fetchOrder, clearCart]);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleTrackOrder = () => {
    if (order?.id) {
      navigate(`/orders/${order.id}`);
    }
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  if (loading) {
    return (
      <div className="payment-success-loading">
        <div className="loading-spinner"></div>
        <p>Loading order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="success-animation-wrapper"
        >
          <SuccessAnimation />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="success-content"
        >
          <h1 className="success-title">Payment Successful! 🎉</h1>
          <p className="success-message">
            Thank you for your purchase! Your order has been confirmed.
          </p>

          {/* Order Details */}
          <div className="order-details-section">
            <OrderConfirmation
              order={order}
              orderNumber={orderNumber}
              orderId={orderId}
              paymentId={paymentId}
            />
          </div>

          {/* Next Steps */}
          <div className="next-steps-section">
            <h2>What happens next?</h2>
            <div className="timeline">
              <div className="timeline-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Order Processing</h3>
                  <p>We'll start preparing your order immediately</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Shipping</h3>
                  <p>Your order will ship within 1-2 business days</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Delivery</h3>
                  <p>Estimated delivery: 3-7 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="success-actions">
            <div className="action-group">
              <button onClick={handleContinueShopping} className="btn-primary">
                Continue Shopping
              </button>
              {order && (
                <button onClick={handleTrackOrder} className="btn-secondary">
                  Track Order
                </button>
              )}
              <button onClick={handleViewOrders} className="btn-outline">
                View All Orders
              </button>
            </div>

            <div className="additional-actions">
              {order && (
                <>
                  <DownloadReceipt order={order} />
                  <ShareOrder order={order} />
                </>
              )}
            </div>
          </div>

          {/* Customer Support */}
          <div className="support-section">
            <h3>Need help with your order?</h3>
            <div className="support-options">
              <Link to="/contact" className="support-link">
                Contact Support
              </Link>
              <Link to="/faq" className="support-link">
                View FAQ
              </Link>
              <a
                href={`mailto:support@afrochic.com?subject=Order Inquiry #${orderNumber}`}
                className="support-link"
              >
                Email Us
              </a>
            </div>
            <p className="support-note">
              We'll send you email updates about your order. You can also track
              your order in your account.
            </p>
          </div>

          {/* Recent Products or Recommendations */}
          {user && (
            <div className="recommendations-section">
              <h3>You might also like</h3>
              <div className="recommendations">
                {/* Add product recommendations component here */}
                <Link to="/products" className="view-more-link">
                  Browse more products →
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Confetti */}
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
