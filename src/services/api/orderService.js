import apiClient from "./apiClient";

const orderService = {
  // Get orders with role-based filtering
  getOrders: async (params = {}) => {
    try {
      const response = await apiClient.get("/orders", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get specific order
  getOrder: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post("/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order status (for staff/admin)
  updateOrderStatus: async (orderId, status, reason = "") => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, {
        status,
        cancellation_reason: reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason = "") => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },

  // Add tracking info (for brand staff/admin)
  addTrackingInfo: async (orderId, trackingData) => {
    try {
      const response = await apiClient.post(
        `/orders/${orderId}/tracking`,
        trackingData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding tracking info:", error);
      throw error;
    }
  },

  // Update shipping info
  updateShippingInfo: async (orderId, shippingInfo) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/shipping`, {
        shipping_info: shippingInfo,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating shipping info:", error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async (params = {}) => {
    try {
      const response = await apiClient.get("/orders/stats", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }
  },

  // Search orders
  searchOrders: async (searchTerm) => {
    try {
      const response = await apiClient.get("/orders/search", {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching orders:", error);
      throw error;
    }
  },

  // Get order by number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await apiClient.get(`/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by number:", error);
      throw error;
    }
  },
};

export default orderService;
