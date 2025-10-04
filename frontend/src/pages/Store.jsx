import React, { useState } from 'react';
import './Store.css';

export default function Store() {
  const [products] = useState([
    {
      id: 1,
      name: 'Scape the Plate T-Shirt',
      price: 25.00,
      image: 'https://via.placeholder.com/300x300/9300c5/ffffff?text=T-Shirt',
      description: 'Premium quality t-shirt with our signature logo'
    },
    {
      id: 2,
      name: 'Scape the Plate Hoodie',
      price: 45.00,
      image: 'https://via.placeholder.com/300x300/f50505/ffffff?text=Hoodie',
      description: 'Comfortable hoodie featuring the Scape the Plate brand'
    },
    {
      id: 3,
      name: 'Custom Car Wrap Package',
      price: 299.00,
      image: 'https://via.placeholder.com/300x300/9300c5/ffffff?text=Car+Wrap',
      description: 'Professional car wrap design and installation package'
    }
  ]);

  return (
    <div className="container store-page">
      <h1>Store</h1>
      <p className="store-intro">
        Get official Scape the Plate merchandise and exclusive packages!
      </p>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="store-notice">
        <p>🛒 Online store coming soon! For now, contact us to place an order.</p>
      </div>
    </div>
  );
}
