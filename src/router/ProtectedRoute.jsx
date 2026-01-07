import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // Make sure this is the correct import
import LoadingSpinner from "../components/common/LoadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children, role, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  console.log("🛡️ ProtectedRoute check:", {
    loading,
    isAuthenticated:
      typeof isAuthenticated === "function"
        ? isAuthenticated()
        : isAuthenticated,
    user,
    requiredRole: role,
    userRole: user?.role,
    pathname: location.pathname,
  });

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingSpinner size="medium" />;
  }

  // Get authentication status
  let authenticated = false;
  if (typeof isAuthenticated === "function") {
    authenticated = isAuthenticated();
  } else if (isAuthenticated !== undefined) {
    authenticated = isAuthenticated;
  } else {
    authenticated = !!localStorage.getItem("token");
  }

  // Redirect to login if not authenticated
  if (!authenticated || !user) {
    console.log("🚫 Not authenticated or no user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle allowedRoles parameter
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      console.log(
        `⛔ Access denied: user role '${user.role}' not in allowed roles:`,
        allowedRoles
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }
  // Handle role-specific checks
  else if (role) {
    // Special handling for admin routes
    if (role === "admin") {
      const adminRoles = ["admin", "super_admin", "brand_admin"];
      if (!adminRoles.includes(user.role)) {
        console.log(
          `⛔ Admin access denied: user role '${user.role}' not in`,
          adminRoles
        );
        return <Navigate to="/unauthorized" replace />;
      }
    }
    // For specific role checks (non-admin)
    else if (user.role !== role) {
      console.log(
        `⛔ Role mismatch: user has '${user.role}', required '${role}'`
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log("✅ Access granted to protected route");
  return children;
};

export default ProtectedRoute;
