import React from "react";
import "./FilterBar.css";

const FilterBar = ({ filters, onFilterChange, onSearch }) => {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "last30", label: "Last 30 Days" },
    { value: "last90", label: "Last 90 Days" },
    { value: "thisYear", label: "This Year" },
    { value: "lastYear", label: "Last Year" },
  ];

  const handleStatusChange = (e) => {
    const newFilters = { ...filters, status: e.target.value };
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (e) => {
    const newFilters = { ...filters, dateRange: e.target.value };
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-search">
        <input
          type="text"
          placeholder="Search orders by number, customer, or product..."
          value={filters.search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="filter-bar-selects">
        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="filter-select"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.dateRange}
          onChange={handleDateRangeChange}
          className="filter-select"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
