// src/pages/Brands/Directory/BrandDirectory.jsx
import React from "react";
import BrandList from "../../../components/brands/BrandList";
import { Helmet } from "react-helmet-async";
import "./BrandDirectory.css";

const BrandDirectory = () => {
  return (
    <div className="brand-directory">
      <Helmet>
        <title>Brand Directory | T-Shirt Platform</title>
        <meta
          name="description"
          content="Browse all our partner brands and discover unique t-shirt designs"
        />
      </Helmet>

      <div className="directory-header">
        <h1>Brand Directory</h1>
        <p className="directory-subtitle">
          Discover amazing brands and their unique t-shirt collections
        </p>
      </div>

      <div className="directory-content">
        <BrandList showFilters={true} showPagination={true} itemsPerPage={12} />
      </div>

      <div className="directory-footer">
        <p>
          Don't see your brand?{" "}
          <a href="/contact" className="contact-link">
            Contact us
          </a>{" "}
          to become a partner.
        </p>
      </div>
    </div>
  );
};

export default BrandDirectory;
