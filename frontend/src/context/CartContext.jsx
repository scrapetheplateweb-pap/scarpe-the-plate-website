import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product_id: productId, quantity })
      });

      if (response.ok) {
        await loadCart();
        return true;
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add to cart');
        return false;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        await loadCart();
      }
    } catch (error) {
      console.error('Update cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await loadCart();
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setCart([]);
      }
    } catch (error) {
      console.error('Clear cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
