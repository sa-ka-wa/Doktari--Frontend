// src/context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/api/productService';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(params);
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (productId) => {
    try {
      setLoading(true);
      const product = await productService.getProductById(productId);
      setCurrentProduct(product);
      return product;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
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
      setProducts(prev => prev.map(p => 
        p.id === productId ? updatedProduct : p
      ));
      if (currentProduct?.id === productId) {
        setCurrentProduct(updatedProduct);
      }
      return updatedProduct;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (currentProduct?.id === productId) {
        setCurrentProduct(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    }
  };

  const searchProducts = async (query) => {
    try {
      return await productService.searchProducts(query);
    } catch (err) {
      setError(err.message || 'Failed to search products');
      throw err;
    }
  };

  const value = {
    products,
    currentProduct,
    loading,
    error,
    fetchProducts,
    getProductById,
    getProductsByBrand,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};