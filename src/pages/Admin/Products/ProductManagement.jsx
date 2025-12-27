import React from "react";
import ProductManagementComponent from "../../../components/admin/ProductManagement/ProductManagement";
import "./ProductManagement.css";

const ProductManagement = () => {
  return (
    <div className="product-management-page">
      <div className="page-header">
        <h1>Product Management</h1>
        <p>Manage products across all brands</p>
      </div>
      <ProductManagementComponent />
    </div>
  );
};

export default ProductManagement;
