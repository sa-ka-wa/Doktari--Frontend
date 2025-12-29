// src/components/products/ProductList/ProductList.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import  LoadingSpinner  from '../../common/LoadingSpinner/LoadingSpinner';
import  Pagination  from '../../common/Pagination/Pagination';
import { productService } from '../../../services/api/productService';
import './ProductList.css';

const ProductList = ({ 
  brandId = null,
  category = null,
  limit = 12,
  showFilters = true,
  showPagination = true,
  onProductClick,
  title = "Products"
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const itemsPerPage = limit;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, searchTerm, priceRange, brandId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: sortBy,
        search: searchTerm || undefined,
        brand_id: brandId || undefined,
        min_price: priceRange.min || undefined,
        max_price: priceRange.max || undefined
      };

      const data = await productService.getProducts(params);
      
      setProducts(data.products || data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalCount || data.length || 0);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      window.location.href = `/products/detail/${product.id}`;
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSortBy('newest');
    setSearchTerm('');
    setPriceRange({ min: 0, max: 1000 });
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="product-list-loading">
        <LoadingSpinner size="large" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Products</h3>
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>{title}</h2>
        <div className="product-count">
          {totalItems} {totalItems === 1 ? 'product' : 'products'} found
        </div>
      </div>

      {showFilters && (
        <div className="product-list-filters">
          <div className="filter-group">
            <div className="filter-section">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="category-select"
              >
                <option value="all">All Categories</option>
                <option value="tshirts">T-Shirts</option>
                <option value="hoodies">Hoodies</option>
                <option value="hats">Hats</option>
                <option value="stickers">Stickers</option>
                <option value="accessories">Accessories</option>
                <option value="bandanas">Bandanas</option>
                <option value="caps">Caps</option>
              </select>
            </div>

            <div className="filter-section">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="filter-section">
              <label>Price Range:</label>
              <div className="price-range">
                <span className="price-label">${priceRange.min} - ${priceRange.max}</span>
                <div className="range-inputs">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 0, priceRange.max)}
                    className="price-input"
                    placeholder="Min"
                  />
                  <span className="range-separator">to</span>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange(priceRange.min, parseInt(e.target.value) || 1000)}
                    className="price-input"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="product-list-empty">
          <div className="empty-icon">📦</div>
          <h3>No Products Found</h3>
          <p>Try adjusting your search or filters.</p>
          <button onClick={handleClearFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="product-list-grid">
            {products.map(product => (
              <div key={product.id} className="product-list-item">
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            ))}
          </div>

          {showPagination && totalPages > 1 && (
            <div className="product-list-pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <div className="pagination-info">
                Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;