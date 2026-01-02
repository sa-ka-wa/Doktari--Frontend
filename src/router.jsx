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
import StaffDashboard from "./pages/Admin-Staff/Dashboard/StaffDashboard/StaffDashboard";

// Staff components
import StaffOverview from "./pages/Admin-Staff/Dashboard/StaffOverview/StaffOverview";
import OrderManagement from "./pages/Admin-Staff/Orders/OrderManagement/OrderManagement";
import OrderDetail from "./pages/Admin-Staff/Orders/OrderDetail/OrderDetail"; // You'll need to create this

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

        {/* Admin routes */}
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

        {/* Staff routes - nested structure */}
        <Route
          path="/staff"
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
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffOverview />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products" element={<ProductManagement />} />
          {/* Add other staff routes as needed */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
