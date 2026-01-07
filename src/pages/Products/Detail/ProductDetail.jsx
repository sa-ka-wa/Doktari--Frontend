import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../../../hooks/useProducts";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use the hook - it returns { product, loading, error }
  const { product, loading, error } = useProduct(id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    console.log("Product data:", product);
    console.log("Loading:", loading);
    console.log("Error:", error);

    if (product) {
      // Map backend properties to frontend expectations
      const size =
        product.size || product.title?.match(/\((\w+)\)/)?.[1] || "One Size";
      const color = product.color || "Default";

      setSelectedSize(size);
      setSelectedColor(color);
    }
  }, [product, loading, error]);

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
      name: product.title || product.name, // Use title from backend
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.image_url || product.image, // Use image_url from backend
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
    if (product && quantity < (product.stock_quantity || 0)) {
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
        <Link to="/products" className="btn btn-primary">
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
        <Link to="/products" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Map backend properties to frontend expectations
  const productName = product.title || product.name || "Unnamed Product";
  const productImage =
    product.image_url || product.image || "/images/placeholder-tshirt.jpg";
  const productImages = [productImage];
  const productSizes = product.size ? [product.size] : ["One Size"];
  const productColors = product.color ? [product.color] : ["Default"];
  const inStock = (product.stock_quantity || 0) > 0;
  const stockQuantity = product.stock_quantity || 0;
  const productBrand =
    product.brand_name || product.brand?.name || "Unknown Brand";
  const productDescription =
    product.description || product.fullDescription || "";

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{productName}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={productImages[activeImage]}
                alt={productName}
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
            {productImages.length > 1 && (
              <div className="image-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${
                      activeImage === index ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
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
              <h1 className="product-title">{productName}</h1>
              <div className="product-price">
                ${product.price?.toFixed(2) || "0.00"}
              </div>
            </div>

            <div className="product-meta">
              {productBrand && (
                <span className="brand">Brand: {productBrand}</span>
              )}
              <span className="category">
                Category: {product.category || "Uncategorized"}
              </span>
              {product.style_tag && (
                <span className="style-tag">Style: {product.style_tag}</span>
              )}
              {product.artist && (
                <span className="artist">Artist: {product.artist}</span>
              )}
              <span
                className={`stock ${inStock ? "in-stock" : "out-of-stock"}`}
              >
                {inStock
                  ? `In Stock (${stockQuantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            <p className="product-description">{productDescription}</p>

            {product.material && (
              <div className="material-info">
                <strong>Material:</strong> {product.material}
              </div>
            )}

            {/* Size Selection */}
            {productSizes.length > 0 && (
              <div className="selection-group">
                <label className="selection-label">Size:</label>
                <div className="size-options">
                  {productSizes.map((size) => (
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
            {productColors.length > 0 && (
              <div className="selection-group">
                <label className="selection-label">Color:</label>
                <div className="color-options">
                  {productColors.map((color) => (
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
                  disabled={quantity >= stockQuantity}
                >
                  +
                </button>
              </div>
              {stockQuantity > 0 && (
                <div className="stock-info">
                  Only {stockQuantity} left in stock
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={handleBuyNow}
                disabled={!inStock}
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
