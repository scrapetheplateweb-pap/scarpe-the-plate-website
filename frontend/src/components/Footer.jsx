import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Scape the Plate Entertainment</h3>
          <p>Est. 2000 – Present</p>
          <p className="footer-tagline">This isn't just a brand. This isn't just business. This is Scape the Plate.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/comedy">Comedy</Link>
            <Link to="/car-wraps">Car Wrapping</Link>
            <Link to="/modeling">Modeling</Link>
            <Link to="/media">Media</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <p>🎤 Live Comedy Shows</p>
          <p>🚗 Custom Car Wrapping</p>
          <p>📸 Professional Modeling</p>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">YouTube</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Scape the Plate Entertainment. All rights reserved.</p>
        <p>Serving customers nationwide since 2000</p>
      </div>
    </footer>
  );
}
