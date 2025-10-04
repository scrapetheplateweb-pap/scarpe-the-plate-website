import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

export default function OrderSuccess() {
  return (
    <div className="container order-success-page">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <h1>Order Successful!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        <p>You will receive an email confirmation shortly.</p>
        <div className="success-actions">
          <Link to="/store"><button>Continue Shopping</button></Link>
          <Link to="/"><button className="secondary-btn">Return Home</button></Link>
        </div>
      </div>
    </div>
  );
}
