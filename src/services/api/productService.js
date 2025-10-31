import { useState, useEffect } from "react";
import apiClient from "./apiClient";

export const productService = {
  // Get all products with optional filtering
  async getProducts(filters = {}) {
    const params = new URLSearchParams();

    // Add filters to params
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by ID
  async getProductById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(category) {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  },

  // Get products by style tag
  async getProductsByStyle(styleTag) {
    const response = await apiClient.get(`/products/style/${styleTag}`);
    return response.data;
  },

  // Search products
  async searchProducts(query) {
    const response = await apiClient.get(
      `/products/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  },

  // Get available filters
  async getProductFilters() {
    const response = await apiClient.get("/products/filters");
    return response.data;
  },

  // Create new product (admin only)
  async createProduct(productData) {
    const response = await apiClient.post("/products", productData);
    return response.data;
  },

  // Update product (admin only)
  async updateProduct(id, productData) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin only)
  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
