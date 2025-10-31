import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Our T-Shirt Store</h1>
          <p className="hero-subtitle">
            Design your own custom t-shirts or explore our amazing collection
          </p>
          <div className="hero-actions">
            <Link to="/products/catalog" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/custom-design" className="btn btn-secondary">
              Custom Design
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Custom Designs</h3>
              <p>Create unique t-shirts with our easy-to-use design tools</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Get your orders delivered quickly anywhere</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Premium Quality</h3>
              <p>High-quality materials and printing techniques</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products Preview */}
      <section className="popular-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-preview">
            {/* You can add product preview cards here */}
            <div className="preview-placeholder">
              <p>Featured products will be displayed here</p>
              <Link to="/products/catalog" className="btn btn-outline">
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
