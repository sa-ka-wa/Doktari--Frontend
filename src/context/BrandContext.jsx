import React, { createContext, useState, useContext, useEffect } from "react";

const BrandContext = createContext();

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};

export const BrandProvider = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const getSubdomain = () => {
    if (import.meta.env.DEV) {
      // For development, simulate brands
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("brand") || "urbanstyle";
    }

    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    if (parts.length > 2 && parts[0] !== "www") {
      return parts[0];
    }
    return null;
  };

  useEffect(() => {
    const subdomain = getSubdomain();
    console.log("🔧 Detected subdomain:", subdomain);

    // You could fetch brand details from API here
    // For now, we'll just store the subdomain
    setCurrentBrand({
      subdomain: subdomain,
      name: subdomain
        ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1)
        : "Default",
    });

    setLoading(false);
  }, []);

  const value = {
    currentBrand,
    loading,
    getSubdomain,
  };

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
};
