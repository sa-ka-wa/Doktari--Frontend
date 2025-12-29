// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Cart item structure
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
  cartId: null // For guest carts
};

// Action types
const CartActionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SYNC_CART: 'SYNC_CART'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.product_id === action.payload.product_id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      );

      if (existingItemIndex > -1) {
        // Update existing item
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
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: state.totalItems + action.payload.quantity,
          totalAmount: state.totalAmount + (action.payload.price * action.payload.quantity)
        };
      }

    case CartActionTypes.REMOVE_ITEM:
      const itemToRemove = state.items.find(
        item => item.id === action.payload.id
      );

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
        cartId: state.cartId // Preserve cart ID for guests
      };

    case CartActionTypes.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalAmount: action.payload.totalAmount || 0,
        cartId: action.payload.cartId || null
      };

    case CartActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case CartActionTypes.SET_ERROR:
      return { ...state, error: action.payload };

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

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: CartActionTypes.SET_CART, payload: parsedCart });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const saveCart = () => {
      try {
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          totalItems: state.totalItems,
          totalAmount: state.totalAmount,
          cartId: state.cartId
        }));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    };

    saveCart();
  }, [state]);

  // Sync cart with server when user logs in
  useEffect(() => {
    const syncCartWithServer = async () => {
      if (isAuthenticated && state.items.length > 0) {
        try {
          dispatch({ type: CartActionTypes.SET_LOADING, payload: true });
          // TODO: Implement API call to sync cart with server
          console.log('Syncing cart with server...', state.items);
          dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
        } catch (error) {
          console.error('Error syncing cart with server:', error);
          dispatch({ type: CartActionTypes.SET_LOADING, payload: false });
          dispatch({ type: CartActionTypes.SET_ERROR, payload: error.message });
        }
      }
    };

    syncCartWithServer();
  }, [isAuthenticated, state.items]);

  // Actions
  const addToCart = (product, quantity = 1, size = '', color = '') => {
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
    
    // Return success for toast notifications
    return {
      success: true,
      message: 'Added to cart!',
      item: cartItem
    };
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: CartActionTypes.REMOVE_ITEM, payload: { id: itemId } });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    dispatch({ type: CartActionTypes.UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  const getCartItemCount = () => {
    return state.totalItems;
  };

  const getCartTotal = () => {
    return state.totalAmount;
  };

  const isInCart = (productId, size = '', color = '') => {
    return state.items.some(
      item => item.product_id === productId && 
              item.size === size && 
              item.color === color
    );
  };

  const value = {
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    isLoading: state.isLoading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
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