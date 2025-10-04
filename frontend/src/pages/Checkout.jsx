import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

function CheckoutForm({ totalAmount, customerInfo, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
          receipt_email: customerInfo.email,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message);
        setProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Payment Details</h3>
      <PaymentElement />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || processing} className="pay-button">
        {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const items = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      const paymentResponse = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const paymentData = await paymentResponse.json();
      setClientSecret(paymentData.clientSecret);
      setOrderCreated(true);
    } catch (error) {
      console.error('Order creation error:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const items = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          shipping_address: customerInfo.address,
          items
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      await clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Failed to finalize order:', error);
      alert(error.message || 'Failed to finalize order');
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-form">
          {!orderCreated ? (
            <form onSubmit={handleCreateOrder}>
              <h3>Customer Information</h3>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                />
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  rows="3"
                />
              </div>
              <button type="submit" className="continue-button">Continue to Payment</button>
            </form>
          ) : (
            clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  totalAmount={getCartTotal()} 
                  customerInfo={customerInfo}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            )
          )}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total</strong>
            <strong>${getCartTotal().toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
