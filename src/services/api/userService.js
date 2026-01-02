import apiClient from "./apiClient";

const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get specific user
  getUser: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await apiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, roleData) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/role`, roleData);
      return response.data;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  },

  // Search users
  searchUsers: async (searchTerm) => {
    try {
      const response = await apiClient.get("/users/search", {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await apiClient.get("/users/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },
};

export default userService;
