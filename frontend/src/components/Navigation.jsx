import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav>
      <Link to="/" className={isActive('/')}>Home</Link>
      <Link to="/about" className={isActive('/about')}>About</Link>
      <Link to="/comedy" className={isActive('/comedy')}>Comedy</Link>
      <Link to="/car-wraps" className={isActive('/car-wraps')}>Car Wrapping</Link>
      <Link to="/modeling" className={isActive('/modeling')}>Modeling</Link>
      <Link to="/media" className={isActive('/media')}>Media</Link>
      <Link to="/contact" className={isActive('/contact')}>Contact</Link>
    </nav>
  );
}
