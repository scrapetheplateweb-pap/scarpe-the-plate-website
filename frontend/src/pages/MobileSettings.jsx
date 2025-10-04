import React, { useState, useEffect } from 'react';

export default function MobileSettings() {
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    services: true,
    media: true,
    about: true,
    cta: true
  });
  
  const [navigationItems, setNavigationItems] = useState([
    'home', 'about', 'comedy', 'car-wraps', 'modeling', 'media', 'store'
  ]);
  
  const [fontSizes, setFontSizes] = useState({
    heading: '1.8rem',
    subheading: '1.2rem',
    body: '1rem'
  });
  
  const [layoutMode, setLayoutMode] = useState('single-column');
  
  const [mobileContent, setMobileContent] = useState({});
  const [editingContent, setEditingContent] = useState({
    page: 'home',
    field: 'title',
    value: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMobileSettings();
  }, []);

  const loadMobileSettings = async () => {
    try {
      const response = await fetch('/api/mobile-settings', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.section_visibility) setSectionVisibility(data.section_visibility);
        if (data.navigation_items) setNavigationItems(data.navigation_items);
        if (data.font_sizes) setFontSizes(data.font_sizes);
        if (data.layout_mode) setLayoutMode(data.layout_mode);
        if (data.mobile_content) setMobileContent(data.mobile_content);
      }
    } catch (error) {
      console.error('Failed to load mobile settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mobile-settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ value })
      });

      if (response.ok) {
        setSuccessMessage(`${key} updated successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to update setting');
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      alert('Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionVisibilityChange = (section) => {
    const updated = {
      ...sectionVisibility,
      [section]: !sectionVisibility[section]
    };
    setSectionVisibility(updated);
    updateSetting('section_visibility', updated);
  };

  const handleNavigationToggle = (item) => {
    const updated = navigationItems.includes(item)
      ? navigationItems.filter(i => i !== item)
      : [...navigationItems, item];
    setNavigationItems(updated);
    updateSetting('navigation_items', updated);
  };

  const handleFontSizeChange = (type, value) => {
    const updated = { ...fontSizes, [type]: value };
    setFontSizes(updated);
  };

  const saveFontSizes = () => {
    updateSetting('font_sizes', fontSizes);
  };

  const handleLayoutChange = (mode) => {
    setLayoutMode(mode);
    updateSetting('layout_mode', mode);
  };

  const saveMobileContent = () => {
    const key = `${editingContent.page}_${editingContent.field}`;
    const updated = {
      ...mobileContent,
      [key]: editingContent.value
    };
    setMobileContent(updated);
    updateSetting('mobile_content', updated);
  };

  const resetToDefaults = async () => {
    if (!confirm('Reset all mobile settings to defaults?')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/mobile-settings/reset', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        await loadMobileSettings();
        setSuccessMessage('Mobile settings reset to defaults!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const allNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'car-wraps', label: 'Car Wrapping' },
    { id: 'modeling', label: 'Modeling' },
    { id: 'media', label: 'Media' },
    { id: 'store', label: 'Store' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Mobile Settings</h2>
        <button 
          onClick={resetToDefaults}
          disabled={loading}
          style={{
            background: '#f50505',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset to Defaults
        </button>
      </div>

      {successMessage && (
        <div style={{
          background: '#00ff00',
          color: '#000',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          {successMessage}
        </div>
      )}

      {/* Section Visibility */}
      <div className="admin-section" style={{ marginBottom: '2rem' }}>
        <h3>📱 Section Visibility (Mobile Only)</h3>
        <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>
          Control which homepage sections are visible on mobile devices
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries(sectionVisibility).map(([section, visible]) => (
            <label key={section} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={visible}
                onChange={() => handleSectionVisibilityChange(section)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{section} Section</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="admin-section" style={{ marginBottom: '2rem' }}>
        <h3>📲 Mobile Navigation Menu</h3>
        <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>
          Customize which links appear in the mobile navigation menu
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {allNavItems.map((item) => (
            <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={navigationItems.includes(item.id)}
                onChange={() => handleNavigationToggle(item.id)}
                style={{ width: '20px', height: '20px' }}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Font Sizes */}
      <div className="admin-section" style={{ marginBottom: '2rem' }}>
        <h3>🔤 Mobile Font Sizes</h3>
        <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>
          Adjust text sizes for better mobile readability
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Heading Size:</label>
            <input
              type="text"
              value={fontSizes.heading}
              onChange={(e) => handleFontSizeChange('heading', e.target.value)}
              placeholder="e.g., 1.8rem"
              style={{ width: '200px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subheading Size:</label>
            <input
              type="text"
              value={fontSizes.subheading}
              onChange={(e) => handleFontSizeChange('subheading', e.target.value)}
              placeholder="e.g., 1.2rem"
              style={{ width: '200px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Body Text Size:</label>
            <input
              type="text"
              value={fontSizes.body}
              onChange={(e) => handleFontSizeChange('body', e.target.value)}
              placeholder="e.g., 1rem"
              style={{ width: '200px' }}
            />
          </div>
          <button onClick={saveFontSizes} disabled={loading}>
            Save Font Sizes
          </button>
        </div>
      </div>

      {/* Layout Mode */}
      <div className="admin-section" style={{ marginBottom: '2rem' }}>
        <h3>📐 Mobile Layout Mode</h3>
        <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>
          Choose how content is displayed on mobile devices
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="layout"
              checked={layoutMode === 'single-column'}
              onChange={() => handleLayoutChange('single-column')}
            />
            <span>Single Column (Stacked)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="layout"
              checked={layoutMode === 'grid'}
              onChange={() => handleLayoutChange('grid')}
            />
            <span>Grid (2 Columns)</span>
          </label>
        </div>
      </div>

      {/* Mobile-Specific Content */}
      <div className="admin-section">
        <h3>✏️ Mobile-Specific Content</h3>
        <p style={{ color: '#aaa9ad', marginBottom: '1rem' }}>
          Write shorter descriptions that only appear on mobile devices
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Page:</label>
            <select
              value={editingContent.page}
              onChange={(e) => setEditingContent({ ...editingContent, page: e.target.value })}
              style={{ width: '100%', maxWidth: '300px' }}
            >
              <option value="home">Home</option>
              <option value="about">About</option>
              <option value="comedy">Comedy</option>
              <option value="car-wraps">Car Wraps</option>
              <option value="modeling">Modeling</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Field:</label>
            <select
              value={editingContent.field}
              onChange={(e) => setEditingContent({ ...editingContent, field: e.target.value })}
              style={{ width: '100%', maxWidth: '300px' }}
            >
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="tagline">Tagline</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mobile Content:</label>
            <textarea
              value={editingContent.value}
              onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
              placeholder="Enter mobile-specific content..."
              rows={4}
              style={{ width: '100%' }}
            />
          </div>
          <button onClick={saveMobileContent} disabled={loading}>
            Save Mobile Content
          </button>
        </div>
      </div>
    </div>
  );
}
