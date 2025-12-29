// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api/productService';

export const useProducts = (options = {}) => {
  const {
    autoFetch = true,
    brandId = null,
    category = null,
    limit = null,
    sort = 'newest',
    search = ''
  } = options;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0
  });

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productService.getProducts({
        ...params,
        brand_id: brandId || params.brand_id,
        category: category || params.category,
        limit: limit || params.limit,
        sort: sort || params.sort,
        search: search || params.search
      });
      
      setProducts(data.products || data);
      
      if (data.pagination) {
        setPagination(data.pagination);
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error in useProducts:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [brandId, category, limit, sort, search]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  const createProduct = async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.message || 'Failed to create product');
      throw err;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(productId, productData);
      setProducts(prev => prev.map(product => 
        product.id === productId ? updatedProduct : product
      ));
      return updatedProduct;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    }
  };

  const getProduct = async (productId) => {
    try {
      setLoading(true);
      const product = await productService.getProductById(productId);
      return product;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (searchTerm) => {
    return fetchProducts({ search: searchTerm });
  };

  const changePage = async (page) => {
    return fetchProducts({ page });
  };

  const getProductsByBrand = async (brandId, params = {}) => {
    try {
      setLoading(true);
      const data = await productService.getProductsByBrand(brandId, params);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch brand products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedProducts = async (limit = 8) => {
    try {
      setLoading(true);
      const data = await productService.getFeaturedProducts(limit);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch featured products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNewArrivals = async (limit = 8) => {
    try {
      setLoading(true);
      const data = await productService.getNewArrivals(limit);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch new arrivals');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBestSellers = async (limit = 8) => {
    try {
      setLoading(true);
      const data = await productService.getBestSellers(limit);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch best sellers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    searchProducts,
    changePage,
    getProductsByBrand,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellers,
    refetch: fetchProducts
  };
};

// Singular hook for single product
export const useProduct = (productId, options = {}) => {
  const {
    autoFetch = true,
    includeRelated = false
  } = options;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProduct = async (id = productId) => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getProductById(id);
      setProduct(productData);
      
      if (includeRelated && productData) {
        const related = await productService.getProducts({
          category: productData.category,
          brand_id: productData.brand_id,
          limit: 4,
          exclude: id
        });
        setRelatedProducts(related.products || related);
      }
      
      return productData;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      console.error('Error in useProduct:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && productId) {
      fetchProduct();
    }
  }, [productId, autoFetch]);

  const updateProduct = async (productData) => {
    try {
      const updatedProduct = await productService.updateProduct(productId, productData);
      setProduct(updatedProduct);
      return updatedProduct;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async () => {
    try {
      await productService.deleteProduct(productId);
      setProduct(null);
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    }
  };

  const updateStock = async (quantity) => {
    try {
      const updatedProduct = await productService.updateStock(productId, quantity);
      setProduct(updatedProduct);
      return updatedProduct;
    } catch (err) {
      setError(err.message || 'Failed to update stock');
      throw err;
    }
  };

  return {
    product,
    loading,
    error,
    relatedProducts,
    fetchProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    refetch: fetchProduct
  };
};