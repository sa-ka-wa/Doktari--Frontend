// src/components/orders/CheckoutForm/CheckoutForm.jsx
import React, { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import "./CheckoutForm.css";

const CheckoutForm = ({
  formData,
  onFormChange,
  onSubmit,
  isProcessing,
  user,
  isAuthenticated,
}) => {
  const [errors, setErrors] = useState({});

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      cost: 200,
      estimated: "3-5 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      cost: 500,
      estimated: "1-2 business days",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      cost: 1000,
      estimated: "Next business day",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "county",
      "postalCode",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^(?:254|\+254|0)?(7\d{8})$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Kenyan phone number";
    }

    if (formData.paymentMethod === "mpesa" && !formData.mpesaPhone) {
      newErrors.mpesaPhone = "Phone number is required for M-Pesa";
    } else if (
      formData.paymentMethod === "mpesa" &&
      formData.mpesaPhone &&
      !phoneRegex.test(formData.mpesaPhone)
    ) {
      newErrors.mpesaPhone =
        "Please enter a valid Kenyan phone number for M-Pesa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {/* Contact Information */}
      <section className="form-section">
        <h2>Contact Information</h2>
        <div className="form-row">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            required
            fullWidth
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
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
          error={errors.email}
          required
          fullWidth
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          placeholder="07XX XXX XXX"
          fullWidth
        />
      </section>

      {/* Shipping Address */}
      <section className="form-section">
        <h2>Shipping Address</h2>
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          error={errors.address}
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
            error={errors.city}
            required
            fullWidth
          />
          <Input
            label="County"
            name="county"
            value={formData.county}
            onChange={handleInputChange}
            error={errors.county}
            required
            fullWidth
            placeholder="e.g., Nairobi"
          />
        </div>
        <div className="form-row">
          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            error={errors.postalCode}
            required
            fullWidth
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            fullWidth
            disabled
          />
        </div>
      </section>

      {/* Shipping Method */}
      <section className="form-section">
        <h2>Shipping Method</h2>
        <div className="shipping-methods">
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              className={`shipping-method ${
                formData.shippingMethod === method.id ? "selected" : ""
              }`}
              onClick={() =>
                onFormChange((prev) => ({ ...prev, shippingMethod: method.id }))
              }
            >
              <div className="method-info">
                <div className="method-name">{method.name}</div>
                <div className="method-estimated">{method.estimated}</div>
              </div>
              <div className="method-cost">
                KSh {method.cost.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Method */}
      <section className="form-section">
        <h2>Payment Method</h2>
        <div className="payment-methods">
          <div className="payment-method selected">
            <input
              type="radio"
              id="mpesa"
              name="paymentMethod"
              value="mpesa"
              checked={formData.paymentMethod === "mpesa"}
              onChange={handleInputChange}
            />
            <label htmlFor="mpesa">
              <div className="method-icon">📱</div>
              <div className="method-details">
                <span className="method-name">M-Pesa</span>
                <span className="method-description">
                  Pay via M-Pesa STK Push
                </span>
              </div>
            </label>
          </div>
        </div>

        {formData.paymentMethod === "mpesa" && (
          <div className="payment-details">
            <Input
              label="M-Pesa Phone Number"
              name="mpesaPhone"
              value={formData.mpesaPhone}
              onChange={handleInputChange}
              error={errors.mpesaPhone}
              placeholder="07XX XXX XXX"
              required
              fullWidth
            />
            <div className="payment-instructions">
              <p>💡 You'll receive an M-Pesa prompt on this number</p>
              <p>💡 Enter your M-Pesa PIN to complete the payment</p>
            </div>
          </div>
        )}
      </section>

      {/* Additional Information */}
      <section className="form-section">
        <h2>Additional Information</h2>
        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleInputChange}
              disabled={!isAuthenticated}
            />
            <span>Save shipping information for future orders</span>
          </label>
        </div>
        <Input
          label="Order Notes (Optional)"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Special instructions for your order..."
          fullWidth
          multiline
          rows={3}
        />
      </section>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isProcessing}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Continue to Payment"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
