// src/pages/Admin/BrandManager/BrandManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";
import brandService from "../../../services/api/brandService";
import Button from "../../../components/common/Button/Button";
import Modal from "../../../components/common/Modal/Modal";
import Input from "../../../components/common/Input/Input";
import Card from "../../../components/common/Card/Card";
import Pagination from "../../../components/common/Pagination/Pagination";
import LoadingSpinner from "../../../components/common/LoadingSpinner/LoadingSpinner";
import "./BrandManagement.css";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    logo_url: "",
    website: "",
    established_year: "",
    subdomain: "",
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  const itemsPerPage = 10;

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
      };

      const data = await brandService.getAllBrands(params);

      setBrands(data.brands || data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalCount || data.length || 0);
    } catch (err) {
      setError("Failed to load brands. Please try again.");
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await brandService.getAllBrands();
      const brandsList = data.brands || data;
      const uniqueCategories = [
        ...new Set((brandsList || []).map((brand) => brand.category)),
      ];
      setCategories(["all", ...uniqueCategories.filter(Boolean).sort()]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Brand name is required";
    if (!formData.category) errors.category = "Category is required";
    if (formData.website && !isValidUrl(formData.website)) {
      errors.website = "Please enter a valid URL";
    }
    if (formData.logo_url && !isValidUrl(formData.logo_url)) {
      errors.logo_url = "Please enter a valid URL";
    }
    if (formData.established_year) {
      const year = parseInt(formData.established_year);
      if (year < 1900 || year > new Date().getFullYear()) {
        errors.established_year = "Please enter a valid year";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleCreateBrand = async () => {
    if (!validateForm()) return;

    try {
      const brandData = {
        ...formData,
        established_year: formData.established_year
          ? parseInt(formData.established_year)
          : null,
      };

      const newBrand = await brandService.createBrand(brandData);
      setBrands((prev) => [newBrand, ...prev]);
      setShowCreateModal(false);
      resetForm();
      alert("Brand created successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create brand");
    }
  };

  const handleEditBrand = (brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      category: brand.category,
      logo_url: brand.logo_url || "",
      website: brand.website || "",
      established_year: brand.established_year || "",
      subdomain: brand.subdomain || "",
      is_active: brand.is_active,
    });
    setShowEditModal(true);
  };

  const handleUpdateBrand = async () => {
    if (!validateForm()) return;

    try {
      const brandData = {
        ...formData,
        established_year: formData.established_year
          ? parseInt(formData.established_year)
          : null,
      };

      const updatedBrand = await brandService.updateBrand(
        selectedBrand.id,
        brandData
      );
      setBrands((prev) =>
        prev.map((brand) =>
          brand.id === selectedBrand.id ? updatedBrand : brand
        )
      );
      setShowEditModal(false);
      setSelectedBrand(null);
      resetForm();
      alert("Brand updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update brand");
    }
  };

  const handleDeleteBrand = (brand) => {
    setSelectedBrand(brand);
    setShowDeleteModal(true);
  };

  const confirmDeleteBrand = async () => {
    try {
      await brandService.deleteBrand(selectedBrand.id);
      setBrands((prev) =>
        prev.filter((brand) => brand.id !== selectedBrand.id)
      );
      setShowDeleteModal(false);
      setSelectedBrand(null);
      alert("Brand deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete brand");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      logo_url: "",
      website: "",
      established_year: "",
      subdomain: "",
      is_active: true,
    });
    setFormErrors({});
  };

  const exportBrands = () => {
    const csvContent = [
      ["ID", "Name", "Category", "Status", "Products", "Created At"],
      ...brands.map((brand) => [
        brand.id,
        `"${brand.name}"`,
        brand.category,
        brand.is_active ? "Active" : "Inactive",
        brand.products_count || 0,
        new Date(brand.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brands_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading && brands.length === 0) {
    return (
      <div className="brand-management-loading">
        <LoadingSpinner size="large" />
        <p>Loading brands...</p>
      </div>
    );
  }

  return (
    <div className="brand-management">
      <Helmet>
        <title>Brand Management | Admin Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="management-header">
        <div className="header-content">
          <h1>Brand Management</h1>
          <p className="subtitle">
            Manage all brands in the platform ({totalItems} total)
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={<Plus size={18} />}
          >
            Add New Brand
          </Button>
          <Button
            variant="outline"
            onClick={exportBrands}
            icon={<Download size={18} />}
          >
            Export
          </Button>
          <Button
            variant="ghost"
            onClick={fetchBrands}
            icon={<RefreshCw size={18} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="search-filter">
            <Search className="search-icon" size={20} />
            <Input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <Filter className="filter-icon" size={20} />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div className="status-filter">
            <select className="status-select" defaultValue="all">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Brands Table */}
      <Card className="brands-table-card">
        {error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <Button onClick={fetchBrands}>Retry</Button>
          </div>
        ) : brands.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h3>No Brands Found</h3>
            <p>Try adjusting your search or add a new brand.</p>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={<Plus size={18} />}
            >
              Add Your First Brand
            </Button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="brands-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Products</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id}>
                      <td className="brand-id">#{brand.id}</td>
                      <td className="brand-info-cell">
                        <div className="brand-info">
                          {brand.logo_url && (
                            <img
                              src={brand.logo_url}
                              alt={brand.name}
                              className="brand-logo-small"
                            />
                          )}
                          <div className="brand-details">
                            <div className="brand-name">{brand.name}</div>
                            {brand.subdomain && (
                              <div className="brand-subdomain">
                                {brand.subdomain}.lvh.me
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{brand.category}</span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            brand.is_active ? "active" : "inactive"
                          }`}
                        >
                          {brand.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="products-count">
                        {brand.products_count || 0}
                      </td>
                      <td className="created-date">
                        {new Date(brand.created_at).toLocaleDateString()}
                      </td>
                      <td className="action-buttons">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBrand(brand)}
                          icon={<Edit size={16} />}
                          title="Edit"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBrand(brand)}
                          icon={<Trash2 size={16} />}
                          title="Delete"
                          className="delete-btn"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="table-pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
                <div className="pagination-info">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} brands
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create Brand Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Brand"
        size="lg"
      >
        <div className="brand-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="required">
                Brand Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                error={formErrors.name}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="required">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-select ${formErrors.category ? "error" : ""}`}
              >
                <option value="">Select category</option>
                <option value="clothing">Clothing</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="sports">Sports</option>
                <option value="music">Music</option>
                <option value="art">Art</option>
                <option value="technology">Technology</option>
                <option value="gaming">Gaming</option>
                <option value="other">Other</option>
              </select>
              {formErrors.category && (
                <div className="error-message">{formErrors.category}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter brand description"
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo_url">Logo URL</label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                error={formErrors.logo_url}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                error={formErrors.website}
              />
            </div>

            <div className="form-group">
              <label htmlFor="established_year">Established Year</label>
              <Input
                id="established_year"
                name="established_year"
                type="number"
                value={formData.established_year}
                onChange={handleInputChange}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
                error={formErrors.established_year}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subdomain">Subdomain</label>
              <Input
                id="subdomain"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleInputChange}
                placeholder="brand-name"
                addonBefore="https://"
                addonAfter=".lvh.me:3004"
              />
              <div className="helper-text">
                Auto-generated from brand name if left empty
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                Active Brand
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateBrand}
              icon={<Plus size={18} />}
            >
              Create Brand
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Brand Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBrand(null);
          resetForm();
        }}
        title={`Edit Brand: ${selectedBrand?.name}`}
        size="lg"
      >
        <div className="brand-form">
          <div className="form-grid">
            {/* Same form fields as create modal */}
            <div className="form-group">
              <label htmlFor="edit-name" className="required">
                Brand Name
              </label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-category" className="required">
                Category
              </label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-select ${formErrors.category ? "error" : ""}`}
              >
                <option value="">Select category</option>
                <option value="clothing">Clothing</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="sports">Sports</option>
                <option value="music">Music</option>
                <option value="art">Art</option>
                <option value="technology">Technology</option>
                <option value="gaming">Gaming</option>
                <option value="other">Other</option>
              </select>
              {formErrors.category && (
                <div className="error-message">{formErrors.category}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-logo_url">Logo URL</label>
              <Input
                id="edit-logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                error={formErrors.logo_url}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-website">Website</label>
              <Input
                id="edit-website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                error={formErrors.website}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-established_year">Established Year</label>
              <Input
                id="edit-established_year"
                name="established_year"
                type="number"
                value={formData.established_year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                error={formErrors.established_year}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-subdomain">Subdomain</label>
              <Input
                id="edit-subdomain"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleInputChange}
                addonBefore="https://"
                addonAfter=".lvh.me:3004"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                Active Brand
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setSelectedBrand(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateBrand}
              icon={<Edit size={18} />}
            >
              Update Brand
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBrand(null);
        }}
        title="Delete Brand"
        size="md"
      >
        <div className="delete-confirmation">
          <div className="warning-icon">⚠️</div>
          <h3>Delete {selectedBrand?.name}?</h3>
          <p className="warning-text">
            Are you sure you want to delete this brand? This action cannot be
            undone.
          </p>
          <p className="warning-details">
            All products associated with this brand will be affected.
          </p>

          <div className="brand-info-summary">
            <div className="summary-item">
              <span className="summary-label">Brand ID:</span>
              <span className="summary-value">#{selectedBrand?.id}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Products:</span>
              <span className="summary-value">
                {selectedBrand?.products_count || 0}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Status:</span>
              <span
                className={`summary-value ${
                  selectedBrand?.is_active ? "active" : "inactive"
                }`}
              >
                {selectedBrand?.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedBrand(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteBrand}
              icon={<Trash2 size={18} />}
            >
              Delete Brand
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BrandManagement;
