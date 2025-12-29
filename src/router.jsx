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

// Admin
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import BrandManagement from "./pages/Admin/BrandManager/BrandManagement";
import ProductManagement from "./pages/Admin/Products/ProductManagement";
import UserManagement from "./pages/Admin/Users/UserManagement";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Brand public routes */}
        <Route path="/brands" element={<BrandDirectory />} />
        <Route path="/brands/:brandId" element={<BrandDetailPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="brands" element={<BrandManagement />} />
          <Route path="brands/create" element={<BrandManagement />} />
          <Route path="brands/:brandId/edit" element={<BrandManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
