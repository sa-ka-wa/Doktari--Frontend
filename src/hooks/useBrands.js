// src/hooks/useBrands.js
import { useState, useEffect, useCallback } from "react";
import { brandService } from "../services/api/brandService";

export const useBrands = (options = {}) => {
  const { autoFetch = true, category = null, limit = null } = options;

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchBrands = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const data = await brandService.getAllBrands({
          ...params,
          category: category || params.category,
          limit: limit || params.limit,
        });

        setBrands(data.brands || data);

        if (data.pagination) {
          setPagination(data.pagination);
        }

        return data;
      } catch (err) {
        setError(err.message || "Failed to fetch brands");
        console.error("Error in useBrands:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [category, limit]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchBrands();
    }
  }, [autoFetch, fetchBrands]);

  const createBrand = async (brandData) => {
    try {
      const newBrand = await brandService.createBrand(brandData);
      setBrands((prev) => [...prev, newBrand]);
      return newBrand;
    } catch (err) {
      setError(err.message || "Failed to create brand");
      throw err;
    }
  };

  const updateBrand = async (brandId, brandData) => {
    try {
      const updatedBrand = await brandService.updateBrand(brandId, brandData);
      setBrands((prev) =>
        prev.map((brand) => (brand.id === brandId ? updatedBrand : brand))
      );
      return updatedBrand;
    } catch (err) {
      setError(err.message || "Failed to update brand");
      throw err;
    }
  };

  const deleteBrand = async (brandId) => {
    try {
      await brandService.deleteBrand(brandId);
      setBrands((prev) => prev.filter((brand) => brand.id !== brandId));
    } catch (err) {
      setError(err.message || "Failed to delete brand");
      throw err;
    }
  };

  const searchBrands = async (searchTerm) => {
    return fetchBrands({ search: searchTerm });
  };

  const changePage = async (page) => {
    return fetchBrands({ page });
  };

  const getBrand = async (brandId) => {
    try {
      setLoading(true);
      const brand = await brandService.getBrandById(brandId);
      return brand;
    } catch (err) {
      setError(err.message || "Failed to fetch brand");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    loading,
    error,
    pagination,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    searchBrands,
    changePage,
    getBrand,
    refetch: fetchBrands,
  };
};
