import React, { useState } from 'react';
import './Careers.css';

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    experience: '',
    portfolio_url: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service_type) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service_type: '',
          experience: '',
          portfolio_url: '',
          message: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container careers-page">
      <h1>Join Our Team</h1>
      <p className="careers-intro">
        Are you a talented comedian, skilled car wrapper, or professional model? 
        We're always looking for passionate individuals to join our growing team!
      </p>

      <div className="careers-benefits">
        <div className="benefit-card">
          <h3>🎭 Comedians</h3>
          <p>Showcase your talent at our events and grow your audience with us</p>
        </div>
        <div className="benefit-card">
          <h3>🚗 Car Wrappers</h3>
          <p>Join our team of expert installers and work on exciting projects</p>
        </div>
        <div className="benefit-card">
          <h3>📸 Models</h3>
          <p>Work with professional photographers and build your portfolio</p>
        </div>
      </div>

      {success && (
        <div className="success-message">
          Thank you for your application! We'll review it and get back to you soon.
        </div>
      )}

      <div className="application-form-container">
        <h2>Submit Your Application</h2>
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Service Type *</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
              >
                <option value="">Select one...</option>
                <option value="comedy">Comedy</option>
                <option value="car_wrapping">Car Wrapping</option>
                <option value="modeling">Modeling</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 3 years"
            />
          </div>

          <div className="form-group">
            <label>Portfolio/Resume Link</label>
            <input
              type="url"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="https://"
            />
          </div>

          <div className="form-group">
            <label>Tell Us About Yourself</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Share your experience, skills, and why you'd like to work with us..."
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
