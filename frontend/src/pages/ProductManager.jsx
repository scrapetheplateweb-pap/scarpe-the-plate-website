import React, { useState, useEffect } from 'react';

export default function ProductManager({ onSuccess }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    stock: '0',
    category: '',
    active: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Load products error:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      alert('Name and price are required!');
      return;
    }

    setLoading(true);
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        resetForm();
        await loadProducts();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Save product error:', err);
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      stock: product.stock,
      category: product.category || '',
      active: product.active
    });
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        onSuccess('Product deleted successfully!');
        await loadProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      stock: '0',
      category: '',
      active: true
    });
    setEditingProduct(null);
    setError('');
  };

  return (
    <div>
      <h3>{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>

      {error && (
        <div style={{
          background: '#f50505',
          color: 'white',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows="3"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Price * ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              step="0.01"
              min="0"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleFormChange}
              min="0"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Image URL
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleFormChange}
            placeholder="https://example.com/image.jpg"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            style={{ width: '100%' }}
          >
            <option value="">Select Category</option>
            <option value="merchandise">Merchandise</option>
            <option value="services">Services</option>
            <option value="packages">Packages</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', color: '#f50505', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleFormChange}
              style={{ marginRight: '0.5rem' }}
            />
            Active (visible in store)
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
          </button>
          {editingProduct && (
            <button type="button" onClick={resetForm} style={{ background: '#666' }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3>Product Inventory ({products.length})</h3>
      {loading && <p>Loading...</p>}
      
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {products.length === 0 ? (
          <div className="patch-item">
            <p style={{ color: '#aaa9ad' }}>No products yet. Create your first product above!</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="patch-item" style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#9300c5', fontSize: '1.1rem' }}>{product.name}</strong>
                    {!product.active && (
                      <span style={{ 
                        background: '#666', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '3px', 
                        fontSize: '0.7rem' 
                      }}>
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#aaa9ad', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#aaa9ad' }}>
                    <span>Price: <strong style={{ color: '#f50505' }}>${Number(product.price).toFixed(2)}</strong></span>
                    <span>Stock: <strong style={{ color: product.stock > 0 ? '#00aa00' : '#f50505' }}>{product.stock}</strong></span>
                    {product.category && <span>Category: <strong>{product.category}</strong></span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEdit(product)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#9300c5',
                      fontSize: '0.9rem'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#f50505',
                      fontSize: '0.9rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
