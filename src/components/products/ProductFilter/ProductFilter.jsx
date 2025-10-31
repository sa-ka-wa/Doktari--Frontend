import React from "react";
import "./ProductFilter.css";

const ProductFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const categories = ["casual", "premium", "sports", "graphic", "basic"];
  const brands = ["BasicWear", "StyleCo", "SportTech", "UrbanStyle", "EcoWear"];
  const priceRanges = [
    { label: "Under $25", value: "0-25" },
    { label: "$25 - $50", value: "25-50" },
    { label: "$50 - $100", value: "50-100" },
    { label: "Over $100", value: "100-" },
  ];
  const sortOptions = [
    { label: "Name A-Z", value: "name" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Newest First", value: "newest" },
  ];

  const handleCategoryChange = (category) => {
    onFilterChange({ category: filters.category === category ? "" : category });
  };

  const handleBrandChange = (brand) => {
    onFilterChange({ brand: filters.brand === brand ? "" : brand });
  };

  const handlePriceRangeChange = (priceRange) => {
    onFilterChange({
      priceRange: filters.priceRange === priceRange ? "" : priceRange,
    });
  };

  const handleSortChange = (sortBy) => {
    onFilterChange({ sortBy });
  };

  const hasActiveFilters =
    filters.category || filters.brand || filters.priceRange;

  return (
    <div className="product-filter">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="filter-section">
        <h4>Sort By</h4>
        <div className="filter-options">
          {sortOptions.map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={filters.sortBy === option.value}
                onChange={(e) => handleSortChange(e.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h4>Categories</h4>
        <div className="filter-options">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-chip ${
                filters.category === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="filter-section">
        <h4>Brands</h4>
        <div className="filter-options">
          {brands.map((brand) => (
            <button
              key={brand}
              className={`filter-chip ${
                filters.brand === brand ? "active" : ""
              }`}
              onClick={() => handleBrandChange(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="filter-options">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              className={`filter-chip ${
                filters.priceRange === range.value ? "active" : ""
              }`}
              onClick={() => handlePriceRangeChange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
