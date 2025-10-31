import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, showAddToCart = true }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", product.id);
    // TODO: Implement cart functionality
  };

  return (
    <div className="product-card">
      <Link to={`/products/detail/${product.id}`} className="product-link">
        <div className="product-image">
          <img
            src={product.image || "/images/placeholder-tshirt.jpg"}
            alt={product.name}
            onError={(e) => {
              e.target.src = "/images/placeholder-tshirt.jpg";
            }}
          />
          {!product.inStock && <div className="out-of-stock">Out of Stock</div>}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <span className="product-brand">{product.brand}</span>
            <span className="product-category">{product.category}</span>
          </div>

          <div className="product-price">${product.price}</div>
        </div>
      </Link>

      {showAddToCart && product.inStock && (
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
