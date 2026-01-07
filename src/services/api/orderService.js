import apiClient from "./apiClient";

const orderService = {
  // =========================
  // ORDERS (GENERAL)
  // =========================

  // Get orders (role-based: admin/staff/user)
  getOrders: async (params = {}) => {
    try {
      const response = await apiClient.get("/orders", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get specific order by ID
  getOrder: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Get current user's orders
  getMyOrders: async () => {
    try {
      const response = await apiClient.get("/orders/my-orders");
      return response.data;
    } catch (error) {
      console.error("Get my orders error:", error);
      throw error;
    }
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await apiClient.get(`/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by number:", error);
      throw error;
    }
  },

  // =========================
  // CREATE / UPDATE
  // =========================

  // Create new order
  createOrder: async (orderData) => {
    try {
      console.log("Creating order with data:", orderData);
      const response = await apiClient.post("/orders", orderData);
      console.log("Order created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Order creation error details:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw new Error(error.response?.data?.error || "Failed to create order");
    }
  },

  // Update order status (admin / staff)
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

  // Cancel order (user)
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

  // =========================
  // SHIPPING & TRACKING
  // =========================

  // Add tracking info (brand staff/admin)
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

  // =========================
  // STATS & SEARCH
  // =========================

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
};

export default orderService;
