import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.username, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password, formData.displayName);
      }
      setFormData({ username: '', email: '', password: '', displayName: '' });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        
        <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username{mode === 'login' && ' or Email'}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label>Display Name (Optional)</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            </>
          )}

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {mode === 'register' && (
              <small>Must be at least 6 characters</small>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <p>Don't have an account? <button onClick={switchMode}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={switchMode}>Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
