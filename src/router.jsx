import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductCatalog from "./pages/Products/Catalog";
import ProductDetail from "./pages/Products/Detail";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/catalog" element={<ProductCatalog />} />
        <Route path="/products/detail/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
