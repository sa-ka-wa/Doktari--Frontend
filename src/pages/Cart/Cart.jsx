

// src/pages/Cart/Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import './Cart.css';

const Cart = () => {
  const { 
    items, 
    totalItems, 
    totalAmount, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-container">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="empty-cart-icon"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products/catalog">
            <Button variant="primary" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    // For now, just navigate to checkout page
    // You can add validation logic here later
    window.location.href = '/checkout';
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-item-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearCart}
            className="clear-cart-btn"
          >
            Clear All
          </Button>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span className="header-product">Product</span>
              <span className="header-price">Price</span>
              <span className="header-quantity">Quantity</span>
              <span className="header-total">Total</span>
            </div>

            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-product">
                    <div className="product-image">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="product-details">
                      <h3 className="product-title">{item.title}</h3>
                      {item.brand_name && (
                        <p className="product-brand">Brand: {item.brand_name}</p>
                      )}
                      {item.size && item.size !== 'Default' && (
                        <p className="product-size">Size: {item.size}</p>
                      )}
                      {item.color && item.color !== 'Default' && (
                        <p className="product-color">Color: {item.color}</p>
                      )}
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price">
                    <span className="price">${item.price.toFixed(2)}</span>
                  </div>

                  <div className="cart-item-quantity">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock_quantity || 99)}
                      >
                        +
                      </button>
                    </div>
                    {item.stock_quantity && item.stock_quantity <= 10 && (
                      <p className="low-stock-warning">
                        Only {item.stock_quantity} left in stock
                      </p>
                    )}
                  </div>

                  <div className="cart-item-total">
                    <span className="total-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="continue-shopping">
              <Link to="/products/catalog">
                <Button variant="outline">
                  ← Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span className="row-label">Subtotal</span>
                <span className="row-value">${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span className="row-label">Shipping</span>
                <span className="row-value">Calculated at checkout</span>
              </div>
              
              <div className="summary-row">
                <span className="row-label">Tax</span>
                <span className="row-value">Will be calculated</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <span className="total-label">Estimated Total</span>
                <span className="total-value">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="checkout-action">
                <Button 
                  variant="primary" 
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>

              <div className="payment-methods">
                <p className="payment-note">We accept:</p>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-icon">📱</span>
                  <span className="payment-icon">💰</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
