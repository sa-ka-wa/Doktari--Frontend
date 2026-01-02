import apiClient from "./apiClient";

const cartService = {
  // Get current cart from server
  getCart: async () => {
    try {
      const response = await apiClient.get("/cart");
      console.log("🛒 Cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error getting cart:",
        error.response?.data || error.message
      );

      // If 404 or 401, return empty cart
      if (error.response?.status === 404 || error.response?.status === 401) {
        console.log("No cart found on server, returning empty cart");
        return {
          items: [],
          total_items: 0,
          total_amount: 0,
        };
      }

      // If no response (network error), try to get from localStorage
      if (!error.response) {
        console.log("Network error, trying localStorage...");
        const localCart = localStorage.getItem("cart");
        if (localCart) {
          return JSON.parse(localCart);
        }
        return {
          items: [],
          total_items: 0,
          total_amount: 0,
        };
      }

      throw error;
    }
  },

  // Add item to cart on server
  addToCart: async (itemData) => {
    try {
      console.log("➕ Adding to cart:", itemData);
      const response = await apiClient.post("/cart/add", itemData);
      console.log("✅ Added to cart:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error adding to cart:",
        error.response?.data || error.message
      );

      // If network error, save to localStorage and throw error
      if (!error.response) {
        console.warn("Network error, saving to localStorage for offline");
        throw new Error("Network error. Your item was saved locally.");
      }

      throw error;
    }
  },

  // Update cart item quantity on server
  updateCartItem: async (itemId, data) => {
    try {
      console.log("✏️ Updating cart item:", itemId, data);
      const response = await apiClient.put(`/cart/item/${itemId}`, data);
      console.log("✅ Updated cart item:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error updating cart item:",
        error.response?.data || error.message
      );

      // If item not found on server, it might be a local item
      if (error.response?.status === 404) {
        console.warn("Item not found on server, might be local only");
        throw new Error("Item not found on server");
      }

      throw error;
    }
  },

  // Remove item from cart on server
  removeFromCart: async (itemId) => {
    try {
      console.log("🗑️ Removing cart item:", itemId);
      const response = await apiClient.delete(`/cart/item/${itemId}`);
      console.log("✅ Removed cart item:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error removing cart item:",
        error.response?.data || error.message
      );

      // If item not found on server, it might be a local item
      if (error.response?.status === 404) {
        console.warn("Item not found on server, might be local only");
        throw new Error("Item not found on server");
      }

      throw error;
    }
  },

  // Clear entire cart on server
  clearCart: async () => {
    try {
      console.log("🧹 Clearing cart");
      const response = await apiClient.delete("/cart/clear");
      console.log("✅ Cleared cart:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error clearing cart:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Merge guest cart with user cart (when user logs in)
  mergeCarts: async () => {
    try {
      console.log("🔄 Merging carts");
      const response = await apiClient.post("/cart/merge");
      console.log("✅ Merged carts:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error merging carts:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Sync local cart with server
  syncCartWithServer: async (localItems, user) => {
    try {
      console.log("🔄 Syncing cart with server...", { localItems, user });

      if (!user) {
        console.log("No user, skipping sync");
        return null;
      }

      // Get current cart from server
      const serverCart = await cartService.getCart();
      console.log("Server cart:", serverCart);

      // If server cart is empty, add all local items
      if (!serverCart.items || serverCart.items.length === 0) {
        console.log("Server cart empty, adding all local items");

        // Clear any existing items first
        await cartService.clearCart();

        // Add all local items
        for (const item of localItems) {
          await cartService.addToCart({
            product_id: item.product_id,
            quantity: item.quantity,
            size: item.size || "Default",
            color: item.color || "Default",
          });
        }

        // Get updated cart
        return await cartService.getCart();
      }

      console.log("Server has cart items, merging...");
      // Merge strategy: Keep server items, add any missing local items
      const serverProductIds = serverCart.items.map((item) => item.product_id);

      for (const item of localItems) {
        if (!serverProductIds.includes(item.product_id)) {
          await cartService.addToCart({
            product_id: item.product_id,
            quantity: item.quantity,
            size: item.size || "Default",
            color: item.color || "Default",
          });
        }
      }

      return await cartService.getCart();
    } catch (error) {
      console.error("❌ Error syncing cart:", error);
      throw error;
    }
  },
};

export default cartService;
