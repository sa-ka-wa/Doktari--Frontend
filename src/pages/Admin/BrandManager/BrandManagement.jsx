import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import brandService from "../../../services/api/brandService";
import BrandManagementComponent from "../../../components/admin/BrandManagement/BrandManagement";
import AuthContext from "../../../context/AuthContext";
import "./BrandManagement.css";

const BrandManagement = () => {
  const { token } = useContext(AuthContext);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return; // don't fetch if token is missing

    const fetchBrands = async () => {
      try {
        const data = await brandService.getAllBrands();
        setBrands(data);
      } catch (err) {
        setError(err.message || "Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [token]);

  if (loading) return <p>Loading brands...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="brand-management-page">
      <div className="page-header">
        <h1>Brand Management</h1>
        <p>Manage all your T-shirt brands in one place</p>
      </div>
      <BrandManagementComponent brands={brands} />
    </div>
  );
};

export default BrandManagement;
