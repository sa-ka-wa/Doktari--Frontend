import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import ProductCard from "../../../components/products/ProductCard";
import ProductFilter from "../../../components/products/ProductFilter";
import SearchBar from "../../../components/common/SearchBar";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import "./ProductCatalog.css";

const ProductCatalog = () => {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    brand: "",
    sortBy: "name",
  });

  // Filter products based on search and filters
  useEffect(() => {
    let result = products;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    // Brand filter
    if (filters.brand) {
      result = result.filter((product) => product.brand === filters.brand);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min;
      });
    }

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      category: "",
      priceRange: "",
      brand: "",
      sortBy: "name",
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="catalog-error">
        <h2>Error loading products</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <div className="container">
          <h1>Product Catalog</h1>
          <p>Discover our amazing collection of t-shirts</p>
        </div>
      </div>

      <div className="catalog-content">
        <div className="container">
          <div className="catalog-toolbar">
            <div className="toolbar-left">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search products..."
              />
            </div>
            <div className="toolbar-right">
              <span className="results-count">
                {filteredProducts.length} products found
              </span>
            </div>
          </div>

          <div className="catalog-layout">
            {/* Filters Sidebar */}
            <aside className="filters-sidebar">
              <ProductFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </aside>

            {/* Products Grid */}
            <main className="products-main">
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters</p>
                  <button onClick={clearFilters} className="btn btn-outline">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="products-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        showAddToCart={true}
                      />
                    ))}
                  </div>

                  {/* Load More or Pagination can be added here */}
                  <div className="catalog-actions">
                    <Link to="/custom-design" className="btn btn-primary">
                      Create Custom Design
                    </Link>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
