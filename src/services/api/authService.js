import apiClient from "./apiClient.js";

const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    const response = await apiClient.post("/auth/login", { email, password });
    // Save user in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("authToken", response.data.token);
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(userData) {
    const response = await apiClient.post("/auth/register", userData);
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("authToken", response.data.token);
    return response.data;
  },

  /**
   * Fetch logged-in user's profile
   */
  async getProfile() {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  /**
   * Get the stored user from localStorage
   */
  getStoredUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Logout the user
   */
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  },
};

export default authService;
