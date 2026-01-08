import apiClient from "./apiClient.js";

const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    const response = await apiClient.post("/auth/login", { email, password });
    const data = response.data;

    console.log("Login response data:", data);

    // Handle different response structures
    const user = data.user || data;
    const token = data.token || data.access_token || data.auth_token;

    console.log("Extracted user:", user);
    console.log("Extracted token:", token);

    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token); // ✅ Consistent key
      localStorage.setItem("token", token); // ✅ Also save as backup
    }
    return { user, token };
  },

  /**
   * Register a new user
   */
  async register(userData) {
    const response = await apiClient.post("/auth/register", userData);
    const data = response.data;

    // Handle different response structures
    const user = data.user || data;
    const token = data.token || data.access_token || data.auth_token;
    const sessionId = data.session_id || data.sessionId;

    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token); // ✅ Consistent key
      localStorage.setItem("token", token); // ✅ Also save as backup
      if (sessionId) {
        localStorage.setItem("session_id", sessionId);
      }
      localStorage.setItem("token", token); // ✅ Also save as backup
      if (sessionId) {
        localStorage.setItem("session_id", sessionId);
      }
    }
    return { user, token };
  },

  /**
   * Fetch logged-in user's profile
   */
  async getProfile() {
    const response = await apiClient.get("/auth/profile");
    // Update stored user data
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Get the stored user from localStorage
   */
  getStoredUser() {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  },
  /**
   * Get the stored token from localStorage
   */
  getStoredToken() {
    return (
      localStorage.getItem("authToken") || localStorage.getItem("token") || null
    );
  },
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getStoredToken();
  },

  /**
   * Logout the user
   */
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
  },
};

export default authService;
