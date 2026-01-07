// src/services/api/paymentService.js
import apiClient from "./apiClient"; // Import from the correct file

export const paymentService = {
  createPayment: async (paymentData) => {
    try {
      console.log("Creating payment with data:", paymentData);
      const response = await apiClient.post("/payments/", paymentData);
      console.log("Payment created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Payment creation error details:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw new Error(
        error.response?.data?.error || "Failed to create payment"
      );
    }
  },

  getPaymentStatus: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Get payment status error:", error);
      throw error;
    }
  },

  getOrderPayments: async (orderId) => {
    try {
      const response = await apiClient.get(`/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Get order payments error:", error);
      throw error;
    }
  },
};
