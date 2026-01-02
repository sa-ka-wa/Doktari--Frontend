import React, { createContext, useState, useContext, useCallback } from "react";
import userService from "../services/api/userService";
import { useAuth } from "./AuthContext";

const UserContext = createContext({});

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const { user: currentAuthUser } = useAuth();

  // Fetch all users (with role-based filtering)
  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(params);
      setUsers(data.users || data || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
      console.error("Error fetching users:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific user
  const fetchUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUser(userId);
      setCurrentUser(data.user || data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch user");
      console.error("Error fetching user:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new user
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.createUser(userData);
      setUsers((prev) => [data.user, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
      console.error("Error creating user:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user
  const updateUser = useCallback(
    async (userId, userData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.updateUser(userId, userData);

        // Update in users list
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? data.user : user))
        );

        // Update current user if it's the one being updated
        if (currentUser?.id === userId) {
          setCurrentUser(data.user);
        }

        return data;
      } catch (err) {
        setError(err.response?.data?.error || "Failed to update user");
        console.error("Error updating user:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Delete user
  const deleteUser = useCallback(
    async (userId) => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.deleteUser(userId);

        // Remove from users list
        setUsers((prev) => prev.filter((user) => user.id !== userId));

        // Clear current user if it's the one being deleted
        if (currentUser?.id === userId) {
          setCurrentUser(null);
        }

        return data;
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete user");
        console.error("Error deleting user:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Update user role
  const updateUserRole = useCallback(async (userId, roleData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.updateUserRole(userId, roleData);

      // Update in users list
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? data.user : user))
      );

      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user role");
      console.error("Error updating user role:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search users
  const searchUsers = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.searchUsers(searchTerm);
      setUsers(data.users || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to search users");
      console.error("Error searching users:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user statistics
  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserStats();
      setStats(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch user stats");
      console.error("Error fetching user stats:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current user
  const clearCurrentUser = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const value = {
    users,
    currentUser,
    loading,
    error,
    stats,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    searchUsers,
    fetchUserStats,
    clearError,
    clearCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
