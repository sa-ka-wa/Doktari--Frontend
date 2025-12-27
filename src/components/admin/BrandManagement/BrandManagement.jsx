// components/admin/BrandManagement/BrandManagement.jsx
import React, { useState } from "react";
import brandService from "../../../services/api/brandService";
import "./BrandManagement.css";

const BrandManagement = ({ brands, onBrandsUpdate, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "general",
    description: "",
    established_year: "",
    logo_url: "",
    website: "",
    subdomain: "",
  });

  // Permission checks
  const isSuperAdmin = currentUser?.role === "super_admin";
  const isAdmin = currentUser?.role === "admin";
  const currentUserBrandId = currentUser?.brand_id;

  // Check if user can edit a specific brand
  const canEditBrand = (brand) => {
    if (isSuperAdmin) return true;
    if (isAdmin && brand.id === currentUserBrandId) return true;
    return false;
  };

  // Check if user can delete a specific brand
  const canDeleteBrand = (brand) => {
    if (!isSuperAdmin) return false;
    // Super admin can only delete brands with no products or users
    return brand.products_count === 0 && brand.users_count === 0;
  };

  // Check if user can create brands
  const canCreateBrand = isSuperAdmin;

  // Open form for new brand
  const handleNewBrand = () => {
    if (!canCreateBrand) {
      alert("You do not have permission to create brands");
      return;
    }

    setFormData({
      name: "",
      category: "general",
      description: "",
      established_year: "",
      logo_url: "",
      website: "",
      subdomain: "",
    });
    setEditingBrand(null);
    setShowForm(true);
  };

  // Open form for editing brand
  const handleEditBrand = (brand) => {
    if (!canEditBrand(brand)) {
      alert("You do not have permission to edit this brand");
      return;
    }

    setFormData({
      name: brand.name || "",
      category: brand.category || "general",
      description: brand.description || "",
      established_year: brand.established_year || "",
      logo_url: brand.logo_url || "",
      website: brand.website || "",
      subdomain: brand.subdomain || "",
    });
    setEditingBrand(brand);
    setShowForm(true);
  };

  // View brand details
  const handleViewBrand = (brand) => {
    setSelectedBrand(brand);
    setShowDetails(true);
  };

  // Handle brand card click
  const handleBrandClick = (brand) => {
    handleViewBrand(brand);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate subdomain from name (only for new brands)
    if (name === "name" && !editingBrand) {
      const generatedSubdomain = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, subdomain: generatedSubdomain }));
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploadingLogo(true);
    try {
      // In a real app, upload to your server and get URL
      // For demo, we'll use base64
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, logo_url: e.target.result }));
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Failed to upload logo");
      setUploadingLogo(false);
    }
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double-check permissions
    if (editingBrand && !canEditBrand(editingBrand)) {
      alert("You do not have permission to edit this brand");
      return;
    }

    if (!editingBrand && !canCreateBrand) {
      alert("You do not have permission to create brands");
      return;
    }

    setLoading(true);
    try {
      if (editingBrand) {
        console.log("📤 Updating brand:", editingBrand.id, formData);
        await brandService.updateBrand(editingBrand.id, formData);
      } else {
        console.log("📤 Creating new brand:", formData);
        await brandService.createBrand(formData);
      }
      setShowForm(false);
      onBrandsUpdate(); // Refresh the brands list
    } catch (err) {
      console.error("❌ Error saving brand:", err);
      alert(
        `Failed to save brand: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete brand
  const handleDelete = async (brandId, brandName) => {
    const brand = brands.find((b) => b.id === brandId);
    if (!brand) return;

    if (!canDeleteBrand(brand)) {
      alert("You do not have permission to delete this brand");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete the brand "${brandName}"? This action cannot be undone.`
      )
    )
      return;

    setLoading(true);
    try {
      console.log("🗑️ Deleting brand:", brandId);
      await brandService.deleteBrand(brandId);
      onBrandsUpdate(); // Refresh the brands list
    } catch (err) {
      console.error("❌ Error deleting brand:", err);
      alert(
        `Failed to delete brand: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Category options
  const categories = [
    "fashion",
    "sports",
    "lifestyle",
    "technology",
    "entertainment",
    "education",
    "health",
    "food",
    "travel",
    "general",
  ];

  // Get user's role badge
  const getUserRoleBadge = () => {
    switch (currentUser?.role) {
      case "super_admin":
        return <span className="role-badge super-admin">Super Admin</span>;
      case "admin":
        return <span className="role-badge admin">Admin</span>;
      default:
        return <span className="role-badge user">User</span>;
    }
  };

  return (
    <div className="brand-management">
      <div className="section-header">
        <div className="header-content">
          <h2>Brand Management ({brands.length} brands)</h2>
          <div className="user-info-header">
            {getUserRoleBadge()}
            {currentUser?.brand_name && (
              <span className="current-brand">
                Your Brand: {currentUser.brand_name}
              </span>
            )}
          </div>
        </div>

        {canCreateBrand && (
          <button
            className="btn btn-primary"
            onClick={handleNewBrand}
            disabled={loading}
          >
            {loading ? "Loading..." : "➕ Add New Brand"}
          </button>
        )}
      </div>

      {/* Permissions Info */}
      <div className="permissions-info">
        <div className="permission-item">
          <span className="permission-dot super-admin"></span>
          <span>Super Admin: Can create, edit, and delete all brands</span>
        </div>
        <div className="permission-item">
          <span className="permission-dot admin"></span>
          <span>Admin: Can only edit their assigned brand</span>
        </div>
        <div className="permission-item">
          <span className="permission-dot user"></span>
          <span>User: Can only view brands</span>
        </div>
      </div>

      <div className="brands-grid">
        {brands.map((brand) => {
          const userCanEdit = canEditBrand(brand);
          const userCanDelete = canDeleteBrand(brand);
          const isUsersBrand = brand.id === currentUserBrandId;

          return (
            <div
              key={brand.id}
              className={`brand-card ${isUsersBrand ? "users-brand" : ""} ${
                userCanEdit ? "editable" : ""
              }`}
              onClick={() => handleBrandClick(brand)}
            >
              {isUsersBrand && (
                <div className="brand-badge current">Your Brand</div>
              )}

              <div className="brand-header">
                <img
                  src={brand.logo_url || "/default-logo.svg"}
                  alt={brand.name}
                  className="brand-logo"
                  onError={(e) => {
                    e.target.src = "/default-logo.svg";
                  }}
                />
                <div className="brand-info">
                  <h3 className="brand-name">{brand.name}</h3>
                  <div className="brand-meta-tags">
                    <span className={`brand-category ${brand.category}`}>
                      {brand.category}
                    </span>
                    {brand.subdomain && (
                      <span className="brand-subdomain">
                        {brand.subdomain}.lvh.me
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="brand-description">
                {brand.description || "No description provided"}
              </div>

              <div className="brand-stats">
                <div className="stat">
                  <span className="stat-number">{brand.products_count}</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{brand.users_count}</span>
                  <span className="stat-label">Users</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {brand.established_year || "N/A"}
                  </span>
                  <span className="stat-label">Est.</span>
                </div>
              </div>

              <div className="brand-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewBrand(brand);
                  }}
                  className="btn btn-secondary btn-sm"
                  title="View brand details"
                >
                  👁️ View
                </button>

                {userCanEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBrand(brand);
                    }}
                    disabled={loading}
                    className="btn btn-primary btn-sm"
                    title="Edit brand"
                  >
                    ✏️ Edit
                  </button>
                )}

                {userCanDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(brand.id, brand.name);
                    }}
                    disabled={
                      loading ||
                      brand.products_count > 0 ||
                      brand.users_count > 0
                    }
                    className="btn btn-danger btn-sm"
                    title={
                      brand.products_count > 0 || brand.users_count > 0
                        ? "Cannot delete brand with products or users"
                        : "Delete brand"
                    }
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>

              <div className="brand-meta">
                <span className="created-date">
                  Created: {new Date(brand.created_at).toLocaleDateString()}
                </span>
                <span
                  className={`status ${
                    brand.is_active ? "active" : "inactive"
                  }`}
                >
                  {brand.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Permission indicator */}
              <div className="permission-indicator">
                {userCanEdit && (
                  <span className="permission-text">
                    You can edit this brand
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>{editingBrand ? "Edit Brand" : "Create New Brand"}</h3>
              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="brand-form">
              <div className="form-section">
                <h4>Basic Information</h4>

                <div className="form-group">
                  <label>Brand Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subdomain</label>
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    placeholder="your-brand"
                    disabled={loading || editingBrand} // Can't change subdomain after creation
                  />
                  <small>
                    Will be used for your brand's URL: {formData.subdomain}
                    .lvh.me
                  </small>
                </div>
              </div>

              <div className="form-section">
                <h4>Brand Logo</h4>

                <div className="logo-upload-section">
                  <div className="logo-preview">
                    <img
                      src={formData.logo_url || "/default-logo.svg"}
                      alt="Logo preview"
                      className="logo-preview-img"
                      onError={(e) => {
                        e.target.src = "/default-logo.svg";
                      }}
                    />
                  </div>

                  <div className="logo-upload">
                    <label className="file-upload-btn">
                      {uploadingLogo ? "Uploading..." : "📁 Upload Logo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={loading || uploadingLogo}
                        style={{ display: "none" }}
                      />
                    </label>
                    <small>PNG, JPG, SVG up to 5MB</small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Logo URL</label>
                  <input
                    type="url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Additional Information</h4>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your brand..."
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Established Year</label>
                    <input
                      type="number"
                      name="established_year"
                      value={formData.established_year}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="2020"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || uploadingLogo}
                >
                  {loading
                    ? "Saving..."
                    : editingBrand
                    ? "Update Brand"
                    : "Create Brand"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Details Modal */}
      {showDetails && selectedBrand && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Brand Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            <div className="brand-details">
              <div className="detail-section">
                <div className="detail-header">
                  <img
                    src={selectedBrand.logo_url || "/default-logo.svg"}
                    alt={selectedBrand.name}
                    className="detail-logo"
                  />
                  <div>
                    <h4>{selectedBrand.name}</h4>
                    <p className="detail-subdomain">
                      {selectedBrand.subdomain}.lvh.me
                    </p>
                  </div>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <label>Category</label>
                  <span>{selectedBrand.category}</span>
                </div>
                <div className="detail-item">
                  <label>Established</label>
                  <span>
                    {selectedBrand.established_year || "Not specified"}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Products</label>
                  <span>{selectedBrand.products_count}</span>
                </div>
                <div className="detail-item">
                  <label>Users</label>
                  <span>{selectedBrand.users_count}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description</label>
                  <p>
                    {selectedBrand.description || "No description provided"}
                  </p>
                </div>
                <div className="detail-item full-width">
                  <label>Website</label>
                  <a
                    href={selectedBrand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedBrand.website || "No website"}
                  </a>
                </div>
              </div>

              <div className="detail-actions">
                {canEditBrand(selectedBrand) && (
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      handleEditBrand(selectedBrand);
                    }}
                    className="btn btn-primary"
                  >
                    Edit Brand
                  </button>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;
