// import { useState, useEffect } from "react";

// export const useProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Mock data - replace with actual API call
//     const mockProducts = [
//       {
//         id: 1,
//         name: "Classic Cotton T-Shirt",
//         description: "Comfortable cotton t-shirt for everyday wear",
//         fullDescription:
//           "Our classic cotton t-shirt is made from 100% premium cotton for ultimate comfort. Perfect for everyday wear, this t-shirt features a modern fit and durable construction that maintains its shape wash after wash.",
//         price: 29.99,
//         image: "/images/tshirt1.jpg",
//         images: [
//           "/images/tshirt1.jpg",
//           "/images/tshirt1-alt1.jpg",
//           "/images/tshirt1-alt2.jpg",
//         ],
//         category: "casual",
//         brand: "BasicWear",
//         sizes: ["S", "M", "L", "XL", "XXL"],
//         colors: ["Black", "White", "Gray", "Navy"],
//         inStock: true,
//         createdAt: "2024-01-15",
//       },
//       {
//         id: 2,
//         name: "Premium Fit T-Shirt",
//         description: "Slim fit premium t-shirt with exceptional comfort",
//         fullDescription:
//           "Experience luxury with our premium fit t-shirt. Crafted from high-quality combed cotton, this slim-fit shirt offers exceptional comfort and style. Perfect for both casual and semi-formal occasions.",
//         price: 39.99,
//         image: "/images/tshirt2.jpg",
//         images: ["/images/tshirt2.jpg", "/images/tshirt2-alt1.jpg"],
//         category: "premium",
//         brand: "StyleCo",
//         sizes: ["XS", "S", "M", "L", "XL"],
//         colors: ["Black", "White", "Charcoal", "Burgundy"],
//         inStock: true,
//         createdAt: "2024-01-20",
//       },
//       {
//         id: 3,
//         name: "Sports Performance Tee",
//         description: "Moisture-wicking t-shirt for active lifestyles",
//         fullDescription:
//           "Stay dry and comfortable during your workouts with our sports performance tee. Made from advanced moisture-wicking fabric that keeps you cool and dry. Ideal for running, gym sessions, and sports activities.",
//         price: 34.99,
//         image: "/images/tshirt3.jpg",
//         images: ["/images/tshirt3.jpg"],
//         category: "sports",
//         brand: "SportTech",
//         sizes: ["S", "M", "L", "XL", "XXL"],
//         colors: ["Black", "Royal Blue", "Red", "Green"],
//         inStock: false,
//         createdAt: "2024-01-25",
//       },
//     ];

//     setTimeout(() => {
//       setProducts(mockProducts);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   return { products, loading, error };
// };
import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/api/productService";

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await productService.getProducts(filters);

      // Transform backend data to match frontend structure
      const transformedProducts = productsData.map((product) => ({
        id: product.id,
        name: product.title, // Map title to name
        title: product.title,
        description: product.description,
        fullDescription: product.description, // Using same description for now
        price: product.price,
        image: product.image_url,
        images: [product.image_url], // Single image for now
        category: product.category,
        product_type: product.product_type,
        style_tag: product.style_tag,
        artist: product.artist,
        sizes: product.size ? [product.size] : ["S", "M", "L", "XL"], // Handle single size or provide defaults
        colors: product.color ? [product.color] : ["Black", "White"], // Handle single color or provide defaults
        material: product.material,
        brand: product.brand_name || "Unknown Brand",
        brand_id: product.brand_id,
        stock_quantity: product.stock_quantity,
        inStock: product.stock_quantity > 0,
        has_3d_model: product.has_3d_model,
        model_3d_url: product.model_3d_url,
        model_scale: product.model_scale,
        model_position: product.model_position,
        created_at: product.created_at,
        is_active: product.is_active,
      }));

      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [fetchProducts, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const searchProducts = useCallback(
    async (query) => {
      if (!query.trim()) {
        await fetchProducts(filters);
        return;
      }

      try {
        setLoading(true);
        const searchResults = await productService.searchProducts(query);

        const transformedProducts = searchResults.map((product) => ({
          id: product.id,
          name: product.title,
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image_url,
          category: product.category,
          style_tag: product.style_tag,
          artist: product.artist,
          sizes: product.size ? [product.size] : ["S", "M", "L", "XL"],
          colors: product.color ? [product.color] : ["Black", "White"],
          brand: product.brand_name || "Unknown Brand",
          stock_quantity: product.stock_quantity,
          inStock: product.stock_quantity > 0,
          has_3d_model: product.has_3d_model,
        }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error("Error searching products:", err);
        setError(err.response?.data?.message || "Failed to search products");
      } finally {
        setLoading(false);
      }
    },
    [filters, fetchProducts]
  );

  return {
    products,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    searchProducts,
    refetch: () => fetchProducts(filters),
  };
};

// Hook for single product
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const productData = await productService.getProductById(id);

        // Transform backend data to match frontend structure
        const transformedProduct = {
          id: productData.id,
          name: productData.title,
          title: productData.title,
          description: productData.description,
          fullDescription: productData.description,
          price: productData.price,
          image: productData.image_url,
          images: [productData.image_url], // You might want to extend this for multiple images
          category: productData.category,
          product_type: productData.product_type,
          style_tag: productData.style_tag,
          artist: productData.artist,
          sizes: productData.size ? [productData.size] : ["S", "M", "L", "XL"],
          colors: productData.color ? [productData.color] : ["Black", "White"],
          material: productData.material,
          brand: productData.brand_name || "Unknown Brand",
          brand_id: productData.brand_id,
          stock_quantity: productData.stock_quantity,
          inStock: productData.stock_quantity > 0,
          has_3d_model: productData.has_3d_model,
          model_3d_url: productData.model_3d_url,
          model_scale: productData.model_scale,
          model_position: productData.model_position,
          created_at: productData.created_at,
          is_active: productData.is_active,
        };

        setProduct(transformedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
