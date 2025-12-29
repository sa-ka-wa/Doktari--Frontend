// src/components/products/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../../services/api/productService';
import { useCart } from '../../../context/CartContext';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Modal } from '../../common/Modal';
import ProductList from '../ProductList';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [show3DModal, setShow3DModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getProductById(id);
      setProduct(productData);
      
      // Fetch related products
      if (productData) {
        const related = await productService.getProducts({
          category: productData.category,
          brand_id: productData.brand_id,
          limit: 4,
          exclude: id
        });
        setRelatedProducts(related.products || related);
      }
    } catch (err) {
      setError('Failed to load product details. Please try again.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.size) {
      alert('Please select a size');
      return;
    }

    if (!selectedColor && product.color) {
      alert('Please select a color');
      return;
    }

    try {
      setAddingToCart(true);
      
      const cartItem = {
        product: product,
        quantity: quantity,
        selectedSize: selectedSize || product.size,
        selectedColor: selectedColor || product.color,
        price: product.price
      };

      await addToCart(cartItem);
      
      // Show success message
      alert('Product added to cart successfully!');
      
    } catch (err) {
      alert('Failed to add product to cart. Please try again.');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const renderSizeOptions = () => {
    if (!product.size || product.size === 'One Size') {
      return null;
    }

    const sizes = product.size.split(',').map(s => s.trim());
    
    return (
      <div className="size-options">
        <div className="option-header">
          <label>Size:</label>
          <button 
            type="button" 
            className="size-guide-link"
            onClick={() => setShowSizeGuide(true)}
          >
            Size Guide
          </button>
        </div>
        <div className="size-buttons">
          {sizes.map(size => (
            <button
              key={size}
              type="button"
              className={`size-button ${selectedSize === size ? 'selected' : ''}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderColorOptions = () => {
    if (!product.color) {
      return null;
    }

    const colors = product.color.split(',').map(c => c.trim());
    
    return (
      <div className="color-options">
        <label>Color:</label>
        <div className="color-buttons">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              className={`color-button ${selectedColor === color ? 'selected' : ''}`}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const render3DViewer = () => {
    if (!product.has_3d_model || !product.model_3d_url) {
      return null;
    }

    return (
      <div className="product-3d-section">
        <Button 
          variant="outline" 
          onClick={() => setShow3DModal(true)}
          className="view-3d-btn"
        >
          <span className="btn-icon">🔄</span>
          View in 3D
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <LoadingSpinner size="large" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <div className="error-icon">⚠️</div>
        <h2>Product Not Found</h2>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <Button onClick={() => navigate('/products')}>
          Browse Products
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <a href="/">Home</a>
        <span className="separator">/</span>
        <a href="/products">Products</a>
        <span className="separator">/</span>
        <span className="current">{product.title}</span>
      </nav>

      <div className="product-detail-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={product.image_url} 
              alt={product.title}
              loading="eager"
            />
            {isOutOfStock && (
              <div className="out-of-stock-overlay">
                <span>Out of Stock</span>
              </div>
            )}
          </div>
          
          {render3DViewer()}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            {product.brand_name && (
              <div className="product-brand">
                Brand: <a href={`/brands/${product.brand_id}`}>{product.brand_name}</a>
              </div>
            )}
            {product.artist && (
              <div className="product-artist">Artist: {product.artist}</div>
            )}
          </div>

          <div className="product-price-section">
            <div className="price">${product.price.toFixed(2)}</div>
            {product.stock_quantity > 0 ? (
              <div className="stock-status in-stock">
                <span className="stock-indicator"></span>
                In Stock ({product.stock_quantity} available)
              </div>
            ) : (
              <div className="stock-status out-of-stock">
                <span className="stock-indicator"></span>
                Out of Stock
              </div>
            )}
          </div>

          {/* Product Options */}
          <div className="product-options">
            {renderSizeOptions()}
            {renderColorOptions()}

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  type="button" 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity || 10}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= (product.stock_quantity || 10)) {
                      setQuantity(value);
                    }
                  }}
                  className="quantity-input"
                />
                <button 
                  type="button" 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock_quantity || 10)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button
              variant="primary"
              size="large"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              loading={addingToCart}
              fullWidth
            >
              {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </Button>
            
            <Button
              variant="secondary"
              size="large"
              onClick={handleBuyNow}
              disabled={isOutOfStock || addingToCart}
              fullWidth
            >
              Buy Now
            </Button>
          </div>

          {/* Product Meta */}
          <div className="product-meta">
            {product.category && (
              <div className="meta-item">
                <strong>Category:</strong>
                <span>{product.category}</span>
              </div>
            )}
            {product.product_type && (
              <div className="meta-item">
                <strong>Type:</strong>
                <span>{product.product_type}</span>
              </div>
            )}
            {product.style_tag && (
              <div className="meta-item">
                <strong>Style:</strong>
                <span>{product.style_tag}</span>
              </div>
            )}
            {product.material && (
              <div className="meta-item">
                <strong>Material:</strong>
                <span>{product.material}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="product-tabs">
        <div className="tab-headers">
          <button
            className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (0)
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <p>{product.description || 'No description available.'}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-content">
              <table className="specs-table">
                <tbody>
                  {product.category && (
                    <tr>
                      <td>Category</td>
                      <td>{product.category}</td>
                    </tr>
                  )}
                  {product.product_type && (
                    <tr>
                      <td>Product Type</td>
                      <td>{product.product_type}</td>
                    </tr>
                  )}
                  {product.style_tag && (
                    <tr>
                      <td>Style</td>
                      <td>{product.style_tag}</td>
                    </tr>
                  )}
                  {product.material && (
                    <tr>
                      <td>Material</td>
                      <td>{product.material}</td>
                    </tr>
                  )}
                  {product.size && (
                    <tr>
                      <td>Available Sizes</td>
                      <td>{product.size}</td>
                    </tr>
                  )}
                  {product.color && (
                    <tr>
                      <td>Available Colors</td>
                      <td>{product.color}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <p>No reviews yet. Be the first to review this product!</p>
              <Button variant="outline" size="medium">
                Write a Review
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <ProductList
            products={relatedProducts}
            showFilters={false}
            showPagination={false}
            limit={4}
          />
        </div>
      )}

      {/* 3D Modal */}
      <Modal
        isOpen={show3DModal}
        onClose={() => setShow3DModal(false)}
        title="3D Product Viewer"
        size="xl"
      >
        <div className="model-viewer-container">
          {product.has_3d_model && product.model_3d_url ? (
            <div className="model-viewer">
              {/* This would be your 3D viewer component */}
              <div className="model-placeholder">
                <p>3D Model Viewer Placeholder</p>
                <p>Model URL: {product.model_3d_url}</p>
                <p>Scale: {product.model_scale}</p>
                {product.model_position && (
                  <p>Position: {JSON.stringify(product.model_position)}</p>
                )}
              </div>
            </div>
          ) : (
            <p>3D model not available for this product.</p>
          )}
        </div>
      </Modal>

      {/* Size Guide Modal */}
      <Modal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        title="Size Guide"
        size="lg"
      >
        <div className="size-guide-content">
          <h3>How to Measure</h3>
          <p>Please use the following guide to find your perfect size:</p>
          
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest (in)</th>
                <th>Length (in)</th>
                <th>Sleeve (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>S</td>
                <td>34-36</td>
                <td>26-27</td>
                <td>8-8.5</td>
              </tr>
              <tr>
                <td>M</td>
                <td>38-40</td>
                <td>27-28</td>
                <td>8.5-9</td>
              </tr>
              <tr>
                <td>L</td>
                <td>42-44</td>
                <td>28-29</td>
                <td>9-9.5</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>46-48</td>
                <td>29-30</td>
                <td>9.5-10</td>
              </tr>
              <tr>
                <td>XXL</td>
                <td>50-52</td>
                <td>30-31</td>
                <td>10-10.5</td>
              </tr>
            </tbody>
          </table>
          
          <div className="size-tips">
            <h4>Tips:</h4>
            <ul>
              <li>Measure yourself wearing the type of clothing you'll wear under the garment</li>
              <li>Keep the tape measure snug but not tight</li>
              <li>If between sizes, we recommend sizing up</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;