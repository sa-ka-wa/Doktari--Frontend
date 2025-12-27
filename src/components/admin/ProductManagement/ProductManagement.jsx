import React, { useState } from "react";
import "./ProductManagement.css";

const ProductManagement = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Graffiti King Tee",
      brand: "Prolific",
      price: "$64.99",
      stock: 45,
      status: "Active",
    },
    {
      id: 2,
      name: "Medical Scrubs",
      brand: "Doktari",
      price: "$49.99",
      stock: 32,
      status: "Active",
    },
    {
      id: 3,
      name: "Urban Hoodie",
      brand: "Prolific",
      price: "$89.99",
      stock: 0,
      status: "Out of Stock",
    },
  ]);

  return (
    <div className="product-management">
      <div className="section-header">
        <h2>Product Catalog</h2>
        <button className="btn btn-primary">Add New Product</button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <div className="image-placeholder">👕</div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">{product.price}</p>
              <div className="product-meta">
                <span className="stock">Stock: {product.stock}</span>
                <span
                  className={`status ${product.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {product.status}
                </span>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn btn-sm">Edit</button>
              <button className="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
