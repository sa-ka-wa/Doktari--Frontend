import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import pages
import Home from "./pages/Home/Home";
import ProductCatalog from "./pages/Products/Catalog/ProductCatalog";
import ProductDetail from "./pages/Products/Detail/ProductDetail";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Profile from "./pages/Auth/Profile/Profile";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Orders/Checkout/Checkout";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import BrandManagement from "./pages/Admin/BrandManager/BrandManagement";
import ProductManagement from "./pages/Admin/Products/ProductManagement";
import UserManagement from "./pages/Admin/Users/UserManagement";

// Staff Pages
import StaffDashboard from "./pages/Admin-Staff/Dashboard/StaffDashboard/StaffDashboard";
import StaffOverview from "./pages/Admin-Staff/Dashboard/StaffOverview/StaffOverview";
import StaffOrderManagement from "./pages/Admin-Staff/Orders/OrderManagement/OrderManagement";
import StaffOrderDetail from "./pages/Admin-Staff/Orders/OrderDetail/OrderDetail";

// Brand Pages
import BrandDirectory from "./pages/Brands/Directory/BrandDirectory";
import BrandDetailPage from "./pages/Brands/Detail/BrandDetail";

// Order Pages (Customer)
import CustomerOrderHistory from "./pages/Orders/History/OrderHistory";
import CustomerOrderDetail from "./pages/Orders/Detail/OrderDetail";

// Payment Pages
import PaymentSuccess from "./pages/Payments/Success/PaymentSuccess";
import PaymentFailed from "./pages/Payments/Failed/PaymentFailed";

// Protected Route
import ProtectedRoute from "./router/ProtectedRoute";

// Custom Design Pages
import CustomDesign from "./pages/CustomDesign/CustomDesign";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/custom-design" element={<CustomDesign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/brands" element={<BrandDirectory />} />
        <Route path="/brands/:brandId" element={<BrandDetailPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <CustomerOrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <CustomerOrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Payment Protected Routes */}
        <Route
          path="/payments/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments/failed"
          element={
            <ProtectedRoute>
              <PaymentFailed />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Navigate to="/admin/dashboard" replace />
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
              <BrandManagement mode="create" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/brands/:brandId/edit"
          element={
            <ProtectedRoute role="admin">
              <BrandManagement mode="edit" />
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

        {/* Staff Routes (Nested Layout) */}
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
          <Route path="orders" element={<StaffOrderManagement />} />
          <Route path="orders/:orderId" element={<StaffOrderDetail />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
