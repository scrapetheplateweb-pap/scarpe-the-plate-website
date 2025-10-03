import React, { useState } from 'react';

export default function Admin() {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

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
      <h1>Admin Patch Console</h1>
      <div className="admin-container">
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
    </div>
  );
}
