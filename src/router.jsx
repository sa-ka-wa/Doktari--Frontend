// src/router.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import ProductCatalog from "./pages/Products/Catalog";
import ProductDetail from "./pages/Products/Detail";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Auth/Profile";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Orders/Checkout/Checkout";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import BrandManagement from "./pages/Admin/BrandManager/BrandManagement";
import ProductManagement from "./pages/Admin/Products/ProductManagement";
import UserManagement from "./pages/Admin/Users/UserManagement";
import StaffDashboard from "./pages/Admin/Dashboard/StaffDashboard";

// Brand pages (public)
import BrandDirectory from "./pages/Brands/Directory/BrandDirectory";
import BrandDetailPage from "./pages/Brands/Detail/BrandDetail";

import ProtectedRoute from "./router/ProtectedRoute";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products/catalog" element={<ProductCatalog />} />
        <Route path="/products/detail/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Brand public routes */}
        <Route path="/brands" element={<BrandDirectory />} />
        <Route path="/brands/:brandId" element={<BrandDetailPage />} />

        {/* Admin routes - These should be separate, not nested incorrectly */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute role="admin">
              <BrandManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/brands/create"
          element={
            <ProtectedRoute role="admin">
              <BrandManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/brands/:brandId/edit"
          element={
            <ProtectedRoute role="admin">
              <BrandManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <ProductManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "brand_admin",
                "brand_staff",
                "admin",
                "super_admin",
              ]}
            >
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders"
          element={
            <ProtectedRoute
              allowedRoles={[
                "brand_admin",
                "brand_staff",
                "admin",
                "super_admin",
              ]}
            >
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
