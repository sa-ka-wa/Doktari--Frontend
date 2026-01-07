// src/services/api/productService.js
import apiClient from "./apiClient";

export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    try {
      const queryParams = {
        page: params.page || 1,
        category: params.category,
        type: params.product_type,
        style: params.style_tag,
        brand_id: params.brand_id,
        search: params.search,
        min_price: params.min_price,
        max_price: params.max_price,
        sort: params.sort,
        exclude: params.exclude,
      };

      if (params.limit) {
        queryParams.limit = params.limit;
      } else {
        queryParams.limit = 100; // Default to 100 if no limit specified
      }

      const response = await apiClient.get("/products/", {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Get products by brand
  getProductsByBrand: async (brandId, params = {}) => {
    try {
      const response = await apiClient.get("/products/", {
        params: { ...params, brand_id: brandId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching brand products:", error);
      throw error;
    }
  },
  getProductsByBrandId: async (brandId, params = {}) => {
    try {
      const response = await apiClient.get(`/products/brand/${brandId}`, {
        params: { ...params },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching brand products:", error);
      throw error;
    }
  },

  // Create product (admin only)
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post("/products/", productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product (admin only)
  updateProduct: async (productId, productData) => {
    try {
      const response = await apiClient.put(
        `/products/${productId}/`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (productId) => {
    try {
      const response = await apiClient.delete(`/products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Update stock (admin only)
  updateStock: async (productId, quantity) => {
    try {
      const response = await apiClient.put(`/products/${productId}/stock/`, {
        stock_quantity: quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      const response = await apiClient.get("/products/", {
        params: { ...params, search: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await apiClient.get("/products/categories/");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await apiClient.get("/products/featured/", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8) => {
    try {
      const response = await apiClient.get("/products/new-arrivals/", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      throw error;
    }
  },

  // Get best sellers
  getBestSellers: async (limit = 8) => {
    try {
      const response = await apiClient.get("/products/best-sellers/", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      throw error;
    }
  },
};
