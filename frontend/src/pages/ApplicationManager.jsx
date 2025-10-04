import React, { useState, useEffect } from 'react';

export default function ApplicationManager({ onSuccess }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ status: '', service_type: '' });

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      let url = '/api/careers?';
      if (filter.status) url += `status=${filter.status}&`;
      if (filter.service_type) url += `service_type=${filter.service_type}`;

      const response = await fetch(url, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/careers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        onSuccess(`Application marked as ${status}!`);
        await loadApplications();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteApplication = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const response = await fetch(`/api/careers/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        onSuccess('Application deleted!');
        await loadApplications();
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#9300c5';
      case 'reviewed': return '#f50505';
      case 'contacted': return '#00aa00';
      case 'rejected': return '#666';
      default: return '#aaa9ad';
    }
  };

  return (
    <div>
      <h3>Job Applications ({applications.length})</h3>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ padding: '0.5rem' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="contacted">Contacted</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filter.service_type}
          onChange={(e) => setFilter({ ...filter, service_type: e.target.value })}
          style={{ padding: '0.5rem' }}
        >
          <option value="">All Services</option>
          <option value="comedy">Comedy</option>
          <option value="car_wrapping">Car Wrapping</option>
          <option value="modeling">Modeling</option>
        </select>

        <button onClick={loadApplications} style={{ background: '#9300c5' }}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {applications.length === 0 ? (
          <div className="patch-item">
            <p style={{ color: '#aaa9ad' }}>No applications yet.</p>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="patch-item" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ color: '#9300c5', marginBottom: '0.5rem' }}>{app.name}</h4>
                  <div style={{ color: '#aaa9ad', fontSize: '0.9rem' }}>
                    <p>📧 {app.email} {app.phone && `| 📱 ${app.phone}`}</p>
                    <p>Service: <strong style={{ color: '#f50505', textTransform: 'capitalize' }}>{app.service_type.replace('_', ' ')}</strong></p>
                    {app.experience && <p>Experience: {app.experience}</p>}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      background: getStatusColor(app.status),
                      padding: '0.3rem 0.8rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {app.portfolio_url && (
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Portfolio:</strong>{' '}
                  <a
                    href={app.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#9300c5' }}
                  >
                    {app.portfolio_url}
                  </a>
                </p>
              )}

              {app.message && (
                <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                  <strong>Message:</strong>
                  <p style={{ marginTop: '0.5rem', color: '#aaa9ad' }}>{app.message}</p>
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
                Applied: {new Date(app.created_at).toLocaleString()}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => updateStatus(app.id, 'reviewed')}
                  style={{ background: '#f50505', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'contacted')}
                  style={{ background: '#00aa00', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'rejected')}
                  style={{ background: '#666', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Mark Rejected
                </button>
                <button
                  onClick={() => deleteApplication(app.id)}
                  style={{ background: '#444', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
