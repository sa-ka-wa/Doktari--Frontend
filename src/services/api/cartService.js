
// src/services/CartService.js
import apiClient from './apiClient';

class CartService {
  // Get current cart
  async getCart() {
    try {
      const response = await apiClient.get('/cart');
      return this.transformCartData(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(productId, quantity = 1, size = '', color = '') {
    try {
      const response = await apiClient.post('/cart/add', {
        product_id: productId,
        quantity,
        size,
        color
      });
      return this.transformCartData(response.data.cart || response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    try {
      const response = await apiClient.put(`/cart/item/${itemId}`, {
        quantity
      });
      return this.transformCartData(response.data.cart || response.data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeCartItem(itemId) {
    try {
      const response = await apiClient.delete(`/cart/item/${itemId}`);
      return this.transformCartData(response.data.cart || response.data);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const response = await apiClient.delete('/cart/clear');
      return this.transformCartData(response.data.cart || response.data);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Merge guest cart with user cart
  async mergeCarts() {
    try {
      const response = await apiClient.post('/cart/merge');
      return this.transformCartData(response.data.cart || response.data);
    } catch (error) {
      console.error('Error merging carts:', error);
      throw error;
    }
  }

  // Transform backend data to frontend format
  transformCartData(cart) {
    if (!cart) {
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        cartId: null,
        session_id: null
      };
    }

    const items = (cart.items || []).map(item => ({
      id: item.id?.toString() || `${item.product_id}-${item.size || ''}-${item.color || ''}`,
      item_id: item.id, // Keep original ID for API calls
      product_id: item.product_id,
      title: item.product?.title || item.product?.name || 'Unknown Product',
      price: item.product?.price || item.price || 0,
      quantity: item.quantity || 1,
      size: item.size || '',
      color: item.color || '',
      image_url: item.product?.image_url || item.product?.imageUrl || '',
      stock_quantity: item.product?.stock_quantity || item.stock_quantity || 0,
      brand_id: item.product?.brand_id || item.brand_id,
      brand_name: item.product?.brand_name || item.product?.brand?.name || ''
    }));

    const totalItems = cart.total_items || items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = cart.total_amount || items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

    return {
      items,
      totalItems,
      totalAmount,
      cartId: cart.id || cart.cartId || null,
      session_id: cart.session_id || null
    };
  }

  // Sync local cart with backend
  async syncCart(localItems) {
    try {
      // Get current cart from backend
      const backendCart = await this.getCart();
      
      // Merge logic can be implemented here if needed
      return backendCart;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }

  // Save cart to localStorage
  saveCartToLocalStorage(cart) {
    try {
      localStorage.setItem('cart', JSON.stringify({
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        cartId: cart.cartId,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  // Load cart from localStorage
  loadCartFromLocalStorage() {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return this.transformCartData(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return this.transformCartData(null);
  }
}

export default new CartService();