// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import AuthContext from "../context/AuthContext.jsx";
// import LoadingSpinner from "../components/common/LoadingSpinner/LoadingSpinner.jsx";

// const ProtectedRoute = ({ children, role }) => {
//   const { user, loading, isAuthenticated } = useContext(AuthContext);

//   // Show loading state while checking authentication
//   if (loading) {
//     return <LoadingSpinner size="medium" />;
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check role-based access if role is specified
//   if (role && user.role !== role) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner/LoadingSpinner.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  console.log("🛡️ ProtectedRoute check:", {
    loading,
    isAuthenticated:
      typeof isAuthenticated === "function"
        ? isAuthenticated()
        : isAuthenticated,
    user,
    requiredRole: role,
  });

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingSpinner size="medium" />;
  }

  // Get authentication status - handle both function and value
  let authenticated = false;
  if (typeof isAuthenticated === "function") {
    authenticated = isAuthenticated();
  } else if (isAuthenticated !== undefined) {
    authenticated = isAuthenticated;
  } else {
    // Fallback: check localStorage directly
    authenticated = !!localStorage.getItem("token");
  }

  // Redirect to login if not authenticated
  if (!authenticated || !user) {
    console.log("🚫 Not authenticated or no user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if role is specified
  // Allow both 'admin' and 'super_admin' for admin routes
  if (role && user.role !== role && user.role !== "super_admin") {
    console.log(
      `⛔ Role mismatch: user has '${user.role}', required '${role}' or 'super_admin'`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Access granted to protected route");
  return children;
};

export default ProtectedRoute;
