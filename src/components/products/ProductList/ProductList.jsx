// src/components/products/ProductList/ProductList.jsx
import React from "react";
import { ProductCard } from "../ProductCard"; // Change to named import

const ProductList = ({ products = [] }) => (
  <div className="product-list">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

export default ProductList;
