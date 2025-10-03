import React, { useState } from 'react';

export default function Admin() {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('patches');
  
  // Content management states
  const [homeTitle, setHomeTitle] = useState('Welcome to Scrape the Plate');
  const [homeDescription, setHomeDescription] = useState('Your one-stop platform for all your entertainment needs including comedy, car wraps, and modeling services, ect.');
  const [comedyContent, setComedyContent] = useState('Book comedy shows and performances.');
  const [carWrapsContent, setCarWrapsContent] = useState('Professional car wrap services and designs.');
  const [modelingContent, setModelingContent] = useState('Book modeling sessions and view our portfolio.');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (accessCode === '4922') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid access code!');
      setAccessCode('');
    }
  };

  const applyPatch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patch: 'sample patch' })
      });
      const data = await response.json();
      setPatches(prev => [...prev, data.message]);
    } catch (error) {
      console.error('Error applying patch:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContentChanges = () => {
    // Store content in localStorage for now
    localStorage.setItem('siteContent', JSON.stringify({
      homeTitle,
      homeDescription,
      comedyContent,
      carWrapsContent,
      modelingContent
    }));
    setSuccessMessage('Content saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const resetContent = () => {
    setHomeTitle('Welcome to Scrape the Plate');
    setHomeDescription('Your one-stop platform for all your entertainment needs including comedy, car wraps, and modeling services, ect.');
    setComedyContent('Book comedy shows and performances.');
    setCarWrapsContent('Professional car wrap services and designs.');
    setModelingContent('Book modeling sessions and view our portfolio.');
    localStorage.removeItem('siteContent');
    setSuccessMessage('Content reset to defaults!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>Admin Access</h1>
        <div className="admin-container">
          <form onSubmit={handleLogin}>
            <h3>Enter Access Code</h3>
            <div style={{ marginTop: '1rem' }}>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter code..."
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              {error && <div style={{ color: '#f50505', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
              <button type="submit">Access Admin</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Control Panel</h1>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('patches')}
          style={{ opacity: activeTab === 'patches' ? 1 : 0.6 }}
        >
          Patch Management
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          style={{ opacity: activeTab === 'content' ? 1 : 0.6 }}
        >
          Content Editor
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          style={{ opacity: activeTab === 'settings' ? 1 : 0.6 }}
        >
          Site Settings
        </button>
      </div>

      {/* Patch Management Tab */}
      {activeTab === 'patches' && (
        <div className="admin-container">
          <h3>Patch Management</h3>
          <button onClick={applyPatch} disabled={loading}>
            {loading ? 'Applying...' : 'Apply Patch'}
          </button>
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Patch History:</h3>
            {patches.map((patch, i) => (
              <div key={i} className="patch-item">{patch}</div>
            ))}
          </div>
        </div>
      )}

      {/* Content Editor Tab */}
      {activeTab === 'content' && (
        <div className="admin-container">
          <h3>Edit Site Content</h3>
          {successMessage && (
            <div style={{ 
              background: '#9300c5', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '4px', 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {successMessage}
            </div>
          )}
          
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Home Page Title:
            </label>
            <input
              type="text"
              value={homeTitle}
              onChange={(e) => setHomeTitle(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />

            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Home Page Description:
            </label>
            <textarea
              value={homeDescription}
              onChange={(e) => setHomeDescription(e.target.value)}
              rows={3}
              style={{ 
                width: '100%', 
                marginBottom: '1rem',
                border: '2px solid #9300c5',
                borderRadius: '4px',
                padding: '0.8rem',
                background: '#2a262b',
                color: '#aaa9ad',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />

            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Comedy Page Content:
            </label>
            <textarea
              value={comedyContent}
              onChange={(e) => setComedyContent(e.target.value)}
              rows={2}
              style={{ 
                width: '100%', 
                marginBottom: '1rem',
                border: '2px solid #9300c5',
                borderRadius: '4px',
                padding: '0.8rem',
                background: '#2a262b',
                color: '#aaa9ad',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />

            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Car Wraps Page Content:
            </label>
            <textarea
              value={carWrapsContent}
              onChange={(e) => setCarWrapsContent(e.target.value)}
              rows={2}
              style={{ 
                width: '100%', 
                marginBottom: '1rem',
                border: '2px solid #9300c5',
                borderRadius: '4px',
                padding: '0.8rem',
                background: '#2a262b',
                color: '#aaa9ad',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />

            <label style={{ display: 'block', color: '#f50505', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Modeling Page Content:
            </label>
            <textarea
              value={modelingContent}
              onChange={(e) => setModelingContent(e.target.value)}
              rows={2}
              style={{ 
                width: '100%', 
                marginBottom: '1rem',
                border: '2px solid #9300c5',
                borderRadius: '4px',
                padding: '0.8rem',
                background: '#2a262b',
                color: '#aaa9ad',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={saveContentChanges}>Save Changes</button>
              <button onClick={resetContent} style={{ background: 'linear-gradient(135deg, #3a363b 0%, #666 100%)' }}>
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="admin-container">
          <h3>Site Settings</h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="patch-item">
              <strong>Site Name:</strong> Scrape the Plate v4
            </div>
            <div className="patch-item">
              <strong>Theme:</strong> Saints Row (Purple & Red)
            </div>
            <div className="patch-item">
              <strong>Access Code:</strong> ••••
            </div>
            <div className="patch-item">
              <strong>Status:</strong> Active
            </div>
            <div style={{ marginTop: '1rem', color: '#aaa9ad' }}>
              <p>Additional settings coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
