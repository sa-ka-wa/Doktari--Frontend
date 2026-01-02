import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import cartService from "../services/api/cartService";

// Cart item structure
const CartItem = {
  id: "",
  product_id: "",
  title: "",
  price: 0,
  quantity: 1,
  size: "",
  color: "",
  image_url: "",
  stock_quantity: 0,
  brand_id: null,
  brand_name: "",
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
  cartId: null,
  isSynced: false,
};

// Action types
const CartActionTypes = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  SET_CART: "SET_CART",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SYNC_START: "SYNC_START",
  SYNC_SUCCESS: "SYNC_SUCCESS",
  SYNC_FAILURE: "SYNC_FAILURE",
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product_id === action.payload.product_id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount:
            state.totalAmount + action.payload.price * action.payload.quantity,
          isSynced: false,
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount:
            state.totalAmount + action.payload.price * action.payload.quantity,
          isSynced: false,
        };
      }

    case CartActionTypes.REMOVE_ITEM:
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload.id
      );

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        totalItems: state.totalItems - (itemToRemove?.quantity || 0),
        totalAmount:
          state.totalAmount -
          (itemToRemove?.price || 0) * (itemToRemove?.quantity || 0),
        isSynced: false,
      };

    case CartActionTypes.UPDATE_QUANTITY:
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex === -1) return state;

      const oldItem = state.items[itemIndex];
      const quantityDiff = action.payload.quantity - oldItem.quantity;

      const updatedItems = [...state.items];
      updatedItems[itemIndex] = {
        ...oldItem,
        quantity: action.payload.quantity,
      };

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + oldItem.price * quantityDiff,
        isSynced: false,
      };

    case CartActionTypes.CLEAR_CART:
      return {
        ...initialState,
        isSynced: false,
      };

    case CartActionTypes.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalAmount: action.payload.totalAmount || 0,
        cartId: action.payload.cartId || null,
        isSynced: action.payload.isSynced || false,
      };

    case CartActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case CartActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case CartActionTypes.SYNC_START:
      return { ...state, isLoading: true, isSynced: false };

    case CartActionTypes.SYNC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSynced: true,
        items: action.payload.items || state.items,
        totalItems: action.payload.totalItems || state.totalItems,
        totalAmount: action.payload.totalAmount || state.totalAmount,
      };

    case CartActionTypes.SYNC_FAILURE:
      return {
        ...state,
        isLoading: false,
        isSynced: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Convert server cart items to local format
  const convertServerToLocal = (serverCart) => {
    if (!serverCart || !serverCart.items) {
      return { items: [], totalItems: 0, totalAmount: 0 };
    }

    const items = serverCart.items.map((item) => {
      const product = item.product || {};
      return {
        id: `${product.id}-${item.size || "Default"}-${
          item.color || "Default"
        }`,
        product_id: product.id,
        title: product.title || product.name || "Unknown Product",
        price: product.price || 0,
        quantity: item.quantity || 1,
        size: item.size || "Default",
        color: item.color || "Default",
        image_url: product.image_url || product.imageUrl || "",
        stock_quantity: product.stock_quantity || 0,
        brand_id: product.brand_id || null,
        brand_name: product.brand_name || product.brand?.name || "",
      };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return { items, totalItems, totalAmount, isSynced: true };
  };

  // Load cart from server on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        dispatch({ type: CartActionTypes.SET_LOADING, payload: true });

        // Try to get cart from server
        const serverCart = await cartService.getCart();
        console.log("🛒 Loaded cart from server:", serverCart);

        if (serverCart && serverCart.items) {
          const localCart = convertServerToLocal(serverCart);
          dispatch({
            type: CartActionTypes.SET_CART,
            payload: { ...localCart, isSynced: true },
          });
        } else {
          // Try to load from localStorage as fallback
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            console.log("📦 Loaded cart from localStorage:", parsedCart);
            dispatch({
              type: CartActionTypes.SET_CART,
              payload: { ...parsedCart, isSynced: false },
            });
          }
        }
      } catch (error) {
        console.error("❌ Error loading cart:", error);

        // Load from localStorage as fallback
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          console.log(
            "📦 Loaded cart from localStorage (fallback):",
            parsedCart
          );
          dispatch({
            type: CartActionTypes.SET_CART,
            payload: { ...parsedCart, isSynced: false },
          });
        }

        dispatch({ type: CartActionTypes.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes and sync with server if authenticated
  useEffect(() => {
    const saveAndSyncCart = async () => {
      try {
        // Always save to localStorage
        localStorage.setItem(
          "cart",
          JSON.stringify({
            items: state.items,
            totalItems: state.totalItems,
            totalAmount: state.totalAmount,
            cartId: state.cartId,
            updatedAt: new Date().toISOString(),
          })
        );

        // Sync with server if user is authenticated and cart changed
        if (isAuthenticated && !state.isSynced && state.items.length > 0) {
          console.log("🔄 Syncing cart with server...");
          dispatch({ type: CartActionTypes.SYNC_START });

          const syncedCart = await cartService.syncCartWithServer(
            state.items,
            user
          );

          if (syncedCart) {
            const localCart = convertServerToLocal(syncedCart);
            dispatch({
              type: CartActionTypes.SYNC_SUCCESS,
              payload: localCart,
            });
            console.log("✅ Cart synced with server");
          }
        }
      } catch (error) {
        console.error("❌ Error saving/syncing cart:", error);
        if (isAuthenticated) {
          dispatch({
            type: CartActionTypes.SYNC_FAILURE,
            payload: error.message,
          });
        }
      }
    };

    // Only save if cart has items or we're not loading
    if (!state.isLoading) {
      saveAndSyncCart();
    }
  }, [
    state.items,
    state.totalItems,
    state.totalAmount,
    isAuthenticated,
    user,
    state.isSynced,
  ]);

  // Actions
  const addToCart = async (product, quantity = 1, size = "", color = "") => {
    try {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: true });

      const cartItem = {
        id: `${product.id}-${size || "Default"}-${color || "Default"}`,
        product_id: product.id,
        title: product.title || product.name,
        price: product.price,
        quantity,
        size: size || "Default",
        color: color || "Default",
        image_url: product.image_url || product.imageUrl || "",
        stock_quantity: product.stock_quantity || 0,
        brand_id: product.brand_id,
        brand_name: product.brand_name || product.brand?.name || "",
      };

      // Try to add to server if authenticated
      if (isAuthenticated) {
        try {
          await cartService.addToCart({
            product_id: product.id,
            quantity,
            size: size || "Default",
            color: color || "Default",
          });
        } catch (serverError) {
          console.warn(
            "⚠️ Could not add to server, saving locally:",
            serverError.message
          );
        }
      }

      // Update local state
      dispatch({ type: CartActionTypes.ADD_ITEM, payload: cartItem });

      return {
        success: true,
        message: "Added to cart!",
        item: cartItem,
      };
    } catch (error) {
      dispatch({ type: CartActionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: true });

      // Find the item to get its data for server sync
      const itemToRemove = state.items.find((item) => item.id === itemId);

      // Try to remove from server if authenticated
      if (isAuthenticated && itemToRemove) {
        try {
          // We need to find the server item ID - for now we'll use a workaround
          // In a real app, you'd need to store server item IDs
          console.log(
            "Removing item locally, server sync might be inconsistent"
          );
        } catch (serverError) {
          console.warn("⚠️ Could not remove from server:", serverError.message);
        }
      }

      // Update local state
      dispatch({ type: CartActionTypes.REMOVE_ITEM, payload: { id: itemId } });
    } catch (error) {
      dispatch({ type: CartActionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    try {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: true });

      // Find the item
      const itemToUpdate = state.items.find((item) => item.id === itemId);

      // Try to update on server if authenticated
      if (isAuthenticated && itemToUpdate) {
        try {
          // Similar limitation as remove - need server item ID
          console.log("Updating quantity locally");
        } catch (serverError) {
          console.warn(
            "⚠️ Could not update quantity on server:",
            serverError.message
          );
        }
      }

      // Update local state
      dispatch({
        type: CartActionTypes.UPDATE_QUANTITY,
        payload: { id: itemId, quantity },
      });
    } catch (error) {
      dispatch({ type: CartActionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: true });

      // Try to clear on server if authenticated
      if (isAuthenticated) {
        try {
          await cartService.clearCart();
        } catch (serverError) {
          console.warn(
            "⚠️ Could not clear cart on server:",
            serverError.message
          );
        }
      }

      // Clear local state
      dispatch({ type: CartActionTypes.CLEAR_CART });
      localStorage.removeItem("cart");
    } catch (error) {
      dispatch({ type: CartActionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
    }
  };

  const syncCart = async () => {
    if (!isAuthenticated) {
      console.log("Cannot sync: user not authenticated");
      return;
    }

    try {
      dispatch({ type: CartActionTypes.SYNC_START });
      const syncedCart = await cartService.syncCartWithServer(
        state.items,
        user
      );

      if (syncedCart) {
        const localCart = convertServerToLocal(syncedCart);
        dispatch({
          type: CartActionTypes.SYNC_SUCCESS,
          payload: localCart,
        });
        return localCart;
      }
    } catch (error) {
      console.error("❌ Sync failed:", error);
      dispatch({
        type: CartActionTypes.SYNC_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

  const getCartItemCount = () => state.totalItems;
  const getCartTotal = () => state.totalAmount;

  const isInCart = (productId, size = "", color = "") => {
    return state.items.some(
      (item) =>
        item.product_id === productId &&
        item.size === (size || "Default") &&
        item.color === (color || "Default")
    );
  };

  const value = {
    cart: {
      items: state.items,
      total_items: state.totalItems,
      total_amount: state.totalAmount,
      cart_id: state.cartId,
    },
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    isLoading: state.isLoading,
    error: state.error,
    isSynced: state.isSynced,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
