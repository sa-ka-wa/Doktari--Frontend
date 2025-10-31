import apiClient from "./apiClient";

export const authService = {
  async login(credentials) {
    const response = await apiClient.post("/auth/login", credentials);
    const data = response.data;

    // ✅ Store token and user info after successful login
    if (data.access_token) {
      localStorage.setItem("authToken", data.access_token);
    }

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  },

  async register(userData) {
    const response = await apiClient.post("/auth/register", userData);
    const data = response.data;

    // ✅ Store token and user info after successful registration
    if (data.access_token) {
      localStorage.setItem("authToken", data.access_token);
    }

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  },

  async getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  async logout() {
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // You might also want to call a backend logout endpoint
    // await apiClient.post('/auth/logout');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },

  // Get stored user info
  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
