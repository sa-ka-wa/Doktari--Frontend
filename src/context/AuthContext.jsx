import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/api/authService";
import { setAuthToken } from "../services/api/apiClient";

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set token synchronously if exists
  const token = authService.getStoredToken();
  if (token) {
    setAuthToken(token);
  }

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = authService.getStoredToken();

    if (token) {
      setAuthToken(token);
    }

    if (token && storedUser) {
      setUser(storedUser);

      authService
        .getProfile()
        .then((res) => {
          setUser(res.user || res);
        })
        .catch(() => {
          authService.logout();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      console.log("AuthContext login response:", response);
      setAuthToken(response.token);
      console.log("Set auth token:", response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setAuthToken(response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // =================== NEW FUNCTIONS ADDED HERE ===================

  // Role-based permission checks
  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;

    // Define role permissions
    const rolePermissions = {
      super_admin: ["*"],
      admin: [
        "manage_users",
        "manage_brands",
        "manage_products",
        "view_all_orders",
      ],
      brand_admin: [
        "manage_brand_users",
        "manage_brand_products",
        "view_brand_orders",
        "update_order_status",
      ],
      brand_staff: [
        "view_brand_orders",
        "update_order_tracking",
        "view_brand_products",
      ],
      customer: ["view_own_orders", "create_orders", "cancel_own_orders"],
    };

    const userPermissions = rolePermissions[user.role] || [];
    return (
      userPermissions.includes("*") || userPermissions.includes(permission)
    );
  };

  // Check if user can access brand-specific data
  const canAccessBrand = (brandId) => {
    if (!user) return false;
    if (hasRole(["super_admin", "admin"])) return true;
    if (user.brand_id && user.brand_id.toString() === brandId?.toString())
      return true;
    return false;
  };

  // Get user's display role
  const getRoleDisplay = () => {
    if (!user || !user.role) return "";
    const roleMap = {
      super_admin: "Super Admin",
      admin: "Admin",
      brand_admin: "Brand Admin",
      brand_staff: "Staff",
      customer: "Customer",
    };
    return roleMap[user.role] || user.role;
  };

  // =================== END OF NEW FUNCTIONS ===================

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    // =================== EXPORT NEW FUNCTIONS ===================
    hasRole,
    hasPermission,
    canAccessBrand,
    getRoleDisplay,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
