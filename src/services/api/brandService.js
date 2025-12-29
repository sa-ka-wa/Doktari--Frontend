// services/brandService.js
import apiClient from "./apiClient.js";

const brandService = {
  // ✅ CORRECT: Fetch all brands
  async getAllBrands() {
    const response = await apiClient.get("/brands");
    return response.data;
  },

  // ✅ CORRECT: Create a new brand
  async createBrand(brandData) {
    const response = await apiClient.post("/brands", brandData);
    return response.data;
  },

  // ✅ CORRECT: Update existing brand
  async updateBrand(brandId, brandData) {
    const response = await apiClient.put(`/brands/${brandId}`, brandData);
    return response.data;
  },

  // ✅ CORRECT: Delete a brand
  async deleteBrand(brandId) {
    const response = await apiClient.delete(`/brands/${brandId}`);
    return response.data;
  },

  // ✅ CORRECT: Get brand by subdomain
  async getBrandBySubdomain(subdomain) {
    const response = await apiClient.get("/brands/by-subdomain", {
      params: { subdomain },
    });
    return response.data;
  },
    async getBrandById(brandId) {
    try {
      const response = await apiClient.get(`/brands/${brandId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brand with ID ${brandId}:`, error);
      throw error;
    }
  },

  // ❌ WRONG: Remove /api prefix since apiClient already adds it
  getAdminBrands: async (params = {}) => {
    try {
      // CHANGE FROM: "/api/admin/brands" TO: "/admin/brands"
      const response = await apiClient.get("/admin/brands", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching admin brands:", error);
      throw error;
    }
  },

  // ❌ WRONG: Remove /api prefix
  getBrandAnalytics: async (brandId) => {
    try {
      // CHANGE FROM: `/api/admin/brands/${brandId}/analytics` TO: `/admin/brands/${brandId}/analytics`
      const response = await apiClient.get(
        `/admin/brands/${brandId}/analytics`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching brand analytics:", error);
      throw error;
    }
  },

  // ❌ WRONG: Remove /api prefix
  getBrandPerformance: async (brandId, period = "monthly") => {
    try {
      // CHANGE FROM: `/api/admin/brands/${brandId}/performance` TO: `/admin/brands/${brandId}/performance`
      const response = await apiClient.get(
        `/admin/brands/${brandId}/performance`,
        {
          params: { period },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching brand performance:", error);
      throw error;
    }
  },

  // ✅ ADD: New method to get brand by slug (for subdomain detection)
  async getBrandBySlug(slug) {
    try {
      const response = await apiClient.get(`/brands/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brand by slug ${slug}:`, error);
      return null;
    }
  },

  // ✅ ADD: Detect and get current brand
  async getCurrentBrand() {
    // Detect subdomain from URL
    const hostname = window.location.hostname;
    let subdomain = null;
    
    // Parse subdomain from lvh.me
    if (hostname.includes('.lvh.me')) {
      subdomain = hostname.split('.')[0];
    }
    // Parse from localhost with port
    else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      // Try to get from localStorage first (for development)
      subdomain = localStorage.getItem('dev_subdomain') || 'urbanstyle';
    }
    
    if (!subdomain) {
      console.warn("No subdomain detected");
      return null;
    }
    
    console.log(`Detected subdomain: ${subdomain}`);
    
    // Try to get brand by subdomain
    try {
      const brand = await this.getBrandBySubdomain(subdomain);
      if (brand) {
        // Store in localStorage for quick access
        localStorage.setItem('current_brand', JSON.stringify(brand));
        return brand;
      }
    } catch (error) {
      console.warn(`Brand not found for subdomain ${subdomain}, trying slug...`);
    }
    
    // Try by slug as fallback
    try {
      const brand = await this.getBrandBySlug(subdomain);
      if (brand) {
        localStorage.setItem('current_brand', JSON.stringify(brand));
        return brand;
      }
    } catch (error) {
      console.error(`Error fetching brand for ${subdomain}:`, error);
    }
    
    return null;
  },

  // ✅ ADD: Get cached brand
  getCachedBrand() {
    try {
      const cached = localStorage.getItem('current_brand');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Error parsing cached brand:", error);
      return null;
    }
  },

  // ✅ ADD: Clear brand cache
  clearBrandCache() {
    localStorage.removeItem('current_brand');
    localStorage.removeItem('dev_subdomain');
  },

  // ✅ ADD: Set development subdomain (for local testing)
  setDevSubdomain(subdomain) {
    localStorage.setItem('dev_subdomain', subdomain);
    this.clearBrandCache(); // Clear old cache
  }
};

export default brandService;