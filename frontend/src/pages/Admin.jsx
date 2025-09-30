import React, { useState } from 'react';

export default function Admin() {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);

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
