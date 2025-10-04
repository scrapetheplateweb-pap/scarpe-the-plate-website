import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Store.css';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, getCartCount } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products?active=true');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="container store-page">
        <h1>Store</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container store-page">
      <div className="store-header">
        <div>
          <h1>Store</h1>
          <p className="store-intro">
            Get official Scape the Plate merchandise and exclusive packages!
          </p>
        </div>
        <Link to="/cart" className="view-cart-btn">
          🛒 View Cart ({getCartCount()})
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="store-notice">
          <p>No products available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="product-image" />
              ) : (
                <div className="product-placeholder">
                  <span>{product.name}</span>
                </div>
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                {product.stock > 0 ? (
                  <div className="product-footer">
                    <span className="product-price">${Number(product.price).toFixed(2)}</span>
                    <button 
                      className="add-to-cart-btn" 
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ) : (
                  <div className="product-footer">
                    <span className="out-of-stock">Out of Stock</span>
                  </div>
                )}
                <p className="stock-info">{product.stock} in stock</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
