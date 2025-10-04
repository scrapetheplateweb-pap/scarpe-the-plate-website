import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container cart-page">
        <h1>Shopping Cart</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/store"><button>Continue Shopping</button></Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="cart-item-image" />
                )}
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">${Number(item.price).toFixed(2)} each</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}>+</button>
                  </div>
                  <p className="cart-item-subtotal">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <h3>Total: ${getCartTotal().toFixed(2)}</h3>
            </div>
            <div className="cart-actions">
              <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
              <button onClick={handleCheckout} className="checkout-btn">Proceed to Checkout</button>
            </div>
            <Link to="/store" className="continue-shopping">Continue Shopping</Link>
          </div>
        </>
      )}
    </div>
  );
}
