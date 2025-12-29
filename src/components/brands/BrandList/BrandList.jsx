// src/components/brands/BrandList/BrandList.jsx
import React, { useState, useEffect } from "react";
import BrandCard from "../BrandCard";
import  LoadingSpinner  from "../../common/LoadingSpinner";
import  Pagination  from "../../common/Pagination";
import  SearchBar  from "../../common/SearchBar";
import  brandService  from "../../../services/api/brandService";
import "./BrandList.css";

const BrandList = ({
  brands: initialBrands,
  loading: initialLoading,
  showFilters = true,
  showPagination = true,
  itemsPerPage = 12,
  onBrandClick,
  isAdmin = false,
}) => {
  const [brands, setBrands] = useState(initialBrands || []);
  const [loading, setLoading] = useState(initialLoading || false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialBrands) {
      fetchBrands();
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialBrands) {
      setBrands(initialBrands);
    }
  }, [initialBrands]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandService.getAllBrands();
      setBrands(data);
    } catch (err) {
      setError("Failed to load brands. Please try again.");
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    // Extract unique categories from brands or fetch from API
    const uniqueCategories = [
      ...new Set(brands.map((brand) => brand.category)),
    ];
    setCategories(["all", ...uniqueCategories.filter(Boolean)]);
  };

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory && brand.is_active;
  });

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBrands = filteredBrands.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleEditBrand = (brand) => {
    // Navigate to edit page or open modal
    console.log("Edit brand:", brand);
  };

  const handleDeleteBrand = async (brandId) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await brandService.deleteBrand(brandId);
        setBrands(brands.filter((brand) => brand.id !== brandId));
      } catch (err) {
        alert("Failed to delete brand. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="brand-list-loading">
        <LoadingSpinner size="large" />
        <p>Loading brands...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-list-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Brands</h3>
        <p>{error}</p>
        <button onClick={fetchBrands} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (filteredBrands.length === 0 && !loading) {
    return (
      <div className="brand-list-empty">
        <div className="empty-icon">🏢</div>
        <h3>No Brands Found</h3>
        <p>
          {searchTerm
            ? "Try a different search term"
            : "No brands available at the moment"}
        </p>
      </div>
    );
  }

  return (
    <div className="brand-list-container">
      {showFilters && (
        <div className="brand-list-filters">
          <SearchBar
            placeholder="Search brands..."
            value={searchTerm}
            onChange={handleSearch}
            className="brand-search"
          />

          <div className="category-filter">
            <label htmlFor="category-select">Filter by Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="brand-list-grid">
        {paginatedBrands.map((brand) => (
          <div key={brand.id} className="brand-list-item">
            <BrandCard
              brand={brand}
              showActions={isAdmin}
              onEdit={handleEditBrand}
              onDelete={handleDeleteBrand}
            />
          </div>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="brand-list-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <div className="pagination-info">
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredBrands.length)} of{" "}
            {filteredBrands.length} brands
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
