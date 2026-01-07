// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/api/cartService';

// Cart item structure (for reference)
const CartItem = {
  id: '',
  product_id: '',
  title: '',
  price: 0,
  quantity: 1,
  size: '',
  color: '',
  image_url: '',
  stock_quantity: 0,
  brand_id: null,
  brand_name: ''
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
  cartId: null,
  lastSynced: null
};

// Action types
const CartActionTypes = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SYNC_CART: 'SYNC_CART'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalAmount: action.payload.totalAmount || 0,
        cartId: action.payload.cartId || null,
        lastSynced: new Date().toISOString(),
        error: null
      };

    case CartActionTypes.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.product_id === action.payload.product_id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };

        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.price * action.payload.quantity)
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.price * action.payload.quantity)
        };
      }

    case CartActionTypes.REMOVE_ITEM:
      const itemToRemove = state.items.find(item => item.id === action.payload.id);
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity)
      };

    case CartActionTypes.UPDATE_QUANTITY:
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex === -1) return state;

      const oldItem = state.items[itemIndex];
      const quantityDiff = action.payload.quantity - oldItem.quantity;

      const updatedItems = [...state.items];
      updatedItems[itemIndex] = {
        ...oldItem,
        quantity: action.payload.quantity
      };

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + (oldItem.price * quantityDiff)
      };

    case CartActionTypes.CLEAR_CART:
      return {
        ...initialState,
        lastSynced: new Date().toISOString()
      };

    case CartActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case CartActionTypes.SET_ERROR:
      return { ...state, error: action.payload };

    case CartActionTypes.SYNC_CART:
      return {
        ...state,
        ...action.payload,
        lastSynced: new Date().toISOString()
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
  const { user, isAuthenticated, token } = useAuth();

  // Load cart from backend on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        dispatch({ type: CartActionTypes.SET_LOADING, payload: true });
        
        // Try to load from backend
        const cart = await cartService.getCart();
        dispatch({ type: CartActionTypes.SET_CART, payload: cart });
        
        // Save to localStorage as backup
        cartService.saveCartToLocalStorage(cart);
        
        // Save session ID for guest users
        if (!isAuthenticated && cart.session_id) {
          localStorage.setItem('session_id', cart.session_id);
        }
        
      } catch (error) {
        console.error('Error loading cart from backend:', error);
        
        // Fallback to localStorage
        const localCart = cartService.loadCartFromLocalStorage();
        dispatch({ type: CartActionTypes.SET_CART, payload: localCart });
        
        dispatch({ 
          type: CartActionTypes.SET_ERROR, 
          payload: 'Using local cart. Backend unavailable.' 
        });
      } finally {
        dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Merge guest cart with user cart when user logs in
  useEffect(() => {
    const mergeCarts = async () => {
      if (isAuthenticated) {
        try {
          dispatch({ type: CartActionTypes.SET_LOADING, payload: true });
          const cart = await cartService.mergeCarts();
          dispatch({ type: CartActionTypes.SET_CART, payload: cart });
        } catch (error) {
          console.error('Error merging carts:', error);
        } finally {
          dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
        }
      }
    };

    mergeCarts();
  }, [isAuthenticated]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    const cartData = {
      items: state.items,
      totalItems: state.totalItems,
      totalAmount: state.totalAmount,
      cartId: state.cartId
    };
    cartService.saveCartToLocalStorage(cartData);
  }, [state.items, state.totalItems, state.totalAmount, state.cartId]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, size = '', color = '') => {
    try {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: true });
      
      // Add to backend
      const cart = await cartService.addToCart(product.id, quantity, size, color);
      
      // Update state with backend response
      dispatch({ type: CartActionTypes.SET_CART, payload: cart });
      
      return {
        success: true,
        message: 'Added to cart!',
        item: {
          id: `${product.id}-${size}-${color}`,
          product_id: product.id,
          title: product.title || product.name,
          price: product.price,
          quantity,
          size,
          color,
          image_url: product.image_url || product.imageUrl,
          stock_quantity: product.stock_quantity,
          brand_id: product.brand_id,
          brand_name: product.brand_name || product.brand?.name
        }
      };
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Fallback to local state
      const cartItem = {
        id: `${product.id}-${size}-${color}`,
        product_id: product.id,
        title: product.title || product.name,
        price: product.price,
        quantity,
        size,
        color,
        image_url: product.image_url || product.imageUrl,
        stock_quantity: product.stock_quantity,
        brand_id: product.brand_id,
        brand_name: product.brand_name || product.brand?.name
      };
      
      dispatch({ type: CartActionTypes.ADD_ITEM, payload: cartItem });
      
      return {
        success: true,
        message: 'Added to cart (offline mode)',
        item: cartItem
      };
    } finally {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      // Try to remove from backend first
      await cartService.removeCartItem(itemId);
    } catch (error) {
      console.error('Error removing from backend cart:', error);
      // Continue with local removal even if backend fails
    }
    
    // Update local state
    dispatch({ type: CartActionTypes.REMOVE_ITEM, payload: { id: itemId } });
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    try {
      // Try to update backend first
      await cartService.updateCartItem(itemId, quantity);
    } catch (error) {
      console.error('Error updating quantity in backend cart:', error);
      // Continue with local update even if backend fails
    }
    
    // Update local state
    dispatch({ type: CartActionTypes.UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  };

  // Clear cart
  const clearCart = async () => {
    try {
      // Try to clear backend first
      await cartService.clearCart();
    } catch (error) {
      console.error('Error clearing backend cart:', error);
      // Continue with local clear even if backend fails
    }
    
    // Clear local state
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  // Sync cart with backend
  const syncCart = async () => {
    try {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: true });
      const cart = await cartService.syncCart(state.items);
      dispatch({ type: CartActionTypes.SYNC_CART, payload: cart });
      return { success: true, message: 'Cart synced successfully' };
    } catch (error) {
      console.error('Error syncing cart:', error);
      return { success: false, message: 'Failed to sync cart' };
    } finally {
      dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
    }
  };

  // Check if product is in cart
  const isInCart = (productId, size = '', color = '') => {
    return state.items.some(
      item => item.product_id === productId && 
              item.size === size && 
              item.color === color
    );
  };

  const getCartItemCount = () => state.totalItems;
  const getCartTotal = () => state.totalAmount;

  const value = {
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    isLoading: state.isLoading,
    error: state.error,
    lastSynced: state.lastSynced,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
    getCartItemCount,
    getCartTotal,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};       