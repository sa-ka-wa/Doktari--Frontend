import React, { createContext, useState, useContext, useEffect } from "react";
import brandService from "../services/api/brandService"; // Import brand service

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
  const [error, setError] = useState(null);

  const detectSubdomain = () => {
    const hostname = window.location.hostname;
    console.log("🌐 BrandContext - Hostname:", hostname);

    // Handle .lvh.me subdomains (local development)
    if (hostname.includes('.lvh.me')) {
      const subdomain = hostname.split('.')[0];
      console.log("✅ Detected .lvh.me subdomain:", subdomain);
      return subdomain;
    }

    // Handle localhost with ports
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      const port = window.location.port;
      console.log("📍 Localhost port:", port);
      
      // Map ports to subdomains for development
      const portMap = {
        '3001': 'admin',
        '3002': 'doktari',
        '3003': 'user',
        '3004': 'prolific',
        '5173': 'urbanstyle' // Vite default
      };
      
      if (portMap[port]) {
        const subdomain = portMap[port];
        console.log("🔗 Mapped port to subdomain:", port, "->", subdomain);
        return subdomain;
      }
      
      // Check URL params
      const urlParams = new URLSearchParams(window.location.search);
      const paramSubdomain = urlParams.get('subdomain');
      if (paramSubdomain) {
        console.log("🔗 Using URL param subdomain:", paramSubdomain);
        return paramSubdomain;
      }
      
      // Default for local development
      console.log("⚙️ Using default subdomain: urbanstyle");
      return 'urbanstyle';
    }

    // Standard subdomain detection
    const parts = hostname.split('.');
    if (parts.length > 2 && parts[0] !== 'www') {
      const subdomain = parts[0];
      console.log("🌍 Standard subdomain detected:", subdomain);
      return subdomain;
    }

    console.log("⚠️ No subdomain detected");
    return null;
  };

  const fetchBrandBySubdomain = async (subdomain) => {
    try {
      console.log(`🔄 Fetching brand for subdomain: ${subdomain}`);
      
      // Try to get brand by subdomain
      const brandData = await brandService.getBrandBySubdomain(subdomain);
      
      if (brandData) {
        console.log(`✅ Found brand: ${brandData.name} (ID: ${brandData.id})`);
        return brandData;
      }
      
      console.warn(`⚠️ No brand found for subdomain: ${subdomain}`);
      return null;
    } catch (error) {
      console.error(`❌ Error fetching brand for ${subdomain}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const initializeBrand = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Detect subdomain
        const subdomain = detectSubdomain();
        
        if (!subdomain) {
          console.warn("⚠️ No subdomain detected, using default");
          setCurrentBrand({
            id: 1, // Default brand ID
            name: "Default Brand",
            slug: "default",
            subdomain: "default",
            isDefault: true
          });
          setLoading(false);
          return;
        }

        console.log(`🔍 Initializing brand for: ${subdomain}`);

        // 2. Try to fetch brand from API
        const brandData = await fetchBrandBySubdomain(subdomain);
        
        if (brandData) {
          // Found existing brand
          setCurrentBrand({
            ...brandData,
            subdomain: subdomain
          });
          
          // Store in localStorage for quick access
          localStorage.setItem('current_brand', JSON.stringify(brandData));
          localStorage.setItem('current_subdomain', subdomain);
          
          console.log(`✅ Brand context initialized: ${brandData.name}`);
        } else {
          // Brand doesn't exist yet (for registration)
          console.log(`📝 Brand ${subdomain} doesn't exist yet - ready for registration`);
          
          setCurrentBrand({
            id: null,
            name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1),
            slug: subdomain,
            subdomain: subdomain,
            isNew: true // Flag that this brand needs to be created
          });
          
          setError(`Brand "${subdomain}" not found. You can register to create it.`);
        }
        
      } catch (err) {
        console.error("❌ Brand initialization error:", err);
        setError("Failed to initialize brand context");
        
        // Fallback to default
        setCurrentBrand({
          id: 1,
          name: "Default Brand",
          slug: "default",
          subdomain: "default",
          isDefault: true,
          isFallback: true
        });
      } finally {
        setLoading(false);
      }
    };

    initializeBrand();
  }, []);

  const value = {
    brand: currentBrand, // Changed from currentBrand to brand for consistency
    loading,
    error,
    getSubdomain: detectSubdomain,
    refreshBrand: async () => {
      setLoading(true);
      const subdomain = detectSubdomain();
      if (subdomain) {
        const brandData = await fetchBrandBySubdomain(subdomain);
        if (brandData) {
          setCurrentBrand({
            ...brandData,
            subdomain: subdomain
          });
        }
      }
      setLoading(false);
    }
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};