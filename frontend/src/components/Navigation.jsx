import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav>
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
          <Link to="/comedy" className={isActive('/comedy')}>Comedy</Link>
          <Link to="/car-wraps" className={isActive('/car-wraps')}>Car Wrapping</Link>
          <Link to="/modeling" className={isActive('/modeling')}>Modeling</Link>
          <Link to="/media" className={isActive('/media')}>Media</Link>
          <Link to="/store" className={isActive('/store')}>Store</Link>
        </div>
        
        <div className="nav-auth">
          {user ? (
            <div className="user-menu">
              <button 
                className="user-menu-button" 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                👤 {user.displayName || user.username}
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p><strong>{user.displayName || user.username}</strong></p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="login-button" 
              onClick={() => setShowAuthModal(true)}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
