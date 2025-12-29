// src/components/brands/BrandDetail/BrandDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../../services/api/apiClient";
import LoadingSpinner from "../../../components/common/LoadingSpinner/LoadingSpinner";
import ProductCard from "../../../components/products/ProductCard"; // Import ProductCard directly
import "./BrandDetail.css";

const BrandDetail = () => {
  const { brandId } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch brand details
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get(`/brands/${brandId}`);
        
        if (response.data) {
          setBrand(response.data);
          
          // If brand has products included in response
          if (response.data.products) {
            setProducts(response.data.products);
          }
        } else {
          setError("Brand not found");
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError(err.response?.data?.message || "Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchBrand();
    } else {
      setError("No brand ID provided");
      setLoading(false);
    }
  }, [brandId]);

  // Fetch brand products separately if needed
  useEffect(() => {
   const fetchBrandProducts = async () => {
  if (!brandId || products.length > 0) return;
  
  try {
    // Change from /brands/${brandId}/products to /products/brand/${brandId}
    const response = await apiClient.get(`/products/brand/${brandId}`);
    if (response.data) {
      // Check if response has 'products' key or is the array directly
      if (response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts(response.data); // If response is array directly
      }
    }
  } catch (err) {
    console.error("Error fetching brand products:", err);
  }
};

    if (brand && products.length === 0) {
      fetchBrandProducts();
    }
  }, [brand, brandId, products.length]);

  if (loading) {
    return (
      <div className="brand-detail-loading">
        <LoadingSpinner />
        <p>Loading brand details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-detail-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Brand</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
          <Link to="/brands" className="btn btn-outline">
            Browse All Brands
          </Link>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="brand-not-found">
        <h2>Brand Not Found</h2>
        <p>The brand you're looking for doesn't exist or has been removed.</p>
        <Link to="/brands" className="btn btn-primary">
          View All Brands
        </Link>
      </div>
    );
  }

  // Simple product grid component
  const ProductGrid = ({ products }) => (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <div className="brand-detail">
      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-hero">
          {brand.banner_url ? (
            <img 
              src={brand.banner_url} 
              alt={`${brand.name} banner`} 
              className="brand-banner"
            />
          ) : (
            <div className="brand-banner-placeholder">
              <div className="placeholder-content">
                <h1>{brand.name}</h1>
              </div>
            </div>
          )}
        </div>
        
        <div className="brand-info-card">
          <div className="brand-logo-container">
            {brand.logo_url ? (
              <img 
                src={brand.logo_url} 
                alt={`${brand.name} logo`} 
                className="brand-logo"
              />
            ) : (
              <div className="brand-logo-placeholder">
                {brand.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="brand-meta">
            <h1 className="brand-name">{brand.name}</h1>
            {brand.tagline && (
              <p className="brand-tagline">{brand.tagline}</p>
            )}
            
            <div className="brand-stats">
              {brand.products_count !== undefined && (
                <div className="stat">
                  <span className="stat-number">{brand.products_count}</span>
                  <span className="stat-label">Products</span>
                </div>
              )}
              {brand.followers_count !== undefined && (
                <div className="stat">
                  <span className="stat-number">{brand.followers_count}</span>
                  <span className="stat-label">Followers</span>
                </div>
              )}
            </div>
            
            <div className="brand-actions">
              <button className="btn btn-primary">
                Follow Brand
              </button>
              <button className="btn btn-outline">
                Contact Brand
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Content */}
      <div className="brand-content">
        <div className="brand-main">
          {/* About Section */}
          {brand.description && (
            <section className="brand-about">
              <h2>About {brand.name}</h2>
              <div className="brand-description">
                {brand.description}
              </div>
            </section>
          )}

          {/* Products Section */}
          <section className="brand-products">
            <div className="section-header">
              <h2>Products by {brand.name}</h2>
              {products.length > 0 && (
                <span className="product-count">
                  {products.length} products
                </span>
              )}
            </div>
            
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="no-products">
                <p>No products available from this brand yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="brand-sidebar">
          {/* Contact Info */}
          {(brand.website || brand.email || brand.phone) && (
            <div className="sidebar-section">
              <h3>Contact Info</h3>
              <ul className="contact-list">
                {brand.website && (
                  <li>
                    <a 
                      href={brand.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      🌐 Website
                    </a>
                  </li>
                )}
                {brand.email && (
                  <li>
                    <a 
                      href={`mailto:${brand.email}`}
                      className="contact-link"
                    >
                      ✉️ Email
                    </a>
                  </li>
                )}
                {brand.phone && (
                  <li>
                    <a 
                      href={`tel:${brand.phone}`}
                      className="contact-link"
                    >
                      📞 {brand.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Social Links */}
          {brand.social_links && Object.keys(brand.social_links).length > 0 && (
            <div className="sidebar-section">
              <h3>Follow on Social</h3>
              <div className="social-links">
                {brand.social_links.instagram && (
                  <a 
                    href={brand.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link instagram"
                  >
                    Instagram
                  </a>
                )}
                {brand.social_links.twitter && (
                  <a 
                    href={brand.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link twitter"
                  >
                    Twitter
                  </a>
                )}
                {brand.social_links.facebook && (
                  <a 
                    href={brand.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link facebook"
                  >
                    Facebook
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Brand Stats */}
          <div className="sidebar-section">
            <h3>Brand Details</h3>
            <ul className="brand-details-list">
              {brand.category && (
                <li>
                  <strong>Category:</strong> {brand.category}
                </li>
              )}
              {brand.established && (
                <li>
                  <strong>Established:</strong> {brand.established}
                </li>
              )}
              {brand.location && (
                <li>
                  <strong>Location:</strong> {brand.location}
                </li>
              )}
              {brand.created_at && (
                <li>
                  <strong>On Platform Since:</strong>{" "}
                  {new Date(brand.created_at).toLocaleDateString()}
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BrandDetail;