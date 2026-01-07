// src/pages/Orders/Checkout/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import CheckoutForm from "../../../components/orders/CheckoutForm";
import OrderSummary from "../../../components/orders/OrderSummary";
import PaymentModal from "../../../components/payments/PaymentModal";
import orderService from "../../../services/api/orderService";
import { paymentService } from "../../../services/api/paymentService";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentPayment, setCurrentPayment] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
    country: "KE",
    shippingMethod: "standard",
    paymentMethod: "mpesa",
    mpesaPhone: "",
    saveInfo: false,
    notes: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    // Pre-fill form with user data if authenticated
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        mpesaPhone: user.phone || "",
      }));
    }
  }, [items, navigate, isAuthenticated, user]);

  const handleFormSubmit = async (formData) => {
    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          product_title: item.title,
          product_price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          total_price: item.price * item.quantity,
        })),
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_state: formData.county,
        shipping_zip: formData.postalCode,
        shipping_country: formData.country,
        shipping_method: formData.shippingMethod,
        shipping_cost: getShippingCost(formData.shippingMethod),
        tax_amount: calculateTax(totalAmount),
        payment_method: formData.paymentMethod,
        customer_notes: formData.notes,
        save_info: formData.saveInfo,
      };

      // Create order
      const orderResponse = await orderService.createOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || "Failed to create order");
      }

      const order = orderResponse.order;
      setCurrentOrder(order);

      // Handle payment based on method
      if (formData.paymentMethod === "mpesa") {
        await handleMpesaPayment(order, formData);
      } else {
        // For other payment methods
        clearCart();
        navigate("/payments/success", {
          state: {
            orderId: order.id,
            orderNumber: order.order_number,
            total: order.total_amount,
          },
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message || "Checkout failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleMpesaPayment = async (order, formData) => {
    try {
      const normalizedPhone = formatPhoneNumber(formData.mpesaPhone);

      const paymentData = {
        order_id: order.id,
        amount: order.total_amount,
        payment_method: "mpesa_stk",
        phone_number: normalizedPhone,
      };

      const paymentResponse = await paymentService.createPayment(paymentData);

      if (paymentResponse.success) {
        setCurrentPayment(paymentResponse.payment);
        setPaymentStatus("processing");
        setShowPaymentModal(true);

        // Start polling for payment status
        pollPaymentStatus(paymentResponse.payment.id, order.id);
      } else {
        throw new Error(paymentResponse.error || "Failed to initiate payment");
      }
    } catch (error) {
      throw error;
    }
  };

  const pollPaymentStatus = async (paymentId, orderId) => {
    let attempts = 0;
    const maxAttempts = 60;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setPaymentStatus("timeout");
        return;
      }

      try {
        const statusResponse = await paymentService.getPaymentStatus(paymentId);

        if (statusResponse.payment.status === "success") {
          setPaymentStatus("success");
          clearCart();

          setTimeout(() => {
            navigate("/payments/success", {
              state: {
                orderId: orderId,
                paymentId: paymentId,
              },
            });
          }, 2000);
        } else if (statusResponse.payment.status === "failed") {
          setPaymentStatus("failed");
        } else {
          attempts++;
          setTimeout(poll, 5000);
        }
      } catch (error) {
        attempts++;
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  const getShippingCost = (method) => {
    const methods = {
      standard: 200,
      express: 500,
      overnight: 1000,
    };
    return methods[method] || 0;
  };

  const calculateTax = (amount) => {
    return amount * 0.16; // 16% VAT for Kenya
  };

  const formatPhoneNumber = (phone) => {
    let normalized = phone.replace(/\D/g, "");
    if (normalized.startsWith("0")) {
      normalized = "254" + normalized.substring(1);
    } else if (normalized.startsWith("7")) {
      normalized = "254" + normalized;
    }
    return normalized;
  };

  if (items.length === 0) {
    return null;
  }

  const shippingCost = getShippingCost(formData.shippingMethod);
  const taxAmount = calculateTax(totalAmount);
  const totalWithTaxAndShipping = totalAmount + shippingCost + taxAmount;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step completed">1. Cart</div>
            <div className="step active">2. Information</div>
            <div className="step">3. Payment</div>
            <div className="step">4. Confirmation</div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-left">
            <CheckoutForm
              formData={formData}
              onFormChange={setFormData}
              onSubmit={handleFormSubmit}
              isProcessing={isProcessing}
              user={user}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <div className="checkout-right">
            <OrderSummary
              items={items}
              subtotal={totalAmount}
              shippingCost={shippingCost}
              taxAmount={taxAmount}
              total={totalWithTaxAndShipping}
              shippingMethod={formData.shippingMethod}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          status={paymentStatus}
          order={currentOrder}
          payment={currentPayment}
          mpesaPhone={formData.mpesaPhone}
          totalAmount={totalWithTaxAndShipping}
        />
      </div>
    </div>
  );
};

export default Checkout;
