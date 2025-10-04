import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'comedy',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookings = JSON.parse(localStorage.getItem('siteBookings') || '[]');
    const newBooking = {
      id: Date.now(),
      ...formData,
      page: formData.service,
      date: new Date().toISOString().split('T')[0],
      time: 'Contact Inquiry',
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem('siteBookings', JSON.stringify(bookings));
    
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'comedy',
      message: ''
    });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Ready to Book? Let's Make It Happen.</p>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Information</h2>
            
            <div className="info-block">
              <h3>🎤 Comedy Bookings</h3>
              <p>Book our comedians for your next event, club, or private party.</p>
            </div>
            
            <div className="info-block">
              <h3>🚗 Car Wrapping</h3>
              <p>Transform your ride with custom wraps, graphics, and designs.</p>
            </div>
            
            <div className="info-block">
              <h3>📸 Modeling Services</h3>
              <p>Professional modeling for photoshoots, events, and promotional work.</p>
            </div>
            
            <div className="info-block">
              <h3>📍 Service Area</h3>
              <p>Nationwide service with roots in Atlanta, the Carolinas, and Virginia.</p>
            </div>
            
            <div className="info-block">
              <h3>⏰ Hours</h3>
              <p>Available for bookings 7 days a week</p>
              <p>Response time: Within 24 hours</p>
            </div>
            
            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#" className="social-btn">Facebook</a>
                <a href="#" className="social-btn">Instagram</a>
                <a href="#" className="social-btn">Twitter</a>
                <a href="#" className="social-btn">YouTube</a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            
            {submitted && (
              <div className="success-message">
                <h3>✓ Message Sent!</h3>
                <p>We'll get back to you within 24 hours.</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="service">Service Interested In *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="comedy">Comedy</option>
                  <option value="car-wraps">Car Wrapping</option>
                  <option value="modeling">Modeling</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
