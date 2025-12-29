// src/components/brands/BrandDetail/BrandDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import  brandService from "../../../services/api/brandService";
import  LoadingSpinner  from "../../common/LoadingSpinner";
import  Button  from "../../common/Button";
import  Modal  from "../../common/Modal";
import ProductList from "../../products/ProductList";
import "./BrandDetail.css";

const BrandDetail = () => {
  const { brandId } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchBrand();
    // Check user role (implement your auth logic)
    checkUserRole();
  }, [brandId]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandService.getBrandById(brandId);
      setBrand(data);
      setEditForm(data);
    } catch (err) {
      setError("Failed to load brand details. Please try again.");
      console.error("Error fetching brand:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = () => {
    // Implement your role checking logic
    // For now, assume false or get from context
    setIsAdmin(false);
  };

  const handleEdit = async () => {
    try {
      const updatedBrand = await brandService.updateBrand(brandId, editForm);
      setBrand(updatedBrand);
      setShowEditModal(false);
      alert("Brand updated successfully!");
    } catch (err) {
      alert("Failed to update brand. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await brandService.deleteBrand(brandId);
      setShowDeleteModal(false);
      alert("Brand deleted successfully!");
      // Redirect to brands directory
      window.location.href = "/brands";
    } catch (err) {
      alert("Failed to delete brand. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="brand-detail-loading">
        <LoadingSpinner size="large" />
        <p>Loading brand details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-detail-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/brands">
          <Button>Back to Brands</Button>
        </Link>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="brand-detail-not-found">
        <h2>Brand Not Found</h2>
        <p>The brand you're looking for doesn't exist.</p>
        <Link to="/brands">
          <Button>Browse All Brands</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="brand-detail">
      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-header-content">
          {brand.logo_url && (
            <div className="brand-logo-large">
              <img src={brand.logo_url} alt={`${brand.name} logo`} />
            </div>
          )}

          <div className="brand-header-info">
            <h1 className="brand-title">{brand.name}</h1>

            <div className="brand-meta">
              {brand.category && (
                <span className="brand-category-badge">{brand.category}</span>
              )}
              {brand.established_year && (
                <span className="brand-year">
                  Est. {brand.established_year}
                </span>
              )}
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-website"
                >
                  Visit Website
                </a>
              )}
            </div>

            {isAdmin && (
              <div className="brand-admin-actions">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Brand
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Brand
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand Content */}
      <div className="brand-content">
        {brand.description && (
          <div className="brand-description-section">
            <h2>About {brand.name}</h2>
            <p className="brand-description-full">{brand.description}</p>
          </div>
        )}

        {/* Brand Products */}
        <div className="brand-products-section">
          <div className="section-header">
            <h2>Products by {brand.name}</h2>
            <span className="product-count">
              {brand.products_count || 0} products available
            </span>
          </div>
          <ProductList brandId={brandId} />
        </div>

        {/* Brand Stats */}
        <div className="brand-stats-section">
          <h2>Brand Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{brand.products_count || 0}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {brand.created_at
                  ? new Date(brand.created_at).getFullYear()
                  : "N/A"}
              </div>
              <div className="stat-label">Joined</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Brand"
        size="lg"
      >
        <div className="edit-brand-form">
          <div className="form-group">
            <label htmlFor="name">Brand Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editForm.name || ""}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editForm.description || ""}
              onChange={handleInputChange}
              rows="4"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={editForm.category || ""}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Category</option>
              <option value="clothing">Clothing</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="sports">Sports</option>
              <option value="music">Music</option>
              <option value="art">Art</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="logo_url">Logo URL</label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              value={editForm.logo_url || ""}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={editForm.website || ""}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="established_year">Established Year</label>
            <input
              type="number"
              id="established_year"
              name="established_year"
              value={editForm.established_year || ""}
              onChange={handleInputChange}
              className="form-input"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Brand"
        size="md"
      >
        <div className="delete-confirmation">
          <p className="warning-text">
            ⚠️ Are you sure you want to delete <strong>{brand.name}</strong>?
          </p>
          <p className="warning-detail">
            This action cannot be undone. All products associated with this
            brand will be removed.
          </p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Brand
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BrandDetail;
