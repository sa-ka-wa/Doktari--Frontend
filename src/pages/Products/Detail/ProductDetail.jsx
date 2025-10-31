import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../../../hooks/useProducts"; // Updated import
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id); // Using the new hook
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      // Set default selections based on available options
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    if (!product.inStock) {
      alert("This product is out of stock");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.image,
      product_type: product.product_type,
      style_tag: product.style_tag,
      artist: product.artist,
    };

    console.log("Added to cart:", cartItem);
    // TODO: Implement actual cart context
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return <LoadingSpinner text="Loading product..." />;
  }

  if (error) {
    return (
      <div className="product-not-found">
        <h2>Error Loading Product</h2>
        <p>{error}</p>
        <Link to="/products/catalog" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products/catalog" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images || [product.image];
  const sizes = product.sizes || ["One Size"];
  const colors = product.colors || ["Default"];

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products/catalog">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={images[activeImage]}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/images/placeholder-tshirt.jpg";
                }}
              />
              {product.has_3d_model && (
                <div className="3d-model-badge">
                  <span>3D Model Available</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${
                      activeImage === index ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = "/images/placeholder-tshirt.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-price">${product.price}</div>
            </div>

            <div className="product-meta">
              {product.brand && (
                <span className="brand">Brand: {product.brand}</span>
              )}
              <span className="category">Category: {product.category}</span>
              {product.style_tag && (
                <span className="style-tag">Style: {product.style_tag}</span>
              )}
              {product.artist && (
                <span className="artist">Artist: {product.artist}</span>
              )}
              <span
                className={`stock ${
                  product.inStock ? "in-stock" : "out-of-stock"
                }`}
              >
                {product.inStock
                  ? `In Stock (${product.stock_quantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            <p className="product-description">{product.fullDescription}</p>

            {product.material && (
              <div className="material-info">
                <strong>Material:</strong> {product.material}
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="selection-group">
                <label className="selection-label">Size:</label>
                <div className="size-options">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="selection-group">
                <label className="selection-label">Color:</label>
                <div className="color-options">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      <span
                        className="color-swatch"
                        style={{
                          backgroundColor: color.toLowerCase(),
                          border:
                            color.toLowerCase() === "white"
                              ? "1px solid #ddd"
                              : "none",
                        }}
                      ></span>
                      <span className="color-name">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="selection-group">
              <label className="selection-label">Quantity:</label>
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
              {product.stock_quantity > 0 && (
                <div className="stock-info">
                  Only {product.stock_quantity} left in stock
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>

            {/* 3D Model Section */}
            {product.has_3d_model && (
              <div className="3d-model-section">
                <h3>3D Preview</h3>
                <p>View this product in 3D to see all angles</p>
                <Link
                  to={`/products/3d-view/${product.id}`}
                  className="btn btn-outline"
                >
                  View in 3D
                </Link>
              </div>
            )}

            {/* Product Features */}
            <div className="product-features">
              <h3>Product Features</h3>
              <ul>
                <li>High Quality {product.material || "Material"}</li>
                <li>Machine Washable</li>
                <li>Comfortable Fit</li>
                <li>Durable Construction</li>
                {product.style_tag && <li>{product.style_tag} Style</li>}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info">
              <h3>Shipping & Returns</h3>
              <div className="shipping-features">
                <div className="shipping-feature">
                  <span className="icon">🚚</span>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="shipping-feature">
                  <span className="icon">↩️</span>
                  <span>30-day return policy</span>
                </div>
                <div className="shipping-feature">
                  <span className="icon">🛡️</span>
                  <span>Quality guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
