import React, { createContext, useState, useContext, useCallback } from "react";
import orderService from "../services/api/orderService";
import { useAuth } from "./AuthContext";

const OrderContext = createContext({});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  // Fetch orders with role-based filtering
  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders(params);
      setOrders(data.orders || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific order
  const fetchOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrder(orderId);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch order");
      console.error("Error fetching order:", err);
      throw err;
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

      // Add to orders list
      setOrders((prev) => [data.order, ...prev]);
      setCurrentOrder(data.order);

      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create order");
      console.error("Error creating order:", err);
      throw err;
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

        // Update in orders list
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data.order : order))
        );

        // Update current order if it's the one being updated
        if (currentOrder?.id === orderId) {
          setCurrentOrder(data.order);
        }

        return data;
      } catch (err) {
        setError(err.response?.data?.error || "Failed to update order status");
        console.error("Error updating order status:", err);
        throw err;
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

        // Update in orders list
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data.order : order))
        );

        // Update current order if it's the one being cancelled
        if (currentOrder?.id === orderId) {
          setCurrentOrder(data.order);
        }

        return data;
      } catch (err) {
        setError(err.response?.data?.error || "Failed to cancel order");
        console.error("Error cancelling order:", err);
        throw err;
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

        // Update in orders list
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data.order : order))
        );

        // Update current order
        if (currentOrder?.id === orderId) {
          setCurrentOrder(data.order);
        }

        return data;
      } catch (err) {
        setError(err.response?.data?.error || "Failed to add tracking info");
        console.error("Error adding tracking info:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  // Get order statistics
  const fetchOrderStats = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderStats(params);
      setStats(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch order stats");
      console.error("Error fetching order stats:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search orders
  const searchOrders = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.searchOrders(searchTerm);
      setOrders(data.orders || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to search orders");
      console.error("Error searching orders:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create the value object
  const value = {
    orders,
    currentOrder,
    loading,
    error,
    stats,
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    addTrackingInfo,
    fetchOrderStats,
    searchOrders,
    clearCurrentOrder,
    clearError,
  };

  // Debug logging - MUST BE AFTER value is created
  console.log("📦 OrderProvider initialized");
  console.log("📊 fetchOrders type:", typeof fetchOrders);
  console.log("📊 fetchOrderStats type:", typeof fetchOrderStats);
  console.log("🔍 OrderContext keys:", Object.keys(value));
  console.log(
    "✅ fetchOrderStats available?",
    typeof value.fetchOrderStats === "function"
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};
