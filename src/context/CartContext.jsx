import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCartItems([]);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        const imageUrl = product.images && product.images.length > 0
          ? (product.images[0].image_url.startsWith('http') 
              ? product.images[0].image_url 
              : `http://localhost:8000${product.images[0].image_url}`)
          : '/placeholder-image.jpg';
          
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: imageUrl
        }];
      }
    });
    
    // Open cart sidebar when adding item
    setCartOpen(true);
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
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

  return (
    <CartContext.Provider value={{
      cartItems,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);