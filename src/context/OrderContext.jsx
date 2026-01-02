import React, { createContext, useState, useContext, useCallback } from "react";
import orderService from "../services/api/orderService";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  // Fetch orders with filters
  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders(params);
      setOrders(data.orders || []);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch orders";
      setError(errorMsg);
      console.error("Error fetching orders:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch order statistics
  const fetchOrderStats = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderStats(params);
      setStats(data);
      return data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to fetch order stats";
      setError(errorMsg);
      console.error("Error fetching order stats:", err);

      // Return default stats on error
      const defaultStats = {
        total_orders: 0,
        total_revenue: 0,
        average_order_value: 0,
        status_counts: {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        },
      };
      setStats(defaultStats);
      return defaultStats;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single order
  const fetchOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrder(orderId);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch order";
      setError(errorMsg);
      console.error("Error fetching order:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new order
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.createOrder(orderData);
      setOrders((prev) => [data.order, ...prev]);
      setCurrentOrder(data.order);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create order";
      setError(errorMsg);
      console.error("Error creating order:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(
    async (orderId, status, reason = "") => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.updateOrderStatus(
          orderId,
          status,
          reason
        );

        // Update in local state
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data.order : order))
        );

        if (currentOrder?.id === orderId) {
          setCurrentOrder(data.order);
        }

        return data;
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || "Failed to update order status";
        setError(errorMsg);
        console.error("Error updating order status:", err);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  // Cancel order
  const cancelOrder = useCallback(
    async (orderId, reason = "") => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.cancelOrder(orderId, reason);

        // Update in local state
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data.order : order))
        );

        if (currentOrder?.id === orderId) {
          setCurrentOrder(data.order);
        }

        return data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || "Failed to cancel order";
        setError(errorMsg);
        console.error("Error cancelling order:", err);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  // Add tracking info
  const addTrackingInfo = useCallback(
    async (orderId, trackingData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.addTrackingInfo(orderId, trackingData);

        // Update in local state
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data.order : order))
        );

        if (currentOrder?.id === orderId) {
          setCurrentOrder(data.order);
        }

        return data;
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || "Failed to add tracking info";
        setError(errorMsg);
        console.error("Error adding tracking info:", err);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  // Search orders
  const searchOrders = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.searchOrders(searchTerm);
      setOrders(data.orders || []);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to search orders";
      setError(errorMsg);
      console.error("Error searching orders:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // State
    orders,
    currentOrder,
    loading,
    error,
    stats,

    // Actions
    fetchOrders,
    fetchOrderStats,
    fetchOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    addTrackingInfo,
    searchOrders,
    clearCurrentOrder,
    clearError,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};
