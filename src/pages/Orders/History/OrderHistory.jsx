import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOrders } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../../../components/common/LoadingSpinner/LoadingSpinner";
import OrderCard from "../../../components/orders/OrderCard";
import FilterBar from "../../../components/orders/FilterBar";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Pagination from "../../../components/common/Pagination/Pagination";
import "./OrderHistory.css";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders } = useOrders();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const params = {};
    if (filters.status !== "all") params.status = filters.status;
    if (filters.dateRange !== "all") params.date_range = filters.dateRange;
    if (filters.search) params.search = filters.search;

    fetchOrders(params);
  }, [fetchOrders, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleReorder = (order) => {
    // Implement reorder logic
    console.log("Reorder:", order);
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case "last30":
          startDate.setDate(now.getDate() - 30);
          break;
        case "last90":
          startDate.setDate(now.getDate() - 90);
          break;
        case "thisYear":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case "lastYear":
          startDate = new Date(now.getFullYear() - 1, 0, 1);
          const endDate = new Date(now.getFullYear() - 1, 11, 31);
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.created_at);
            return orderDate >= startDate && orderDate <= endDate;
          });
          return filtered;
        default:
          break;
      }

      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= startDate
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm) ||
          order.customer_name?.toLowerCase().includes(searchTerm) ||
          order.items?.some((item) =>
            item.product_title?.toLowerCase().includes(searchTerm)
          )
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading && orders.length === 0) {
    return (
      <div className="order-history-loading">
        <LoadingSpinner />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-error">
        <h2>Unable to load orders</h2>
        <p>{error}</p>
        <button onClick={() => fetchOrders()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        {/* Header */}
        <div className="order-history-header">
          <h1>My Orders</h1>
          <p className="order-history-subtitle">
            View and manage all your orders
          </p>
        </div>

        {/* Filters */}
        <div className="order-history-filters">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Orders List */}
        <div className="order-history-content">
          {filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders found"
              message={
                filters.status !== "all" || filters.search
                  ? "Try adjusting your filters"
                  : "Start shopping to see your orders here"
              }
              icon="📦"
              action={
                <Link to="/products" className="btn-primary">
                  Start Shopping
                </Link>
              }
            />
          ) : (
            <>
              <div className="orders-list">
                {paginatedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onView={() => handleViewOrder(order.id)}
                    onReorder={() => handleReorder(order)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="orders-pagination">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  <div className="pagination-info">
                    Showing {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, filteredOrders.length)}{" "}
                    of {filteredOrders.length} orders
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
