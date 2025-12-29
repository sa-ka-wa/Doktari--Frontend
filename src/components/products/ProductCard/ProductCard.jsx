// src/components/products/ProductCard/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../common/Card';
import Button from '../../common/Button';
import './ProductCard.css';

const ProductCard = ({ product, onClick, showBrand = true }) => {
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    image_url,
    price,
    category,
    brand_name,
    brand_id,
    stock_quantity = 0,
    has_3d_model,
    style_tag,
    artist
  } = product;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on buttons or links
    if (!e.target.closest('button') && !e.target.closest('a')) {
      if (onClick) {
        onClick(product);
      }
    }
  };

  const getStockStatus = () => {
    if (stock_quantity <= 0) return 'out_of_stock';
    if (stock_quantity <= 10) return 'low_stock';
    return 'in_stock';
  };

  const stockStatus = getStockStatus();

  return (
    <Card 
      className="product-card" 
      hoverable 
      clickable
      onClick={handleCardClick}
    >
      <div className="product-image-container">
        {!imageError ? (
          <img 
            src={image_url} 
            alt={title} 
            className="product-image"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="product-image-placeholder">
            <span className="placeholder-text">No Image</span>
          </div>
        )}
        
        {has_3d_model && (
          <span className="product-3d-badge" title="3D Model Available">
            <span className="badge-icon">3D</span>
          </span>
        )}

        {stockStatus === 'out_of_stock' && (
          <div className="product-out-of-stock">Out of Stock</div>
        )}

        {stockStatus === 'low_stock' && (
          <div className="product-low-stock">Low Stock</div>
        )}

        {style_tag && (
          <span className="product-style-tag">{style_tag}</span>
        )}
      </div>

      <div className="product-info">
        <div className="product-header">
          <h3 className="product-title" title={title}>
            {title}
          </h3>
          
          {showBrand && brand_name && (
            <Link 
              to={`/brands/${brand_id}`} 
              className="product-brand-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="product-brand">{brand_name}</span>
            </Link>
          )}

          {artist && (
            <span className="product-artist">by {artist}</span>
          )}
        </div>

        <div className="product-meta">
          <div className="product-price-section">
            <div className="product-price">${price.toFixed(2)}</div>
            {category && (
              <span className="product-category">{category}</span>
            )}
          </div>

          {stock_quantity > 0 && (
            <div className="product-stock">
              <span className={`stock-indicator ${stockStatus}`}></span>
              <span className="stock-text">
                {stock_quantity} in stock
              </span>
            </div>
          )}
        </div>

        <div className="product-footer">
          <div className="product-actions">
            <Link 
              to={`/products/detail/${id}`} 
              onClick={(e) => e.stopPropagation()}
              className="view-details-link"
            >
              <Button variant="outline" size="sm" fullWidth>
                View Details
              </Button>
            </Link>
            
            {stock_quantity > 0 && (
              <Button 
                variant="primary" 
                size="sm" 
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic here
                  console.log('Add to cart:', product);
                }}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;