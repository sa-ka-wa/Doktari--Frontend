// src/pages/Admin/Products/ProductManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../services/api/productService';
import  brandService  from '../../../services/api/brandService';
import  LoadingSpinner  from '../../../components/common/LoadingSpinner';
import  Button  from '../../../components/common/Button';
import  Modal  from '../../../components/common/Modal';
import  Input  from '../../../components/common/Input';
import  Card  from '../../../components/common/Card';
import  Pagination  from '../../../components/common/Pagination';
import './ProductManagement.css';

// Simple SVG icons
const Icons = {
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Filter: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Package: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  Cube: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
};

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    price: '',
    category: 'tshirts',
    product_type: 'clothing',
    style_tag: 'artsy',
    artist: '',
    size: 'S,M,L,XL',
    color: 'Black,White,Gray',
    material: 'Cotton',
    stock_quantity: '0',
    brand_id: '',
    has_3d_model: false,
    model_3d_url: '',
    model_scale: '1.0',
    model_position: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [stockQuantity, setStockQuantity] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory, selectedBrand, selectedStatus]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        brand_id: selectedBrand !== 'all' ? selectedBrand : undefined,
        is_active: selectedStatus !== 'all' ? (selectedStatus === 'active') : undefined
      };

      const data = await productService.getProducts(params);
      
      setProducts(data.products || data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalCount || data.length || 0);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, selectedBrand, selectedStatus]);

  const fetchBrands = async () => {
    try {
      const data = await brandService.getAllBrands();
      setBrands(['all', ...data.map(brand => ({ id: brand.id, name: brand.name }))]);
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const fetchCategories = () => {
    const categoryList = [
      'all', 'tshirts', 'hoodies', 'hats', 'stickers', 
      'accessories', 'bandanas', 'caps', 'pants', 'jackets'
    ];
    setCategories(categoryList);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Product title is required';
    if (!formData.image_url.trim()) errors.image_url = 'Image URL is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.product_type) errors.product_type = 'Product type is required';
    if (!formData.style_tag) errors.style_tag = 'Style tag is required';
    if (!formData.brand_id) errors.brand_id = 'Brand is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) return;

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        brand_id: parseInt(formData.brand_id),
        model_scale: parseFloat(formData.model_scale) || 1.0,
        model_position: formData.model_position ? JSON.parse(formData.model_position) : null
      };

      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      setShowCreateModal(false);
      resetForm();
      alert('Product created successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create product');
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      image_url: product.image_url,
      price: product.price.toString(),
      category: product.category,
      product_type: product.product_type,
      style_tag: product.style_tag,
      artist: product.artist || '',
      size: product.size || 'S,M,L,XL',
      color: product.color || 'Black,White,Gray',
      material: product.material || 'Cotton',
      stock_quantity: product.stock_quantity.toString(),
      brand_id: product.brand_id?.toString() || '',
      has_3d_model: product.has_3d_model || false,
      model_3d_url: product.model_3d_url || '',
      model_scale: product.model_scale?.toString() || '1.0',
      model_position: product.model_position ? JSON.stringify(product.model_position) : '',
      is_active: product.is_active
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!validateForm()) return;

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        brand_id: parseInt(formData.brand_id),
        model_scale: parseFloat(formData.model_scale) || 1.0,
        model_position: formData.model_position ? JSON.parse(formData.model_position) : null
      };

      const updatedProduct = await productService.updateProduct(selectedProduct.id, productData);
      setProducts(prev => prev.map(product => 
        product.id === selectedProduct.id ? updatedProduct : product
      ));
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
      alert('Product updated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update product');
    }
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await productService.deleteProduct(selectedProduct.id);
      setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
      setShowDeleteModal(false);
      setSelectedProduct(null);
      alert('Product deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setStockQuantity(product.stock_quantity.toString());
    setShowStockModal(true);
  };

  const confirmUpdateStock = async () => {
    try {
      const quantity = parseInt(stockQuantity) || 0;
      await productService.updateStock(selectedProduct.id, quantity);
      
      setProducts(prev => prev.map(product => 
        product.id === selectedProduct.id 
          ? { ...product, stock_quantity: quantity }
          : product
      ));
      
      setShowStockModal(false);
      setSelectedProduct(null);
      setStockQuantity('');
      alert('Stock updated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update stock');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/detail/${productId}`);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      price: '',
      category: 'tshirts',
      product_type: 'clothing',
      style_tag: 'artsy',
      artist: '',
      size: 'S,M,L,XL',
      color: 'Black,White,Gray',
      material: 'Cotton',
      stock_quantity: '0',
      brand_id: '',
      has_3d_model: false,
      model_3d_url: '',
      model_scale: '1.0',
      model_position: '',
      is_active: true
    });
    setFormErrors({});
  };

  const exportProducts = () => {
    const csvContent = [
      ['ID', 'Title', 'Brand', 'Category', 'Price', 'Stock', 'Status', 'Created At'],
      ...products.map(product => [
        product.id,
        `"${product.title}"`,
        product.brand_name || 'N/A',
        product.category,
        product.price,
        product.stock_quantity,
        product.is_active ? 'Active' : 'Inactive',
        new Date(product.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading && products.length === 0) {
    return (
      <div className="product-management-loading">
        <LoadingSpinner size="large" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-management">
      {/* Set page title */}
      <title>Product Management | Admin Dashboard</title>

      {/* Header */}
      <div className="management-header">
        <div className="header-content">
          <h1>Product Management</h1>
          <p className="subtitle">
            Manage all products in the platform ({totalItems} total)
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={<Icons.Plus />}
          >
            Add New Product
          </Button>
          <Button
            variant="outline"
            onClick={exportProducts}
            icon={<Icons.Download />}
          >
            Export
          </Button>
          <Button
            variant="ghost"
            onClick={fetchProducts}
            icon={<Icons.Refresh />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="search-filter">
            <Icons.Search />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label>Brand:</label>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="filter-select"
            >
              <option value="all">All Brands</option>
              {brands.filter(b => b !== 'all').map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label>Status:</label>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="products-table-card">
        {error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <Button onClick={fetchProducts}>Retry</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Products Found</h3>
            <p>Try adjusting your search or add a new product.</p>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={<Icons.Plus />}
            >
              Add Your First Product
            </Button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>3D</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="product-id">#{product.id}</td>
                      <td className="product-info-cell">
                        <div className="product-info">
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            className="product-image-small"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="%23e5e7eb"><rect width="24" height="24" rx="4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="8" fill="%239ca3af">No Image</text></svg>';
                            }}
                          />
                          <div className="product-details">
                            <div className="product-title">{product.title}</div>
                            {product.artist && (
                              <div className="product-artist">by {product.artist}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="brand-badge">{product.brand_name || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td className="product-price">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="stock-cell">
                        <div className="stock-info">
                          <span className={`stock-indicator ${product.stock_quantity > 10 ? 'in-stock' : product.stock_quantity > 0 ? 'low-stock' : 'out-of-stock'}`}></span>
                          <span className="stock-count">{product.stock_quantity}</span>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleUpdateStock(product)}
                            className="update-stock-btn"
                          >
                            Update
                          </Button>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {product.has_3d_model ? (
                          <span className="model-badge" title="3D Model Available">
                            <Icons.Cube />
                          </span>
                        ) : (
                          <span className="no-model">-</span>
                        )}
                      </td>
                      <td className="created-date">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="action-buttons">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProduct(product.id)}
                          icon={<Icons.Eye />}
                          title="View"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          icon={<Icons.Edit />}
                          title="Edit"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                          icon={<Icons.Trash />}
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create Product Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Product"
        size="xl"
      >
        <div className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title" className="required">
                Product Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
                error={formErrors.title}
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand_id" className="required">
                Brand
              </label>
              <select
                id="brand_id"
                name="brand_id"
                value={formData.brand_id}
                onChange={handleInputChange}
                className={`form-select ${formErrors.brand_id ? 'error' : ''}`}
              >
                <option value="">Select brand</option>
                {brands.filter(b => b !== 'all').map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {formErrors.brand_id && (
                <div className="error-message">{formErrors.brand_id}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image_url" className="required">
                Image URL
              </label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                error={formErrors.image_url}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="required">
                Price ($)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="29.99"
                min="0.01"
                step="0.01"
                error={formErrors.price}
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
                className={`form-select ${formErrors.category ? 'error' : ''}`}
              >
                <option value="tshirts">T-Shirts</option>
                <option value="hoodies">Hoodies</option>
                <option value="hats">Hats</option>
                <option value="stickers">Stickers</option>
                <option value="accessories">Accessories</option>
                <option value="bandanas">Bandanas</option>
                <option value="caps">Caps</option>
                <option value="pants">Pants</option>
                <option value="jackets">Jackets</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="product_type" className="required">
                Product Type
              </label>
              <select
                id="product_type"
                name="product_type"
                value={formData.product_type}
                onChange={handleInputChange}
                className={`form-select ${formErrors.product_type ? 'error' : ''}`}
              >
                <option value="clothing">Clothing</option>
                <option value="accessory">Accessory</option>
                <option value="digital">Digital</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="style_tag" className="required">
                Style Tag
              </label>
              <select
                id="style_tag"
                name="style_tag"
                value={formData.style_tag}
                onChange={handleInputChange}
                className={`form-select ${formErrors.style_tag ? 'error' : ''}`}
              >
                <option value="artsy">Artsy</option>
                <option value="afrobeat">Afrobeat</option>
                <option value="rock">Rock</option>
                <option value="hiphop">Hip Hop</option>
                <option value="streetwear">Streetwear</option>
                <option value="vintage">Vintage</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artist</label>
              <Input
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                placeholder="Enter artist name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="size">Sizes (comma separated)</label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="S,M,L,XL,XXL"
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Colors (comma separated)</label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Black,White,Red,Blue"
              />
            </div>

            <div className="form-group">
              <label htmlFor="material">Material</label>
              <Input
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="100% Cotton"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock_quantity">Stock Quantity</label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_3d_model"
                  checked={formData.has_3d_model}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                Has 3D Model
              </label>
            </div>

            {formData.has_3d_model && (
              <>
                <div className="form-group">
                  <label htmlFor="model_3d_url">3D Model URL</label>
                  <Input
                    id="model_3d_url"
                    name="model_3d_url"
                    value={formData.model_3d_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/model.glb"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model_scale">Model Scale</label>
                  <Input
                    id="model_scale"
                    name="model_scale"
                    type="number"
                    value={formData.model_scale}
                    onChange={handleInputChange}
                    placeholder="1.0"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model_position">Model Position (JSON)</label>
                  <Input
                    id="model_position"
                    name="model_position"
                    value={formData.model_position}
                    onChange={handleInputChange}
                    placeholder='{"x": 0, "y": 0, "z": 0}'
                  />
                </div>
              </>
            )}

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
                Active Product
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
              onClick={handleCreateProduct}
              icon={<Icons.Plus />}
            >
              Create Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
          resetForm();
        }}
        title={`Edit Product: ${selectedProduct?.title}`}
        size="xl"
      >
        <div className="product-form">
          <div className="form-grid">
            {/* Same form fields as create modal */}
            <div className="form-group">
              <label htmlFor="edit-title" className="required">
                Product Title
              </label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={formErrors.title}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-brand_id" className="required">
                Brand
              </label>
              <select
                id="edit-brand_id"
                name="brand_id"
                value={formData.brand_id}
                onChange={handleInputChange}
                className={`form-select ${formErrors.brand_id ? 'error' : ''}`}
              >
                <option value="">Select brand</option>
                {brands.filter(b => b !== 'all').map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {formErrors.brand_id && (
                <div className="error-message">{formErrors.brand_id}</div>
              )}
            </div>

            {/* ... include all other form fields from create modal ... */}
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
              <label htmlFor="edit-image_url" className="required">
                Image URL
              </label>
              <Input
                id="edit-image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                error={formErrors.image_url}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-price" className="required">
                Price ($)
              </label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                error={formErrors.price}
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
                className={`form-select ${formErrors.category ? 'error' : ''}`}
              >
                <option value="tshirts">T-Shirts</option>
                <option value="hoodies">Hoodies</option>
                <option value="hats">Hats</option>
                <option value="stickers">Stickers</option>
                <option value="accessories">Accessories</option>
                <option value="bandanas">Bandanas</option>
                <option value="caps">Caps</option>
                <option value="pants">Pants</option>
                <option value="jackets">Jackets</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-product_type" className="required">
                Product Type
              </label>
              <select
                id="edit-product_type"
                name="product_type"
                value={formData.product_type}
                onChange={handleInputChange}
                className={`form-select ${formErrors.product_type ? 'error' : ''}`}
              >
                <option value="clothing">Clothing</option>
                <option value="accessory">Accessory</option>
                <option value="digital">Digital</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-style_tag" className="required">
                Style Tag
              </label>
              <select
                id="edit-style_tag"
                name="style_tag"
                value={formData.style_tag}
                onChange={handleInputChange}
                className={`form-select ${formErrors.style_tag ? 'error' : ''}`}
              >
                <option value="artsy">Artsy</option>
                <option value="afrobeat">Afrobeat</option>
                <option value="rock">Rock</option>
                <option value="hiphop">Hip Hop</option>
                <option value="streetwear">Streetwear</option>
                <option value="vintage">Vintage</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-artist">Artist</label>
              <Input
                id="edit-artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-size">Sizes</label>
              <Input
                id="edit-size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-color">Colors</label>
              <Input
                id="edit-color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-material">Material</label>
              <Input
                id="edit-material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-stock_quantity">Stock Quantity</label>
              <Input
                id="edit-stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_3d_model"
                  checked={formData.has_3d_model}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                Has 3D Model
              </label>
            </div>

            {formData.has_3d_model && (
              <>
                <div className="form-group">
                  <label htmlFor="edit-model_3d_url">3D Model URL</label>
                  <Input
                    id="edit-model_3d_url"
                    name="model_3d_url"
                    value={formData.model_3d_url}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-model_scale">Model Scale</label>
                  <Input
                    id="edit-model_scale"
                    name="model_scale"
                    type="number"
                    value={formData.model_scale}
                    onChange={handleInputChange}
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-model_position">Model Position (JSON)</label>
                  <Input
                    id="edit-model_position"
                    name="model_position"
                    value={formData.model_position}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

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
                Active Product
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setSelectedProduct(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateProduct}
              icon={<Icons.Edit />}
            >
              Update Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        title="Delete Product"
        size="md"
      >
        <div className="delete-confirmation">
          <div className="warning-icon">⚠️</div>
          <h3>Delete {selectedProduct?.title}?</h3>
          <p className="warning-text">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <p className="warning-details">
            All orders associated with this product will be affected.
          </p>
          
          <div className="product-info-summary">
            <div className="summary-item">
              <span className="summary-label">Product ID:</span>
              <span className="summary-value">#{selectedProduct?.id}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Brand:</span>
              <span className="summary-value">{selectedProduct?.brand_name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Price:</span>
              <span className="summary-value">${selectedProduct?.price?.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Stock:</span>
              <span className="summary-value">{selectedProduct?.stock_quantity}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Status:</span>
              <span className={`summary-value ${selectedProduct?.is_active ? 'active' : 'inactive'}`}>
                {selectedProduct?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteProduct}
              icon={<Icons.Trash />}
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => {
          setShowStockModal(false);
          setSelectedProduct(null);
          setStockQuantity('');
        }}
        title="Update Stock"
        size="sm"
      >
        <div className="stock-update">
          <p>Update stock quantity for <strong>{selectedProduct?.title}</strong></p>
          
          <div className="current-stock">
            Current Stock: <span className="stock-count">{selectedProduct?.stock_quantity}</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="new-stock">New Stock Quantity:</label>
            <Input
              id="new-stock"
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              min="0"
              placeholder="Enter new quantity"
            />
          </div>
          
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setShowStockModal(false);
                setSelectedProduct(null);
                setStockQuantity('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmUpdateStock}
            >
              Update Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;