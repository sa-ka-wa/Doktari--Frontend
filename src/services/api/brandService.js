// import apiClient from "./apiClient.js";

// const brandService = {
//   // Fetch all brands
//   async getAllBrands() {
//     const response = await apiClient.get("/brands");
//     return response.data;
//   },

//   // Create a new brand
//   async createBrand(brandData) {
//     const response = await apiClient.post("/brands", brandData);
//     return response.data;
//   },

//   // Update existing brand
//   async updateBrand(brandId, brandData) {
//     const response = await apiClient.put(`/brands/${brandId}`, brandData);
//     return response.data;
//   },

//   // Delete a brand
//   async deleteBrand(brandId) {
//     const response = await apiClient.delete(`/brands/${brandId}`);
//     return response.data;
//   },
// };

// export default brandService;
// services/brandService.js
import apiClient from "./apiClient.js";

const brandService = {
  // Fetch all brands - CORRECT ENDPOINT
  async getAllBrands() {
    const response = await apiClient.get("/brands"); // Remove /api
    return response.data;
  },

  // Create a new brand
  async createBrand(brandData) {
    const response = await apiClient.post("/brands", brandData);
    return response.data;
  },

  // Update existing brand
  async updateBrand(brandId, brandData) {
    const response = await apiClient.put(`/brands/${brandId}`, brandData);
    return response.data;
  },

  // Delete a brand
  async deleteBrand(brandId) {
    const response = await apiClient.delete(`/brands/${brandId}`);
    return response.data;
  },

  // Get brand by subdomain
  async getBrandBySubdomain(subdomain) {
    const response = await apiClient.get("/brands/by-subdomain", {
      params: { subdomain },
    });
    return response.data;
  },
};

export default brandService;
