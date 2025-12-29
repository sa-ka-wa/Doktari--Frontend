// src/pages/Orders/Checkout/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    shippingMethod: 'standard',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    saveInfo: false
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Here you would integrate with your payment gateway
      // For now, simulate a successful payment
      await simulatePayment();
      
      // Clear cart after successful purchase
      clearCart();
      
      // Redirect to success page
      navigate('/order-success', { 
        state: { 
          orderId: `ORD-${Date.now()}`,
          total: totalAmount 
        } 
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        alert(`Please fill in the ${field} field.`);
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const simulatePayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 2000);
    });
  };

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', cost: 5.99, estimated: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', cost: 14.99, estimated: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', cost: 24.99, estimated: 'Next business day' }
  ];

  const selectedShipping = shippingMethods.find(method => method.id === formData.shippingMethod);
  const totalWithShipping = totalAmount + (selectedShipping?.cost || 0);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">1. Cart</div>
            <div className="step active">2. Information</div>
            <div className="step active">3. Payment</div>
            <div className="step">4. Confirmation</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-left">
              {/* Contact Information */}
              <section className="checkout-section">
                <h2>Contact Information</h2>
                <div className="form-row">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </div>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                />
              </section>

              {/* Shipping Address */}
              <section className="checkout-section">
                <h2>Shipping Address</h2>
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  placeholder="Street address"
                />
                <div className="form-row">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="State/Province"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="ZIP/Postal Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </div>
              </section>

              {/* Shipping Method */}
              <section className="checkout-section">
                <h2>Shipping Method</h2>
                <div className="shipping-methods">
                  {shippingMethods.map(method => (
                    <div 
                      key={method.id} 
                      className={`shipping-method ${formData.shippingMethod === method.id ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, shippingMethod: method.id }))}
                    >
                      <div className="method-info">
                        <div className="method-name">{method.name}</div>
                        <div className="method-estimated">{method.estimated}</div>
                      </div>
                      <div className="method-cost">${method.cost.toFixed(2)}</div>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={formData.shippingMethod === method.id}
                        onChange={handleInputChange}
                        hidden
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Method */}
              <section className="checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleInputChange}
                    />
                    <span>Credit Card</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    <span>PayPal</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleInputChange}
                    />
                    <span>Bank Transfer</span>
                  </label>
                </div>

                {formData.paymentMethod === 'credit_card' && (
                  <div className="credit-card-form">
                    <Input
                      label="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      fullWidth
                    />
                    <div className="form-row">
                      <Input
                        label="Expiration Date (MM/YY)"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        fullWidth
                      />
                      <Input
                        label="CVC"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        placeholder="123"
                        fullWidth
                      />
                    </div>
                  </div>
                )}

                <div className="save-info">
                  <label>
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                    />
                    <span>Save this information for next time</span>
                  </label>
                </div>
              </section>
            </div>

            <div className="checkout-right">
              <div className="order-summary">
                <h2>Order Summary</h2>
                
                <div className="order-items">
                  {items.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <div className="item-name">{item.title}</div>
                        <div className="item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping ({selectedShipping?.name})</span>
                    <span>${selectedShipping?.cost.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Estimated Tax</span>
                    <span>${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${(totalWithShipping + (totalAmount * 0.08)).toFixed(2)}</span>
                  </div>
                </div>

                <div className="secure-checkout">
                  <div className="secure-badge">
                    🔒 Secure Checkout
                  </div>
                  <p className="secure-note">
                    Your payment information is encrypted and secure.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isProcessing}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>

                <p className="return-policy">
                  By placing your order, you agree to our{' '}
                  <a href="/terms">Terms of Service</a> and{' '}
                  <a href="/privacy">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;