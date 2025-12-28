// src/pages/Brands/Detail/BrandDetailPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import BrandDetail from "../../../components/brands/BrandDetail";
import { Helmet } from "react-helmet-async";
import "./BrandDetail.css";

const BrandDetailPage = () => {
  const { brandId } = useParams();

  return (
    <div className="brand-detail-page">
      <Helmet>
        <title>Brand Details | T-Shirt Platform</title>
      </Helmet>
      <BrandDetail brandId={brandId} />
    </div>
  );
};

export default BrandDetailPage;
