import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSiteContent } from '../utils/content';
import './Footer.css';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  });

  useEffect(() => {
    const content = getSiteContent();
    if (content.social) {
      setSocialLinks(content.social);
    }
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <h3>Scape the Plate</h3>
          <p className="footer-tagline">This isn't just a brand. This isn't just business. This is Scape the Plate.</p>
          <p style={{ marginTop: '1rem', color: '#aaa9ad' }}>Est. 2000 – Present</p>
        </div>
        
        <div className="footer-section">
          <h4>Our Services</h4>
          <p>🎤 Live Comedy Shows</p>
          <p>🚗 Custom Car Wrapping</p>
          <p>📸 Professional Modeling</p>
        </div>

        <div className="footer-section">
          <h4>Get In Touch</h4>
          <p>📧 info@scrapetheplate.com</p>
          <p>📱 (555) 123-4567</p>
          <p>📍 Serving Nationwide</p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/contact" style={{ color: '#9300c5', textDecoration: 'none', fontWeight: 'bold' }}>Contact Form →</Link>
          </p>
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(245, 5, 5, 0.1)', 
            border: '2px solid #f50505', 
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <Link to="/careers" style={{ 
              color: '#f50505', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              💼 Join Our Team →
            </Link>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/comedy">Comedy</Link>
            <Link to="/car-wraps">Car Wraps</Link>
            <Link to="/modeling">Modeling</Link>
            <Link to="/media">Media</Link>
            <Link to="/store">Store</Link>
          </div>
          <div className="social-links" style={{ marginTop: '1rem', alignItems: 'center' }}>
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>Facebook</a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>Instagram</a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>Twitter</a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>YouTube</a>
            )}
            {!socialLinks.facebook && !socialLinks.instagram && !socialLinks.twitter && !socialLinks.youtube && (
              <>
                <a href="#" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>Facebook</a>
                <a href="#" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>Instagram</a>
                <a href="#" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>Twitter</a>
                <a href="#" className="social-link" style={{ borderLeft: 'none', textAlign: 'center' }}>YouTube</a>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Scape the Plate Entertainment. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link to="/admin" style={{ color: '#9300c5', textDecoration: 'none', fontWeight: 'bold', transition: 'color 0.3s' }}>Admin Access</Link>
        </p>
      </div>
    </footer>
  );
}
