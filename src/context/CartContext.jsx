import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

// API base URL
const API_URL = 'http://localhost:8000/api/cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('session_id') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // If a user logs in, we should fetch their cart to ensure it's up-to-date
    if (token) {
      fetchCart();
    }
  }, []);


  // Fetch cart from API
  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {}
      };

      if (isAuthenticated) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      } else if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
      }

      const response = await axios.get(`${API_URL}/show`, config);

      if (response.data && response.data.items) {
        const formattedItems = response.data.items.map(item => ({
          id: item.product_id,
          name: item.product.name,
          price: parseFloat(item.unit_price),
          quantity: item.quantity,
          cartItemId: item.id,
          image: item.product.images && item.product.images.length > 0
            ? (item.product.images[0].image_url.startsWith('http')
              ? item.product.images[0].image_url
              : `http://localhost:8000${item.product.images[0].image_url}`)
            : '/placeholder-image.jpg'
        }));

        setCartItems(formattedItems);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart. Please try again.');

      // If cart not found, use empty array
      if (err.response && err.response.status === 404) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = isAuthenticated ? `${API_URL}/client/add` : `${API_URL}/guest/add`;
      const payload = {
        product_id: product.id,
        quantity
      };

      const config = {
        headers: {}
      };

      if (isAuthenticated) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      } else if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
      }

      const response = await axios.post(endpoint, payload, config);

      // Store session ID from response if present
      if(!isAuthenticated && response.data.session_id) {
        localStorage.setItem('session_id', response.data.session_id);
        setSessionId(response.data.session_id);
      }
      // Refresh cart after adding item
      await fetchCart();

      // Open cart sidebar when adding item
      setCartOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      // Find cart item ID which is different from product ID
      const cartItem = cartItems.find(item => item.id === productId);
      if (!cartItem || !cartItem.cartItemId) {
        throw new Error('Cart item not found');
      }

      const config = {
        headers: {}
      };

      if (isAuthenticated) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      } else if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
      }

      await axios.delete(`${API_URL}/item/remove/${cartItem.cartItemId}`, config);

      // Update local state after successful deletion
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    setError(null);

    try {
      // Find cart item ID which is different from product ID
      const cartItem = cartItems.find(item => item.id === productId);
      if (!cartItem || !cartItem.cartItemId) {
        throw new Error('Cart item not found');
      }

      const config = {
        headers: {}
      };

      if (isAuthenticated) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      } else if (sessionId) {
        config.headers['X-Session-Id'] = sessionId;
      }

      await axios.post(`${API_URL}/item/update`, {
        cart_item_id: cartItem.cartItemId,
        quantity: Math.max(1, quantity)
      }, config);

      // Update local state after successful update
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    // Since there's no specific API for clearing the entire cart,
    // we'll remove each item individually
    cartItems.forEach(item => removeFromCart(item.id));
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Toggle cart sidebar
  const toggleCart = () => {
    setCartOpen(prev => !prev);
  };

  // Merge guest cart with user cart after login
  const mergeCartsAfterLogin = async (token) => {
    if (!sessionId) return;

    try {
      await axios.post(`${API_URL}/merge`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Session-Id': sessionId
        }
      });

      // Clear the session ID since we're now authenticated
      localStorage.removeItem('session_id');
      setSessionId(null);

      // Update authentication status and fetch the merged cart
      setIsAuthenticated(true);
      await fetchCart();
    } catch (err) {
      console.error('Error merging carts:', err);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartOpen,
      loading,
      error,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      toggleCart,
      fetchCart,
      mergeCartsAfterLogin,
      isAuthenticated
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);